import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { Info, LoaderIcon, Save } from 'lucide-react';
import { FormMessageError } from '@/components/ui/form-message-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSessionContext } from '@/contexts/session-context';
import { UpdateUserFormSchema } from '@idiomax/http-schemas/users/update-user';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { updateUser } from '@/services/users/update-user';

type UpdateUserFormSchema = z.infer<typeof UpdateUserFormSchema>;

export default function ProfilePage() {

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: UpdateUserFormSchema) => {
            const response = await updateUser({
                ...data,
                id: userProfile?.id || '',
                companyId: getCurrentCompanyId()
            });
            return response;
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

    const { userProfile, isLoadingUserProfile } = useSessionContext();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        control,
        reset
    } = useForm<UpdateUserFormSchema>({
        resolver: zodResolver(UpdateUserFormSchema),
        mode: 'all',
        criteriaMode: 'all',
    });

    useEffect(() => {
        if (userProfile) {
            reset({
                name: userProfile.name,
                cpf: userProfile.cpf,
                gender: userProfile.gender,
                address: userProfile.address,
                phone: userProfile.phone,
                date_of_birth: userProfile.date_of_birth ? new Date(userProfile.date_of_birth) : new Date(),
                username: userProfile.username,
                email: userProfile.email,
                avatar_url: userProfile.avatar_url,
            });
        }
    }, [userProfile, reset]);

    if (isLoadingUserProfile || !userProfile || !watch("gender")) return <LoaderIcon className='ml-2 h-4 w-4 animate-spin' />;

    return (
        <div className='flex justify-center items-center w-full p-6'>
            <Card className='w-full'>
                <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4'>
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
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value ?? undefined}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger id='gender' className='w-full'>
                                                <SelectValue placeholder="Selecione o gênero" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="M">Masculino</SelectItem>
                                                <SelectItem value="F">Feminino</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FormMessageError error={errors.gender?.message} />
                            </div>
                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='phone'>Telefone</Label>
                                <Input type='text' id='phone' {...register('phone')} />
                                <FormMessageError error={errors.phone?.message} />
                            </div>
                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='date_of_birth'>Data de nascimento</Label>
                                <Controller
                                    name="date_of_birth"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type='date'
                                            id='date_of_birth'
                                            value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                            onChange={(e) => {
                                                // Converte string do input para Date object para enviar à API
                                                const dateValue = e.target.value ? new Date(e.target.value) : undefined;
                                                field.onChange(dateValue);
                                            }}
                                        />
                                    )}
                                />
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
                            onClick={() => { console.log(watch("gender")) }}
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