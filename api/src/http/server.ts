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
import z from 'zod'
import * as dotenv from 'dotenv'
import { SignInWithPassword } from './controllers/auth/sign-in-with-password'
import { SignUpWithPassword } from './controllers/auth/sign-up-with-password'
import { requestPasswordRecover } from './controllers/auth/request-password-recover'
import { getUserProfile } from './controllers/users/get-user-profile'
import { resetPassword } from './controllers/auth/reset-password'
import { errorHandler } from '../lib/error-handler'
import { createCompany } from './controllers/companies/create-company'
import { setRole } from './controllers/roles/set-role'
import { getCompanyById } from './controllers/companies/get-company-by-id'
import { getUserById } from './controllers/users/get-user-by-id'
import { UpdateProfile } from './controllers/users/update-profile'
import { AdminDashboard } from './controllers/dashboard/admin'
import { CreateCheckoutSession } from './controllers/stripe/create-checkout-session'
import { envSchema } from '@idiomax/http-schemas/env'
import { StripeWebHooks } from './controllers/stripe/stripe-web-hooks'

dotenv.config()

export const env = envSchema.safeParse(process.env)

if (!env.success) {
  console.error('Variáveis de ambiente inválidas:', z.treeifyError(env.error))
  process.exit(1)
}

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

// app.register(fastifyRawBody, {
//   field: 'rawBody',
//   global: false,
//   encoding: 'buffer',
//   runFirst: true
// });


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
  sign: {
    expiresIn: '7d',
  }
})

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});


//routes
app.register(SignInWithPassword);
app.register(SignUpWithPassword);
app.register(requestPasswordRecover);
app.register(getUserProfile);
app.register(resetPassword);
app.register(createCompany);
app.register(setRole);
app.register(getCompanyById);
app.register(CreateCheckoutSession);
app.register(getUserById);
app.register(UpdateProfile);
app.register(AdminDashboard);
app.register(StripeWebHooks);

if (process.env.VERCEL !== "1") {
  app.listen({ port: Number(env.data.PORT) }).then(() => {
    console.log(`HTTP server running in http://localhost:${env.data.PORT}`);
  });
}

export const ENV = env.data

export default async function handler(req: any, res: any) {
  await app.ready()
  app.server.emit('request', req, res)
}