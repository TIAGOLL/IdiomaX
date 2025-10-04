import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { DeleteRegistrationApiRequestSchema, DeleteRegistrationApiResponseSchema } from '@idiomax/validation-schemas/registrations/delete-registration'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'
import { NotFoundError } from '../_errors/not-found-error'
import { ErrorResponseSchema } from '../../../types/error-response-schema'

export async function deleteRegistration(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete('/registrations', {
            schema: {
                tags: ['Registrations'],
                summary: 'Delete a registration (soft delete)',
                security: [{ bearerAuth: [] }],
                body: DeleteRegistrationApiRequestSchema,
                response: {
                    200: DeleteRegistrationApiResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const { id, company_id } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('delete', 'Registration')) {
                throw new ForbiddenError()
            }

            // Verificar se a inscrição existe
            const existingRegistration = await prisma.registrations.findFirst({
                where: {
                    id: id,
                    company_id: company_id,
                    active: true
                }
            });

            if (!existingRegistration) {
                throw new NotFoundError('Inscrição não encontrada');
            }

            // Soft delete - apenas marca como inativa
            await prisma.registrations.update({
                where: {
                    id: id
                },
                data: {
                    active: false,
                    updated_by: userId,
                }
            })

            return reply.status(200).send({
                message: 'Inscrição excluída com sucesso!',
                success: true
            })
        })
}