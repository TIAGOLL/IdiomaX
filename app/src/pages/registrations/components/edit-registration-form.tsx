import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, LoaderIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateRegistrationFormSchema } from '@idiomax/validation-schemas/registrations/update-registration';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { updateRegistration } from '@/services/registrations/update-registration';
import type { GetRegistrationByIdResponseType } from '@idiomax/validation-schemas/registrations';

type UpdateRegistrationFormData = z.infer<typeof UpdateRegistrationFormSchema>;

export function EditRegistrationForm({ registration }: { registration: GetRegistrationByIdResponseType }) {
    const queryClient = useQueryClient();

    // Removido a busca de usuários e cursos pois não podem ser editados

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: UpdateRegistrationFormData) => {
            const response = await updateRegistration(data);
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['registration', registration.id] });
            queryClient.invalidateQueries({ queryKey: ['registrations', getCurrentCompanyId()] });
        },
        onError: (err) => {
            console.log(err);
            toast.error(err.message);
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(UpdateRegistrationFormSchema),
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            id: registration.id,
            company_id: registration.company_id,
            monthly_fee_amount: registration.monthly_fee_amount,
            discount_payment_before_due_date: registration.discount_payment_before_due_date
        }
    });

    return (
        <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4'>
            <div className="sm:grid flex flex-col sm:grid-cols-2 gap-4">
                {/* Valor da Mensalidade */}
                <div className="space-y-2">
                    <Label htmlFor="monthly_fee_amount">Valor da Mensalidade (R$) *</Label>
                    <Input
                        type="number"
                        id="monthly_fee_amount"
                        placeholder="0.00"
                        step="0.01"
                        {...register('monthly_fee_amount', { valueAsNumber: true })}
                    />
                    <FormMessageError error={errors.monthly_fee_amount?.message} />
                </div>

                {/* Valor do Desconto */}
                <div className="space-y-2">
                    <Label htmlFor="discount_payment_before_due_date">
                        Valor do Desconto de Pagamento Antecipado (R$) *
                    </Label>
                    <Input
                        type="number"
                        id="discount_payment_before_due_date"
                        placeholder="0.00"
                        step="0.01"
                        {...register('discount_payment_before_due_date', { valueAsNumber: true })}
                    />
                    <FormMessageError error={errors.discount_payment_before_due_date?.message} />
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    variant='default'
                    type='submit'
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <LoaderIcon className='mr-2 h-4 w-4 animate-spin' />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <Save className='mr-2 h-4 w-4' />
                            Salvar Alterações
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}