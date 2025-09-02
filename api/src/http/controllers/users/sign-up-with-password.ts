import { hash } from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { BadRequestError } from '@/http/controllers/_errors/bad-request-error';
import { prisma } from '@/lib/prisma';
import { generateUUID } from '@/lib/uuid';

export async function SignUpWithPassword(app: FastifyInstance) {
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
          date_of_birth: z.string(),
          address: z.string().min(1).max(255),
          password: z.string().min(6),
          avatar_url: z.url().max(256).optional(),
          users_roles: z.array(z.string().min(1).max(256)),
          companies_id: z.string().min(1).max(256),
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

      const userWithSameUsername = await prisma.users.findUnique({
        where: {
          username,
        },
      });

      if (userWithSameEmail) {
        throw new BadRequestError('Já existe um usuário com este e-mail.');
      }

      if (userWithSameUsername) {
        throw new BadRequestError('Já existe um usuário com este nome de usuário.');
      }

      const passwordHash = await hash(password, 6);
      const date_of_birth_date = new Date(date_of_birth);

      await prisma.users.create({
        data: {
          id: generateUUID(),
          name,
          email,
          password: passwordHash,
          gender,
          date_of_birth: date_of_birth_date,
          address,
          avatar_url,
          cpf,
          username,
          phone,
          companies: {
            connect: {
              id: companies_id,
            },
          },
          users_roles: {
            connect: users_roles.map((id) => ({ id }))
          },
        },
      });

      return reply.status(201).send();
    },
  );
}
