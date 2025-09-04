import type { FastifyInstance } from 'fastify';
import z, { ZodError } from 'zod';

import { BadRequestError } from '@/http/controllers/_errors/bad-request-error';
import { UnauthorizedError } from '@/http/controllers/_errors/unauthorized-error';
import { ServiceUnavailableException } from '../http/controllers/_errors/service-unavailable-exception';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (error instanceof BadRequestError) {
    return reply
      .status(400)
      .send({ message: error.message })
  } else if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Erro de validação.' })
  } else if (error instanceof UnauthorizedError) {
    return reply
      .status(401)
      .send()
  } else if (error instanceof ServiceUnavailableException) {
    return reply
      .status(503)
      .send({ message: 'Serviço indisponível.' })
  }

  console.error(error)
  return reply.status(500).send({ message: 'Ocorreu um erro inesperado, entre em contato com o fornecedor do software!' })
}