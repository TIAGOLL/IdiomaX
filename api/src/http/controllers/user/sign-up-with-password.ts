import { hash } from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { BadRequestError } from '@/http/controllers/_errors/bad-request-error';
import { prisma } from '@/lib/prisma';

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/sign-up-with-password',
    {
      schema: {
        tags: ['Autenticação'],
        summary: 'Criar uma nova conta de usuário',
        body: z.object({
          name: z.string().min(3).max(256),
          email: z.email().min(3).max(256),
          username: z.string().min(3).max(100),
          cpf: z.string().min(11).max(11),
          phone: z.string().min(10).max(11),
          gender: z.string().min(1).max(1),
          date_of_birth: z.date(),
          address: z.string().min(1).max(255),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password, gender, date_of_birth, address, avatar_url, cpf, users_roles, username, phone, companies_id } = request.body;

      const userWithSameEmail = await prisma.users.findUnique({
        where: {
          email,
        },
      });

      if (userWithSameEmail) {
        throw new BadRequestError('Já existe um usuário com este e-mail.');
      }

      const passwordHash = await hash(password, 6);

      await prisma.users.create({
        data: {
          name,
          email,
          password,
          gender,
          date_of_birth,
          address,
          avatar_url,
          cpf,
          users_roles,
          username,
          phone,
          companies: {
            connect: {
              id: companies_id,
            },
          },
        },
      });

      return reply.status(201).send();
    },
  );
}
