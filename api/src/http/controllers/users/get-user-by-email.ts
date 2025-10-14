import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { GetUserByEmailApiRequestSchema, GetUserByEmailApiResponseSchema } from '@idiomax/validation-schemas/users/get-user-by-email';
import { prisma } from '../../../services/prisma';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { NotFoundError } from '../_errors/not-found-error';

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
                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get', 'User')) {
                    throw new ForbiddenError()
                }

                const user = await prisma.users.findFirst({
                    where: {
                        email,
                        member_on: {
                            some: {
                                company_id,
                            }
                        }
                    },
                });

                if (!user) {
                    throw new NotFoundError('Usuário não encontrado.');
                }

                return reply.status(200).send(user);
            },
        );
}