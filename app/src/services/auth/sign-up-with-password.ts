import { api } from "@/lib/api";

type SignUpFormSchema = {
    name: string;
    email: string;
    username: string;
    cpf: string;
    phone: string;
    gender: string;
    date_of_birth: Date;
    address: string;
    password: string;
    company: {
        name: string;
        cnpj: string;
        address: string;
        phone: string;
    };
}

type signUpFormResponse = {
    token: string;
    message: string;
}


export async function signUpWithPassword(data: SignUpFormSchema) {
    const response = await api.post<signUpFormResponse>('/auth/sign-up-with-password', data);
    return response.data;
}
