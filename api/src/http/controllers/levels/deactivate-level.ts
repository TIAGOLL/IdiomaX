import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '../_errors/bad-request-error'
import { prisma } from '../../../lib/prisma'
import { DeactivateLevelFormSchema, DeactivateLevelApiResponse } from '@idiomax/validation-schemas/levels/deactivate-level'
import { auth } from '../../../middlewares/auth'

export async function deactivateLevel(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch('/levels/:id/deactivate', {
            schema: {
                tags: ['Levels'],
                params: z.object({
                    id: z.string().uuid()
                }),
                body: DeactivateLevelFormSchema,
                response: {
                    200: DeactivateLevelApiResponse
                }
            }
        }, async (request) => {
            const userId = await request.getCurrentUserId()
            const { id } = request.params
            const { active } = request.body

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
                    }
                }
            })

            if (!level) {
                throw new BadRequestError('Level não encontrado.')
            }

            if (!level.courses || level.courses.companies.members.length === 0) {
                throw new BadRequestError('Você não tem permissão para modificar este level.')
            }

            // Atualizar o status do level
            await prisma.levels.update({
                where: { id },
                data: { active }
            })

            return {
                message: active ? 'Level ativado com sucesso.' : 'Level desativado com sucesso.'
            }
        })
}