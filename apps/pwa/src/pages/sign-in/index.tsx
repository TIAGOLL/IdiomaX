import { Card, CardContent } from '@idiomax/ui/components/card';
import { ModeToggle } from '@idiomax/ui/components/mode-toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@idiomax/ui/components/tabs';
import { Info } from 'lucide-react';

import { SignInForm } from './components/sign-in-form.tsx';

function SignIn() {
  return (
    <div className='flex h-screen w-screen items-center justify-center bg-slate-100 dark:bg-slate-600'>
      <div className='absolute bottom-10 left-10'>
        <ModeToggle />
      </div>
      <Tabs defaultValue='auth' className='w-[calc(100vw-135px)] sm:max-w-[425px]'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='auth'>Login</TabsTrigger>
          <TabsTrigger value='forgotPassword'>Esqueci a senha</TabsTrigger>
        </TabsList>
        <TabsContent value='auth' data-test='tabAuth'>
          <SignInForm />
        </TabsContent>
        <TabsContent value='forgotPassword' data-test='tabForgotPassoword'>
          <Card className='flex h-[24rem] items-center justify-center'>
            <CardContent className='flex h-full flex-col items-center justify-around space-y-2'>
              <span className='flex flex-row items-center gap-2'>
                <Info /> Este recurso ainda não está disponível.
              </span>
              <span className='text-center font-semibold'>
                Caso precise mudar sua senha, entre em contato com a escola.
              </span>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SignIn;
