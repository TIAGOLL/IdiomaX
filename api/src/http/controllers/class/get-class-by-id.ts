import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { GetClassByIdApiRequestSchema, GetClassByIdApiResponseSchema } from '@idiomax/validation-schemas/class';
import { prisma } from '../../../lib/prisma';
import { auth } from '../../../middlewares/auth';
import { z } from 'zod';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';

const ErrorResponseSchema = z.object({
    message: z.string(),
});

export async function getClassById(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get('/class-by-id', {
            schema: {
                tags: ['Class'],
                summary: 'Obter turma por ID',
                security: [{ bearerAuth: [] }],
                querystring: GetClassByIdApiRequestSchema,
                response: {
                    200: GetClassByIdApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const { company_id, class_id } = request.query

            const userId = await request.getCurrentUserId();
            const { member } = await request.getUserMember(company_id);
            const { cannot } = getUserPermissions(userId, member.role);

            if (cannot('get', 'Class')) {
                throw new ForbiddenError();
            }

            const classData = await prisma.classes.findUnique({
                where: { id: class_id },
                include: {
                    courses: true,
                    users_in_class: {
                        include: {
                            users: true,
                        }
                    },
                    class_days: true,
                },
            });

            if (!classData) {
                return reply.status(400).send({ message: 'Turma não encontrada.' });
            }

            return reply.status(200).send(classData);
        });
}
