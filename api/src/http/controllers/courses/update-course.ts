import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UpdateCourseApiRequestSchema, UpdateCourseApiResponseSchema } from '@idiomax/validation-schemas/courses/update-course'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'
import { BadRequestError } from '../_errors/bad-request-error'

export async function updateCourse(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put('/course/:id', {
            schema: {
                tags: ['Courses'],
                summary: 'Update course',
                security: [{ bearerAuth: [] }],
                body: UpdateCourseApiRequestSchema,
                response: {
                    200: UpdateCourseApiResponseSchema,
                    400: UpdateCourseApiResponseSchema,
                    403: UpdateCourseApiResponseSchema,
                    404: UpdateCourseApiResponseSchema
                },
            },
        }, async (request, reply) => {
            const {
                id,
                company_id,
                name,
                description,
                registration_value,
                workload,
                monthly_fee_value,
                minimum_grade,
                maximum_grade,
                minimum_frequency,
                syllabus_url,
                active
            } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('update', 'Course')) {
                throw new ForbiddenError()
            }

            // Verificar se o curso existe
            const existingCourse = await prisma.courses.findFirst({
                where: {
                    id,
                    active: true
                }
            })

            if (!existingCourse) {
                return reply.status(404).send({
                    message: 'Curso não encontrado.'
                })
            }

            // Verificar se já existe outro curso com o mesmo nome na empresa (exceto o atual)
            const conflictingCourse = await prisma.courses.findFirst({
                where: {
                    name,
                    company_id: company_id,
                    active: true,
                    id: {
                        not: id
                    }
                }
            })

            if (conflictingCourse) {
                return reply.status(400).send({
                    message: 'Já existe outro curso com este nome nesta empresa.'
                })
            }

            // Validar se nota mínima é menor que nota máxima
            if (minimum_grade >= maximum_grade) {
                return reply.status(400).send({
                    message: 'A nota mínima deve ser menor que a nota máxima.'
                })
            }

            const res = await prisma.courses.update({
                where: { id },
                data: {
                    name,
                    description,
                    registration_value,
                    workload,
                    monthly_fee_value,
                    minimum_grade,
                    maximum_grade,
                    minimum_frequency,
                    syllabus_url,
                    active,
                    updated_by: userId
                }
            })

            if (!res) {
                throw new BadRequestError('Erro ao atualizar o curso.')
            }

        })
}