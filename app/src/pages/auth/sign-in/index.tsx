
import { ModeToggle } from '@/components/ui/mode-toggle.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignInForm } from './components/sign-in-form';
import { RequestPasswordRecoverForm } from './components/request-password-recover-form';
import { Link } from 'react-router';
import { buttonVariants } from '@/components/ui/button';
import { Building } from 'lucide-react';

export function SignInPage() {

  return (
    <div className='relative flex justify-center min-h-screen items-center sm:!w-screen bg-cover bg-right bg-no-repeat' style={{ backgroundImage: "url('/images/bg2.png')" }}>
      <div className='absolute inset-0 bg-black/70 z-0' />

      <Link to='/auth/sign-up' className={`${buttonVariants({ variant: "outline" })} absolute top-10 left-10 z-10`}>
        <Building className='mr-1 h-4 w-4' />
        Cadastrar minha empresa
      </Link>
      <div className='absolute bottom-10 left-10 z-10'>
        <ModeToggle />
      </div>
      <Tabs defaultValue='auth' className='w-[calc(100vw-135px)] sm:max-w-[425px] z-10'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='auth'>Autenticação</TabsTrigger>
          <TabsTrigger value='request-password-recover'>Esqueci a senha</TabsTrigger>
        </TabsList>
        <TabsContent value='auth' data-test='tabAuth'>
          <SignInForm />
        </TabsContent>
        <TabsContent value='request-password-recover' data-test='tabForgotPassword'>
          <RequestPasswordRecoverForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

