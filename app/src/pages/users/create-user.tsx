import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, LoaderIcon, InfoIcon } from 'lucide-react';
import { PasswordGenerator } from '@/lib/utils';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { CreateUserFormSchema } from '@idiomax/http-schemas/users/create-user';
import { FormMessageError } from '@/components/ui/form-message-error';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { createUser } from '@/services/users/create-user';
import { getCurrentCompanyId } from '@/lib/company-utils';

type CreateUserRequest = z.infer<typeof CreateUserFormSchema>;

export function CreateUserPage() {

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateUserRequest) => {
            const response = await createUser(data);
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            console.log(res);
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
        watch,
        setValue,
        control
    } = useForm<CreateUserRequest>({
        resolver: zodResolver(CreateUserFormSchema) as Resolver<CreateUserRequest>,
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            company_id: getCurrentCompanyId(),
            address: 'Rua teste, 123 - Bairro - Cidade - Estado - 00000-000',
            date_of_birth: new Date('1995-01-01'),
            gender: 'M',
            role: 'STUDENT',
            cpf: '00000000000',
            email: "teste@gmail.com",
            username: "teste123",
            name: "Teste Teste",
            phone: "11999999999"
        }
    });

    const date_of_birth = watch('date_of_birth');
    const userName = watch('name');

    useEffect(() => {
        if (date_of_birth && userName) {
            setValue("password", PasswordGenerator(watch("cpf")))
        }
    }, [date_of_birth, userName, setValue, watch])

    return (
        <div className='flex justify-center items-center sm:w-full'>
            <Card className='w-full'>
                <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4'>
                    <CardHeader className='flex space-x-4 flex-col'>
                        <div className='flex-col'>
                            <CardTitle>
                                Cadastrar usuário
                            </CardTitle>
                            <CardDescription>Preencha os dados para cadastrar um novo usuário</CardDescription>
                        </div>
                        <Avatar className="rounded-xl justify-center items-center flex size-48">
                            <AvatarFallback>
                                <img src="/images/without-avatar.png" className='dark:invert' />
                            </AvatarFallback>
                        </Avatar>
                    </CardHeader>
                    <CardContent>
                        <div className="sm:grid flex flex-col sm:grid-cols-3 gap-4">
                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='role'>Tipo de Usuário</Label>
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value ?? undefined}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger id='role' className='w-full'>
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="STUDENT">Estudante</SelectItem>
                                                <SelectItem value="TEACHER">Professor</SelectItem>
                                                <SelectItem value="ADMIN">Administrador</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FormMessageError error={errors.role?.message} />
                            </div>
                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='name'>Nome</Label>
                                <Input type='text' id='name' placeholder="Nome completo" {...register('name')} />
                                <FormMessageError error={errors.name?.message} />
                            </div>
                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='email'>Email</Label>
                                <Input
                                    id='email'
                                    placeholder="Email"
                                    {...register('email')}
                                />
                                <FormMessageError error={errors.email?.message} />
                            </div>
                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='cpf'>CPF</Label>
                                <Input type='text' id='cpf' placeholder="CPF" {...register('cpf')} />
                                <FormMessageError error={errors.cpf?.message} />
                            </div>
                            <div className="col-span-1 space-y-1 w-full">
                                <Label htmlFor='gender'>Gênero</Label>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value ?? undefined}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger id='gender' className='w-full'>
                                                <SelectValue placeholder="Selecione o gênero" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="M">Masculino</SelectItem>
                                                <SelectItem value="F">Feminino</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FormMessageError error={errors.gender?.message} />
                            </div>
                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='phone'>Telefone</Label>
                                <Input type='text' id='phone' placeholder="Telefone" {...register('phone')} maxLength={11} />
                                <FormMessageError error={errors.phone?.message} />
                            </div>
                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='date_of_birth'>Data de nascimento</Label>
                                <Controller
                                    name="date_of_birth"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type='date'
                                            id='date_of_birth'
                                            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                            onChange={(e) => {
                                                const dateValue = e.target.value ? new Date(e.target.value) : undefined;
                                                field.onChange(dateValue);
                                            }}
                                        />
                                    )}
                                />
                                <FormMessageError error={errors.date_of_birth?.message} />
                            </div>
                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='address'>Endereço</Label>
                                <Input type='text' id='address' placeholder="Endereço completo" {...register('address')} />
                                <FormMessageError error={errors.address?.message} />
                            </div>
                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='username'>Usuário</Label>
                                <Input
                                    type='text'
                                    id='username'
                                    placeholder="Nome de usuário"
                                    {...register('username')}
                                />
                                <FormMessageError error={errors.username?.message} />
                            </div>
                            <div className="col-span-1 space-y-1">
                                <div className='flex items-center space-x-2'>
                                    <Label htmlFor='password'>Senha</Label>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <InfoIcon className='size-4' />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>A senha gerada é bemvindo + 4 primeiros caracteres do CPF.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <Input
                                    type='text'
                                    id='password'
                                    placeholder="Senha gerada automaticamente"
                                    value={PasswordGenerator(watch("cpf"))}
                                    {...register('password')}
                                />

                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className='flex justify-between flex-row-reverse'>
                        <Button
                            variant='default'
                            type='submit'
                            onClick={() => console.log(errors)}
                            disabled={isPending}
                        >
                            Cadastrar
                            {isPending ? (
                                <LoaderIcon className='ml-2 h-4 w-4 animate-spin' />
                            ) : (
                                <PlusCircle className='ml-2 h-4 w-4' />
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}