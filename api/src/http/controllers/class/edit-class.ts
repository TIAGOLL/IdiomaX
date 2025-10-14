import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { EditClassApiRequestSchema, EditClassApiResponseSchema } from '@idiomax/validation-schemas/class/edit-class';
import { prisma } from '../../../services/prisma';
import { auth } from '../../../middlewares/auth';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { ErrorResponseSchema } from '../../../types/error-response-schema';
import { WeekDays } from '@prisma/client';

export async function editClass(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put('/class', {
            schema: {
                tags: ['Class'],
                summary: 'Edit a class',
                security: [{ bearerAuth: [] }],
                body: EditClassApiRequestSchema,
                response: {
                    200: EditClassApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const {
                id,
                company_id,
                name,
                vacancies,
                class_days,
            } = request.body;

            const userId = await request.getCurrentUserId();
            const { member } = await request.getUserMember(company_id);
            const { cannot } = getUserPermissions(userId, member.role);

            if (cannot('update', 'Class')) {
                throw new ForbiddenError();
            }

            // Verificar se já existe uma turma com o mesmo nome no curso (exceto a atual)
            const existingClass = await prisma.classes.findFirst({
                where: {
                    name,
                    id: { not: id },
                    active: true
                }
            });

            if (existingClass) {
                return reply.status(400).send({
                    message: 'Já existe uma turma com este nome neste curso.'
                });
            }

            // Usar transação para atualizar a turma e os dias da semana
            await prisma.$transaction(async (tx) => {
                // Atualizar a turma
                await tx.classes.update({
                    where: { id },
                    data: {
                        name,
                        vacancies,
                        updated_by: userId,
                    }
                });

                // Atualizar os dias da semana se fornecidos
                if (class_days) {
                    // Remover todos os dias existentes
                    await tx.class_days.deleteMany({
                        where: { class_id: id }
                    });

                    // Adicionar os novos dias
                    if (class_days.length > 0) {
                        await tx.class_days.createMany({
                            data: class_days.map(day => ({
                                class_id: id,
                                week_date: day.week_date as WeekDays,
                                start_time: new Date(`1970-01-01T${day.start_time}:00.000Z`),
                                end_time: new Date(`1970-01-01T${day.end_time}:00.000Z`),
                                created_by: userId,
                                updated_by: userId,
                            }))
                        });
                    }
                }
            });

            return reply.status(200).send({
                message: 'Turma atualizada com sucesso!'
            });
        });
}
