
import { ModeToggle } from '@/components/ui/mode-toggle.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignInForm } from './components/sign-in-form';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { tokenDecode } from '@/lib/token-decode';
import nookies from 'nookies';
import { RequestPasswordRecoverForm } from './components/request-password-recover-form';

function SignIn() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = nookies.get(null, 'token').token;
    if (token) {
      const decoded = tokenDecode(token);
      if (decoded?.profile.role === 'student') {
        navigate('/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    }
  }, []);

  return (
    <div className='flex h-screen w-screen items-center justify-center bg-slate-100 dark:bg-slate-600'>
      <div className='absolute bottom-10 left-10'>
        <ModeToggle />
      </div>
      <Tabs defaultValue='auth' className='w-[calc(100vw-135px)] sm:max-w-[425px]'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='auth'>Login</TabsTrigger>
          <TabsTrigger value='request-password-recover'>Esqueci a senha</TabsTrigger>
        </TabsList>
        <TabsContent value='auth' data-test='tabAuth'>
          <SignInForm />
        </TabsContent>
        <TabsContent value='request-password-recover' data-test='tabForgotPassoword'>
          <RequestPasswordRecoverForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SignIn;
