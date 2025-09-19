import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FormMessageError } from '@/components/ui/form-message-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { LoaderIcon, LogIn, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router';
import nookies from 'nookies';
import { signUpWithPassword } from '@/services/auth/sign-up-with-password';
import { signUpWithPasswordRequest } from '@idiomax/http-schemas/sign-up-with-password';
import type z from 'zod';

type SignUpWithPasswordRequest = z.infer<typeof signUpWithPasswordRequest>;

export function SignUpForm() {
    const navigate = useNavigate();
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: SignUpWithPasswordRequest) => {
            const response = await signUpWithPassword(data);
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            nookies.set(null, "token", res.token, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days 
            });
            navigate('/auth/create-company');
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
        watch,
        setValue
    } = useForm({
        resolver: zodResolver(signUpWithPasswordRequest),
        mode: 'all',
        criteriaMode: 'all',
        defaultValues: {
            name: 'João da Silva',
            email: 'tiagoepitanga10@gmail.com',
            username: 'tiago10',
            cpf: '12345458901',
            phone: '11999999999',
            gender: 'M',
            date_of_birth: '2000-01-01',
            address: 'Rua das Flores, 123',
            password: 'admin1',
        }
    });

    return (
        <Card className='w-10/12'>
            <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4'>
                <CardHeader className='flex items-center space-x-4'>
                    <div className='flex flex-col items-center justify-center'>
                        <img src='/images/logo.png' alt='Logo da loja' className='size-12' />
                    </div>
                    <div className='flex-col'>
                        <CardTitle>
                            Cadastro do usuário ADMIN
                        </CardTitle>
                        <CardDescription>Depois você poderá cadastrar mais usuários admin em sua empresa.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="sm:grid flex flex-col sm:grid-cols-3 gap-4">
                        <div className="col-span-1 space-y-1">
                            <Label htmlFor='name'>Nome</Label>
                            <Input type='text' id='name' {...register('name')} />
                            <FormMessageError error={errors.name?.message} />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <Label htmlFor='email'>Email</Label>
                            <Input type='email' id='email' {...register('email')} />
                            <FormMessageError error={errors.email?.message} />
                        </div>
                        <div className="col-span-1 space-y-1">
                            <Label htmlFor='cpf'>CPF</Label>
                            <Input type='text' id='cpf' {...register('cpf')} />
                            <FormMessageError error={errors.cpf?.message} />
                        </div>
                        <div className="col-span-1 space-y-1 w-full">
                            <Label htmlFor='gender'>Gênero</Label>
                            <Select
                                onValueChange={value => {
                                    setValue('gender', value as 'M' | 'F');
                                }}
                                defaultValue={watch('gender')}
                            >
                                <SelectTrigger id='gender' className='w-full'>
                                    <SelectValue placeholder="Selecione o gênero" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="M">Masculino</SelectItem>
                                    <SelectItem value="F">Feminino</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessageError error={errors.gender?.message} />
                        </div>
                        <div className="col-span-1 space-y-1">
                            <Label htmlFor='phone'>Telefone</Label>
                            <Input type='text' id='phone' {...register('phone')} />
                            <FormMessageError error={errors.phone?.message} />
                        </div>
                        <div className="col-span-1 space-y-1">
                            <Label htmlFor='date_of_birth'>Data de nascimento</Label>
                            <Input type='date' id='date_of_birth' {...register('date_of_birth')} />
                            <FormMessageError error={errors.date_of_birth?.message} />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <Label htmlFor='address'>Endereço</Label>
                            <Input type='text' id='address' {...register('address')} />
                            <FormMessageError error={errors.address?.message} />
                        </div>
                        <div className="col-span-1 space-y-1">
                            <div className='flex gap-3'>
                                <Label htmlFor='username'>Usuário</Label>
                                <Tooltip>
                                    <TooltipTrigger><Info className='size-4' /></TooltipTrigger>
                                    <TooltipContent>
                                        <p>Você usará esse nome para fazer login.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <Input type='text' id='username' {...register('username')} />
                            <FormMessageError error={errors.username?.message} />
                        </div>
                        <div className="col-span-1 space-y-1">
                            <Label htmlFor='password'>Senha</Label>
                            <Input type='password' id='password' {...register('password')} />
                            <FormMessageError error={errors.password?.message} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className='flex justify-between flex-row-reverse'>
                    <Button
                        variant='default'
                        onClick={() => console.log(watch('date_of_birth'))}
                        type='submit'
                        disabled={isPending}
                        data-test='signUpSubmitButton'>
                        Continuar
                        {isPending ? (
                            <LoaderIcon className='ml-2 h-4 w-4 animate-spin' />
                        ) : (
                            <LogIn className='ml-2 h-4 w-4' />
                        )}
                    </Button>
                    <Button variant='ghost' type='button' onClick={() => navigate('/auth/sign-in')} className='ml-4'>
                        Já possuo uma conta
                    </Button>
                </CardFooter>
            </form>
        </Card >
    );
}
