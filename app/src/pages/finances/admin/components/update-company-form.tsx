import { useEffect } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { LoaderIcon, Save } from 'lucide-react';
import { FormMessageError } from '@/components/ui/form-message-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UpdateCompanyFormSchema } from '@idiomax/http-schemas/companies/update-company';
import type { UpdateCompanyHttpRequest } from '@idiomax/http-schemas/companies/update-company';
import type { GetCompanyByIdHttpResponse } from '@idiomax/http-schemas/companies/get-company-by-id';
import { useSessionContext } from '@/contexts/session-context';

type UpdateCompanyFormData = z.infer<typeof UpdateCompanyFormSchema>;

export function UpdateCompanyForm({ company }: { company: GetCompanyByIdHttpResponse['company'] }) {
    const { currentCompanyMember } = useSessionContext();
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: UpdateCompanyHttpRequest) => {
            const response = await api.put('/companies', data);
            return response.data;
        },
        onSuccess: (res) => {
            toast.success(res.message);
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateCompanyFormData>({
        resolver: zodResolver(UpdateCompanyFormSchema),
        mode: 'all',
        criteriaMode: 'all',
    });

    useEffect(() => {
        if (company && currentCompanyMember) {
            reset({
                name: company.name,
                description: company.description || '',
                website: company.website || '',
                phone: company.phone || '',
                address: company.address || '',
            });
        }
    }, [company, currentCompanyMember, reset]);

    if (!company) return

    return (
        <form onSubmit={handleSubmit((data) => {
            const updateData: UpdateCompanyHttpRequest = {
                id: currentCompanyMember!.company.id,
                ...data
            };
            mutate(updateData);
        })} className='space-y-4'>
            <CardContent>
                <div className="sm:grid flex flex-col sm:grid-cols-3 gap-4">
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='name'>Nome</Label>
                        <Input type='text' id='name' {...register('name')} />
                        <FormMessageError error={errors.name?.message} />
                    </div>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='phone'>Telefone</Label>
                        <Input type='text' id='phone' {...register('phone')} />
                        <FormMessageError error={errors.phone?.message} />
                    </div>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='website'>Website</Label>
                        <Input type='url' id='website' {...register('website')} />
                        <FormMessageError error={errors.website?.message} />
                    </div>
                    <div className="col-span-3 space-y-1">
                        <Label htmlFor='address'>Endereço</Label>
                        <Input type='text' id='address' {...register('address')} />
                        <FormMessageError error={errors.address?.message} />
                    </div>
                    <div className="col-span-3 space-y-1">
                        <Label htmlFor='description'>Descrição</Label>
                        <Input type='text' id='description' {...register('description')} />
                        <FormMessageError error={errors.description?.message} />
                    </div>
                </div>
            </CardContent>
            <CardFooter className='flex justify-between flex-row-reverse'>
                <Button
                    variant='default'
                    type='submit'
                    disabled={isPending}
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
    );
}