import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { UserRole } from "@idiomax/validation-schemas/users/get-users"
import { getUsers } from "@/services/users/get-users";
import { getUserByEmail } from "@/services/users/get-user-by-email";

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


export function PasswordGenerator(cpf: string) {
  if (!cpf) return "";
  cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
  return 'bemvindo' + cpf.slice(0, 4); // Retorna 'bemvindo' + primeiros 4 dígitos do CPF
}

export async function VerifyUserExists(username: string): Promise<boolean> {
  try {
    const { users } = await getUsers();

    const userExists = users.some(user => user.username === username);
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