import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CreateClassApiRequestSchema, CreateClassApiResponseSchema } from '@idiomax/validation-schemas/class/create-class';
import { prisma } from '../../../lib/prisma';
import { auth } from '../../../middlewares/auth';
import { z } from 'zod';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';

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
                course_id
            } = request.body;

            const userId = await request.getCurrentUserId();
            const { member } = await request.getUserMember(company_id);
            const { cannot } = getUserPermissions(userId, member.role);

            if (cannot('create', 'Class')) {
                throw new ForbiddenError();
            }

            // Verificar se já existe uma turma com o mesmo nome no curso
            const existingClass = await prisma.renamedclass.findFirst({
                where: {
                    name,
                    course_id,
                    active: true
                }
            });

            if (existingClass) {
                return reply.status(400).send({
                    message: 'Já existe uma turma com este nome neste curso.'
                });
            }

            await prisma.renamedclass.create({
                data: {
                    name,
                    vacancies,
                    course_id,
                    created_by: userId,
                    updated_by: userId,
                }
            });

            return reply.status(201).send({
                message: 'Turma criada com sucesso!'
            });
        });
}
