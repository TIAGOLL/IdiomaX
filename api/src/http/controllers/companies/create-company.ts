import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { BadRequestError } from '../_errors/bad-request-error';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../lib/prisma';
import { CreateCompanyApiRequestSchema, CreateCompanyApiResponseSchema } from '@idiomax/validation-schemas/companies/create-company'

export async function createCompany(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/companies',
            {
                schema: {
                    tags: ['Instituições'],
                    summary: 'Criar uma nova instituição de ensino.',
                    security: [{ bearerAuth: [] }],
                    response: {
                        201: CreateCompanyApiResponseSchema,
                    },
                    body: CreateCompanyApiRequestSchema,
                },
            },
            async (request, reply) => {
                const { name, address, cnpj, phone, email, logo_16x16_url, logo_512x512_url, social_reason, state_registration, tax_regime, } = request.body;

                const companyAlreadyExists = await prisma.companies.findUnique({
                    where: {
                        cnpj: cnpj,
                    },
                });

                if (email) {
                    const companyAlreadyExistsByEmail = await prisma.companies.findFirst({
                        where: {
                            email: email,
                        },
                    });

                    if (companyAlreadyExistsByEmail) {
                        throw new BadRequestError('Já existe uma instituição com esse e-mail.');
                    }
                }

                const companyAlreadyExistsByPhone = await prisma.companies.findFirst({
                    where: {
                        phone: phone,
                    },
                });

                if (companyAlreadyExists) {
                    throw new BadRequestError('Já existe uma instituição com esse CNPJ.');
                }

                if (companyAlreadyExistsByPhone) {
                    throw new BadRequestError('Já existe uma instituição com esse telefone.');
                }

                const userId = await request.getCurrentUserId()

                const { id } = await prisma.companies.create({
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
                        owner: {
                            connect: {
                                id: userId,
                            }
                        },
                        members: {
                            create: {
                                user_id: userId,
                                role: 'ADMIN',
                                created_by: userId,
                                updated_by: userId,
                            }
                        }
                    },
                });

                return reply.status(201).send({
                    message: 'Instituição criada com sucesso.', companyId: id
                });
            },
        );
}