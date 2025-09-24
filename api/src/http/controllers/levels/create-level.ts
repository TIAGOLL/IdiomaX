import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CreateLevelApiRequestSchema, CreateLevelApiResponseSchema } from '@idiomax/http-schemas/levels/create-level'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { checkMemberAccess } from '../../../lib/permissions'
import { BadRequestError } from '../_errors/bad-request-error'
import { z } from 'zod'

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
            const userId = await request.getCurrentUserId()
            const {
                company_id,
                course_id,
                name,
                level,
            } = request.body

            const { company } = await checkMemberAccess(company_id, userId)

            // Verificar se o curso existe e pertence à empresa
            const course = await prisma.courses.findFirst({
                where: {
                    id: course_id,
                    companies_id: company.id,
                    active: true
                }
            })

            if (!course) {
                throw new BadRequestError('Curso não encontrado ou não pertence a esta empresa.')
            }

            // Verificar se já existe um level com o mesmo número no curso
            const existingLevel = await prisma.levels.findFirst({
                where: {
                    level,
                    courses_id: course_id,
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
                    courses_id: course_id,
                    active: true
                }
            })

            if (existingLevelName) {
                throw new BadRequestError('Já existe um level com este nome neste curso.')
            }

            // Criar o level com suas disciplinas em uma transação
            await prisma.levels.create({
                data: {
                    name,
                    level,
                    courses_id: course_id,
                    created_by: userId,
                    updated_by: userId,
                }
            })

            return reply.status(201).send({
                message: 'Level criado com sucesso!',
            })
        })
}