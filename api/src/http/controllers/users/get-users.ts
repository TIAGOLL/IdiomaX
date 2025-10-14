import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { GetUsersApiRequestSchema, GetUsersApiResponseSchema } from '@idiomax/validation-schemas/users/get-users';
import { prisma } from '../../../services/prisma';
import { ForbiddenError } from '../_errors/forbidden-error';
import { getUserPermissions } from '../../../lib/get-user-permission';

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
                const { company_id, search, role } = request.query;

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get', 'User')) {
                    throw new ForbiddenError()
                }

                const whereClause: Record<string, unknown> = {
                    member_on: {
                        some: {
                            company_id,
                            role: role ? role : undefined,
                        }
                    }
                };

                if (search) {
                    whereClause.OR = [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { username: { contains: search, mode: 'insensitive' } },
                        { cpf: { contains: search } },
                        { company_id: { equals: company_id } }
                    ];
                }

                // Buscar usuários
                const users = await prisma.users.findMany({
                    where: whereClause,
                    orderBy: { name: 'asc' },
                    include: {
                        member_on: {
                            include: {
                                company: true,
                            }
                        }
                    }
                });

                return reply.status(200).send(users);
            },
        );
}