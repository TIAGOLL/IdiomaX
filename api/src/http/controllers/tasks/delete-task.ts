import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../services/prisma';
import { DeleteTaskApiResponseSchema } from '@idiomax/validation-schemas/tasks/delete-task';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { BadRequestError } from '../_errors/bad-request-error';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function deleteTask(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete(
            '/tasks/:taskId',
            {
                schema: {
                    tags: ['Tarefas'],
                    summary: 'Deletar uma tarefa (soft delete)',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        taskId: z.string().uuid(),
                    }),
                    response: {
                        200: DeleteTaskApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const userId = await request.getCurrentUserId();
                const { taskId } = request.params;

                // Verificar se a tarefa existe e buscar company_id
                const existingTask = await prisma.tasks.findUnique({
                    where: { id: taskId, active: true },
                    include: {
                        disciplines: {
                            include: {
                                levels: {
                                    include: {
                                        courses: true,
                                    },
                                },
                            },
                        },
                    },
                });

                if (!existingTask || !existingTask.disciplines?.levels?.courses) {
                    throw new BadRequestError('Tarefa não encontrada');
                }

                const company_id = existingTask.disciplines.levels.courses.company_id;
                const { member } = await request.getUserMember(company_id);

                const { cannot } = getUserPermissions(userId, member.role);

                if (cannot('delete', 'Task')) {
                    throw new ForbiddenError();
                }

                // Verificar se algum aluno já entregou a tarefa
                const submittedTasks = await prisma.tasks_submitted.findFirst({
                    where: {
                        task_id: taskId,
                    },
                });

                if (submittedTasks) {
                    throw new BadRequestError('Não é possível deletar esta tarefa pois já existem entregas de alunos');
                }

                // Soft delete
                await prisma.tasks.update({
                    where: { id: taskId },
                    data: {
                        active: false,
                        updated_by: userId,
                    },
                });

                return reply.status(200).send({
                    message: 'Tarefa deletada com sucesso',
                });
            }
        );
}
