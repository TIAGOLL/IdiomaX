import { hash } from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { BadRequestError } from '../_errors/bad-request-error';
import { prisma } from '../../../lib/prisma';


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
          avatar_url: z.url().optional(),
          company: z.object({
            name: z.string().min(3).max(256),
            cnpj: z.string().min(14).max(14),
            address: z.string().min(1).max(256),
            phone: z.string().min(10).max(15),
            email: z.email().max(256).optional(),
            tax_regime: z.string().min(1).max(256).optional(),
            state_registration: z.string().min(1).max(256).optional(),
            social_reason: z.string().min(1).max(256).optional(),
            logo_16x16: z.string().nullable().optional(),
            logo_512x512: z.string().nullable().optional(),
          })
        }),
        response: {
          201: z.object({
            message: z.string(),
            token: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        }
      },
    },
    async (request, reply) => {
      const { name, email, password, gender, date_of_birth, company, address, avatar_url, cpf, username, phone } = request.body;

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

      const companyWithSameCnpj = await prisma.companies.findUnique({
        where: {
          cnpj: company.cnpj,
        },
      });

      if (userWithSameEmail) {
        throw new BadRequestError('Já existe um usuário com este e-mail.');
      }

      if (userWithSameUsername) {
        throw new BadRequestError('Já existe um usuário com este nome de usuário.');
      }
      if (companyWithSameCnpj) {
        throw new BadRequestError('Já existe uma empresa com este CNPJ.');
      }

      if (userWithSameCpf) {
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
            avatar_url,
            cpf,
            username,
            phone,
          },
        })
        const { id: companyId } = await prisma.companies.create({
          data: {
            name: company.name,
            cnpj: company.cnpj,
            address: company.address,
            phone: company.phone,
            email: email,
            tax_regime: company.tax_regime,
            state_registration: company.state_registration,
            social_reason: company.social_reason,
            owner_id: userId,
          },
        })

        await prisma.members.create({
          data: {
            user_id: userId,
            company_id: companyId,
            role: 'ADMIN',
          },
        })

        return {
          token: app.jwt.sign({
            sub: userId,
          }),
        }
      });

      return reply.status(201).send({
        message: 'Usuário e instituição criada com sucesso.',
        token,
      });
    },
  );
}
