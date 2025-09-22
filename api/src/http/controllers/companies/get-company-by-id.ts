import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { BadRequestError } from '../_errors/bad-request-error';
import { prisma } from '../../../lib/prisma';
import { auth } from '../../../middlewares/auth';
import { GetCompanyByIdApiRequestSchema, GetCompanyByIdApiResponseSchema } from '@idiomax/http-schemas/companies/get-company-by-id'
export async function getCompanyById(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/companies/:id',
            {
                schema: {
                    tags: ['Instituições'],
                    summary: 'Obter uma instituição de ensino pelo ID.',
                    security: [{ bearerAuth: [] }],
                    params: GetCompanyByIdApiRequestSchema,
                    response: {
                        200: GetCompanyByIdApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id } = request.params;
                const userId = await request.getCurrentUserId();

                const userIsMember = await prisma.members.findFirst({
                    where: {
                        user_id: userId,
                        company_id: company_id,
                    }
                });

                if (!userIsMember) {
                    throw new BadRequestError('Usuário não está associado a essa instituição.');
                }

                const company = await prisma.companies.findUnique({
                    where: {
                        id: company_id,
                        members: {
                            some: {
                                user_id: userId,
                            }
                        }
                    },
                }).catch((err) => console.log(err));

                if (!company) {
                    throw new BadRequestError('Instituição não encontrada ou você não tem acesso a ela.');
                }

                return reply.status(200).send({ company });
            },
        );
}
