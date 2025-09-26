import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { BadRequestError } from '../_errors/bad-request-error';
import { prisma } from '../../../lib/prisma';
import { auth } from '../../../middlewares/auth';
import { GetCompanyByIdApiRequestSchema, GetCompanyByIdApiResponseSchema } from '@idiomax/http-schemas/companies/get-company-by-id'
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
export async function getCompanyById(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/companies/:companies_id',
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
                const { companies_id } = request.params;

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(companies_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get', 'Company')) {
                    throw new ForbiddenError()
                }

                const company = await prisma.companies.findUnique({
                    where: {
                        id: companies_id,
                        members: {
                            some: {
                                user_id: userId,
                            }
                        }
                    },
                })

                if (!company) {
                    throw new BadRequestError('Instituição não encontrada ou você não tem acesso a ela.');
                }

                return reply.status(200).send(company);
            },
        );
}
