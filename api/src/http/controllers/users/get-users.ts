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

                const whereClause: any = {
                    member_on: {
                        some: {
                            company_id,
                            role: role ? role : undefined,
                        }
                    }
                };

                // TEACHER vê apenas alunos das suas turmas
                if (member.role === 'TEACHER') {
                    // Buscar turmas do professor
                    const teacherClasses = await prisma.users_in_class.findMany({
                        where: {
                            user_id: userId,
                            teacher: true
                        },
                        select: {
                            class_id: true
                        }
                    })

                    const classIds = teacherClasses.map(tc => tc.class_id)

                    // Buscar IDs dos alunos dessas turmas
                    const studentsInClasses = await prisma.users_in_class.findMany({
                        where: {
                            class_id: { in: classIds },
                            teacher: false
                        },
                        select: {
                            user_id: true
                        }
                    })

                    const studentIds = studentsInClasses.map(s => s.user_id)

                    whereClause.id = { in: studentIds }
                }

                // STUDENT vê apenas ele mesmo
                if (member.role === 'STUDENT') {
                    whereClause.id = userId
                }

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