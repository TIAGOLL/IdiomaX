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
import { LoaderIcon, LogIn, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router';
import nookies from 'nookies';
import { signUpWithPassword } from '@/services/auth/sign-up-with-password';

const signUpFormSchema = z.object({
    name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }).max(256),
    email: z.email({ message: 'Email inválido.' }).min(3, { message: 'Email deve ter pelo menos 3 caracteres.' }).max(256),
    username: z.string().min(3, { message: 'Nome de usuário deve ter pelo menos 3 caracteres.' }).max(100),
    cpf: z.string().min(11, { message: 'CPF deve ter 11 caracteres.' }).max(11),
    phone: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 caracteres.' }).max(11),
    gender: z.string().min(1, { message: 'Gênero é obrigatório.' }).max(1),
    date_of_birth: z.date().refine((date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const month = today.getMonth() - date.getMonth();
        const day = today.getDate() - date.getDate();
        return age > 18 || (age === 18 && (month > 0 || (month === 0 && day >= 0)));
    }, { message: 'Você deve ter pelo menos 18 anos.' }),
    address: z.string().min(1, { message: 'Endereço é obrigatório.' }).max(255),
    password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' }).max(128),
    company: z.object({
        name: z.string().min(3, { message: 'Nome da empresa deve ter pelo menos 3 caracteres.' }).max(256),
        cnpj: z.string().min(14, { message: 'CNPJ deve ter 14 caracteres.' }).max(14),
        address: z.string().min(1, { message: 'Endereço da empresa é obrigatório.' }).max(256),
        phone: z.string().min(10, { message: 'Telefone da empresa deve ter pelo menos 10 caracteres.' }).max(15),
    }),
});

type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

export function SignUpForm() {
    const navigate = useNavigate();
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: SignUpFormSchema) => {
            const response = await signUpWithPassword(data);
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            nookies.set(null, "token", res.token, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days 
            });
            navigate('/select-plan');
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
        watch,
        setValue
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(signUpFormSchema),
        mode: 'all',
        criteriaMode: 'all',
        defaultValues: {
            name: 'João da Silva',
            email: 'joao.silva@email.com',
            username: 'joaosilva',
            cpf: '12345458901',
            phone: '11999999999',
            gender: 'M',
            date_of_birth: new Date('2000-01-01'),
            address: 'Rua das Flores, 123',
            password: 'senha123',
            company: {
                name: 'Empresa Teste',
                cnpj: '12345458000199',
                address: 'Av. Paulista, 1000',
                phone: '42984066200',
            },
        }
    });

    async function SignUp(data: SignUpFormSchema) {
        mutate(data);
    }

    return (
        <Card className='w-10/12'>
            <form onSubmit={handleSubmit(SignUp)} className='space-y-4'>
                <CardHeader className='flex items-center space-x-4'>
                    <div className='flex flex-col items-center justify-center'>
                        <img src='/images/logo.png' alt='Logo da loja' className='size-12' />
                    </div>
                    <div className='flex-col'>
                        <CardTitle>
                            Cadastro
                        </CardTitle>
                        <CardDescription>Preencha seus dados e os da instituição.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div
                        className="sm:grid flex flex-col sm:grid-cols-3 gap-4"
                    >
                        {/* Dados do usuário */}
                        <div className='col-span-3 mt-4 font-bold'>Dados do usuário</div>
                        <div className="col-span-1 space-y-1">
                            <Label htmlFor='name'>Nome</Label>
                            <Input type='text' id='name' {...register('name')} />
                            <FormMessageError error={errors.name?.message} />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <Label htmlFor='email'>Email</Label>
                            <Input type='email' id='email' {...register('email')} />
                            <FormMessageError error={errors.email?.message} />
                        </div>
                        <div className="col-span-1 space-y-1">
                            <Label htmlFor='cpf'>CPF</Label>
                            <Input type='text' id='cpf' {...register('cpf')} />
                            <FormMessageError error={errors.cpf?.message} />
                        </div>
                        <div className="col-span-1 space-y-1 w-full">
                            <Label htmlFor='gender'>Gênero</Label>
                            <Select
                                onValueChange={value => {
                                    setValue('gender', value);
                                }}
                                defaultValue={watch('gender')}
                            >
                                <SelectTrigger id='gender' className='w-full'>
                                    <SelectValue placeholder="Selecione o gênero" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="M">Masculino</SelectItem>
                                    <SelectItem value="F">Feminino</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessageError error={errors.gender?.message} />
                        </div>
                        <div className="col-span-1 space-y-1">
                            <Label htmlFor='phone'>Telefone</Label>
                            <Input type='text' id='phone' {...register('phone')} />
                            <FormMessageError error={errors.phone?.message} />
                        </div>
                        <div className="col-span-1 space-y-1">
                            <Label htmlFor='date_of_birth'>Data de nascimento</Label>
                            <Input type='date' id='date_of_birth' {...register('date_of_birth', { valueAsDate: true })} />
                            <FormMessageError error={errors.date_of_birth?.message} />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <Label htmlFor='address'>Endereço</Label>
                            <Input type='text' id='address' {...register('address')} />
                            <FormMessageError error={errors.address?.message} />
                        </div>
                        <div className="col-span-1 space-y-1">
                            <div className='flex gap-3'>
                                <Label htmlFor='username'>Usuário</Label>
                                <Tooltip>
                                    <TooltipTrigger><Info className='size-4' /></TooltipTrigger>
                                    <TooltipContent>
                                        <p>Você usará esse nome para fazer login.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <Input type='text' id='username' {...register('username')} />
                            <FormMessageError error={errors.username?.message} />
                        </div>
                        <div className="col-span-1 space-y-1">
                            <Label htmlFor='password'>Senha</Label>
                            <Input type='password' id='password' {...register('password')} />
                            <FormMessageError error={errors.password?.message} />
                        </div>

                        {/* Dados da empresa */}
                        <div className='col-span-3 mt-4 font-bold'>Dados da Instituição</div>
                        <div className="col-span-2 space-y-1">
                            <Label htmlFor='company.name'>Nome da empresa</Label>
                            <Input type='text' id='company.name' {...register('company.name')} />
                            <FormMessageError error={errors.company?.name?.message} />
                        </div>
                        <div className="col-span-1 space-y-1">
                            <Label htmlFor='company.cnpj'>CNPJ</Label>
                            <Input type='text' id='company.cnpj' {...register('company.cnpj')} />
                            <FormMessageError error={errors.company?.cnpj?.message} />
                        </div>
                        <div className="col-span-1 space-y-1">
                            <Label htmlFor='company.address'>Endereço</Label>
                            <Input type='text' id='company.address' {...register('company.address')} />
                            <FormMessageError error={errors.company?.address?.message} />
                        </div>
                        <div className="col-span-1 space-y-1">
                            <Label htmlFor='company.phone'>Telefone</Label>
                            <Input type='text' id='company.phone' {...register('company.phone')} />
                            <FormMessageError error={errors.company?.phone?.message} />
                        </div>
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
        </Card>
    );
}
