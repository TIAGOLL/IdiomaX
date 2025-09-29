import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { GetLevelByIdApiParamsSchema, GetLevelByIdApiResponseSchema } from '@idiomax/validation-schemas/levels/get-level-by-id'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { z } from 'zod'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'
import { NotFoundError } from '../_errors/not-found-error'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function getLevelById(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get('/level-by-id/:level_id', {
            schema: {
                tags: ['Levels'],
                summary: 'Get level by id',
                security: [{ bearerAuth: [] }],
                querystring: GetLevelByIdApiParamsSchema,
                response: {
                    200: GetLevelByIdApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const { level_id, company_id } = request.query

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('get', 'Level')) {
                throw new ForbiddenError()
            }

            const level = await prisma.levels.findUnique({
                where: {
                    id: level_id,
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
                    courses: true
                }
            })

            if (!level) {
                throw new NotFoundError('Level não encontrado.')
            }

            const mappedLevel = {
                id: level.id,
                name: level.name,
                level: Number(level.level),
                course_id: level.course_id || '',
                created_at: level.created_at.toISOString(),
                updated_at: level.updated_at.toISOString(),
                active: level.active,
                disciplines: level.disciplines.map(discipline => ({
                    id: discipline.id,
                    name: discipline.name,
                    level_id: discipline.level_id,
                    created_at: discipline.created_at.toISOString(),
                    updated_at: discipline.updated_at.toISOString(),
                    active: discipline.active
                }))
            }

            return reply.status(200).send(mappedLevel)
        })
}