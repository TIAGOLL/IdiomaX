import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/get-user-permission';
import { GetUsersApiRequestSchema, GetUsersApiResponseSchema } from '@idiomax/http-schemas/users/get-users';
import { prisma } from '../../../lib/prisma';

export async function getUsers(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/users',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Obter uma lista de usuários de uma empresa por role.',
                    security: [{ bearerAuth: [] }],
                    querystring: GetUsersApiRequestSchema,
                    response: {
                        200: GetUsersApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const userId = await request.getCurrentUserId();
                const { company_id } = request.query;
                const { company } = await checkMemberAccess(company_id, userId);

                const {
                    page = 1,
                    limit = 10,
                    search,
                    role
                } = request.query;

                const offset = (page - 1) * limit;

                const whereClause: Record<string, unknown> = {
                    member_on: {
                        some: {
                            company_id: company.id,
                            ...(role && { role: role }),
                        }
                    }
                };

                if (search) {
                    whereClause.OR = [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { username: { contains: search, mode: 'insensitive' } },
                        { cpf: { contains: search } },
                        { company_id: { equals: company.id } }
                    ];
                }

                // Buscar usuários
                const [users, totalCount] = await Promise.all([
                    prisma.users.findMany({
                        where: whereClause,
                        skip: offset,
                        take: limit,
                        orderBy: { name: 'asc' },
                        include: {
                            member_on: {
                                include: {
                                    company: true,
                                }
                            }
                        }
                    }),
                    prisma.users.count({ where: whereClause })
                ]);

                const totalPages = Math.ceil(totalCount / limit);

                return reply.status(200).send({
                    users,
                    pagination: {
                        total: totalCount,
                        page,
                        limit,
                        pages: totalPages,
                    },
                });
            },
        );
}