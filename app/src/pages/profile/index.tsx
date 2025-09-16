import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sidebar } from '@/components/side-bar';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useSession } from '@/hooks/use-session';
import { Info, LoaderIcon, Save } from 'lucide-react';
import { FormMessageError } from '@/components/ui/form-message-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const updateProfileSchema = z.object({
    name: z.string().min(3).max(256),
    cpf: z.string().min(11).max(11),
    phone: z.string().min(10).max(11),
    gender: z.string().min(1).max(1),
    date_of_birth: z.string(),
    address: z.string().min(1).max(255),
    avatar_url: z.url().max(256).optional(),
})

type ProfileFormSchema = z.infer<typeof updateProfileSchema>;

export default function ProfilePage() {

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: ProfileFormSchema) => {
            const response = await api.put('/users', data);
            return response.data;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            console.log(res);
        },
        onError: (err) => {
            console.log(err);
            toast.error(err.message);
        }
    });

    const { userProfile } = useSession();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset
    } = useForm<ProfileFormSchema>({
        resolver: zodResolver(updateProfileSchema),
        mode: 'all',
        criteriaMode: 'all',
    });

    useEffect(() => {
        if (userProfile) {
            reset({
                name: userProfile.name,
                cpf: userProfile.cpf,
                phone: userProfile.phone,
                gender: userProfile.gender,
                date_of_birth: userProfile.date_of_birth.slice(0, 10),
                address: userProfile.address,
                avatar_url: userProfile.avatar_url || undefined,
            });
        }
    }, [userProfile, reset]);


    async function updateProfile(data: ProfileFormSchema) {
        mutate(data);
    }

    return (
        <div className='flex justify-center min-h-screen items-center bg-slate-100 dark:bg-slate-600 sm:!w-screen'>
            <Sidebar />
            <Card className='w-10/12'>
                <form onSubmit={handleSubmit(updateProfile)} className='space-y-4'>
                    <CardHeader className='flex space-x-4 flex-col'>
                        <div className='flex-col'>
                            <CardTitle>
                                Meu Perfil
                            </CardTitle>
                            <CardDescription>Aqui você pode editar seus dados</CardDescription>
                        </div>
                        <Avatar className="rounded-xl justify-center items-center flex size-48">
                            <AvatarImage src={userProfile?.avatar_url || ''} />
                            <AvatarFallback>
                                <img src="/images/without-avatar.png" className='dark:invert' />
                            </AvatarFallback>
                        </Avatar>
                    </CardHeader>
                    <CardContent>
                        <div className="sm:grid flex flex-col sm:grid-cols-3 gap-4">
                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='name'>Nome</Label>
                                <Input type='text' id='name' {...register('name')} />
                                <FormMessageError error={errors.name?.message} />
                            </div>
                            <div className="col-span-2 space-y-1">
                                <Label htmlFor='email'>Email</Label>
                                <Input type='email' id='email' value={userProfile?.email} disabled />
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
                                    value={watch('gender')}
                                >
                                    <SelectTrigger id='gender' className='w-full' >
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
                                <Input type='date' id='date_of_birth'  {...register('date_of_birth')} />
                                <FormMessageError error={errors.date_of_birth?.message} />
                            </div>
                            <div className="col-span-1 space-y-1">
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
                                <Input type='text' id='username' disabled value={userProfile?.username} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className='flex justify-between flex-row-reverse'>
                        <Button
                            variant='default'
                            type='submit'
                            disabled={isPending}
                            data-test='profileSubmitButton'
                            onClick={() => { console.log(errors) }}
                        >
                            Salvar Alterações
                            {isPending ? (
                                <LoaderIcon className='ml-2 h-4 w-4 animate-spin' />
                            ) : (
                                <Save className='ml-2 h-4 w-4' />
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}