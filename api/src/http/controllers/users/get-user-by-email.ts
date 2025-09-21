import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { getUserByEmailQuery, getUserByEmailResponse } from '@idiomax/http-schemas/get-user-by-email';
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
                    querystring: getUserByEmailQuery,
                    response: {
                        200: getUserByEmailResponse,
                    },
                },
            },
            async (request, reply) => {
                const { companyId, email, role } = request.query;
                const userId = await request.getCurrentUserId();

                const { company } = await checkMemberAccess(companyId, userId);

                const user = await prisma.users.findFirst({
                    where: {
                        email,
                        member_on: {
                            some: {
                                company_id: company.id,
                                role: role,
                            }
                        }
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        cpf: true,
                        phone: true,
                        username: true,
                        gender: true,
                        date_of_birth: true,
                        address: true,
                        avatar_url: true,
                        active: true,
                        created_at: true,
                        updated_at: true,
                        created_by: true,
                        updated_by: true,
                    }
                });

                return reply.status(200).send(user);
            },
        );
}