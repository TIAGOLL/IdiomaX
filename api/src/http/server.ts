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
import { ServiceUnavailableException } from './controllers/_errors/service-unavailable-exception'
import { requestPasswordRecover } from './controllers/users/request-password-recover'
import { getUserProfile } from './controllers/users/get-user-profile'
import { resetPassword } from './controllers/users/reset-password'
import { errorHandler } from '../lib/error-handler'

dotenv.config()

const envSchema = z.object({
  PORT: z.string().transform((val) => Number(val)),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(1),
  PASS_MAIL_SENDER: z.string().min(1),
  PORT_MAIL_SENDER: z.string().min(1),
  USER_MAIL_SENDER: z.string().min(1),
  HOST_MAIL_SENDER: z.string().min(1),

  // Nome e endereço que vai aparecer para o usuário
  APP_NAME: z.string().min(1),
  ADDRESS_MAIL_SENDER: z.string().min(1),
  WEB_URL: z.url(),
})

export const env = envSchema.safeParse(process.env)

if (!env.success) {
  console.error('Variáveis de ambiente inválidas:', z.treeifyError(env.error))
  process.exit(1)
}

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

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
app.register(requestPasswordRecover);
app.register(getUserProfile);
app.register(resetPassword);

app.listen({ port: Number(env.data.PORT) }).then(() => {
  console.log(`HTTP server running in http://localhost:${env.data.PORT}`)
})

export const ENV = env.data
