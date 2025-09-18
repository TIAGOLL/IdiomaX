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
import { toast } from 'sonner';
import nookies from 'nookies';
import { getUserProfile } from '@/services/users/get-user-profile';
import { useNavigate } from 'react-router';
import { signInWithPassword } from '@/services/auth/sign-in-with-password';
import { signInWithPasswordRequest } from '@idiomax/http-schemas/sign-in-with-password';

type SignInWithPasswordRequest = z.infer<typeof signInWithPasswordRequest>;

export function SignInForm() {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SignInWithPasswordRequest) => {
      const response = await signInWithPassword(data)
      nookies.set(null, "token", response.token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days 
      });
      return response;
    },
    onSuccess: async (res) => {
      const profile = await getUserProfile();
      if (profile.member_on?.length === 0) {
        toast.error('Nenhuma instituição encontrada para este usuário.');
      } else {
        navigate('/');
        toast.success(res.message);
      }
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInWithPasswordRequest),
    mode: 'all',
    criteriaMode: 'all',
    defaultValues: {
      username: 'tiago10',
      password: 'admin1',
    }
  });

  return (
    <Card>
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
      <form onSubmit={handleSubmit((data) => mutate(data))} className='flex flex-col gap-4'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Faça login e entre na plataforma.</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-2 space-y-2'>
          <div className='space-y-1'>
            <Label htmlFor='username' className='flex flex-row'>
              <User className='mr-1 h-4 w-4' />
              Usúario
            </Label>
            <Input type='text' {...register('username')} autoFocus data-test='loginUsernameInput' />
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
        <CardFooter className='flex justify-end flex-row'>
          <Button
            variant='default'
            type='submit'
            disabled={isPending}
            data-test='loginSubmitButton'>
            Entrar
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
