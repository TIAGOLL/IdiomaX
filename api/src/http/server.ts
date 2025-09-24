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
import { SignIn } from './controllers/auth/sign-in'
import { SignUp } from './controllers/auth/sign-up'
import { requestPasswordRecover } from './controllers/auth/request-password-recover'
import { getUserProfile } from './controllers/users/get-user-profile'
import { resetPassword } from './controllers/auth/reset-password'
import { errorHandler } from '../lib/error-handler'
import { createCompany } from './controllers/companies/create-company'
import { getCompanyById } from './controllers/companies/get-company-by-id'
import { getUserById } from './controllers/users/get-user-by-id'
import { AdminDashboard } from './controllers/dashboard/admin'
import { CreateCheckoutSession } from './controllers/stripe/create-checkout-session'
import { envSchema } from '@idiomax/http-schemas/env'
import { StripeWebHooks } from './controllers/stripe/stripe-web-hooks'
import { CreateSubscription } from './controllers/stripe/create-subscription'
import { GetProducts } from './controllers/stripe/get-products'
import { GetCompanySubscription } from './controllers/stripe/get-company-subscription'
import { updateCompany } from './controllers/companies/update-company'
import { Unsubscribe } from './controllers/stripe/unsubscribe'
import { getCourses } from './controllers/courses/get-courses'
import { createCourse } from './controllers/courses/create-course'
import { getCourseById } from './controllers/courses/get-course-by-id'
import { updateCourse } from './controllers/courses/update-course'
import { deactivateCourse } from './controllers/courses/deactivate-course'
import { deleteCourse } from './controllers/courses/delete-course'
import { getBooks } from './controllers/materials/get-books'
// Importações dos novos controladores genéricos de users
import { getUsers } from './controllers/users/get-users'
import { getUserByEmail } from './controllers/users/get-user-by-email'
import { updateUser } from './controllers/users/update-user'
import { updateUserPassword } from './controllers/users/update-user-password'
import { adminUpdateStudentPassword } from './controllers/users/admin-update-student-password'
import { deleteUser } from './controllers/users/delete-user'
import { deactivateUser } from './controllers/users/deactivate-user'
import { addUserRole } from './controllers/roles/add-user-role'
import { removeUserRole } from './controllers/users/remove-user-role'
import { updateUserRole } from './controllers/users/update-user-role'
import { createUser } from './controllers/users/create-user'

// Levels controllers
import { createLevel } from './controllers/levels/create-level'
import { getLevelsByCourse } from './controllers/levels/get-levels-by-course'
import { getLevelById } from './controllers/levels/get-level-by-id'
import { updateLevel } from './controllers/levels/update-level'
import { deactivateLevel } from './controllers/levels/deactivate-level'
import { deleteLevel } from './controllers/levels/delete-level'

// Disciplines controllers
import { createDiscipline } from './controllers/disciplines/create-discipline'
import { updateDiscipline } from './controllers/disciplines/update-discipline'
import { toggleDisciplineStatus } from './controllers/disciplines/toggle-discipline-status'
import { deleteDiscipline } from './controllers/disciplines/delete-discipline'

dotenv.config()

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
  sign: {
    expiresIn: '7d',
  }
})

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
});


//routes
app.register(SignIn);
app.register(SignUp);
app.register(requestPasswordRecover);
app.register(getUserProfile);
app.register(resetPassword);
app.register(createCompany);
app.register(getCompanyById);
app.register(CreateCheckoutSession);
app.register(getUserById);
app.register(AdminDashboard);
app.register(StripeWebHooks);
app.register(CreateSubscription);
app.register(GetProducts);
app.register(GetCompanySubscription);
app.register(updateCompany);
app.register(Unsubscribe);
app.register(getCourses);
app.register(createCourse);
app.register(getCourseById);
app.register(updateCourse);
app.register(deactivateCourse);
app.register(deleteCourse);
app.register(getBooks);
app.register(getUsers);
app.register(getUserByEmail);
app.register(updateUser);
app.register(updateUserPassword);
app.register(adminUpdateStudentPassword);
app.register(deleteUser);
app.register(deactivateUser);
app.register(addUserRole);
app.register(removeUserRole);
app.register(updateUserRole);
app.register(createUser);

// Levels routes
app.register(createLevel);
app.register(getLevelsByCourse);
app.register(getLevelById);
app.register(updateLevel);
app.register(deactivateLevel);
app.register(deleteLevel);

// Disciplines routes
app.register(createDiscipline);
app.register(updateDiscipline);
app.register(toggleDisciplineStatus);
app.register(deleteDiscipline);


if (process.env.VERCEL !== "1") {
  app.listen({ port: Number(env.data.PORT) }).then(() => {
    console.log(`HTTP server running in http://localhost:${env.data.PORT}`);
  });
}

export const ENV = env.data

export default async function handler(req: unknown, res: unknown) {
  await app.ready()
  app.server.emit('request', req, res)
}