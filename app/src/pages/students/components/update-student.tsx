import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoaderIcon, Save } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserBody } from '@idiomax/http-schemas/update-user';
import { FormMessageError } from '@/components/ui/form-message-error';
import { toast } from 'sonner';
import { getStudentByEmail, updateStudent } from '@/services/students';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

type UpdateStudentBody = z.infer<typeof updateUserBody>;

export function UpdateStudents() {

    const [searchParams] = useSearchParams();

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData: UpdateStudentBody) => {
            if (!data?.id || !formData.date_of_birth) {
                throw new Error('ID do estudante não encontrado');
            }
            const processedData: UpdateStudentBody = {
                ...formData,
                date_of_birth: new Date(formData.date_of_birth)
            };
            const response = await updateStudent(processedData)
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            console.log(res);
        },
        onError: (err) => {
            console.log(err);
            toast.error(err.message);
        }
    });

    const email = searchParams.get("email");

    const { data } = useQuery({
        queryKey: ["student", email],
        queryFn: async () => {
            if (!email) return null;
            return await getStudentByEmail(email)
        },
        enabled: !!email
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset
    } = useForm<UpdateStudentBody>({
        resolver: zodResolver(updateUserBody),
        mode: "all",
        criteriaMode: "all",
    });

    useEffect(() => {
        if (data) {
            reset({
                name: data.name,
                cpf: data.cpf,
                phone: data.phone,
                gender: data.gender,
                date_of_birth: new Date(data.date_of_birth),
                address: data.address,
                avatar_url: data.avatar_url || undefined,
            });
        }
    }, [data, reset]);

    return (
        <div className='mt-10 flex flex-col'>
            <form onSubmit={handleSubmit((data) => mutate(data))} className='grid grid-cols-8 gap-2'>
                <div className='col-span-8 justify-center items-center grid'>
                    <p className='font-semibold'>Perfil</p>
                </div>
                <div className='col-span-4'>
                    <Label htmlFor='name'>Primeiro nome</Label>
                    <Input id='name' placeholder="Primeiro nome" {...register('name')} />
                    <FormMessageError error={errors.name?.message} />
                </div>
                <div className='col-span-4'>
                    <Label htmlFor='cpf'>CPF</Label>
                    <Input id='cpf' placeholder="CPF" {...register('cpf')} maxLength={11} />
                    <FormMessageError error={errors.cpf?.message} />
                </div>
                <div className='col-span-4'>
                    <Label htmlFor='phone'>Telefone</Label>
                    <Input id='phone' placeholder="Telefone" {...register('phone')} maxLength={11} />
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
                    <Label htmlFor='cep'>CEP</Label>
                    <Input id='cep' placeholder="CEP" {...register('address')} />
                    <FormMessageError error={errors.address?.message} />
                </div>
                <div className='col-span-8 justify-center items-center grid mt-4'>
                    <p className='font-semibold'>Credenciais</p>
                </div>
                <div className='col-span-4'>
                    <Label htmlFor='email'>Email</Label>
                    <Input id='email' placeholder="Email" {...register('email')} disabled className="rounded-r-none" />
                    <FormMessageError error={errors.email?.message} />
                </div>
                <div className='col-span-4'>
                    <Label htmlFor='username'>Usuário</Label>
                    <Input id='username' placeholder="Usuário" {...register('username')} disabled />
                    <FormMessageError error={errors.username?.message} />
                </div>
                <Button type="submit" variant="default" className="mt-5">
                    <Save className='w-4 h-4 mr-2' />
                    {isPending ? <LoaderIcon className='animate-spin' /> : 'Salvar'}
                </Button>
            </form>
        </div>
    );
}