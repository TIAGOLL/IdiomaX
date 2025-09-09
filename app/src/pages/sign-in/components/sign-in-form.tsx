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
import { signInFormSchema } from '@/services/users/sign-in-with-password';
import { useAuth } from '@/contexts/auth-context';

type SignInFormSchema = z.infer<typeof signInFormSchema>;

export function SignInForm() {
  const { login } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SignInFormSchema) => {
      const response = await api.post('/auth/sign-in-with-password', data);
      return response.data;
    },
    onSuccess: async (res) => {
      toast.success(res.message);
      login(res.token)
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  async function SignIn({ username, password }: SignInFormSchema) {
    mutate({ username, password });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInFormSchema),
    mode: 'all',
    criteriaMode: 'all',
    defaultValues: {
      username: 'tiago10',
      password: 'admin1',
    }
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
      <form onSubmit={handleSubmit(SignIn)} className='flex flex-col gap-4'>
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
