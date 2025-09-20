/**
 * UTILITÁRIOS PARA CAMPOS BASE DE AUDITORIA
 * 
 * Este arquivo contém funções helper para trabalhar com os campos base
 * que todas as tabelas devem ter: created_at, created_by, updated_at, updated_by, active
 */

export interface BaseFields {
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    active: boolean;
}

export interface CreateBaseFields {
    created_by?: string;
}

export interface UpdateBaseFields {
    updated_by?: string;
}

// Tipo genérico para modelos do Prisma
type PrismaModel = {
    create: (args: { data: unknown }) => Promise<unknown>;
    update: (args: { where: unknown; data: unknown }) => Promise<unknown>;
    findMany: (args?: unknown) => Promise<unknown[]>;
};

// Tipo genérico para condições where
type WhereCondition = Record<string, unknown>;

/**
 * Gera campos base para criação de registros
 */
export function getCreateBaseFields(userId?: string): CreateBaseFields & { active: boolean } {
    return {
        created_by: userId,
        active: true,
    };
}

/**
 * Gera campos base para atualização de registros
 */
export function getUpdateBaseFields(userId?: string): UpdateBaseFields {
    return {
        updated_by: userId,
    };
}

/**
 * Soft delete - marca registro como inativo
 */
export function getSoftDeleteFields(userId?: string): UpdateBaseFields & { active: boolean } {
    return {
        updated_by: userId,
        active: false,
    };
}

/**
 * Query helper para incluir campos de auditoria nas consultas
 */
export const auditFieldsInclude = {
    creator: {
        select: {
            id: true,
            name: true,
            email: true,
        }
    },
    updater: {
        select: {
            id: true,
            name: true,
            email: true,
        }
    }
};

/**
 * Wrapper genérico para criar registros com auditoria
 */
export async function createWithAudit<T>(
    model: PrismaModel,
    data: Omit<T, keyof BaseFields>,
    userId?: string
) {
    return model.create({
        data: {
            ...data,
            ...getCreateBaseFields(userId),
        }
    });
}

/**
 * Wrapper genérico para atualizar registros com auditoria
 */
export async function updateWithAudit<T>(
    model: PrismaModel,
    where: WhereCondition,
    data: Partial<Omit<T, keyof BaseFields>>,
    userId?: string
) {
    return model.update({
        where,
        data: {
            ...data,
            ...getUpdateBaseFields(userId),
        }
    });
}

/**
 * Wrapper genérico para soft delete
 */
export async function softDeleteWithAudit(
    model: PrismaModel,
    where: WhereCondition,
    userId?: string
) {
    return model.update({
        where,
        data: getSoftDeleteFields(userId)
    });
}

/**
 * Query helper para filtrar apenas registros ativos
 */
export const activeRecordsFilter = {
    active: true
};

/**
 * Exemplos de uso:
 * 
 * // Criar uma empresa com auditoria
 * const company = await createWithAudit(
 *     prisma.companies,
 *     { name: 'Empresa XYZ', cnpj: '123456789' },
 *     userId
 * );
 * 
 * // Atualizar uma empresa com auditoria
 * const updatedCompany = await updateWithAudit(
 *     prisma.companies,
 *     { id: companyId },
 *     { name: 'Novo Nome' },
 *     userId
 * );
 * 
 * // Soft delete
 * await softDeleteWithAudit(
 *     prisma.companies,
 *     { id: companyId },
 *     userId
 * );
 * 
 * // Buscar apenas registros ativos
 * const activeCompanies = await prisma.companies.findMany({
 *     where: {
 *         ...activeRecordsFilter,
 *         name: { contains: 'busca' }
 *     },
 *     include: auditFieldsInclude
 * });
 */

export default {
    getCreateBaseFields,
    getUpdateBaseFields,
    getSoftDeleteFields,
    auditFieldsInclude,
    createWithAudit,
    updateWithAudit,
    softDeleteWithAudit,
    activeRecordsFilter,
};