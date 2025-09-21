import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, LoaderIcon } from 'lucide-react';
import { PasswordGenerator, UserGenerator } from '@/lib/utils';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { createUserWithRoleRequest, type CreateUserWithRoleRequest } from '@idiomax/http-schemas/create-user-with-role';
import { FormMessageError } from '@/components/ui/form-message-error';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function CreateUser() {

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateUserWithRoleRequest) => {
            // TODO: Implementar criação de usuário quando o endpoint estiver disponível
            console.log("Dados para criação:", data);
            // Simular sucesso por enquanto
            return { message: `Usuário ${data.role.toLowerCase()} criado com sucesso!` };
        },
        onSuccess: (res) => {
            toast.success(res.message);
            console.log(res);
            // TODO: Adicionar redirect ou reset do form após sucesso
        },
        onError: (err) => {
            console.log(err);
            toast.error("Erro ao criar usuário: " + err.message);
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        control
    } = useForm<CreateUserWithRoleRequest>({
        resolver: zodResolver(createUserWithRoleRequest) as Resolver<CreateUserWithRoleRequest>,
        mode: "all",
        criteriaMode: "all",
    });

    const dateOfBirth = watch('date_of_birth');
    const selectedRole = watch('role');

    useEffect(() => {
        setValue("password", PasswordGenerator(dateOfBirth, watch('name')?.toLowerCase()))
        setValue("username", UserGenerator(dateOfBirth, watch('name')?.toLowerCase()))
    }, [dateOfBirth, setValue, watch])

    // Função para obter o título baseado na role
    const getRoleTitle = (role: string | undefined) => {
        switch (role) {
            case 'STUDENT': return 'Novo Estudante';
            case 'TEACHER': return 'Novo Professor';
            case 'ADMIN': return 'Novo Administrador';
            default: return 'Novo Usuário';
        }
    };

    // Função para obter a descrição baseada na role
    const getRoleDescription = (role: string | undefined) => {
        switch (role) {
            case 'STUDENT': return 'Preencha os dados para cadastrar um novo estudante';
            case 'TEACHER': return 'Preencha os dados para cadastrar um novo professor';
            case 'ADMIN': return 'Preencha os dados para cadastrar um novo administrador';
            default: return 'Selecione o tipo de usuário e preencha os dados';
        }
    };

    return (
        <div className='flex justify-center items-center sm:w-full'>
            <Card className='sm:w-11/12 w-full'>
                <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4'>
                    <CardHeader className='flex space-x-4 flex-col'>
                        <div className='flex-col'>
                            <CardTitle>
                                Criar {getRoleTitle(selectedRole)}
                            </CardTitle>
                            <CardDescription>{getRoleDescription(selectedRole)}</CardDescription>
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
                            <div className="col-span-2 space-y-1">
                                <Label htmlFor='name'>Nome</Label>
                                <Input type='text' id='name' placeholder="Nome completo" {...register('name')} />
                                <FormMessageError error={errors.name?.message} />
                            </div>
                            <div className="col-span-2 space-y-1">
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
                                            value={field.value ? field.value.toISOString().split('T')[0] : ''}
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
                                    value={UserGenerator(dateOfBirth, watch('name')?.toLowerCase())}
                                    {...register('username')}
                                />
                                <FormMessageError error={errors.username?.message} />
                            </div>
                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='password'>Senha</Label>
                                <Input
                                    type='text'
                                    id='password'
                                    placeholder="Senha gerada automaticamente"
                                    value={PasswordGenerator(dateOfBirth, watch('name')?.toLowerCase())}
                                    {...register('password')}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className='flex justify-between flex-row-reverse'>
                        <Button
                            variant='default'
                            type='submit'
                            disabled={isPending}
                        >
                            Criar {selectedRole === 'STUDENT' ? 'Estudante' : selectedRole === 'TEACHER' ? 'Professor' : selectedRole === 'ADMIN' ? 'Administrador' : 'Usuário'}
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