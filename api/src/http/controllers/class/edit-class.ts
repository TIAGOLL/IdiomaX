import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { EditClassApiRequestSchema, EditClassApiResponseSchema } from '@idiomax/validation-schemas/class/edit-class';
import { prisma } from '../../../lib/prisma';
import { auth } from '../../../middlewares/auth';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { ErrorResponseSchema } from '../../../types/error-response-schema';

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
            } = request.body;

            const userId = await request.getCurrentUserId();
            const { member } = await request.getUserMember(company_id);
            const { cannot } = getUserPermissions(userId, member.role);

            if (cannot('update', 'Class')) {
                throw new ForbiddenError();
            }

            // Verificar se já existe uma turma com o mesmo nome no curso (exceto a atual)
            const existingClass = await prisma.renamedclass.findFirst({
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

            await prisma.renamedclass.update({
                where: { id },
                data: {
                    name,
                    vacancies,
                    updated_by: userId,
                }
            });

            return reply.status(200).send({
                message: 'Turma atualizada com sucesso!'
            });
        });
}
