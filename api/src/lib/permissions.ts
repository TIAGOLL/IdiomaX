import { prisma } from './prisma';
import { BadRequestError } from '../http/controllers/_errors/bad-request-error';
import { UnauthorizedError } from '../http/controllers/_errors/unauthorized-error';

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

interface PermissionCheckOptions {
    companyId: string;
    userId: string;
    requiredRole?: UserRole | UserRole[];
    throwOnError?: boolean;
}

interface PermissionResult {
    hasAccess: boolean;
    userRole?: UserRole;
    company?: {
        id: string;
        name: string;
        [key: string]: unknown;
    };
    member?: {
        id: string;
        role: string;
        user_id: string;
        company_id: string;
        [key: string]: unknown;
    };
}

/**
 * Verifica se o usuário tem permissão para acessar conteúdo de uma empresa específica
 */
export async function checkCompanyAccess(options: PermissionCheckOptions): Promise<PermissionResult> {
    const { companyId, userId, requiredRole, throwOnError = true } = options;

    try {
        // Busca o membro e a empresa em uma única query
        const member = await prisma.members.findFirst({
            where: {
                user_id: userId,
                company_id: companyId,
            },
            include: {
                company: true,
            }
        });

        // Se não é membro da empresa
        if (!member) {
            if (throwOnError) {
                throw new BadRequestError('Usuário não está associado a essa instituição.');
            }
            return { hasAccess: false };
        }

        // Se não há restrição de role, apenas ser membro já é suficiente
        if (!requiredRole) {
            return {
                hasAccess: true,
                userRole: member.role as UserRole,
                company: member.company,
                member
            };
        }

        // Verifica se o role do usuário atende aos requisitos
        const userRole = member.role as UserRole;
        const hasRequiredRole = Array.isArray(requiredRole)
            ? requiredRole.includes(userRole)
            : userRole === requiredRole;

        if (!hasRequiredRole) {
            if (throwOnError) {
                throw new UnauthorizedError(`Acesso negado. Permissão necessária: ${Array.isArray(requiredRole) ? requiredRole.join(' ou ') : requiredRole}.`);
            }
            return {
                hasAccess: false,
                userRole,
                company: member.company,
                member
            };
        }

        return {
            hasAccess: true,
            userRole,
            company: member.company,
            member
        };

    } catch (error) {
        if (throwOnError) {
            throw error;
        }
        return { hasAccess: false };
    }
}

/**
 * Verifica se o usuário é ADMIN da empresa
 */
export async function checkAdminAccess(companyId: string, userId: string): Promise<PermissionResult> {
    return checkCompanyAccess({
        companyId,
        userId,
        requiredRole: 'ADMIN'
    });
}

/**
 * Verifica se o usuário é ADMIN ou TEACHER da empresa
 */
export async function checkTeacherAccess(companyId: string, userId: string): Promise<PermissionResult> {
    return checkCompanyAccess({
        companyId,
        userId,
        requiredRole: ['ADMIN', 'TEACHER']
    });
}

/**
 * Verifica apenas se o usuário é membro da empresa (qualquer role)
 */
export async function checkMemberAccess(companyId: string, userId: string): Promise<PermissionResult> {
    return checkCompanyAccess({
        companyId,
        userId
    });
}

/**
 * Hook para usar em middlewares ou controllers do Fastify
 */
export function createPermissionChecker(requiredRole?: UserRole | UserRole[]) {
    return async (companyId: string, userId: string) => {
        return checkCompanyAccess({
            companyId,
            userId,
            requiredRole
        });
    };
}