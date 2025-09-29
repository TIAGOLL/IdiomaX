import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UpdateLevelApiRequestSchema, UpdateLevelApiResponseSchema } from '@idiomax/validation-schemas/levels/update-level'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'
import { z } from 'zod'
import { ForbiddenError } from '../_errors/forbidden-error'
import { getUserPermissions } from '../../../lib/get-user-permission'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function updateLevel(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put('/level/:id', {
            schema: {
                tags: ['Levels'],
                summary: 'Update level',
                security: [{ bearerAuth: [] }],
                body: UpdateLevelApiRequestSchema,
                response: {
                    200: UpdateLevelApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema
                },
            },
        }, async (request, reply) => {
            const { id } = request.params as { id: string }
            const {
                company_id,
                name,
                level,
                active,
            } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('update', 'Level')) {
                throw new ForbiddenError()
            }

            const course = await prisma.courses.findFirst({
                where: {
                    company_id,
                    active: true
                }
            })

            // Verificar se já existe outro level com o mesmo número no curso (exceto o atual)
            if (level !== Number(level) && course) {
                const conflictingLevel = await prisma.levels.findFirst({
                    where: {
                        level,
                        course_id: course.id,
                        active: true,
                        NOT: {
                            id: id
                        }
                    }
                })

                if (conflictingLevel) {
                    throw new BadRequestError('Já existe outro level com este número neste curso.')
                }
            }

            const res = await prisma.levels.update({
                where: { id },
                data: {
                    name,
                    level,
                    active,
                    updated_by: userId,
                    updated_at: new Date(),
                }
            })

            if (!res) {
                throw new BadRequestError('Erro ao atualizar o level.')
            }

            return reply.status(200).send({ message: 'Level atualizado com sucesso!', })
        })
}