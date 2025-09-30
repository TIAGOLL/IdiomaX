import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CreateDisciplineApiRequestSchema, CreateDisciplineApiResponseSchema } from '@idiomax/validation-schemas/disciplines/create-discipline'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'
import { z } from 'zod'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'

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
            const { name, level_id, company_id } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('create', 'Discipline')) {
                throw new ForbiddenError()
            }

            // Verificar se já existe disciplina com o mesmo nome no nível
            const existingDiscipline = await prisma.disciplines.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive'
                    },
                    level_id: level_id,
                    active: true
                }
            })

            if (existingDiscipline) {
                throw new BadRequestError('Já existe uma disciplina com este nome neste nível.')
            }

            await prisma.disciplines.create({
                data: {
                    name,
                    level_id,
                    created_by: userId,
                    updated_by: userId,
                }
            })
            return reply.status(201).send({
                message: 'Disciplina criada com sucesso'
            })
        })
}