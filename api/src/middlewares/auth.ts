import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'
import { UnauthorizedError } from '../http/controllers/_errors/unauthorized-error'
import { prisma } from '../services/prisma'
import { ForbiddenError } from '../http/controllers/_errors/forbidden-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{
          sub: string,
          iat: number,
        }>()

        return sub
      } catch {
        throw new UnauthorizedError()
      }
    }

    request.getUserMember = async (companyId: string) => {
      const userId = await request.getCurrentUserId()

      const result = await prisma.members.findFirst({
        where: {
          user_id: userId,
          company_id: companyId,
        },
        include: {
          company: true,
        },
      })

      if (!result) {
        throw new ForbiddenError(`Você não é membro desta empresa.`)
      }

      const { company, ...member } = result

      return {
        company,
        member,
      }
    }
  })
  app.addHook('preHandler', async (request) => {
    await request.getCurrentUserId()
  })
})