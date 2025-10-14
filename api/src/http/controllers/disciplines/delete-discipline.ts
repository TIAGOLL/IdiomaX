import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { DeleteDisciplineApiRequestSchema, DeleteDisciplineApiResponseSchema } from '@idiomax/validation-schemas/disciplines/delete-discipline'
import { prisma } from '../../../services/prisma'
import { auth } from '../../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'
import { ErrorResponseSchema } from '../../../types/error-response-schema'

export async function deleteDiscipline(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete('/disciplines', {
            schema: {
                tags: ['Disciplinas'],
                summary: 'Deletar disciplina',
                security: [{ bearerAuth: [] }],
                body: DeleteDisciplineApiRequestSchema,
                response: {
                    200: DeleteDisciplineApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const { id, company_id } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('delete', 'Discipline')) {
                throw new ForbiddenError()
            }

            // Verificar se a disciplina tem tasks associadas
            const tasksCount = await prisma.tasks.count({
                where: {
                    discipline_id: id,
                    active: true
                }
            })

            if (tasksCount > 0) {
                throw new BadRequestError('Não é possível deletar disciplina que possui tarefas associadas. Desative-a ao invés disso.')
            }

            await prisma.disciplines.delete({
                where: { id }
            })

            return reply.status(200).send({
                message: 'Disciplina deletada com sucesso'
            })
        })
}