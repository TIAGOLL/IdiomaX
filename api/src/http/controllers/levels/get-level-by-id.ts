import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { GetLevelByIdApiParamsSchema, GetLevelByIdApiResponseSchema } from '@idiomax/http-schemas/levels/get-level-by-id'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { checkMemberAccess } from '../../../lib/get-user-permission'
import { BadRequestError } from '../_errors/bad-request-error'
import { z } from 'zod'

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
            const userId = await request.getCurrentUserId()
            const { level_id } = request.query

            const level = await prisma.levels.findFirst({
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
                throw new BadRequestError('Level não encontrado.')
            }

            await checkMemberAccess(level.courses?.companies_id || '', userId)

            const mappedLevel = {
                id: level.id,
                name: level.name,
                level: Number(level.level),
                courses_id: level.courses_id || '',
                created_at: level.created_at.toISOString(),
                updated_at: level.updated_at.toISOString(),
                active: level.active,
                disciplines: level.disciplines.map(discipline => ({
                    id: discipline.id,
                    name: discipline.name,
                    levels_id: discipline.levels_id,
                    created_at: discipline.created_at.toISOString(),
                    updated_at: discipline.updated_at.toISOString(),
                    active: discipline.active
                }))
            }

            return reply.status(200).send(mappedLevel)
        })
}