import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UpdatePresenceApiRequestSchema, UpdatePresenceApiResponseSchema } from '@idiomax/validation-schemas/lessons/update-presence'
import { prisma } from '../../../services/prisma'
import { auth } from '../../../middlewares/auth'
import { z } from 'zod'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'
import { NotFoundError } from '../_errors/not-found-error'
import { BadRequestError } from '../_errors/bad-request-error'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function updatePresence(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put('/lesson/presence', {
            schema: {
                tags: ['Lessons'],
                summary: 'Update lesson presence list',
                security: [{ bearerAuth: [] }],
                body: UpdatePresenceApiRequestSchema,
                response: {
                    200: UpdatePresenceApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const {
                lesson_id,
                company_id,
                presence_list
            } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('update', 'Lesson')) {
                throw new ForbiddenError()
            }

            // Verificar se a aula existe e pertence à empresa
            const existingLesson = await prisma.lessons.findFirst({
                where: {
                    id: lesson_id,
                    active: true,
                    class: {
                        courses: {
                            company_id: company_id
                        }
                    }
                }
            })

            if (!existingLesson) {
                throw new NotFoundError('Aula não encontrada ou não pertence a esta empresa.')
            }

            // Verificar se todos os IDs de presença pertencem à aula
            const presenceIds = presence_list.map(p => p.id)
            const existingPresences = await prisma.presence_lists.findMany({
                where: {
                    id: { in: presenceIds },
                    lesson_id,
                    active: true
                }
            })

            if (existingPresences.length !== presence_list.length) {
                throw new BadRequestError('Alguns registros de presença não foram encontrados ou não pertencem a esta aula.')
            }

            // Atualizar presença usando transação para garantir consistência
            await prisma.$transaction(async (tx) => {
                for (const presenceUpdate of presence_list) {
                    await tx.presence_lists.update({
                        where: {
                            id: presenceUpdate.id
                        },
                        data: {
                            is_present: presenceUpdate.is_present,
                            updated_by: userId,
                        }
                    })
                }
            })

            // Contar quantos alunos estão presentes após a atualização
            const presentCount = await prisma.presence_lists.count({
                where: {
                    lesson_id,
                    is_present: true,
                    active: true
                }
            })

            const totalCount = await prisma.presence_lists.count({
                where: {
                    lesson_id,
                    active: true
                }
            })

            return reply.send({
                message: `Lista de presença atualizada com sucesso! ${presentCount}/${totalCount} alunos presentes.`,
            })
        })
}