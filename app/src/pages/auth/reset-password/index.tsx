import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormMessageError } from '@/components/ui/form-message-error';
import { LoaderIcon, LockIcon } from 'lucide-react';
import { resetPassword } from '@/services/auth/reset-password';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

// Schema de validação
const resetPasswordSchema = z.object({
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
});

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'all',
        criteriaMode: 'all',
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: ResetPasswordSchema) => {
            const response = await resetPassword({ password: data.password, token: token! });
            return response
        },
        onSuccess: async (res) => {
            navigate('/auth/sign-in');
            toast.success(res.message);
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    async function SignIn(data: ResetPasswordSchema) {
        mutate(data);
    }

    return (
        <div className='flex justify-center min-h-screen items-center bg-slate-100 dark:bg-slate-600 sm:!w-screen'>
            <Card className='min-w-4/12'>
                <div className='mt-4 flex flex-col items-center justify-center'>
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
                <form onSubmit={handleSubmit(SignIn)} className='flex flex-col gap-4'>
                    <CardHeader>
                        <CardTitle>Redefinir Senha</CardTitle>
                        <CardDescription>Digite sua nova senha abaixo.</CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-2 space-y-2'>
                        <div className='space-y-1'>
                            <label htmlFor='password' className='flex flex-row'>
                                <LockIcon className='mr-1 h-4 w-4' />
                                Nova Senha
                            </label>
                            <Input type='password' {...register('password')} autoFocus />
                            <FormMessageError error={errors.password?.message} />
                        </div>
                        <div className='space-y-1'>
                            <label htmlFor='confirmPassword' className='flex flex-row'>
                                <LockIcon className='mr-1 h-4 w-4' />
                                Confirmar Senha
                            </label>
                            <Input type='password' {...register('confirmPassword')} />
                            <FormMessageError error={errors.confirmPassword?.message} />
                        </div>
                    </CardContent>
                    <CardFooter className='flex justify-end'>
                        <Button type='submit' disabled={isPending}>
                            Redefinir Senha
                            {isPending && <LoaderIcon className='ml-2 h-4 w-4 animate-spin' />}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}