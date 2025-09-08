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
import { LoaderIcon, LockIcon, LogIn, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import api from '@/lib/api';
import { toast } from 'sonner';
import { signUpFormSchema } from '@/services/users/sign-up-with-password';

type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

export function SignUpForm() {
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: SignUpFormSchema) => {
            const response = await api.post('/auth/sign-up-with-password', data);
            return response.data;
        },
        onSuccess: (res) => {
            toast(res.message)
        },
        onError: (err) => {
            toast(err.message);
        }
    });

    async function SignUp(data: SignUpFormSchema) {
        mutate({ ...data });
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signUpFormSchema),
        mode: 'all',
        criteriaMode: 'all',
    });

    return (
        <Card>
            <div className='mt-4 flex flex-col items-center justify-center animate-fade-in'>
                <img
                    src='/images/logo.png'
                    alt='Logo da loja'
                    className='size-24'
                />
                <span
                    className='mt-2 text-3xl font-extrabold text-primary animate-glow shadow-primary'
                    style={{ fontFamily: 'Montserrat, sans-serif', letterSpacing: '2px' }}
                >
                    IdiomaX
                </span>
            </div>
            <form onSubmit={handleSubmit(SignUp)} className='flex flex-col gap-4'>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Faça login e entre na plataforma.</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-2 space-y-2'>
                    <div className='space-y-1'>
                        <Label htmlFor='user' className='flex flex-row'>
                            <User className='mr-1 h-4 w-4' />
                            Usúario
                        </Label>
                        <Input type='text' {...register('username')} autoFocus data-test='loginUserInput' />
                        <FormMessageError error={errors.username?.message} />
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor='name' className='flex flex-row'>
                            <LockIcon className='mr-1 h-4 w-4' />
                            Senha
                        </Label>
                        <Input type='password' {...register('password')} data-test='loginPasswordInput' />
                        <FormMessageError error={errors.password?.message} />
                    </div>
                </CardContent>
                <CardFooter className='flex justify-center'>
                    <Button
                        variant='default'
                        type='submit'
                        disabled={isPending}
                        data-test='loginSubmitButton'>
                        Logar
                        {isPending ? (
                            <LoaderIcon className='ml-2 h-4 w-4 animate-spin' />
                        ) : (
                            <LogIn className='ml-2 h-4 w-4' />
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
