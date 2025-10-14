import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '../../../services/prisma'
import { UpdateUserRoleApiRequestSchema, UpdateUserRoleApiResponseSchema } from '@idiomax/validation-schemas/users/update-user-role'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'

export async function alterUserRole(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put('/users/role', {
            schema: {
                tags: ['Users'],
                body: UpdateUserRoleApiRequestSchema,
                response: {
                    200: UpdateUserRoleApiResponseSchema,
                },
            },
        }, async (request) => {
            const { user_id: targetUserId, role, company_id } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('update', 'Role')) {
                throw new ForbiddenError()
            }

            // Verificar se o usuário alvo existe na empresa
            const targetMember = await prisma.members.findFirst({
                where: {
                    user_id: targetUserId,
                    company_id,
                },
                include: {
                    user: true,
                    company: true,
                },
            })

            if (!targetMember) {
                throw new BadRequestError('Usuário não encontrado nesta empresa.')
            }

            // Não permitir alterar role de outro ADMIN, exceto se o usuário atual for o owner
            if (targetMember.role === 'ADMIN' && targetMember.user_id !== userId) {
                const isOwner = targetMember.company.owner_id === userId
                if (!isOwner) {
                    throw new UnauthorizedError('Apenas o proprietário da empresa pode alterar a role de outro administrador.')
                }
            }

            // Atualizar a role
            await prisma.members.update({
                where: {
                    id: targetMember.id,
                },
                data: {
                    role,
                },
            })

            return { message: "Função alterada com sucesso.", }
        })
}