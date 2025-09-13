
import { Card, CardContent } from '@/components/ui/card';
import { SignUpForm } from './components/sign-up-form';

export function SignUp() {
    return (
        <div className='flex justify-center min-h-screen items-center bg-slate-100 dark:bg-slate-600 sm:!w-screen'>
            <CardContent className='max-w-sm !p-0 flex-col w-[600px] flex justify-center items-center md:w-screen sm:max-w-11/12'>
                <SignUpForm />
            </CardContent>
        </div>
    );
}