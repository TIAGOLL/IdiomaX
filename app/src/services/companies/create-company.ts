import { api } from "@/lib/api";
import z from "zod";

export const createCompanySchema = z.object({
    name: z.string().min(3).max(100),
    cnpj: z.string().min(14).max(14),
    phone: z.string().min(11).max(11),
    email: z.email(),
    logo_16x16_url: z.url().optional().nullable(),
    logo_512x512_url: z.url().optional().nullable(),
    social_reason: z.string().min(3).max(256),
    state_registration: z.string().min(3).max(256),
    tax_regime: z.string().min(3).max(256),
    address: z.string().min(3).max(256),
})

type CreateCompanySchema = z.infer<typeof createCompanySchema>;

export async function createCompany(data: CreateCompanySchema) {
    const response = await api.post(`/create-companies`, data);
    return response.data;
}
