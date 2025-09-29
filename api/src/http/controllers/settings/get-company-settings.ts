import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import {
    GetCompanySettingsApiRequestSchema,
    GetCompanySettingsApiResponseSchema
} from '@idiomax/http-schemas/settings/get-company-settings';
import { prisma } from '../../../lib/prisma';
import { NotFoundError } from '../_errors/not-found-error';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function getCompanySettings(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/settings/company/:company_id',
            {
                schema: {
                    tags: ['Configurações'],
                    summary: 'Obter configurações da empresa.',
                    security: [{ bearerAuth: [] }],
                    params: GetCompanySettingsApiRequestSchema,
                    response: {
                        200: GetCompanySettingsApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id } = request.params;

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get', 'Company')) {
                    throw new ForbiddenError()
                }
                // Verificar se o usuário tem acesso à empresa
                // Buscar as configurações da empresa
                const config = await prisma.configs.findFirst({
                    where: {
                        company_id,
                    },
                    select: {
                        registrations_time: true,
                    },
                });

                if (!config) {
                    throw new NotFoundError('Configurações não encontradas para esta empresa.');
                }

                reply.send({
                    registration_time: Number(config.registrations_time),
                });
            }
        );
}