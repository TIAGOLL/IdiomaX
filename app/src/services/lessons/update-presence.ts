import { api } from '@/lib/api';
import type { UpdatePresenceRequestType, UpdatePresenceResponseType } from '@idiomax/validation-schemas/lessons/update-presence';

export async function updatePresence(data: UpdatePresenceRequestType) {
    const response = await api.put('/lesson/presence', data);
    return response.data as UpdatePresenceResponseType;
}