import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkAdminAccess } from '../../../lib/get-user-permission';
import {
    UpdateRegistrationTimeApiRequestSchema,
    UpdateRegistrationTimeApiResponseSchema
} from '@idiomax/validation-schemas/settings/update-registration-time';
import { prisma } from '../../../lib/prisma';
import { ForbiddenError } from '../_errors/forbidden-error';

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
                const { company_id, registrations_time } = request.body;
                const userId = await request.getCurrentUserId();

                // Verificar se o usuário tem acesso à empresa (e permissions)
                const { company } = await checkAdminAccess(company_id, userId);

                if (!company) {
                    throw new ForbiddenError();
                }

                // Atualizar o tempo de matrícula
                await prisma.configs.update({
                    where: {
                        company_id: company.id,
                    },
                    data: {
                        registrations_time: registrations_time,
                        updated_at: new Date(),
                        updated_by: userId,
                    },
                });

                reply.send({
                    message: `Tempo de matrícula atualizado com sucesso.`,
                });
            }
        );
}