import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, useForm } from 'react-hook-form';
import { UpdateUserFormSchema } from '@idiomax/validation-schemas/users/update-user';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormMessageError } from '@/components/ui/form-message-error';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon, LoaderIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { ptBR } from 'date-fns/locale';
import { updateUser } from '@/services/users/update-user';
import type { GetUserByIdResponseType } from '@idiomax/validation-schemas/users/get-user-by-id';
import { getCurrentCompanyId } from '@/lib/company-utils';

type UpdateUserFormSchema = z.infer<typeof UpdateUserFormSchema>;

export function EditUserForm({ user }: { user: GetUserByIdResponseType }) {

    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('id') || '';

    const { handleSubmit, control, formState: { errors }, register } =
        useForm<UpdateUserFormSchema>({
            resolver: zodResolver(UpdateUserFormSchema),
            defaultValues: {
                name: user.name,
                email: user.email,
                cpf: user.cpf,
                phone: user.phone,
                username: user.username,
                gender: user.gender,
                date_of_birth: new Date(user.date_of_birth),
                address: user.address,
                avatar_url: user.avatar_url || undefined,
            },
        });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: UpdateUserFormSchema) => updateUser({
            ...data,
            company_id: getCurrentCompanyId(),
            id: userId
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['user', user.id] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return (
        <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="avatar_url">Avatar</Label>
                    <Input
                        id="avatar_url"
                        {...register('avatar_url')}
                        placeholder="Digite a URL do avatar"
                    />
                    <FormMessageError error={errors?.avatar_url?.message} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                        id="name"
                        {...register('name')}
                        placeholder="Digite o nome completo"
                    />
                    <FormMessageError error={errors?.name?.message} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="Digite o email"
                    />
                    <FormMessageError error={errors?.email?.message} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                        id="cpf"
                        {...register('cpf')}
                        placeholder="Digite o CPF"
                        maxLength={11}
                    />
                    <FormMessageError error={errors?.cpf?.message} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                        id="phone"
                        {...register('phone')}
                        placeholder="Digite o telefone"
                    />
                    <FormMessageError error={errors?.phone?.message} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="username">Nome de usuário</Label>
                    <Input
                        id="username"
                        {...register('username')}
                        placeholder="Digite o nome de usuário"
                    />
                    <FormMessageError error={errors?.username?.message} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gender">Gênero</Label>
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Selecione o gênero" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="M">Masculino</SelectItem>
                                    <SelectItem value="F">Feminino</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <FormMessageError error={errors?.gender?.message} />
                </div>

                <div className="space-y-2">
                    <Label>Data de nascimento</Label>
                    <Controller
                        name="date_of_birth"
                        control={control}
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? (
                                            format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR })
                                        ) : (
                                            <span>Selecione uma data</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value ? new Date(field.value) : undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                field.onChange(date);
                                            }
                                        }}
                                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                        locale={ptBR}
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    <FormMessageError error={errors?.date_of_birth?.message} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Endereço completo</Label>
                <Textarea
                    id="address"
                    {...register('address')}
                    placeholder="Digite o endereço completo"
                    rows={3}
                />
                <FormMessageError error={errors?.address?.message} />
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="min-w-32"
                    onClick={() => console.log(errors)}
                >
                    {isPending ? 'Salvando...' : 'Salvar Alterações'}
                    {isPending && <LoaderIcon className="ml-2 size-4 animate-spin" />}
                </Button>
            </div>
        </form>
    )
}