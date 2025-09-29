import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '../../../lib/prisma';
import { auth } from '../../../middlewares/auth';
import { GetProfileApiResponse } from '@idiomax/validation-schemas/auth/get-profile'
import { UnauthorizedError } from '../_errors/unauthorized-error';

export async function getUserProfile(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/auth/user-profile',
            {
                schema: {
                    tags: ['Autenticação'],
                    summary: 'Resgatar perfil do usuário',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: GetProfileApiResponse
                    },
                },
            },
            async (request, reply) => {
                const userId = await request.getCurrentUserId();

                const userProfile = await prisma.users.findUnique({
                    where: { id: userId },
                    include: {
                        member_on: {
                            include: {
                                company: true
                            }
                        },
                    },
                });

                if (!userProfile) {
                    throw new UnauthorizedError("Sessão expirada. Faça login novamente.");
                }

                reply.status(200).send(userProfile);
            },
        );
}