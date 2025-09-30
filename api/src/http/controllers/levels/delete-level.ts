import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { BadRequestError } from '../_errors/bad-request-error'
import { prisma } from '../../../lib/prisma'
import { DeleteLevelApiRequest, DeleteLevelApiResponse } from '@idiomax/validation-schemas/levels/delete-level'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'

export async function deleteLevel(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete('/level', {
            schema: {
                tags: ['Levels'],
                body: DeleteLevelApiRequest,
                response: {
                    200: DeleteLevelApiResponse
                }
            }
        }, async (request) => {
            const { level_id, company_id } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('delete', 'Level')) {
                throw new ForbiddenError()
            }

            // Verificar se o level tem cursos associados
            const disciplinesCount = await prisma.disciplines.count({
                where: {
                    level_id,
                    active: true
                }
            })

            if (disciplinesCount > 0) {
                throw new BadRequestError('Não é possível deletar um level que possui cursos associados.')
            }

            // Deletar o level
            await prisma.levels.delete({
                where: { id: level_id }
            })

            return { message: 'Level deletado com sucesso.' }
        })
}