import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { AlterDisciplineStatusApiRequestSchema, AlterDisciplineStatusApiResponseSchema } from '@idiomax/validation-schemas/disciplines/toggle-discipline-status'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { z } from 'zod'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'

const ParamsSchema = z.object({
    id: z.string().uuid()
})

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function alterDisciplineStatus(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch('/disciplines/:id/alter-status', {
            schema: {
                tags: ['Disciplinas'],
                summary: 'Ativar/desativar disciplina',
                security: [{ bearerAuth: [] }],
                params: ParamsSchema,
                body: AlterDisciplineStatusApiRequestSchema,
                response: {
                    200: AlterDisciplineStatusApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const { id } = request.params
            const { active, company_id } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('delete', 'Discipline')) {
                throw new ForbiddenError()
            }

            await prisma.disciplines.update({
                where: { id },
                data: {
                    active,
                    updated_by: userId,
                    updated_at: new Date()
                }
            })

            return reply.status(200).send({
                message: `Disciplina ${active ? 'ativada' : 'desativada'} com sucesso`
            })
        })
}