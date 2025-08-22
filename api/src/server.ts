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
import dotenv from 'dotenv'
import z from 'zod'


dotenv.config()

const envSchema = z.object({
  PORT: z.string().transform((val) => Number(val)), 
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(1)
})

const env = envSchema.safeParse(process.env)

if (!env.success) {
  console.error('❌ Variáveis de ambiente inválidas:', env.error.format())
  process.exit(1)
}

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)


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

app.listen({ port: Number(env.data.PORT), host: '0.0.0.0' }).then(() => {
  console.log(`HTTP server running in http://localhost:${env.data.PORT}`)
})

export const ENV = env.data
