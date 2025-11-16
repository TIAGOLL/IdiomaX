import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UpdateGradeApiRequestSchema, UpdateGradeApiResponseSchema } from '@idiomax/validation-schemas/grades'
import { prisma } from '../../../services/prisma'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'
import { ErrorResponseSchema } from '../../../types/error-response-schema'
import { z } from 'zod'

export async function updateGrade(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put('/grades/:submission_id', {
            schema: {
                tags: ['Grades'],
                summary: 'Atualizar nota de uma tarefa submetida',
                security: [{ bearerAuth: [] }],
                params: z.object({ submission_id: z.string().uuid() }),
                body: UpdateGradeApiRequestSchema.omit({ submission_id: true }),
                response: {
                    200: UpdateGradeApiResponseSchema,
                    403: ErrorResponseSchema
                },
            },
        }, async (request, reply) => {
            const { submission_id } = request.params
            const { grade, company_id } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('update', 'Grade')) {
                throw new ForbiddenError('Você não tem permissão para atualizar notas')
            }

            await prisma.tasks_submitted.update({
                where: { id: submission_id },
                data: { grade },
            })

            return reply.status(200).send({ 
                message: 'Nota atualizada com sucesso!' 
            })
        })
}
