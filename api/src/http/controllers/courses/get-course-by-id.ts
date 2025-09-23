import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { GetCourseByIdApiParamsSchema, GetCourseByIdApiResponseSchema } from '@idiomax/http-schemas/courses/get-course-by-id'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { z } from 'zod'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function getCourseById(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get('/course/:course_id', {
            schema: {
                tags: ['Courses'],
                summary: 'Obter curso por ID',
                security: [{ bearerAuth: [] }],
                params: GetCourseByIdApiParamsSchema,
                response: {
                    200: GetCourseByIdApiResponseSchema,
                    404: ErrorResponseSchema,
                    403: ErrorResponseSchema
                },
            },
        }, async (request, reply) => {
            const userId = await request.getCurrentUserId()
            const { course_id } = request.params

            // Buscar o curso
            const course = await prisma.courses.findFirst({
                where: {
                    id: course_id,
                }
            })

            if (!course) {
                return reply.status(404).send({
                    message: 'Curso não encontrado.'
                })
            }

            // Verificar se o usuário tem permissão na empresa do curso
            const member = await prisma.members.findFirst({
                where: {
                    user_id: userId,
                    company_id: course.companies_id,
                    role: {
                        in: ['ADMIN', 'TEACHER']
                    }
                }
            })

            if (!member) {
                return reply.status(403).send({
                    message: 'Acesso negado. Você não tem permissão para visualizar este curso.'
                })
            }

            return reply.status(200).send({
                id: course.id,
                name: course.name,
                description: course.description,
                registration_value: course.registration_value.toNumber(),
                workload: course.workload.toNumber(),
                monthly_fee_value: course.monthly_fee_value.toNumber(),
                minimum_grade: course.minimum_grade.toNumber(),
                maximum_grade: course.maximum_grade.toNumber(),
                minimum_frequency: course.minimum_frequency.toNumber(),
                syllabus: course.syllabus,
                companies_id: course.companies_id,
                active: course.active,
                created_at: course.created_at.toISOString(),
                updated_at: course.updated_at.toISOString()
            })
        })
}