import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'
import { UnauthorizedError } from '../http/controllers/_errors/unauthorized-error'

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
  app.addHook('preHandler', async (request) => {
    await request.getCurrentUserId()
  })
})