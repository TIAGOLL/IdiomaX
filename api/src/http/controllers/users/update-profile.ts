import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../lib/prisma';
import { UpdateProfileApiRequest, UpdateProfileApiResponse } from '@idiomax/http-schemas/auth/update-profile';

export async function UpdateProfile(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth).put(
            '/users',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Atualizar informações do usuário',
                    body: UpdateProfileApiRequest,
                    response: {
                        200: UpdateProfileApiResponse
                    },
                },
            },
            async (request, reply) => {
                const { name, gender, date_of_birth, address, avatar_url, cpf, phone } = request.body;
                const userId = await request.getCurrentUserId();

                await prisma.$transaction(async (prisma) => {
                    await prisma.users.update({
                        where: {
                            id: userId,
                        },
                        data: {
                            name,
                            gender,
                            date_of_birth,
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
