// Services genéricos para usuários (Students, Teachers, Admins)
export { getUsers } from './get-users';
export { getUserById } from './get-user-by-id';
export { getUserByEmail } from './get-user-by-email';
export { updateUser } from './update-user';
export { updateUserPassword } from './update-user-password';
export { adminResetPassword } from './admin-reset-password';
export { deleteUser } from './delete-user';
export { deactivateUser } from './deactivate-user';
export { updateUserRole } from '../roles/manage-roles';

export type {
    GetUserByIdResponse
} from './get-user-by-id';

export type {
    GetUserByEmailResponse
} from './get-user-by-email';

export type {
    UpdateUserBody,
    UpdateUserResponse
} from './update-user';

export type {
    UpdateUserPasswordBody,
    UpdateUserPasswordResponse
} from './update-user-password';

export type {
    DeleteUserResponse
} from './delete-user';

export type {
    DeactivateUserResponse
} from './deactivate-user';

// Role type
export type { UserRole } from '@idiomax/http-schemas/users/get-users';