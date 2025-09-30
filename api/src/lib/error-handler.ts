import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';

import { ServiceUnavailableException } from '../http/controllers/_errors/service-unavailable-exception';
import { BadRequestError } from '../http/controllers/_errors/bad-request-error';
import { UnauthorizedError } from '../http/controllers/_errors/unauthorized-error';
import { ForbiddenError } from '../http/controllers/_errors/forbidden-error';
import { NotFoundError } from '../http/controllers/_errors/not-found-error';

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
      .send({ message: error.message })
  } else if (error instanceof ForbiddenError) {
    return reply
      .status(403)
      .send({ message: error.message })
  } else if (error instanceof ServiceUnavailableException) {
    return reply
      .status(503)
      .send({ message: 'Serviço indisponível.' })
  } else if (error instanceof NotFoundError) {
    return reply
      .status(404)
      .send({ message: error.message })
  }

  console.error(error)
  return reply.status(500).send({ message: 'Ocorreu um erro inesperado, entre em contato com o fornecedor do software!' })
}