import { hash } from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { BadRequestError } from '@/http/controllers/_errors/bad-request-error';
import { prisma } from '@/lib/prisma';
import { toUint8Array } from '@/lib/to-uint-8-array';

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
          avatar: z.instanceof(Buffer).optional(),
          company: z.object({
            name: z.string().min(3).max(256),
            cnpj: z.string().min(14).max(14),
            address: z.string().min(1).max(256),
            phone: z.string().min(10).max(15),
            email: z.string().email().max(256),
            tax_regime: z.string().min(1).max(256),
            state_registration: z.string().min(1).max(256),
            social_reason: z.string().min(1).max(256),
            logo_16x16: z.any().transform((val) => {
              if (val instanceof Uint8Array) return val;
              if (val instanceof ArrayBuffer) return new Uint8Array(val);
              if (Array.isArray(val)) return new Uint8Array(val);
              if (typeof val === "string") {
                try {
                  const binary = Buffer.from(val, 'base64');
                  return new Uint8Array(binary);
                } catch {
                  return new Uint8Array();
                }
              }
              return new Uint8Array();
            }),
            logo_512x512: z.any().transform((val) => {
              if (val instanceof Uint8Array) return val;
              if (val instanceof ArrayBuffer) return new Uint8Array(val);
              if (Array.isArray(val)) return new Uint8Array(val);
              if (typeof val === "string") {
                try {
                  const binary = Buffer.from(val, 'base64');
                  return new Uint8Array(binary);
                } catch {
                  return new Uint8Array();
                }
              }
              return new Uint8Array();
            }),
          })
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password, gender, date_of_birth, company, address, avatar, cpf, username, phone } = request.body;

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

      const passwordHash = await hash(password, 6);
      const date_of_birth_date = new Date(date_of_birth);

      await prisma.$transaction(async (prisma) => {
        const { id: userId } = await prisma.users.create({
          data: {
            name,
            email,
            password: passwordHash,
            gender,
            date_of_birth: date_of_birth_date,
            address,
            avatar,
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
            email: company.email,
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
      });

      return reply.status(201).send({
        message: 'Usuário e instituição criada com sucesso.',
      });
    },
  );
}
