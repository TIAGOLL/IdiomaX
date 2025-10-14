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
import { SignIn } from './controllers/auth/sign-in.js'
import { SignUp } from './controllers/auth/sign-up.js'
import { requestPasswordRecover } from './controllers/auth/request-password-recover.js'
import { getUserProfile } from './controllers/users/get-user-profile.js'
import { resetPassword } from './controllers/auth/reset-password.js'
import { errorHandler } from '../lib/error-handler.js'
import { createCompany } from './controllers/companies/create-company.js'
import { getCompanyById } from './controllers/companies/get-company-by-id.js'
import { getUserById } from './controllers/users/get-user-by-id.js'
import { AdminDashboard } from './controllers/dashboard/admin.js'
import { CreateCheckoutSession } from './controllers/stripe/create-checkout-session.js'
import { envSchema } from '@idiomax/validation-schemas/env'
import { StripeWebHooks } from './controllers/stripe/stripe-web-hooks.js'
import { CreateSubscription } from './controllers/stripe/create-subscription.js'
import { GetProducts } from './controllers/stripe/get-products.js'
import { GetCompanySubscription } from './controllers/stripe/get-company-subscription.js'
import { updateCompany } from './controllers/companies/update-company.js'
import { Unsubscribe } from './controllers/stripe/unsubscribe.js'
import { getCourses } from './controllers/courses/get-courses.js'
import { createCourse } from './controllers/courses/create-course.js'
import { getCourseById } from './controllers/courses/get-course-by-id.js'
import { updateCourse } from './controllers/courses/update-course.js'
import { deactivateCourse } from './controllers/courses/deactivate-course.js'
import { deleteCourse } from './controllers/courses/delete-course.js'
import { getMaterialsByLevel } from './controllers/materials/get-materials-by-level.js'
// Importações dos novos controladores genéricos de users
import { getUsers } from './controllers/users/get-users.js'
import { getUserByEmail } from './controllers/users/get-user-by-email.js'
import { updateUser } from './controllers/users/update-user.js'
import { updateUserPassword } from './controllers/users/update-user-password.js'
import { adminUpdateStudentPassword } from './controllers/users/admin-update-student-password.js'
import { deleteUser } from './controllers/users/delete-user.js'
import { deactivateUser } from './controllers/users/deactivate-user.js'
import { alterUserRole } from './controllers/roles/alter-user-role.js'
import { createUser } from './controllers/users/create-user.js'

// Levels controllers
import { createLevel } from './controllers/levels/create-level.js'
import { getLevelsByCourse } from './controllers/levels/get-levels-by-course.js'
import { getLevelById } from './controllers/levels/get-level-by-id.js'
import { updateLevel } from './controllers/levels/update-level.js'
import { deactivateLevel } from './controllers/levels/deactivate-level.js'
import { deleteLevel } from './controllers/levels/delete-level.js'

// Disciplines controllers
import { createDiscipline } from './controllers/disciplines/create-discipline.js'
import { updateDiscipline } from './controllers/disciplines/update-discipline.js'
import { alterDisciplineStatus } from './controllers/disciplines/alter-discipline-status.js'
import { deleteDiscipline } from './controllers/disciplines/delete-discipline.js'

// Settings controllers
import { updateRegistrationTime } from './controllers/settings/update-registration-time.js'
import { getCompanySettings } from './controllers/settings/get-company-settings.js'

// Classrooms controllers
import { createClassroom } from './controllers/classrooms/create-classroom.js'
import { getClassrooms } from './controllers/classrooms/get-classrooms.js'
import { updateClassroom } from './controllers/classrooms/update-classroom.js'
import { deleteClassroom } from './controllers/classrooms/delete-classroom.js'
import { getClass } from './controllers/class/get-class.js'
import { createClass } from './controllers/class/create-class.js'
import { editClass } from './controllers/class/edit-class.js'
import { getClassById } from './controllers/class/get-class-by-id.js'
import { removeUserInClass } from './controllers/class/remove-user-in-class.js'
import { addUserInClass } from './controllers/class/add-user-in-class.js'
import { deleteClass } from './controllers/class/delete-class.js'
import { removeClassDay } from './controllers/class/remove-class-day.js'

// Lessons controllers
import { createLesson } from './controllers/lessons/create-lesson.js'
import { getLessons } from './controllers/lessons/get-lessons.js'
import { getLessonById } from './controllers/lessons/get-lesson-by-id.js'
import { updateLesson } from './controllers/lessons/update-lesson.js'
import { deleteLesson } from './controllers/lessons/delete-lesson.js'
import { updatePresence } from './controllers/lessons/update-presence.js'

// Registrations controllers
import { getRegistrations } from './controllers/registrations/get-registrations.js'
import { getRegistrationById } from './controllers/registrations/get-registration-by-id.js'
import { createRegistration } from './controllers/registrations/create-registration.js'
import { editRegistration } from './controllers/registrations/edit-registration.js'
import { deleteRegistration } from './controllers/registrations/delete-registration.js'

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