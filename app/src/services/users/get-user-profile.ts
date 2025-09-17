import { api } from "@/lib/api";
import z from "zod";
import { getUserProfileResponse } from "@idiomax/http-schemas/get-user-profile";

type GetUserProfileResponse = z.infer<typeof getUserProfileResponse>;

export async function getUserProfile() {
    const response = await api.get(`/auth/user-profile`);
    return response.data as GetUserProfileResponse;
}
