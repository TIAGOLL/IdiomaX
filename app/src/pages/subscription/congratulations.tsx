import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function CongratulationsPage() {
    const navigate = useNavigate();

    return (
        <div className='flex m-auto min-w-screen justify-center min-h-screen items-center bg-slate-100 dark:bg-slate-600'>
            <Card className='w-[400px] sm:w-[500px] lg:w-[600px] xl:w-[700px] 2xl:w-[800px] p-6 shadow-lg'>
                <div className='mt-4 flex flex-col items-center justify-center'>
                    <img
                        src='/images/logo.png'
                        alt='Logo IdiomaX'
                        className='size-24'
                    />
                    <span
                        className='mt-2 text-3xl font-extrabold text-primary animate-glow shadow-primary'
                        style={{ fontFamily: 'Montserrat, sans-serif', letterSpacing: '2px' }}
                    >
                        IdiomaX
                    </span>
                </div>
                <CardHeader className='text-center'>
                    <CardTitle className='flex flex-col items-center gap-2'>
                        <CheckCircle2 className='text-green-500 h-10 w-10' />
                        Assinatura realizada com sucesso!
                    </CardTitle>
                    <CardDescription>
                        Obrigado por assinar o IdiomaX.<br />
                        Sua jornada para o domínio de idiomas começa agora.
                    </CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col items-center gap-2'>
                    <span className='text-lg font-semibold text-primary'>
                        Seja bem-vindo(a)!
                    </span>
                </CardContent>
                <CardFooter className='flex justify-center'>
                    <Button
                        variant='default'
                        onClick={() => navigate('/')}
                        data-test='goToDashboardButton'
                    >
                        Ir para o painel
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
