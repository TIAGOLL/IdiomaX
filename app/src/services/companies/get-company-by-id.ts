import api from "@/lib/api";

interface getCompanyByIdResponse {
    id: string
    message: string
    logo_16x16: string
    name: string
    cnpj: string
    phone: string
    email: string
    logo_512x512: string
    social_reason: string
    state_registration: string
    tax_regime: string
    address: string
    created_at: string
    updated_at: string
}

interface getCompanyByIdRequest {
    companyId: string
}

export async function getCompanyById({ companyId }: getCompanyByIdRequest) {
    if (!companyId) return null;
    const result = await api.get<getCompanyByIdResponse>(`/companies/${companyId}`)

    return result.data
}