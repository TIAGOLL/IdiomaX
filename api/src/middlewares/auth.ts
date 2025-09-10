import { UnauthorizedError } from '@/http/controllers/_errors/unauthorized-error'
import { getUserById } from '@/http/controllers/users/get-user-by-id'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

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
  })
})