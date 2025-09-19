import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { BadRequestError } from '../_errors/bad-request-error';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../lib/prisma';
import { putCompanyRequest, putCompanyResponse } from '@idiomax/http-schemas/put-company';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function putCompany(app: FastifyInstance) {
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
                        201: putCompanyResponse,
                    },
                    body: putCompanyRequest,
                },
            },
            async (request, reply) => {
                const { id, name, address, cnpj, phone, email, logo_16x16_url, logo_512x512_url, social_reason, state_registration, tax_regime, } = request.body;
                const userId = await request.getCurrentUserId()

                if (email) {
                    const companyAlreadyExistsByEmail = await prisma.companies.findFirst({
                        where: {
                            email: email,
                            NOT: {
                                id: id, 
                            },
                        },
                    });

                    if (companyAlreadyExistsByEmail) {
                        throw new BadRequestError('Já existe uma instituição com esse e-mail.');
                    }
                }

                const userAdminInCompany = await prisma.members.findFirst({
                    where: {
                        user_id: userId,
                        company_id: id,
                        role: 'ADMIN',
                    },
                });

                const companyAlreadyExistsByPhone = await prisma.companies.findFirst({
                    where: {
                        phone: phone,
                        NOT: {
                            id: id,
                        },
                    },
                });

                if (!userAdminInCompany) {
                    throw new ForbiddenError('Você não tem permissão para atualizar essa instituição.');
                }

                if (companyAlreadyExistsByPhone) {
                    throw new BadRequestError('Já existe uma instituição com esse telefone.');
                }


                await prisma.companies.update({
                    where: {
                        id: id,
                    },
                    data: {
                        name,
                        address,
                        cnpj,
                        phone,
                        email,
                        logo_16x16_url,
                        logo_512x512_url,
                        social_reason,
                        state_registration,
                        tax_regime,
                    },
                });

                return reply.status(200).send({
                    message: 'Instituição atualizada com sucesso.',
                });
            },
        );
}