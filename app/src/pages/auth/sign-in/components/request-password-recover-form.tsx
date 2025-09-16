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
import { LoaderIcon, Mail, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { requestPasswordRecoverSchema, type RequestPasswordRecoverSchema } from '@/services/auth/request-password-recover';

export function RequestPasswordRecoverForm() {

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: RequestPasswordRecoverSchema) => {
            const response = await api.post('/auth/password-recover', data);
            return response.data;
        },
        onSuccess: async (res) => {
            toast.success(res.message);
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    async function requestPasswordRecover({ email }: RequestPasswordRecoverSchema) {
        mutate({ email });
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(requestPasswordRecoverSchema),
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
            <form onSubmit={handleSubmit(requestPasswordRecover)} className='flex flex-col gap-4'>
                <CardHeader>
                    <CardTitle>Recuperação de senha</CardTitle>
                    <CardDescription>Digite seu e-mail para recuperar sua senha.</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-2 space-y-2'>
                    <div className='space-y-1'>
                        <Label htmlFor='email' className='flex flex-row'>
                            <Mail className='mr-1 h-4 w-4' />
                            Email
                        </Label>
                        <Input type='text' {...register('email')} autoFocus data-test='loginUsernameInput' />
                        <FormMessageError error={errors.email?.message} />
                    </div>
                </CardContent>
                <CardFooter className='flex justify-center'>
                    <Button
                        variant='default'
                        type='submit'
                        disabled={isPending}
                        data-test='loginSubmitButton'>
                        Enviar recuperação de senha
                        {isPending ? (
                            <LoaderIcon className='ml-2 h-4 w-4 animate-spin' />
                        ) : (
                            <Send className='ml-2 h-4 w-4' />
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
