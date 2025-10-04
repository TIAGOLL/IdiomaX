import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { GetRegistrationByIdApiRequestSchema, GetRegistrationByIdApiResponseSchema } from "@idiomax/validation-schemas/registrations/get-registrations"
import { prisma } from '../../../lib/prisma';
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
                const { id, company_id } = request.query;
                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get', 'Registration')) {
                    throw new ForbiddenError()
                }

                const registration = await prisma.registrations.findFirst({
                    where: {
                        id: id,
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
                        }
                    }
                });

                if (!registration) {
                    throw new NotFoundError('Inscrição não encontrada');
                }

                const mappedRegistration = {
                    id: registration.id,
                    start_date: registration.start_date.toISOString(),
                    monthly_fee_amount: Number(registration.monthly_fee_amount),
                    locked: registration.locked,
                    completed: registration.completed,
                    end_date: registration.end_date.toISOString(),
                    user_id: registration.user_id,
                    company_id: registration.company_id,
                    created_at: registration.created_at.toISOString(),
                    updated_at: registration.updated_at.toISOString(),
                    active: registration.active,
                    users: registration.users ? {
                        id: registration.users.id,
                        name: registration.users.name,
                        email: registration.users.email,
                    } : null,
                };

                return reply.status(200).send(mappedRegistration);
            }
        );
}