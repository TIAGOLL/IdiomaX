import { api } from '@/lib/api';
import type { RegisterMonthlyFeePaymentRequestType, RegisterMonthlyFeePaymentResponseType } from '@idiomax/validation-schemas/registrations/register-monthly-fee-payment';

export async function registerMonthlyFeePayment(data: RegisterMonthlyFeePaymentRequestType) {
    const response = await api.post(`/registrations/register-monthly-payment`, data);

    return response.data as RegisterMonthlyFeePaymentResponseType;
}