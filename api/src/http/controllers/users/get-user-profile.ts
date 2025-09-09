import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { auth } from '@/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';

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
                        200: z.object({
                            email: z.email(),
                            name: z.string().min(2).max(100),
                            created_at: z.date(),
                            message: z.string().min(2).max(100),
                        }),
                    },
                },
            },
            async (request, reply) => {
                const userId = await request.getCurrentUserId();

                const userProfile = await prisma.users.findUnique({
                    where: { id: userId },
                    select: {
                        email: true,
                        name: true,
                        created_at: true,
                    },
                });

                if (!userProfile) {
                    throw new BadRequestError("Usuário não encontrado.");
                }

                reply.send({
                    ...userProfile,
                    message: "Perfil do usuário recuperado com sucesso."
                });
            },
        );
}