// Re-export dos services de students que usam os genéricos
export {
    getStudents,
    getStudentByEmail,
    updateStudent,
    updateStudentPassword,
    adminUpdateStudentPassword,
    deleteStudent,
    deactivateStudent
} from './students';

export type {
    GetStudentsQuery,
    GetStudentsResponse,
    GetStudentByEmailResponse,
    UpdateStudentBody,
    UpdateStudentResponse,
    UpdateStudentPasswordBody,
    UpdateStudentPasswordResponse,
    DeleteStudentResponse,
    DeactivateStudentResponse
} from './students';