import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { RemoveClassDayApiResponseSchema } from '@idiomax/validation-schemas/class/remove-class-day';
import { prisma } from '../../../services/prisma';
import { auth } from '../../../middlewares/auth';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { BadRequestError } from '../_errors/bad-request-error';
import { ErrorResponseSchema } from '../../../types/error-response-schema';
import { z } from 'zod';

export async function removeClassDay(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete('/class-day', {
            schema: {
                tags: ['Class'],
                summary: 'Remove a specific class day',
                security: [{ bearerAuth: [] }],
                querystring: z.object({
                    company_id: z.string().uuid(),
                    class_day_id: z.string().uuid()
                }),
                response: {
                    200: RemoveClassDayApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const { company_id, class_day_id } = request.query;

            const userId = await request.getCurrentUserId();
            const { member } = await request.getUserMember(company_id);
            const { cannot } = getUserPermissions(userId, member.role);

            if (cannot('update', 'Class')) {
                throw new ForbiddenError();
            }

            // Verificar se o class_day existe e pertence a uma turma da empresa
            const classDay = await prisma.class_days.findFirst({
                where: {
                    id: class_day_id,
                    class: {
                        courses: {
                            company_id: company_id
                        }
                    }
                }
            });

            if (!classDay) {
                throw new BadRequestError('Dia da semana não encontrado ou não pertence a esta empresa.');
            }

            // Remover o class_day
            await prisma.class_days.delete({
                where: { id: class_day_id }
            });

            return reply.status(200).send({
                message: 'Dia da semana removido com sucesso!'
            });
        });
}