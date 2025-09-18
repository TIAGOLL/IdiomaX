import { hash } from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { BadRequestError } from '../_errors/bad-request-error';
import { prisma } from '../../../lib/prisma';
import { signUpWithPasswordRequest, signUpWithPasswordResponse } from '@idiomax/http-schemas/sign-up-with-password';


export async function SignUpWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/sign-up-with-password',
    {
      schema: {
        tags: ['Autenticação'],
        summary: 'Criar uma nova conta de usuário',
        body: signUpWithPasswordRequest,
        response: {
          201: signUpWithPasswordResponse,
        }
      },
    },
    async (request, reply) => {
      const { name, email, password, gender, date_of_birth,  address, cpf, username, phone } = request.body;

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

      const userWithSameCpf = await prisma.users.findUnique({
        where: {
          cpf,
        },
      });

      if (userWithSameEmail) {
        throw new BadRequestError('Já existe um usuário com este e-mail.');
      } else if (userWithSameUsername) {
        throw new BadRequestError('Já existe um usuário com este nome de usuário.');
      } else if (userWithSameCpf) {
        throw new BadRequestError('Já existe um usuário com este CPF.');
      }

      const passwordHash = await hash(password, 6);
      const date_of_birth_date = new Date(date_of_birth);

      const { token } = await prisma.$transaction(async (prisma) => {
        const { id: userId } = await prisma.users.create({
          data: {
            name,
            email,
            password: passwordHash,
            gender,
            date_of_birth: date_of_birth_date,
            address,
            cpf,
            username,
            phone,
          },
        })

        const token = app.jwt.sign({
          sub: userId,
        });

        return { token };
      });

      return reply.status(201).send({
        message: 'Usuário e instituição criada com sucesso.',
        token,
      });
    },
  );
}
