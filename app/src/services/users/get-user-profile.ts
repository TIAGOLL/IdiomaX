import { api } from "@/lib/api";
import type { GetProfileResponseType } from "@idiomax/validation-schemas/auth/get-profile";

export async function getUserProfile() {
    const response = await api.get(`/auth/user-profile`);
    return response.data as GetProfileResponseType;
}
