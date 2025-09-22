import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { BadRequestError } from '../_errors/bad-request-error';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../lib/prisma';
import { UpdateCompanyApiRequestSchema, UpdateCompanyApiResponseSchema } from '@idiomax/http-schemas/companies/update-company';
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
                        200: UpdateCompanyApiResponseSchema,
                    },
                    body: UpdateCompanyApiRequestSchema,
                },
            },
            async (request, reply) => {
                const { id, name, phone, address } = request.body;
                const userId = await request.getCurrentUserId()

                // Verificar se o usuário é admin da empresa
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


                const updatedCompany = await prisma.companies.update({
                    where: {
                        id: id,
                    },
                    data: {
                        name,
                        phone,
                        address,
                    },
                });

                return reply.status(200).send({
                    message: 'Instituição atualizada com sucesso.',
                    company: {
                        id: updatedCompany.id,
                        name: updatedCompany.name,
                        description: null,
                        website: null,
                        phone: updatedCompany.phone,
                        address: updatedCompany.address,
                        logo_url: null,
                        updated_at: updatedCompany.updated_at,
                    }
                });
            },
        );
}