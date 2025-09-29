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
import { LoaderIcon, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { createCompany } from '@/services/companies/create-company';
import { CreateCompanyFormSchema } from '@idiomax/validation-schemas/companies/create-company';

type CreateCompanyRequest = z.infer<typeof CreateCompanyFormSchema>;

export function CreateCompanyPage() {
    const navigate = useNavigate();
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateCompanyRequest) => {
            const response = await createCompany(data);
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            navigate(`/auth/select-plan?companyId=${res.companyId}`);
        },
        onError: (err) => {
            console.log(err);
            toast.error(err.message);
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateCompanyRequest>({
        resolver: zodResolver(CreateCompanyFormSchema),
        mode: 'all',
        criteriaMode: 'all',
        defaultValues: {
            name: 'Empresa Teste',
            cnpj: '12345458000199',
            address: 'Av. Paulista, 1000',
            phone: '42984066200',
        }
    });

    return (
        <Card className='flex justify-center items-center sm:w-full'>
            <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4 min-w-4/12'>
                <CardHeader className='flex items-center space-x-4'>
                    <div className='flex flex-col items-center justify-center'>
                        <img src='/images/logo.png' alt='Logo da loja' className='size-12' />
                    </div>
                    <div className='flex-col'>
                        <CardTitle>
                            Cadastro da Instituição
                        </CardTitle>
                        <CardDescription>Preencha os dados da instituição.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className='grid grid-cols-2 gap-4'>
                    <div className="col-span-2 space-y-1">
                        <Label htmlFor='name'>Nome da empresa</Label>
                        <Input type='text' id='name' {...register('name')} />
                        <FormMessageError error={errors.name?.message} />
                    </div>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='cnpj'>CNPJ</Label>
                        <Input type='text' id='cnpj' {...register('cnpj')} />
                        <FormMessageError error={errors.cnpj?.message} />
                    </div>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='address'>Endereço</Label>
                        <Input type='text' id='address' {...register('address')} />
                        <FormMessageError error={errors.address?.message} />
                    </div>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='phone'>Telefone</Label>
                        <Input type='text' id='phone' {...register('phone')} />
                        <FormMessageError error={errors.phone?.message} />
                    </div>
                </CardContent>
                <CardFooter className='flex justify-between flex-row-reverse'>
                    <Button
                        variant='default'
                        type='submit'
                        disabled={isPending}
                        data-test='signUpSubmitButton'>
                        Continuar
                        {isPending ? (
                            <LoaderIcon className='ml-2 h-4 w-4 animate-spin' />
                        ) : (
                            <LogIn className='ml-2 h-4 w-4' />
                        )}
                    </Button>
                    <Button variant='ghost' type='button' onClick={() => navigate('/auth/sign-in')} className='ml-4'>
                        Já possuo uma conta
                    </Button>
                </CardFooter>
            </form>
        </Card >
    );
}
