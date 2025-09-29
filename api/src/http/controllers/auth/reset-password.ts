import { hash } from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { ForbiddenError } from '../_errors/forbidden-error';
import { prisma } from '../../../lib/prisma';
import { ResetPasswordApiRequest, ResetPasswordApiResponse } from '@idiomax/validation-schemas/auth/reset-password'

export async function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/reset-password-request',
    {
      schema: {
        tags: ['Autenticação'],
        summary: 'Resetar senha do usuário',
        body: ResetPasswordApiRequest,
        response: {
          200: ResetPasswordApiResponse,
        },
      },
    },
    async (request, reply) => {
      const { token, password } = request.body;

      const tokenFromCode = await prisma.tokens.findUnique({
        where: { id: token },
      });

      if (!tokenFromCode || tokenFromCode.type !== 'PASSWORD_RECOVER' || tokenFromCode.expires_at < new Date()) {
        throw new ForbiddenError("Acesso negado: token inválido ou expirado.");
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
            id: token,
          },
        }),
      ]);

      return reply.status(200).send({ message: 'Senha alterada com sucesso!' });
    },
  );
}
