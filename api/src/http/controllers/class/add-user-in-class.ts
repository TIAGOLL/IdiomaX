import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { AddUserInClassApiRequestSchema, AddUserInClassApiResponseSchema } from '@idiomax/validation-schemas/class/add-user-in-class';
import { prisma } from '../../../lib/prisma';
import { auth } from '../../../middlewares/auth';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { ErrorResponseSchema } from '../../../types/error-response-schema';

export async function addUserInClass(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post('/add-user-in-class', {
            schema: {
                tags: ['Class'],
                summary: 'Adicionar usuário em uma turma',
                security: [{ bearerAuth: [] }],
                body: AddUserInClassApiRequestSchema,
                response: {
                    201: AddUserInClassApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const {
                class_id,
                user_id,
                teacher,
                company_id
            } = request.body;

            const userId = await request.getCurrentUserId();
            const { member } = await request.getUserMember(company_id);
            const { cannot } = getUserPermissions(userId, member.role);

            if (cannot('update', 'Class')) {
                throw new ForbiddenError();
            }

            // Adicionar usuário na turma
            await prisma.users_in_class.create({
                data: {
                    class_id,
                    user_id,
                    teacher,
                    created_by: userId,
                    updated_by: userId,
                }
            });

            return reply.status(201).send({
                message: 'Usuário adicionado na turma com sucesso!'
            });
        });
}