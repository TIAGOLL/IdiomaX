import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CreateDisciplineApiRequestSchema, CreateDisciplineApiResponseSchema } from '@idiomax/http-schemas/disciplines/create-discipline'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { checkMemberAccess } from '../../../lib/permissions'
import { BadRequestError } from '../_errors/bad-request-error'
import { z } from 'zod'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function createDiscipline(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post('/disciplines', {
            schema: {
                tags: ['Disciplinas'],
                summary: 'Criar nova disciplina',
                security: [{ bearerAuth: [] }],
                body: CreateDisciplineApiRequestSchema,
                response: {
                    201: CreateDisciplineApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const userId = await request.getCurrentUserId()
            const { name, levels_id } = request.body

            // Verificar se o level existe e obter company_id
            const level = await prisma.levels.findFirst({
                where: {
                    id: levels_id,
                    active: true
                },
                include: {
                    courses: {
                        select: {
                            companies_id: true
                        }
                    }
                }
            })

            if (!level) {
                throw new BadRequestError('Nível não encontrado.')
            }

            if (!level.courses?.companies_id) {
                throw new BadRequestError('Curso do nível não encontrado.')
            }

            await checkMemberAccess(level.courses.companies_id, userId)

            // Verificar se já existe disciplina com o mesmo nome no nível
            const existingDiscipline = await prisma.disciplines.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive'
                    },
                    levels_id: levels_id,
                    active: true
                }
            })

            if (existingDiscipline) {
                throw new BadRequestError('Já existe uma disciplina com este nome neste nível.')
            }

            await prisma.disciplines.create({
                data: {
                    name,
                    levels_id,
                    created_by: userId,
                    updated_by: userId,
                }
            })
            return reply.status(201).send({
                message: 'Disciplina criada com sucesso'
            })
        })
}