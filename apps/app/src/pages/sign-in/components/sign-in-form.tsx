import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@idiomax/ui/components/button';
import { FormMessageError } from '@idiomax/ui/components/form-message-error';
import { Input } from '@idiomax/ui/components/input';
import { Label } from '@idiomax/ui/components/label';
import { cn } from '@idiomax/ui/lib/utils';
import { GoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { Loader, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { authFormSchema } from '../../../types/authFormSchema';

type AuthFormSchema = z.infer<typeof authFormSchema>;

export function SignInForm({ className, ...props }: React.ComponentProps<'form'>) {
  const { mutate, isPending, error } = useMutation<string, Error, AuthFormSchema>({
    mutationFn: async ({ email, password }) => {
      return await new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(email, password);
          resolve('Login realizado com sucesso!');
        }, 1000);
      });
    },
    onSuccess: (message) => {
      toast.success(message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormSchema>({
    resolver: zodResolver(authFormSchema),
    mode: 'all',
    criteriaMode: 'all',
  });

  function SignInWithPassword(data: AuthFormSchema) {
    mutate(data);
  }

  return (
    <form
      onSubmit={handleSubmit(SignInWithPassword)}
      className={cn('flex flex-col gap-6', className)}
      {...props}>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>Login</h1>
        <p className='text-muted-foreground text-sm text-balance'>
          Entre com seu e-mail para buscarmos sua conta
        </p>
      </div>
      <div className='grid gap-6'>
        <div className='grid gap-1'>
          <Label htmlFor='email'>E-mail</Label>
          <Input id='email' {...register('email')} />
          <FormMessageError error={errors.email?.message} />
        </div>
        <div className='grid gap-1'>
          <div className='flex items-center'>
            <Label htmlFor='password'>Password</Label>
          </div>
          <Input type='password' {...register('password')} />
          <FormMessageError error={errors.password?.message} />
        </div>
        <Button type='submit' className='w-full' disabled={isPending}>
          Logar
          {!isPending && <LogIn className='size-4' />}
          {isPending && <Loader className='size-4 animate-spin' />}
        </Button>
        <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
          <span className='bg-background text-muted-foreground relative z-10 px-2'>
            OU LOGAR COM
          </span>
        </div>
        <div className='flex justify-center'>
          <GoogleLogin
            onSuccess={(e) => {
              console.log('Google login successful:', e);
            }}
            onError={() => {
              toast('Erro ao fazer login com o Google. Tente novamente.');
            }}
            theme='filled_black'
          />
        </div>
      </div>
      <div className='text-center text-sm'>
        Não possui uma conta?{' '}
        <a href='#' className='underline underline-offset-4'>
          Cadastrar
        </a>
      </div>
    </form>
  );
}
