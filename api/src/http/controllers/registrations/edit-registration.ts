import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { EditRegistrationApiRequestSchema, EditRegistrationApiResponseSchema } from '@idiomax/validation-schemas/registrations/edit-registration'
import { prisma } from '../../../services/prisma'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'

import { NotFoundError } from '../_errors/not-found-error'
import { ErrorResponseSchema } from '../../../types/error-response-schema'

export async function editRegistration(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put('/registrations', {
            schema: {
                tags: ['Registrations'],
                summary: 'Edit a registration',
                security: [{ bearerAuth: [] }],
                body: EditRegistrationApiRequestSchema,
                response: {
                    200: EditRegistrationApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const {
                id,
                company_id,
                monthly_fee_amount,
                discount_payment_before_due_date,
                locked,
                completed
            } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('update', 'Registration')) {
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

            await prisma.registrations.update({
                where: {
                    id: id
                },
                data: {
                    monthly_fee_amount,
                    discount_payment_before_due_date,
                    locked: locked ?? existingRegistration.locked,
                    completed: completed ?? existingRegistration.completed,
                    updated_by: userId,
                }
            })

            return reply.status(200).send({
                message: 'Inscrição atualizada com sucesso!'
            })
        })
}