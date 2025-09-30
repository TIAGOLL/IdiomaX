import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import {
    UpdateRegistrationTimeApiRequestSchema,
    UpdateRegistrationTimeApiResponseSchema
} from '@idiomax/validation-schemas/settings/update-registration-time';
import { prisma } from '../../../lib/prisma';
import { ForbiddenError } from '../_errors/forbidden-error';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { BadRequestError } from '../_errors/bad-request-error';

export async function updateRegistrationTime(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put(
            '/settings/update-registration-time',
            {
                schema: {
                    tags: ['Configurações'],
                    summary: 'Atualizar tempo padrão de matrícula.',
                    security: [{ bearerAuth: [] }],
                    body: UpdateRegistrationTimeApiRequestSchema,
                    response: {
                        200: UpdateRegistrationTimeApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id, registration_time } = request.body;

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('update', 'Company')) {
                    throw new ForbiddenError()
                }

                // Atualizar o tempo de matrícula
                const res = await prisma.configs.update({
                    where: {
                        company_id,
                    },
                    data: {
                        registration_time,
                        updated_at: new Date(),
                        updated_by: userId,
                    },
                });

                if (!res) {
                    throw new BadRequestError('Erro ao atualizar o tempo de matrícula.');
                }

                reply.status(200).send({
                    message: `Tempo de matrícula atualizado com sucesso.`,
                });
            }
        );
}