import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { GetCourseByIdApiParamsSchema, GetCourseByIdApiResponseSchema } from '@idiomax/validation-schemas/courses/get-course-by-id'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { z } from 'zod'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'

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
            const { course_id, company_id } = request.params

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('get', 'Course')) {
                throw new ForbiddenError()
            }

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
                syllabus_url: course.syllabus_url,
                company_id: course.company_id,
                active: course.active,
                created_at: course.created_at.toISOString(),
                updated_at: course.updated_at.toISOString()
            })
        })
}