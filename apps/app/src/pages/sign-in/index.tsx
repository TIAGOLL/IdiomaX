import { ModeToggle } from '@idiomax/ui/components/mode-toggle';

import { SignInForm } from './components/sign-in-form';

function SignIn() {
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='absolute bottom-10 left-10'>
        <ModeToggle />
      </div>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2'>
          <a href='#' className='flex items-center gap-2 font-medium'>
            <div className='flex flex-col items-center justify-center'>
              <div className='dark:hidden'>
                <img src='/images/logo-without-bg.png' alt='Logo da loja' className='w-24' />
              </div>
              <div className='hidden dark:flex'>
                <img src='/images/logo-without-bg.png' alt='Logo da loja' className='w-24' />
              </div>
              <p
                className='text-primary font-[Tahoma] text-3xl font-extrabold tracking-widest antialiased'
                style={{ textShadow: '0px 0px 10px var(--primary)' }}>
                IdiomaX
              </p>
            </div>
          </a>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <SignInForm />
          </div>
        </div>
      </div>
      <div className='bg-muted relative hidden lg:block'>
        <img
          src='/placeholder.svg'
          alt='Image'
          className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        />
      </div>
    </div>
  );
}

export default SignIn;
