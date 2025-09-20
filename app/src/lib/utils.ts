import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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


export function PasswordGenerator(date, firstName) {
  if (!date || !firstName) return "";
  firstName = firstName.replace(/\s/g, ""); // tira os espaços do nome
  const day = date?.getDate().toString().length == 1 ? `0${date?.getDate()}` : date?.getDate(); // verifica se o dia tem 1 ou 2 digitos
  const month = date?.getMonth().toString().length == 1 ? `0${date?.getMonth() + 1}` : date?.getMonth() + 1; // verifica se o mês tem 1 ou 2 digitos
  const password = `${firstName}${day}${month}`; // gera a senha
  return password;
}

export function UserGenerator(date, firstName) {
  if (!firstName || !date) return "";
  firstName = firstName.replace(/\s/g, ""); // tira os espaços do nome
  const day = date?.getDate().toString().length == 1 ? `0${date?.getDate()}` : date?.getDate(); // verifica se o dia tem 1 ou 2 digitos
  const month = date?.getMonth().toString().length == 1 ? `0${date?.getMonth() + 1}` : date?.getMonth() + 1; // verifica se o mês tem 1 ou 2 digitos
  const user = `${firstName?.toLowerCase()}${day}${month}`; // gera o usuário
  return user;
}

export async function VerifyUserExists(user) {
  const studentsUsers = await api.professionals.GetStudentUsers();
  const professionalsUsers = await api.professionals.GetUsers();

  let res = true;

  studentsUsers.map((item) => {
    if (item.user == user) {
      return (res = false);
    }
  });
  professionalsUsers.map((item) => {
    if (item.user == user) {
      return (res = false);
    }
  });
  return res;
}

export async function VerifyEmailExists(email) {
  const studentEmails = await api.professionals.GetStudentEmails();
  const professionalsEmails = await api.professionals.GetEmails();

  let res = true;
  studentEmails.map((item) => {
    if (item.email == email) {
      return (res = false);
    }
  });
  professionalsEmails.map((item) => {
    if (item.email == email) {
      return (res = false);
    }
  });
  return res;
}

export function DaysOfWeek() {
  const dates = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  return dates;
}

export function CreatePaginationArray(data, page, per_page) {
  const lastPostIndex = page * per_page;
  const firstPostIndex = lastPostIndex - per_page;
  const currentPosts = data?.slice(firstPostIndex, lastPostIndex);

  return currentPosts;
}