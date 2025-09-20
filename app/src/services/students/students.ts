// Services específicos para Students que usam os genéricos
import { getUsers, getUserByEmail, updateUser, updateUserPassword, deleteUser, deactivateUser } from '../users';
import type {
    GetUsersQuery,
    GetUsersResponse,
    GetUserByEmailResponse,
    UpdateUserBody,
    UpdateUserResponse,
    UpdateUserPasswordBody,
    UpdateUserPasswordResponse,
    DeleteUserResponse,
    DeactivateUserResponse
} from '../users';

// Aliases para manter compatibilidade
export type GetStudentsQuery = GetUsersQuery;
export type GetStudentsResponse = GetUsersResponse;
export type GetStudentByEmailResponse = GetUserByEmailResponse;
export type UpdateStudentBody = UpdateUserBody;
export type UpdateStudentResponse = UpdateUserResponse;
export type UpdateStudentPasswordBody = UpdateUserPasswordBody;
export type UpdateStudentPasswordResponse = UpdateUserPasswordResponse;
export type DeleteStudentResponse = DeleteUserResponse;
export type DeactivateStudentResponse = DeactivateUserResponse;

// Functions específicas para Students
export async function getStudents(
    query?: Partial<Omit<GetStudentsQuery, 'role'>>
): Promise<GetStudentsResponse> {
    return getUsers('STUDENT', query);
}

export async function getStudentByEmail(
    email: string
): Promise<GetStudentByEmailResponse> {
    return getUserByEmail('STUDENT', email);
}

export async function updateStudent(
    body: UpdateStudentBody
): Promise<UpdateStudentResponse> {
    return updateUser('STUDENT', body);
}

export async function updateStudentPassword(
    studentId: string,
    body: UpdateStudentPasswordBody
): Promise<UpdateStudentPasswordResponse> {
    return updateUserPassword('STUDENT', studentId, body);
}

export async function deleteStudent(
    studentId: string
): Promise<DeleteStudentResponse> {
    return deleteUser('STUDENT', studentId);
}

export async function deactivateStudent(
    studentId: string
): Promise<DeactivateStudentResponse> {
    return deactivateUser('STUDENT', studentId);
}