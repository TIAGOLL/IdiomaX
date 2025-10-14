import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CreateClassApiRequestSchema, CreateClassApiResponseSchema } from '@idiomax/validation-schemas/class/create-class';
import { prisma } from '../../../services/prisma';
import { auth } from '../../../middlewares/auth';
import { z } from 'zod';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { WeekDays } from '@prisma/client';
import { BadRequestError } from '../_errors/bad-request-error';

const ErrorResponseSchema = z.object({
    message: z.string(),
});

export async function createClass(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post('/class', {
            schema: {
                tags: ['Class'],
                summary: 'Create a new class',
                security: [{ bearerAuth: [] }],
                body: CreateClassApiRequestSchema,
                response: {
                    201: CreateClassApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const {
                company_id,
                name,
                vacancies,
                course_id,
                class_days,
                users_in_class
            } = request.body;

            const userId = await request.getCurrentUserId();
            const { member } = await request.getUserMember(company_id);
            const { cannot } = getUserPermissions(userId, member.role);

            if (cannot('create', 'Class')) {
                throw new ForbiddenError();
            }

            // Verificar se já existe uma turma com o mesmo nome no curso
            const existingClass = await prisma.classes.findFirst({
                where: {
                    name,
                    course_id,
                    active: true
                }
            });

            if (existingClass) {
                throw new BadRequestError('Já existe uma turma com esse nome neste curso.');
            }

            // Criar turma com transação para garantir consistência
            await prisma.$transaction(async (tx) => {
                // Criar a turma
                const turma = await tx.classes.create({
                    data: {
                        name,
                        vacancies,
                        course_id,
                        created_by: userId,
                        updated_by: userId,
                    }
                });

                // Criar dias da semana se fornecidos
                if (class_days && class_days.length > 0) {
                    await tx.class_days.createMany({
                        data: class_days.map(day => ({
                            week_date: day.week_date as WeekDays,
                            start_time: new Date(`${day.start_time}`),
                            end_time: new Date(`${day.end_time}`),
                            class_id: turma.id,
                            created_by: userId,
                            updated_by: userId,
                        }))
                    });
                }

                // Criar usuários na turma se fornecidos
                if (users_in_class && users_in_class.length > 0) {
                    await tx.users_in_class.createMany({
                        data: users_in_class.map(user => ({
                            class_id: turma.id,
                            user_id: user.user_id,
                            teacher: user.teacher,
                            created_by: userId,
                            updated_by: userId,
                        }))
                    });
                }

                return turma;
            });

            return reply.status(201).send({
                message: 'Turma criada com sucesso!'
            });
        });
}
