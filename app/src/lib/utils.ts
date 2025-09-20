import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getUsers } from "@/services/users/get-users"
import { getUserByEmail } from "@/services/users/get-user-by-email"
import type { UserRole } from "@idiomax/http-schemas/get-users"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year} às ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}


export function PasswordGenerator(date: Date | string, firstName: string): string {
  if (!date || !firstName) return "";
  const dateObj = new Date(date);
  firstName = firstName.replace(/\s/g, ""); // tira os espaços do nome
  const day = dateObj.getDate().toString().length == 1 ? `0${dateObj.getDate()}` : dateObj.getDate(); // verifica se o dia tem 1 ou 2 digitos
  const month = (dateObj.getMonth() + 1).toString().length == 1 ? `0${dateObj.getMonth() + 1}` : dateObj.getMonth() + 1; // verifica se o mês tem 1 ou 2 digitos
  const password = `${firstName}${day}${month}`; // gera a senha
  return password;
}

export function UserGenerator(date: Date | string, firstName: string): string {
  if (!firstName || !date) return "";
  const dateObj = new Date(date);
  firstName = firstName.replace(/\s/g, ""); // tira os espaços do nome
  const day = dateObj.getDate().toString().length == 1 ? `0${dateObj.getDate()}` : dateObj.getDate(); // verifica se o dia tem 1 ou 2 digitos
  const month = (dateObj.getMonth() + 1).toString().length == 1 ? `0${dateObj.getMonth() + 1}` : dateObj.getMonth() + 1; // verifica se o mês tem 1 ou 2 digitos
  const user = `${firstName?.toLowerCase()}${day}${month}`; // gera o usuário
  return user;
}

export async function VerifyUserExists(username: string): Promise<boolean> {
  try {
    const studentsResponse = await getUsers('STUDENT');
    const teachersResponse = await getUsers('TEACHER');
    const adminsResponse = await getUsers('ADMIN');

    const allUsers = [
      ...studentsResponse.users,
      ...teachersResponse.users,
      ...adminsResponse.users
    ];

    const userExists = allUsers.some(user => user.username === username);
    return !userExists; // Retorna true se o usuário NÃO existe (disponível)
  } catch {
    return true; // Se houve erro na busca, considera que o username está disponível
  }
}

export async function VerifyEmailExists(email: string, role: UserRole = 'STUDENT'): Promise<boolean> {
  try {
    await getUserByEmail(role, email);
    return false; // Se encontrou o usuário, o email já existe
  } catch {
    return true; // Se não encontrou, o email está disponível
  }
}

export function DaysOfWeek() {
  const dates = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  return dates;
}

export function CreatePaginationArray<T>(data: T[], page: number, per_page: number): T[] {
  const lastPostIndex = page * per_page;
  const firstPostIndex = lastPostIndex - per_page;
  const currentPosts = data?.slice(firstPostIndex, lastPostIndex);

  return currentPosts;
}