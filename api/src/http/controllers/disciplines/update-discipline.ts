import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UpdateDisciplineApiRequestSchema, UpdateDisciplineApiResponseSchema } from '@idiomax/validation-schemas/disciplines/update-discipline'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { z } from 'zod'
import { ForbiddenError } from '../_errors/forbidden-error'
import { BadRequestError } from '../_errors/bad-request-error'

const ParamsSchema = z.object({
    id: z.string().uuid()
})

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function updateDiscipline(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put('/disciplines/:id', {
            schema: {
                tags: ['Disciplinas'],
                summary: 'Atualizar disciplina',
                security: [{ bearerAuth: [] }],
                params: ParamsSchema,
                body: UpdateDisciplineApiRequestSchema,
                response: {
                    200: UpdateDisciplineApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const { id } = request.params
            const { name, company_id } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('update', 'Discipline')) {
                throw new ForbiddenError()
            }

            const res = await prisma.disciplines.update({
                where: { id },
                data: {
                    name,
                    updated_by: userId,
                    updated_at: new Date()
                }
            })

            if (!res) {
                throw new BadRequestError('Erro ao atualizar disciplina')
            }

            return reply.status(200).send({ message: 'Disciplina atualizada com sucesso' })
        })
}