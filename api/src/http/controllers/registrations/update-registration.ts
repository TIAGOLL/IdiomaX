import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from '../../../services/prisma';
import { auth } from '../../../middlewares/auth';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { NotFoundError } from '../_errors/not-found-error';
import { UpdateRegistrationApiRequestSchema, UpdateRegistrationApiResponseSchema } from '@idiomax/validation-schemas/registrations';

export async function updateRegistration(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch(
            '/update-registration',
            {
                schema: {
                    tags: ['Registrations'],
                    summary: 'Atualizar valor da mensalidade e desconto da matrícula.',
                    security: [{ bearerAuth: [] }],
                    body: UpdateRegistrationApiRequestSchema,
                    response: {
                        200: UpdateRegistrationApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { id, company_id, monthly_fee_amount, discount_payment_before_due_date } = request.body;
                const userId = await request.getCurrentUserId();
                const { member } = await request.getUserMember(company_id);

                const { cannot } = getUserPermissions(userId, member.role);

                if (cannot('update', 'Registration')) {
                    throw new ForbiddenError();
                }

                const registration = await prisma.registrations.findFirst({
                    where: {
                        id,
                        company_id,
                        active: true,
                    },
                });

                if (!registration) {
                    throw new NotFoundError('Matrícula não encontrada');
                }

                const updatedRegistration = await prisma.registrations.update({
                    where: {
                        id,
                    },
                    data: {
                        monthly_fee_amount,
                        discount_payment_before_due_date,
                        updated_by: userId,
                    },
                    select: {
                        id: true,
                        company_id: true,
                        monthly_fee_amount: true,
                        discount_payment_before_due_date: true,
                        updated_at: true,
                    },
                });

                return reply.status(200).send({
                    message: 'Matrícula atualizada com sucesso',
                    registration: {
                        ...updatedRegistration,
                        monthly_fee_amount: Number(updatedRegistration.monthly_fee_amount),
                        discount_payment_before_due_date: Number(updatedRegistration.discount_payment_before_due_date),
                        updated_at: updatedRegistration.updated_at.toISOString(),
                    },
                });
            }
        );
}