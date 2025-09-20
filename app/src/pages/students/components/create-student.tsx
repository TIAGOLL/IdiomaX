import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { useEffect } from 'react';
import { PasswordGenerator, UserGenerator } from '@/lib/utils';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserSchema } from '@idiomax/http-schemas/entities';
import { FormMessageError } from '@/components/ui/form-message-error';

export function CreateStudents() {

    async function createStudent(data: unknown) {
        // TODO: Implementar criação de usuário quando o endpoint estiver disponível
        console.log("Dados para criação:", data);
        alert("Funcionalidade de criação ainda não implementada");
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        control
    } = useForm({
        resolver: zodResolver(CreateUserSchema),
        mode: "all",
        criteriaMode: "all",
    });

    const dateOfBirth = watch('date_of_birth')

    useEffect(() => {
        setValue("password", PasswordGenerator(dateOfBirth, watch('name')?.toLowerCase()))
        setValue("username", UserGenerator(dateOfBirth, watch('name')?.toLowerCase()))
    }, [dateOfBirth, setValue, watch])

    return (
        <div className='mt-10 flex flex-col w-[1000px]'>
            <form onSubmit={handleSubmit(createStudent)} className='grid grid-cols-8 gap-2'>
                <div className='col-span-8 justify-center items-center grid'>
                    <p className='font-semibold'>Perfil</p>
                </div>
                <div className='col-span-4'>
                    <Label>CPF</Label>
                    <Input placeholder="CPF" {...register('cpf')} value={watch("cpf")} />
                    <FormMessageError error={errors.cpf?.message} />
                </div>
                <div className='col-span-4'>
                    <Label>Telefone</Label>
                    <Input placeholder="Telefone" {...register('phone')} maxLength={11} />
                    <FormMessageError error={errors.phone?.message} />
                </div>
                <div className='col-span-4'>
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
                <div className='col-span-4'>
                    <Label>Data de nascimento</Label>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='date_of_birth'>Data de nascimento</Label>
                        <Input type='date' id='date_of_birth'  {...register('date_of_birth')} />
                        <FormMessageError error={errors.date_of_birth?.message} />
                    </div>
                </div>
                <div className='col-span-8 justify-center items-center grid mt-4 mb-2'>
                    <p className='font-semibold'>Endereço</p>
                </div>
                <div className='col-span-4'>
                    <Label>Cidade</Label>
                    <Input placeholder="Cidade" {...register('address')} />
                    <FormMessageError error={errors.address?.message} />
                </div>
                <div className='col-span-8 justify-center items-center grid mt-4'>
                    <p className='font-semibold'>Credenciais</p>
                </div>
                <div className='col-span-4'>
                    <Label>Email</Label>
                    <div className='grid grid-cols-2'>
                        <Input placeholder="Email" {...register('email')} className="rounded-r-none" />
                        <Input placeholder="@school.com" disabled className="rounded-l-none" />
                    </div>
                    <FormMessageError error={errors.email?.message} />
                </div>
                <div className='col-span-4'>
                    <div>
                        <Label>Usúario</Label>
                        <Input placeholder="Usúario" type="text" value={UserGenerator(dateOfBirth, watch('name')?.toLowerCase())} {...register('username')} />
                    </div>
                    <FormMessageError error={errors.username?.message} />
                </div>
                <div className='col-span-4'>
                    <Label>Senha</Label>
                    <Input placeholder="Senha" type="text" value={PasswordGenerator(dateOfBirth, watch('name')?.toLowerCase())}  {...register('password')} />
                </div>
                <Button type="submit" variant="default" className="mt-5">
                    <PlusCircle className='w-4 h-4 mr-2' />
                    Cadastrar
                </Button>
            </form >
        </div >
    );
}