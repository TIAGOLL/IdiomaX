import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import z, { ZodError } from 'zod'
import * as dotenv from 'dotenv'
import { SignInWithPassword } from './controllers/users/sign-in-with-password'
import { BadRequestError } from './controllers/_errors/bad-request-error'
import { UnauthorizedError } from './controllers/_errors/unauthorized-error'
import { SignUpWithPassword } from './controllers/users/sign-up-with-password'

dotenv.config()

const envSchema = z.object({
  PORT: z.string().transform((val) => Number(val)),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(1)
})

const env = envSchema.safeParse(process.env)

if (!env.success) {
  console.error('Variáveis de ambiente inválidas:', z.treeifyError(env.error))
  process.exit(1)
}

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler((error, _, reply) => {
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
      .send({ message: 'Acesso não autorizado.' })
  }

  console.error(error)
  return reply.status(500).send({ message: 'Internal server error.' })
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'IdiomaX API',
      description: 'API para gerenciamento de escolas de idiomas',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.data.JWT_SECRET,
})

app.register(fastifyCors)

//routes
app.register(SignInWithPassword);
app.register(SignUpWithPassword);

app.listen({ port: Number(env.data.PORT) }).then(() => {
  console.log(`HTTP server running in http://localhost:${env.data.PORT}`)
})

export const ENV = env.data
