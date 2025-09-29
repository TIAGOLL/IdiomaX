import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '../../../lib/prisma'
import { DeactivateLevelFormSchema, DeactivateLevelApiResponse } from '@idiomax/http-schemas/levels/deactivate-level'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'

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
            const { id } = request.params
            const { active } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(userId)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('delete', 'Level')) {
                throw new ForbiddenError()
            }

            // Atualizar o status do level
            await prisma.levels.update({
                where: { id },
                data: { active }
            })

            return {
                message: active ?
                    'Level ativado com sucesso.' :
                    'Level desativado com sucesso.'
            }
        })
}