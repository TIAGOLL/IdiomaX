import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { GetRegistrationByIdApiRequestSchema, GetRegistrationByIdApiResponseSchema } from "@idiomax/validation-schemas/registrations"
import { prisma } from '../../../services/prisma';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { NotFoundError } from '../_errors/not-found-error';

export async function getRegistrationById(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/get-registration-by-id',
            {
                schema: {
                    tags: ['Registrations'],
                    summary: 'Obter inscrição específica por ID.',
                    security: [{ bearerAuth: [] }],
                    querystring: GetRegistrationByIdApiRequestSchema,
                    response: {
                        200: GetRegistrationByIdApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { registration_id, company_id } = request.query;
                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get', 'Registration')) {
                    throw new ForbiddenError()
                }

                const registration = await prisma.registrations.findFirst({
                    where: {
                        id: registration_id,
                        company_id: company_id,
                        active: true,
                    },
                    include: {
                        users: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        },
                        courses: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                        monthly_fee: {
                            select: {
                                id: true,
                                registration_id: true,
                                due_date: true,
                                value: true,
                                paid: true,
                                payment_method: true,
                                date_of_payment: true,
                                created_at: true,
                            },
                            orderBy: {
                                due_date: 'desc'
                            }
                        }
                    }
                });

                if (!registration) {
                    throw new NotFoundError('Inscrição não encontrada');
                }

                const mappedRegistration = {
                    id: registration.id,
                    company_id: registration.company_id,
                    user_id: registration.user_id,
                    course_id: registration.course_id,
                    start_date: registration.start_date.toISOString(),
                    completed: registration.completed,
                    monthly_fee_amount: Number(registration.monthly_fee_amount),
                    discount_payment_before_due_date: Number(registration.discount_payment_before_due_date),
                    active: registration.active,
                    locked: registration.locked,
                    created_at: registration.created_at.toISOString(),
                    updated_at: registration.updated_at.toISOString(),
                    user: {
                        id: registration.users.id,
                        name: registration.users.name,
                        email: registration.users.email,
                    },
                    course: {
                        id: registration.courses.id,
                        name: registration.courses.name,
                    },
                    monthly_fees: registration.monthly_fee.map(fee => ({
                        id: fee.id,
                        registration_id: fee.registration_id,
                        due_date: fee.due_date.toISOString(),
                        amount: Number(fee.value),
                        amount_with_discount: Number(fee.value) - Number(registration.discount_payment_before_due_date),
                        paid_at: fee.date_of_payment?.toISOString() || null,
                        paid_amount: fee.paid ? Number(fee.value) : null,
                        status: fee.paid ? 'PAID' as const : (fee.due_date < new Date() ? 'OVERDUE' as const : 'PENDING' as const),
                        created_at: fee.created_at.toISOString()
                    }))
                };

                return reply.status(200).send(mappedRegistration);
            }
        );
}