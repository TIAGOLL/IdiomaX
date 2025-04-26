import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { LoaderIcon, LockIcon, LogIn, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const authFormSchema = z.object({
  user: z.string().max(45, 'Máximo 45 caracteres').min(1, 'Preencha o usúario').trim(),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres').trim(),
});

type AuthFormSchema = z.infer<typeof authFormSchema>;

export function SignInForm() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AuthFormSchema) => {
      const response = await axios.post('/api/v2/sign-in-with-password', data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Login sucesso:', data);
    },
    onError: (err) => {
      console.error('Erro no login:', err);
    },
  });

  async function SignIn({ user, password }: AuthFormSchema) {
    mutate({ user, password });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authFormSchema),
    mode: 'all',
    criteriaMode: 'all',
  });

  return (
    <Card>
      <div className='mt-4 flex flex-col items-center justify-center'>
        <div className='dark:hidden'>
          <img src='/images/logo.png' alt='Logo da loja' className='w-40' />
        </div>
        <div className='hidden dark:flex'>
          <img src='/images/logoWhite.png' alt='Logo da loja' className='w-40' />
        </div>
      </div>
      <form onSubmit={handleSubmit(SignIn)}>
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
            <Input type='text' {...register('user')} autoFocus data-test='loginUserInput' />
            {errors.user && (
              <p className='text-xs text-red-500' data-test='userErrorInput'>
                {errors.user.message}
              </p>
            )}
          </div>
          <div className='space-y-1'>
            <Label htmlFor='name' className='flex flex-row'>
              <LockIcon className='mr-1 h-4 w-4' />
              Senha
            </Label>
            <Input type='password' {...register('password')} data-test='loginPasswordInput' />
            {errors.password && (
              <p className='text-xs text-red-500' data-test='passwordErrorInput'>
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
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
