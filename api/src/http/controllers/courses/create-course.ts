import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CreateCourseApiRequestSchema, CreateCourseApiResponseSchema } from '@idiomax/validation-schemas/courses/create-course'
import { prisma } from '../../../services/prisma'
import { auth } from '../../../middlewares/auth'
import { z } from 'zod'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function createCourse(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post('/courses', {
            schema: {
                tags: ['Courses'],
                summary: 'Create a new course',
                security: [{ bearerAuth: [] }],
                body: CreateCourseApiRequestSchema,
                response: {
                    201: CreateCourseApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
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
                syllabus_url
            } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('create', 'Course')) {
                throw new ForbiddenError()
            }

            // Verificar se já existe um curso com o mesmo nome na empresa
            const existingCourse = await prisma.courses.findFirst({
                where: {
                    name,
                    company_id,
                    active: true
                }
            })

            if (existingCourse) {
                return reply.status(400).send({
                    message: 'Já existe um curso com este nome nesta empresa.'
                })
            }

            // Validar se nota mínima é menor que nota máxima
            if (minimum_grade >= maximum_grade) {
                return reply.status(400).send({
                    message: 'A nota mínima deve ser menor que a nota máxima.'
                })
            }

            await prisma.courses.create({
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
                    company_id,
                    created_by: userId,
                    updated_by: userId,
                }
            })

            return reply.status(201).send({
                message: 'Curso criado com sucesso!',
            })
        })
}