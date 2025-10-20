import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { RegisterMonthlyFeePaymentApiRequestSchema, RegisterMonthlyFeePaymentApiResponseSchema } from '@idiomax/validation-schemas/registrations/register-monthly-fee-payment';
import { prisma } from '../../../services/prisma';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { NotFoundError } from '../_errors/not-found-error';

export async function registerMonthlyFeePayment(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/registrations/register-monthly-payment',
            {
                schema: {
                    tags: ['Registrations'],
                    summary: 'Registrar pagamento de mensalidade.',
                    security: [{ bearerAuth: [] }],
                    body: RegisterMonthlyFeePaymentApiRequestSchema,
                    response: {
                        201: RegisterMonthlyFeePaymentApiResponseSchema
                    }
                }
            },
            async (request, reply) => {
                const { monthly_fee_id, registration_id, company_id, paid_amount, payment_method } = request.body;
                const userId = await request.getCurrentUserId();
                const { member } = await request.getUserMember(company_id);

                const { cannot } = getUserPermissions(userId, member.role);

                if (cannot('update', 'Registration')) {
                    throw new ForbiddenError();
                }

                // Verificar se a mensalidade existe e pertence à matrícula
                const monthlyFee = await prisma.monthly_fees.findFirst({
                    where: {
                        id: monthly_fee_id,
                        registration_id,
                        active: true,
                        registrations: {
                            company_id,
                            active: true
                        }
                    }
                });

                if (!monthlyFee) {
                    throw new NotFoundError('Mensalidade não encontrada');
                }

                if (monthlyFee.paid) {
                    throw new Error('Mensalidade já está paga');
                }

                // Registrar pagamento
                const updatedMonthlyFee = await prisma.monthly_fees.update({
                    where: {
                        id: monthly_fee_id
                    },
                    data: {
                        paid: true,
                        value: paid_amount,
                        payment_method,
                        date_of_payment: new Date(),
                        updated_by: userId
                    },
                    select: {
                        id: true,
                        registration_id: true,
                        due_date: true,
                        value: true,
                        paid: true,
                        date_of_payment: true,
                        created_at: true,
                        updated_at: true,
                        registrations: {
                            select: {
                                discount_payment_before_due_date: true
                            }
                        }
                    }
                });

                const paidOnTime = new Date() <= monthlyFee.due_date;

                return reply.status(201).send({
                    message: 'Pagamento registrado com sucesso',
                });
            }
        );
}