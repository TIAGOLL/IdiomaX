import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { GetUserByEmailApiRequestSchema, GetUserByEmailApiResponseSchema } from '@idiomax/http-schemas/users/get-user-by-email';
import { prisma } from '../../../lib/prisma';

export async function getUserByEmail(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/users/by-email',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Buscar usuário por email e role.',
                    security: [{ bearerAuth: [] }],
                    querystring: GetUserByEmailApiRequestSchema,
                    response: {
                        200: GetUserByEmailApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id, email } = request.query;
                const userId = await request.getCurrentUserId();

                const { company } = await checkMemberAccess(company_id, userId);

                const user = await prisma.users.findFirst({
                    where: {
                        email,
                        member_on: {
                            some: {
                                company_id: company.id,
                            }
                        }
                    },
                    include: {
                        member_on: {
                            where: {
                                company_id: company.id
                            },
                            select: {
                                role: true
                            }
                        }
                    }
                });

                if (!user) {
                    return reply.status(200).send({ user: null });
                }

                const response = {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        role: user.member_on[0]?.role || 'STUDENT' as 'STUDENT' | 'TEACHER' | 'ADMIN',
                        active: user.active || false,
                    }
                };

                return reply.status(200).send(response);
            },
        );
}