import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UpdateCourseApiRequestSchema, UpdateCourseApiResponseSchema } from '@idiomax/http-schemas/courses/update-course'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { z } from 'zod'

const ErrorResponseSchema = z.object({
    message: z.string()
})

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
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema
                },
            },
        }, async (request, reply) => {
            const userId = await request.getCurrentUserId()
            const { id } = request.params as { id: string }
            const {
                company_id,
                name,
                description,
                registration_value,
                workload,
                monthly_fee_value,
                minimum_grade,
                maximum_grade,
                minimum_frequency,
                syllabus,
                active
            } = request.body

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

            // Verificar se o usuário tem permissão na empresa
            const member = await prisma.members.findFirst({
                where: {
                    user_id: userId,
                    company_id: existingCourse.companies_id,
                    role: {
                        in: ['ADMIN']
                    }
                }
            })

            if (!member) {
                return reply.status(403).send({
                    message: 'Acesso negado. Você não tem permissão para editar cursos nesta empresa.'
                })
            }

            // Verificar se já existe outro curso com o mesmo nome na empresa (exceto o atual)
            const conflictingCourse = await prisma.courses.findFirst({
                where: {
                    name,
                    companies_id: company_id,
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

            await prisma.courses.update({
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
                    syllabus,
                    active,
                    updated_by: userId
                }
            })

            return reply.status(200).send({
                message: 'Curso atualizado com sucesso!',
            })
        })
}