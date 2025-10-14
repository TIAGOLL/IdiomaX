import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CreateLevelApiRequestSchema, CreateLevelApiResponseSchema } from '@idiomax/validation-schemas/levels/create-level'
import { prisma } from '../../../services/prisma'
import { auth } from '../../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'
import { z } from 'zod'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function createLevel(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post('/levels', {
            schema: {
                tags: ['Levels'],
                summary: 'Create a new level with disciplines',
                security: [{ bearerAuth: [] }],
                body: CreateLevelApiRequestSchema,
                response: {
                    201: CreateLevelApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const { company_id, course_id, name, level, } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('create', 'Level')) {
                throw new ForbiddenError()
            }

            // Verificar se já existe um level com o mesmo número no curso
            const existingLevel = await prisma.levels.findFirst({
                where: {
                    level,
                    course_id: course_id,
                    active: true
                }
            })

            if (existingLevel) {
                throw new BadRequestError('Já existe um level com este número neste curso.')
            }

            // Verificar se já existe um level com o mesmo nome no curso
            const existingLevelName = await prisma.levels.findFirst({
                where: {
                    name,
                    course_id: course_id,
                    active: true
                }
            })

            if (existingLevelName) {
                throw new BadRequestError('Já existe um level com este nome neste curso.')
            }

            await prisma.levels.create({
                data: {
                    name,
                    level,
                    course_id: course_id,
                    created_by: userId,
                    updated_by: userId,
                }
            })

            return reply.status(201).send({ message: 'Level criado com sucesso!', })
        })
}