import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

export async function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    'auth/password-recover',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Solicitar recuperação de senha',
        body: z.object({
          email: z.email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (!userFromEmail) {
        return reply.status(201).send();
      }

      const { id: code } = await prisma.token.create({
        data: {
          type: 'PASSWORD_RECOVER',
          userId: userFromEmail.id,
        },
      });

      console.log('Password recover token:', code);

      return reply.status(201).send();
    },
  );
}
