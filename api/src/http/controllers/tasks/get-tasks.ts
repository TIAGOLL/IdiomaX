import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../services/prisma';
import { GetTasksApiRequestSchema, GetTasksApiResponseSchema } from '@idiomax/validation-schemas/tasks/get-tasks';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { BadRequestError } from '../_errors/bad-request-error';

export async function getTasks(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/tasks',
            {
                schema: {
                    tags: ['Tarefas'],
                    summary: 'Listar tarefas de uma disciplina',
                    security: [{ bearerAuth: [] }],
                    querystring: GetTasksApiRequestSchema,
                    response: {
                        200: GetTasksApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const userId = await request.getCurrentUserId();
                const { discipline_id } = request.query;

                // Buscar disciplina para obter company_id
                const discipline = await prisma.disciplines.findUnique({
                    where: { id: discipline_id, active: true },
                    include: {
                        levels: {
                            include: {
                                courses: true,
                            },
                        },
                    },
                });

                if (!discipline || !discipline.levels?.courses) {
                    throw new BadRequestError('Disciplina não encontrada');
                }

                const company_id = discipline.levels.courses.company_id;
                const { member } = await request.getUserMember(company_id);

                const { cannot } = getUserPermissions(userId, member.role);

                if (cannot('get', 'Task')) {
                    throw new ForbiddenError();
                }

                const tasks = await prisma.tasks.findMany({
                    where: {
                        discipline_id,
                        active: true,
                    },
                    include: {
                        disciplines: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        created_at: 'desc',
                    },
                });

                return reply.status(200).send(
                    tasks.map((task) => ({
                        ...task,
                        submit_date: task.submit_date.toISOString(),
                        created_at: task.created_at.toISOString(),
                        updated_at: task.updated_at.toISOString(),
                        discipline: task.disciplines,
                    }))
                );
            }
        );
}
