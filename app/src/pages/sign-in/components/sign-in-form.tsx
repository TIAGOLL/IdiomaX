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
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { FormMessageError } from '@/components/ui/form-message-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { LoaderIcon, LockIcon, LogIn, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import api from '@/lib/api';
import { toast } from 'sonner';

export const authFormSchema = z.object({
  user: z.string().max(45, 'Máximo 45 caracteres').min(1, 'Preencha o usúario').trim(),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres').trim(),
  userType: z.string().refine((value) => ['student', 'professional'].includes(value), {
    message: 'Selecione um tipo de usuário',
  })
})

type AuthFormSchema = z.infer<typeof authFormSchema>;

export function SignInForm() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AuthFormSchema) => {
      const response = await api.post('/auth/sign-in-with-password', data);
      return response.data;
    },
    onSuccess: (res) => {
      toast(res.message)
    },
    onError: (err) => {
      toast(err.message);
    }
  });

  async function SignIn({ user, password, userType }: AuthFormSchema) {
    mutate({ user, password, userType });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(authFormSchema),
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
      <form onSubmit={handleSubmit(SignIn)} className='flex flex-col gap-4'>
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
            <FormMessageError error={errors.user?.message} />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='name' className='flex flex-row'>
              <LockIcon className='mr-1 h-4 w-4' />
              Senha
            </Label>
            <Input type='password' {...register('password')} data-test='loginPasswordInput' />
            <FormMessageError error={errors.password?.message} />
          </div>
          <RadioGroup defaultValue="student" {...register('userType')} onValueChange={(value) => setValue('userType', value)}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="student" id="student" defaultChecked />
              <Label htmlFor="student">Estudante</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="professional" id="professional" />
              <Label htmlFor="professional">Funcionário</Label>
            </div>
          </RadioGroup>
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
