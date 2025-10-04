import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { GetRegistrationsApiRequestSchema, GetRegistrationsApiResponseSchema } from "@idiomax/validation-schemas/registrations/get-registrations"
import { prisma } from '../../../lib/prisma';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function getRegistrations(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/registrations',
            {
                schema: {
                    tags: ['Registrations'],
                    summary: 'Obter inscrições de uma empresa.',
                    security: [{ bearerAuth: [] }],
                    querystring: GetRegistrationsApiRequestSchema,
                    response: {
                        200: GetRegistrationsApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id } = request.query;
                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get', 'Registration')) {
                    throw new ForbiddenError()
                }

                const registrations = await prisma.registrations.findMany({
                    where: {
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
                    },
                });

                const mappedRegistrations = registrations.map(registration => ({
                    id: registration.id,
                    start_date: registration.start_date.toISOString(),
                    monthly_fee_amount: Number(registration.monthly_fee_amount),
                    locked: registration.locked,
                    end_date: registration.end_date.toISOString(),
                    completed: registration.completed,
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
                }));

                return reply.status(200).send(mappedRegistrations);
            }
        );
}