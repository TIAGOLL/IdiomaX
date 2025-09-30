import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '../../../lib/prisma'
import { DeactivateLevelApiResponse, DeactivateLevelApiRequest } from '@idiomax/validation-schemas/levels/deactivate-level'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'

export async function deactivateLevel(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch('/level/deactivate', {
            schema: {
                tags: ['Levels'],
                body: DeactivateLevelApiRequest,
                response: {
                    200: DeactivateLevelApiResponse
                }
            }
        }, async (request) => {
            const { company_id, active, level_id } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('delete', 'Level')) {
                throw new ForbiddenError()
            }

            // Atualizar o status do level
            await prisma.levels.update({
                where: { id: level_id },
                data: { active }
            })

            return {
                message: active ?
                    'Level ativado com sucesso.' :
                    'Level desativado com sucesso.'
            }
        })
}