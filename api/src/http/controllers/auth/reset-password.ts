import { hash } from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { UnauthorizedError } from '../_errors/unauthorized-error';

export async function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/reset-password',
    {
      schema: {
        tags: ['Autenticação'],
        summary: 'Resetar senha do usuário',
        body: z.object({
          code: z.string(),
          password: z.string().min(6),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      try {
        const { code, password } = request.body;

        const tokenFromCode = await prisma.tokens.findUnique({
          where: { id: code },
        });

        if (!tokenFromCode || tokenFromCode.type !== 'PASSWORD_RECOVER' || tokenFromCode.expires_at < new Date()) {
          throw new UnauthorizedError();
        }

        const passwordHash = await hash(password, 6);

        await prisma.$transaction([
          prisma.users.update({
            where: {
              id: tokenFromCode.users_id,
            },
            data: {
              password: passwordHash,
            },
          }),

          prisma.tokens.delete({
            where: {
              id: code,
            },
          }),
        ]);

        return reply.status(204).send();
      } catch (error) {
        throw new UnauthorizedError();
      }
    },
  );
}
