import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { auth } from '@/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';
import { UnauthorizedError } from '../_errors/unauthorized-error';

export async function getRolesByUserAndCompany(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/roles-by-user-and-company',
            {
                schema: {
                    tags: ['Roles'],
                    summary: 'Recupera as roles e instituições do usuário ',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: z.array(z.string())
                    },
                    querystring: z.object({
                        companyId: z.string()
                    }),
                },
            },
            async (request, reply) => {
                const { companyId } = request.query;
                const userIdReq = await request.getCurrentUserId();
                console.log(userIdReq)
                console.log(companyId)
                
                const company = await prisma.users_in_companies.findUnique({
                    where: {
                        users_id_companies_id: {
                            companies_id: companyId,
                            users_id: userIdReq
                        }
                    },
                    include: {
                        users_in_companies_roles: {
                            include: {
                                roles: {
                                    select: {
                                        name: true,
                                    }
                                }
                            }
                        }
                    }
                });

                reply.send(
                    company.users_in_companies_roles.map((e) => e.roles.name)
                );
            },
        );
}