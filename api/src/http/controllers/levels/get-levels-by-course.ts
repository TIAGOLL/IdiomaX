import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { GetLevelsApiParamsSchema, GetLevelsApiResponseSchema } from '@idiomax/http-schemas/levels/get-levels'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { checkMemberAccess } from '../../../lib/permissions'
import { BadRequestError } from '../_errors/bad-request-error'
import { z } from 'zod'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function getLevelsByCourse(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get('/levels/:course_id', {
            schema: {
                tags: ['Níveis'],
                summary: 'Obter níveis por curso',
                security: [{ bearerAuth: [] }],
                params: GetLevelsApiParamsSchema,
                response: {
                    200: GetLevelsApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const userId = await request.getCurrentUserId()
            const { course_id } = request.params

            // Verificar se o curso existe e obter company_id
            const course = await prisma.courses.findFirst({
                where: {
                    id: course_id,
                    active: true
                }
            })

            if (!course) {
                throw new BadRequestError('Curso não encontrado.')
            }

            await checkMemberAccess(course.companies_id, userId)

            const levels = await prisma.levels.findMany({
                where: {
                    courses_id: course_id,
                    active: true
                },
                include: {
                    disciplines: {
                        where: {
                            active: true
                        },
                        orderBy: {
                            created_at: 'asc'
                        }
                    },
                },
                orderBy: {
                    level: 'asc'
                }
            })

            // Converter Decimal para number e formatar datas
            const formattedLevels = levels.map(level => ({
                id: level.id,
                name: level.name,
                level: level.level.toNumber(),
                created_at: level.created_at.toISOString(),
                updated_at: level.updated_at.toISOString(),
                active: level.active,
                disciplines: level.disciplines.map(discipline => ({
                    id: discipline.id,
                    name: discipline.name,
                    created_at: discipline.created_at.toISOString(),
                    updated_at: discipline.updated_at.toISOString(),
                    active: discipline.active
                }))
            }))

            return reply.status(200).send(formattedLevels)
        })
}