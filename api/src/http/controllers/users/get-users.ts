import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
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

                // Formatar dados dos usuários para incluir o role
                const formattedUsers = users.map(user => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    cpf: user.cpf,
                    phone: user.phone,
                    username: user.username,
                    gender: user.gender,
                    date_of_birth: user.date_of_birth,
                    address: user.address,
                    avatar_url: user.avatar_url,
                    active: user.active,
                    role: user.member_on.find(member => member.company_id === company.id)?.role || 'STUDENT',
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                }));

                return reply.status(200).send({
                    users: formattedUsers,
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