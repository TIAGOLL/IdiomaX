import api from "@/lib/api";

export async function getUserProfile() {
    const response = await api.get(`/auth/user-profile`);
    return response.data;
}
