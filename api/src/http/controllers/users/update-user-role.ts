import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '../../../lib/prisma'
import { UpdateUserRoleApiRequestSchema, UpdateUserRoleApiResponseSchema } from '@idiomax/http-schemas/users/update-user-role'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../../middlewares/auth'

export async function updateUserRole(app: FastifyInstance) {
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
            const userId = await request.getCurrentUserId()
            const { userId: targetUserId, role, companyId } = request.body

            // Buscar membro atual (quem está fazendo a alteração)
            const currentMember = await prisma.members.findFirst({
                where: {
                    user_id: userId,
                    company_id: companyId,
                },
            })

            if (!currentMember || currentMember.role !== 'ADMIN') {
                throw new UnauthorizedError()
            }

            // Verificar se o usuário alvo existe na empresa
            const targetMember = await prisma.members.findFirst({
                where: {
                    user_id: targetUserId,
                    company_id: companyId,
                },
                include: {
                    user: true,
                },
            })

            if (!targetMember) {
                throw new BadRequestError('Usuário não encontrado nesta empresa.')
            }

            // Não permitir alterar role de outro ADMIN
            if (targetMember.role === 'ADMIN' && targetMember.user_id !== userId) {
                throw new UnauthorizedError('Não é possível alterar a role de outro administrador.')
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

            return {
                message: `Role do usuário ${targetMember.user.name} alterada para ${role === 'STUDENT' ? 'Estudante' : role === 'TEACHER' ? 'Professor' : 'Administrador'} com sucesso.`,
            }
        })
}