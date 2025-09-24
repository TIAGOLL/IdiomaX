import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { ToggleDisciplineStatusApiRequestSchema, ToggleDisciplineStatusApiResponseSchema } from '@idiomax/http-schemas/disciplines/toggle-discipline-status'
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

export async function toggleDisciplineStatus(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch('/disciplines/:id/toggle-status', {
            schema: {
                tags: ['Disciplinas'],
                summary: 'Ativar/desativar disciplina',
                security: [{ bearerAuth: [] }],
                params: ParamsSchema,
                body: ToggleDisciplineStatusApiRequestSchema,
                response: {
                    200: ToggleDisciplineStatusApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const userId = await request.getCurrentUserId()
            const { id } = request.params
            const { active } = request.body

            // Verificar se a disciplina existe e obter company_id
            const discipline = await prisma.disciplines.findFirst({
                where: {
                    id
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

            await prisma.disciplines.update({
                where: { id },
                data: {
                    active,
                    updated_by: userId,
                    updated_at: new Date()
                }
            })

            return reply.status(200).send({
                message: `Disciplina ${active ? 'ativada' : 'desativada'} com sucesso`
            })
        })
}