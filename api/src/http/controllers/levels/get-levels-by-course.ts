import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { GetLevelsApiRequestSchema, GetLevelsApiResponseSchema } from '@idiomax/validation-schemas/levels/get-levels'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'
import { z } from 'zod'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function getLevelsByCourse(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get('/levels-by-course', {
            schema: {
                tags: ['Níveis'],
                summary: 'Obter níveis por curso',
                security: [{ bearerAuth: [] }],
                querystring: GetLevelsApiRequestSchema,
                response: {
                    200: GetLevelsApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const { course_id, company_id } = request.query

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('get', 'Level')) {
                throw new ForbiddenError()
            }

            // Verificar se o curso existe e obter company_id
            const course = await prisma.courses.findFirst({
                where: {
                    id: course_id,
                }
            })

            if (!course) {
                throw new BadRequestError('Curso não encontrado.')
            }

            const levels = await prisma.levels.findMany({
                where: {
                    course_id: course_id,
                },
                include: {
                    disciplines: {
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