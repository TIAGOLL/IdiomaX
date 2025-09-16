import { hash } from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../lib/prisma';


export async function UpdateProfile(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth).put(
            '/users',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Atualizar informações do usuário',
                    body: z.object({
                        name: z.string().min(3).max(256),
                        cpf: z.string().min(11).max(11),
                        phone: z.string().min(10).max(11),
                        gender: z.string().min(1).max(1),
                        date_of_birth: z.string(),
                        address: z.string().min(1).max(255),
                        avatar_url: z.url().optional(),
                    }),
                    response: {
                        200: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
            async (request, reply) => {
                const { name, gender, date_of_birth, address, avatar_url, cpf, phone } = request.body;

                const date_of_birth_date = new Date(date_of_birth);
                const userId = await request.getCurrentUserId();

                await prisma.$transaction(async (prisma) => {
                    await prisma.users.update({
                        where: {
                            id: userId,
                        },
                        data: {
                            name,
                            gender,
                            date_of_birth: date_of_birth_date,
                            address,
                            avatar_url,
                            cpf,
                            phone,
                        },
                    })
                });

                return reply.status(200).send({
                    message: 'Usuário atualizado com sucesso.',
                });
            },
        );
}
