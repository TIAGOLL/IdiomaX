import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '../_errors/bad-request-error'
import { prisma } from '../../../lib/prisma'
import { DeleteLevelApiResponse } from '@idiomax/http-schemas/levels/delete-level'
import { auth } from '../../../middlewares/auth'

export async function deleteLevel(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete('/levels/:id/delete', {
            schema: {
                tags: ['Levels'],
                params: z.object({
                    id: z.string().uuid()
                }),
                response: {
                    200: DeleteLevelApiResponse
                }
            }
        }, async (request) => {
            const userId = await request.getCurrentUserId()
            const { id } = request.params

            // Verificar se o level existe e pertence à empresa do usuário
            const level = await prisma.levels.findUnique({
                where: { id },
                include: {
                    courses: {
                        include: {
                            companies: {
                                include: {
                                    members: {
                                        where: { user_id: userId }
                                    }
                                }
                            }
                        }
                    },
                    disciplines: true
                }
            })

            if (!level) {
                throw new BadRequestError('Level não encontrado.')
            }

            if (!level.courses || level.courses.companies.members.length === 0) {
                throw new BadRequestError('Você não tem permissão para deletar este level.')
            }

            // Verificar se o level possui disciplinas associadas
            if (level.disciplines && level.disciplines.length > 0) {
                throw new BadRequestError('Não é possível deletar um level que possui disciplinas associadas.')
            }

            // Deletar o level
            await prisma.levels.delete({
                where: { id }
            })

            return {
                message: 'Level deletado com sucesso.'
            }
        })
}