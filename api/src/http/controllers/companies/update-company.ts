import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { BadRequestError } from '../_errors/bad-request-error';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../lib/prisma';
import { UpdateCompanyApiRequestSchema, UpdateCompanyApiResponseSchema } from '@idiomax/http-schemas/companies/update-company';
import { ForbiddenError } from '../_errors/forbidden-error';
import { getUserPermissions } from '../../../lib/get-user-permission';

export async function updateCompany(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put(
            '/companies',
            {
                schema: {
                    tags: ['Instituições'],
                    summary: 'Atualizar uma instituição de ensino.',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: UpdateCompanyApiResponseSchema,
                    },
                    body: UpdateCompanyApiRequestSchema,
                },
            },
            async (request, reply) => {
                const { id, name, phone, address, cnpj, email, logo_16x16_url, logo_512x512_url, social_reason, state_registration, tax_regime, } = request.body;

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('update', 'Company')) {
                    throw new ForbiddenError()
                }

                if (phone) {
                    const companyAlreadyExistsByPhone = await prisma.companies.findFirst({
                        where: {
                            phone: phone,
                            NOT: {
                                id: id,
                            },
                        },
                    });

                    if (companyAlreadyExistsByPhone) {
                        throw new BadRequestError('Já existe uma instituição com esse telefone.');
                    }
                }

                const res = await prisma.companies.update({
                    where: {
                        id: id,
                    },
                    data: {
                        name,
                        phone,
                        address,
                        cnpj,
                        email,
                        logo_16x16_url,
                        logo_512x512_url,
                        social_reason,
                        state_registration,
                        tax_regime,
                    },
                });

                if (!res) {
                    throw new BadRequestError('Erro ao atualizar a instituição.');
                }

                return reply.status(200).send({
                    message: 'Instituição atualizada com sucesso.',
                });
            },
        );
}