import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { DeleteDisciplineApiResponseSchema } from '@idiomax/http-schemas/disciplines/delete-discipline'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { checkMemberAccess } from '../../../lib/permissions'
import { BadRequestError } from '../_errors/bad-request-error'
import { z } from 'zod'

const ParamsSchema = z.object({
    id: z.string().uuid()
})

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function deleteDiscipline(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete('/disciplines/:id', {
            schema: {
                tags: ['Disciplinas'],
                summary: 'Deletar disciplina',
                security: [{ bearerAuth: [] }],
                params: ParamsSchema,
                response: {
                    200: DeleteDisciplineApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const userId = await request.getCurrentUserId()
            const { id } = request.params

            // Verificar se a disciplina existe e obter company_id
            const discipline = await prisma.disciplines.findFirst({
                where: {
                    id,
                },
                include: {
                    levels: {
                        include: {
                            courses: {
                                select: {
                                    companies_id: true
                                }
                            }
                        }
                    }
                }
            })

            if (!discipline) {
                throw new BadRequestError('Disciplina não encontrada.')
            }

            if (!discipline.levels?.courses?.companies_id) {
                throw new BadRequestError('Curso da disciplina não encontrado.')
            }

            await checkMemberAccess(discipline.levels.courses.companies_id, userId)

            // Verificar se a disciplina tem tasks associadas
            const tasksCount = await prisma.tasks.count({
                where: {
                    disciplines_id: id,
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