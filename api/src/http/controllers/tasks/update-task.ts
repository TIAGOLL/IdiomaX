import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../services/prisma';
import { UpdateTaskApiRequestSchema, UpdateTaskApiResponseSchema } from '@idiomax/validation-schemas/tasks/update-task';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { BadRequestError } from '../_errors/bad-request-error';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function updateTask(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put(
            '/tasks/:taskId',
            {
                schema: {
                    tags: ['Tarefas'],
                    summary: 'Atualizar uma tarefa',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        taskId: z.string().uuid(),
                    }),
                    body: UpdateTaskApiRequestSchema,
                    response: {
                        200: UpdateTaskApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const userId = await request.getCurrentUserId();
                const { taskId } = request.params;
                const { title, description, value, submit_date, discipline_id, file } = request.body;

                // Verificar se a tarefa existe
                const existingTask = await prisma.tasks.findUnique({
                    where: { id: taskId, active: true },
                });

                if (!existingTask) {
                    throw new BadRequestError('Tarefa não encontrada');
                }

                // Verificar se a disciplina existe e buscar company_id
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

                if (cannot('update', 'Task')) {
                    throw new ForbiddenError();
                }

                await prisma.tasks.update({
                    where: { id: taskId },
                    data: {
                        title,
                        description: description || null,
                        value,
                        submit_date: new Date(submit_date),
                        discipline_id,
                        file: file || existingTask.file,
                        updated_by: userId,
                    },
                });

                return reply.status(200).send({
                    message: 'Tarefa atualizada com sucesso',
                });
            }
        );
}
