import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UpdateDisciplineApiRequestSchema, UpdateDisciplineApiResponseSchema } from '@idiomax/validation-schemas/disciplines/update-discipline'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { checkMemberAccess } from '../../../lib/get-user-permission'
import { BadRequestError } from '../_errors/bad-request-error'
import { z } from 'zod'

const ParamsSchema = z.object({
    id: z.string().uuid()
})

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function updateDiscipline(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put('/disciplines/:id', {
            schema: {
                tags: ['Disciplinas'],
                summary: 'Atualizar disciplina',
                security: [{ bearerAuth: [] }],
                params: ParamsSchema,
                body: UpdateDisciplineApiRequestSchema,
                response: {
                    200: UpdateDisciplineApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const userId = await request.getCurrentUserId()
            const { id } = request.params
            const { name } = request.body

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
                                    company_id: true
                                }
                            }
                        }
                    }
                }
            })

            if (!discipline) {
                throw new BadRequestError('Disciplina não encontrada.')
            }

            if (!discipline.levels?.courses?.company_id) {
                throw new BadRequestError('Curso da disciplina não encontrado.')
            }

            await checkMemberAccess(discipline.levels.courses.company_id, userId)

            // Verificar se já existe outra disciplina com o mesmo nome no mesmo nível
            const existingDiscipline = await prisma.disciplines.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive'
                    },
                    levels_id: discipline.levels_id,
                    id: {
                        not: id
                    },
                    active: true
                }
            })

            if (existingDiscipline) {
                throw new BadRequestError('Já existe uma disciplina com este nome neste nível.')
            }

            await prisma.disciplines.update({
                where: { id },
                data: {
                    name,
                    updated_by: userId,
                    updated_at: new Date()
                }
            })

            return reply.status(200).send({
                message: 'Disciplina atualizada com sucesso'
            })
        })
}