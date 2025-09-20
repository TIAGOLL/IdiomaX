import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { BadRequestError } from '../_errors/bad-request-error';
import { prisma } from '../../../lib/prisma';
import { auth } from '../../../middlewares/auth';
import { getCompanyByIdRequest, getCompanyByIdResponse } from '@idiomax/http-schemas/get-company-by-id'

export async function getStudents(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/students',
            {
                schema: {
                    tags: ['Estudantes'],
                    summary: 'Obter uma lista de estudantes.',
                    security: [{ bearerAuth: [] }],
                    params: getStudentsRequest,
                    response: {
                        200: getStudentsResponse,
                    },
                },
            },
            async (request, reply) => {
                const { companyId } = request.params;
                const userId = await request.getCurrentUserId();

                const userIsMember = await prisma.members.findFirst({
                    where: {
                        user_id: userId,
                        company_id: companyId,
                    }
                });

                if (!userIsMember) {
                    throw new BadRequestError('Usuário não está associado a essa instituição.');
                }

                const company = await prisma.companies.findUnique({
                    where: {
                        id: companyId,
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

                return reply.status(200).send(company);
            },
        );
}
