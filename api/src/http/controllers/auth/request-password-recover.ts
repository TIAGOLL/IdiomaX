import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ServiceUnavailableException } from '../_errors/service-unavailable-exception';
import { prisma } from '../../../lib/prisma';
import { requestPasswordRecoverBody, requestPasswordRecoverSubject } from '../../../mails/request-password-recover';
import { SendEmail } from '../../../services/mail-sender';
import { RequestPasswordRecoverApiRequest, RequestPasswordRecoverApiResponse } from '@idiomax/http-schemas/auth/request-password-recover'

export async function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/password-recover',
    {
      schema: {
        tags: ['Autenticação'],
        summary: 'Solicitar recuperação de senha',
        body: RequestPasswordRecoverApiRequest,
        response: {
          201: RequestPasswordRecoverApiResponse,
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      const userFromEmail = await prisma.users.findUnique({
        where: { email },
      });

      if (!userFromEmail) {
        return reply.status(201).send({ message: "Um email com sua recuperação de senha foi enviado." });
      }

      const { id: token } = await prisma.tokens.create({
        data: {
          type: 'PASSWORD_RECOVER',
          expires_at: new Date(Date.now() + 1000 * 60 * 15), // 15 minutos
          users: {
            connect: {
              id: userFromEmail.id,
            },
          },
        },
      });

      await SendEmail({
        html: requestPasswordRecoverBody({ token }),
        recipients: [{ name: userFromEmail.name, address: userFromEmail.email }],
        subject: requestPasswordRecoverSubject,
      })
        .catch((error) => {
          console.log(error);
          throw new ServiceUnavailableException('Ocorreu um erro, tente novamente mais tarde.');
        });

      return reply.status(201).send({ message: "Um email com sua recuperação de senha foi enviado." });
    },
  );
}
