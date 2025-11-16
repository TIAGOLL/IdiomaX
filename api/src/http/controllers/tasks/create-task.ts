import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../services/prisma';
import { CreateTaskApiRequestSchema, CreateTaskApiResponseSchema } from '@idiomax/validation-schemas/tasks/create-task';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { BadRequestError } from '../_errors/bad-request-error';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function createTask(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/tasks',
            {
                schema: {
                    tags: ['Tarefas'],
                    summary: 'Criar uma nova tarefa',
                    security: [{ bearerAuth: [] }],
                    body: CreateTaskApiRequestSchema,
                    response: {
                        201: CreateTaskApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const userId = await request.getCurrentUserId();
                const { title, description, value, submit_date, discipline_id, file } = request.body;

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

                if (cannot('create', 'Task')) {
                    throw new ForbiddenError();
                }

                const task = await prisma.tasks.create({
                    data: {
                        title,
                        description: description || null,
                        value,
                        submit_date: new Date(submit_date),
                        discipline_id,
                        file: file || null,
                        created_by: userId,
                        updated_by: userId,
                    },
                });

                return reply.status(201).send({
                    message: 'Tarefa criada com sucesso',
                    taskId: task.id,
                });
            }
        );
}
