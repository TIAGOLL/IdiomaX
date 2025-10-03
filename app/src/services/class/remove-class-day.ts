import { api } from '@/lib/api';
import type { RemoveClassDayRequestType, RemoveClassDayResponseType } from '@idiomax/validation-schemas/class';

export async function removeClassDay(data: RemoveClassDayRequestType) {
    const response = await api.delete(`/class-day`, {
        params: {
            company_id: data.company_id,
            class_day_id: data.class_day_id
        }
    });

    return response.data as RemoveClassDayResponseType;
}