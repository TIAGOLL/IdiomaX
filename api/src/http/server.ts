import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import * as dotenv from 'dotenv'
import { SignUp } from './controllers/auth/sign-up'
import { SignIn } from './controllers/auth/sign-in'
import { requestPasswordRecover } from './controllers/auth/request-password-recover'
import { getUserProfile } from './controllers/users/get-user-profile'
import { resetPassword } from './controllers/auth/reset-password'
import { errorHandler } from '../lib/error-handler'
import { createCompany } from './controllers/companies/create-company'
import { getCompanyById } from './controllers/companies/get-company-by-id'
import { getUserById } from './controllers/users/get-user-by-id'
import { AdminDashboard } from './controllers/dashboard/admin'
import { CreateCheckoutSession } from './controllers/stripe/create-checkout-session'
import { envSchema } from '@idiomax/validation-schemas/env'
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
import { getMaterialsByLevel } from './controllers/materials/get-materials-by-level'
// Importações dos novos controladores genéricos de users
import { getUsers } from './controllers/users/get-users'
import { getUserByEmail } from './controllers/users/get-user-by-email'
import { updateUser } from './controllers/users/update-user'
import { updateUserPassword } from './controllers/users/update-user-password'
import { adminUpdateStudentPassword } from './controllers/users/admin-update-student-password'
import { deleteUser } from './controllers/users/delete-user'
import { deactivateUser } from './controllers/users/deactivate-user'
import { alterUserRole } from './controllers/roles/alter-user-role'
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
import { alterDisciplineStatus } from './controllers/disciplines/alter-discipline-status'
import { deleteDiscipline } from './controllers/disciplines/delete-discipline'

// Settings controllers
import { updateRegistrationTime } from './controllers/settings/update-registration-time'
import { getCompanySettings } from './controllers/settings/get-company-settings'

// Classrooms controllers
import { createClassroom } from './controllers/classrooms/create-classroom'
import { getClassrooms } from './controllers/classrooms/get-classrooms'
import { updateClassroom } from './controllers/classrooms/update-classroom'
import { deleteClassroom } from './controllers/classrooms/delete-classroom'
import { getClass } from './controllers/class/get-class'
import { createClass } from './controllers/class/create-class'
import { editClass } from './controllers/class/edit-class'
import { getClassById } from './controllers/class/get-class-by-id'
import { removeUserInClass } from './controllers/class/remove-user-in-class'
import { addUserInClass } from './controllers/class/add-user-in-class'
import { deleteClass } from './controllers/class/delete-class'
import { removeClassDay } from './controllers/class/remove-class-day'

// Lessons controllers
import { createLesson } from './controllers/lessons/create-lesson'
import { getLessons } from './controllers/lessons/get-lessons'
import { getLessonById } from './controllers/lessons/get-lesson-by-id'
import { updateLesson } from './controllers/lessons/update-lesson'
import { deleteLesson } from './controllers/lessons/delete-lesson'
import { updatePresence } from './controllers/lessons/update-presence'

// Registrations controllers
import { getRegistrations } from './controllers/registrations/get-registrations'
import { getRegistrationById } from './controllers/registrations/get-registration-by-id'
import { createRegistration } from './controllers/registrations/create-registration'
import { editRegistration } from './controllers/registrations/edit-registration'
import { deleteRegistration } from './controllers/registrations/delete-registration'

dotenv.config()

export const env = envSchema.safeParse(process.env)

if (!env.success) {
  console.error('Variáveis de ambiente inválidas:', z.treeifyError(env.error))
  process.exit(1)
}

// Export validated env data with correct typing
export const ENV = env.data

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

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: ENV.JWT_SECRET,
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
app.register(getMaterialsByLevel);
app.register(getUsers);
app.register(getUserByEmail);
app.register(updateUser);
app.register(updateUserPassword);
app.register(adminUpdateStudentPassword);
app.register(deleteUser);
app.register(deactivateUser);
app.register(alterUserRole);
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
app.register(alterDisciplineStatus);
app.register(deleteDiscipline);

// Settings routes
app.register(updateRegistrationTime);
app.register(getCompanySettings);

// Classrooms routes
app.register(createClassroom);
app.register(getClassrooms);
app.register(updateClassroom);
app.register(deleteClassroom);

// Class routes
app.register(getClass);
app.register(createClass);
app.register(editClass);
app.register(getClassById);
app.register(removeUserInClass);
app.register(addUserInClass);
app.register(deleteClass);
app.register(removeClassDay);

// Lessons routes
app.register(createLesson);
app.register(getLessons);
app.register(getLessonById);
app.register(updateLesson);
app.register(deleteLesson);
app.register(updatePresence);

// Registrations routes
app.register(getRegistrations);
app.register(getRegistrationById);
app.register(createRegistration);
app.register(editRegistration);
app.register(deleteRegistration);

if (process.env.VERCEL !== "1") {
  app.listen({ port: Number(ENV.PORT) }).then(() => {
    console.log(`HTTP server running in http://localhost:${ENV.PORT}`);
  });
}

export default async function handler(req: unknown, res: unknown) {
  await app.ready()
  app.server.emit('request', req, res)
}