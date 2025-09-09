import api from "@/lib/api";

interface getCompanyProfileResponse {
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

interface getCompanyProfileRequest {
    companyId: string
}

export async function getCompanyProfile({ companyId }: getCompanyProfileRequest) {
    if (!companyId) return null;
    const result = await api.get<getCompanyProfileResponse>(`/companies/${companyId}`)

    return result.data
}