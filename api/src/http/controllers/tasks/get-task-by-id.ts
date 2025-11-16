import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../services/prisma';
import { GetTaskByIdApiResponseSchema } from '@idiomax/validation-schemas/tasks/get-task-by-id';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { BadRequestError } from '../_errors/bad-request-error';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function getTaskById(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/tasks/:taskId',
            {
                schema: {
                    tags: ['Tarefas'],
                    summary: 'Buscar tarefa por ID',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        taskId: z.string().uuid(),
                    }),
                    response: {
                        200: GetTaskByIdApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const userId = await request.getCurrentUserId();
                const { taskId } = request.params;

                // Buscar tarefa com dados da disciplina para obter company_id
                const task = await prisma.tasks.findUnique({
                    where: {
                        id: taskId,
                        active: true,
                    },
                    include: {
                        disciplines: {
                            select: {
                                id: true,
                                name: true,
                                levels: {
                                    include: {
                                        courses: true,
                                    },
                                },
                            },
                        },
                    },
                });

                if (!task || !task.disciplines?.levels?.courses) {
                    throw new BadRequestError('Tarefa não encontrada');
                }

                const company_id = task.disciplines.levels.courses.company_id;
                const { member } = await request.getUserMember(company_id);

                const { cannot } = getUserPermissions(userId, member.role);

                if (cannot('get', 'Task')) {
                    throw new ForbiddenError();
                }

                return reply.status(200).send({
                    ...task,
                    submit_date: task.submit_date.toISOString(),
                    created_at: task.created_at.toISOString(),
                    updated_at: task.updated_at.toISOString(),
                    discipline: {
                        id: task.disciplines.id,
                        name: task.disciplines.name,
                    },
                });
            }
        );
}
