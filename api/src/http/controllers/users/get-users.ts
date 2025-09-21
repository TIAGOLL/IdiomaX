import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { getUsersQuery, getUsersResponse } from '@idiomax/http-schemas/get-users';
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
                    querystring: getUsersQuery,
                    response: {
                        200: getUsersResponse,
                    },
                },
            },
            async (request, reply) => {
                const userId = await request.getCurrentUserId();
                const { companyId } = request.query;

                const { company } = await checkMemberAccess(companyId, userId);

                const {
                    page = 1,
                    limit = 10,
                    search,
                    active,
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

                if (active !== undefined) {
                    whereClause.active = active;
                }

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
                            member_on: {
                                select: {
                                    company_id: true,
                                    role: true,
                                }
                            }
                        }
                    }),
                    prisma.users.count({ where: whereClause })
                ]);

                const totalPages = Math.ceil(totalCount / limit);

                return reply.status(200).send({
                    users,
                    totalCount,
                    page,
                    limit,
                    totalPages,
                });
            },
        );
}