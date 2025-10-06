import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderIcon, Users, Save } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateRegistrationFormSchema } from '@idiomax/validation-schemas/registrations/create-registration';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUsers } from '@/services/users/get-users';
import { createRegistration } from '@/services/registrations';

type CreateRegistrationFormSchema = z.infer<typeof CreateRegistrationFormSchema>;

export function CreateRegistrationPage() {
    // Query para buscar usuários disponíveis
    const { data: users, isPending: isLoadingUsers } = useQuery({
        queryKey: ['users', 'ALL', getCurrentCompanyId()],
        queryFn: () => getUsers({
            company_id: getCurrentCompanyId(),
        }),
        enabled: !!getCurrentCompanyId(),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateRegistrationFormSchema) => {
            const response = await createRegistration({
                ...data,
                company_id: getCurrentCompanyId(),
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            reset();
        },
        onError: (err) => {
            console.log(err);
            toast.error(err.message);
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm({
        resolver: zodResolver(CreateRegistrationFormSchema),
        mode: "all",
        criteriaMode: "all",
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="size-5" />
                        Nova Inscrição
                    </CardTitle>
                    <CardDescription>
                        Preencha os campos abaixo para criar uma nova inscrição de estudante.
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Formulário */}
            <Card>
                <form onSubmit={handleSubmit((data) => mutate(data))}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Estudante *</Label>
                                <Controller
                                    name="user_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={isLoadingUsers}
                                        >
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder={isLoadingUsers ? "Carregando..." : "Selecione um estudante"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users?.map((user) => (
                                                    <SelectItem key={user.id} value={user.id}>
                                                        {user.name} ({user.email})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FormMessageError error={errors.user_id?.message} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="start_date">Data de Início *</Label>
                                <Input
                                    type="date"
                                    id="start_date"
                                    {...register('start_date')}
                                />
                                <FormMessageError error={errors.start_date?.message} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="monthly_fee_amount">Valor da Mensalidade (R$) *</Label>
                                <Input
                                    id="monthly_fee_amount"
                                    placeholder="0.00"
                                    {...register('monthly_fee_amount', { valueAsNumber: true })}
                                />
                                <FormMessageError error={errors.monthly_fee_amount?.message} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="discount_payment_before_due_date">Valor do Desconto de Pagamento Antecipado (R$) *</Label>
                                <Input
                                    id="discount_payment_before_due_date"
                                    placeholder="0.00"
                                    {...register('discount_payment_before_due_date', { valueAsNumber: true })}
                                />
                                <FormMessageError error={errors.discount_payment_before_due_date?.message} />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-2 mt-10">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Matricular
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}