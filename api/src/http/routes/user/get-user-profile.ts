import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { auth } from '@/middlewares/auth';

export async function getUserProfile(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/users',
            {
                schema: {
                    tags: ['Users'],
                    summary: 'Resgatar perfil do usuário',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        id: z.string(),
                    }),
                    response: {
                        200: z.object({
                            id: z.string(),
                            email: z.email(),
                            name: z.string().min(2).max(100),
                            createdAt: z.date(),
                            updatedAt: z.date(),
                        }),
                    },
                    body: z.object({
                        id: z.string()
                    })
                },
            },
            async (request) => {
                const { id } = request.params;
                const userId = await request.getCurrentUserId();

                return {
                };
            },
        );
}