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
import { useSearchParams } from 'react-router';
import { putCompanyRequest } from '@idiomax/http-schemas/put-company';
import { getCompanyByIdResponse } from '@idiomax/http-schemas/get-company-by-id';

type GetCompanyByIdResponse = z.infer<typeof getCompanyByIdResponse>;
type PutCompanyRequest = z.infer<typeof putCompanyRequest>;

export function UpdateCompanyForm({ company }: { company: GetCompanyByIdResponse }) {

    const [searchParams] = useSearchParams();
    const companyId = searchParams.get("companyId");
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: PutCompanyRequest) => {
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
    } = useForm<PutCompanyRequest>({
        resolver: zodResolver(putCompanyRequest),
        mode: 'all',
        criteriaMode: 'all',
    });

    useEffect(() => {
        if (company && companyId) {
            reset({
                id: companyId,
                name: company.name,
                cnpj: company.cnpj,
                phone: company.phone,
                email: company.email || null,
                logo_16x16_url: company.logo_16x16_url || null,
                logo_512x512_url: company.logo_512x512_url || null,
                social_reason: company.social_reason || null,
                state_registration: company.state_registration || null,
                tax_regime: company.tax_regime || null,
                address: company.address,
            });
        }
    }, [company, reset, companyId]);

    if (isPending) return <LoaderIcon className='ml-2 h-4 w-4 animate-spin' />;

    return (
        <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4'>
            <CardContent>
                <div className="sm:grid flex flex-col sm:grid-cols-3 gap-4">
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='name'>Nome</Label>
                        <Input type='text' id='name' {...register('name')} />
                        <FormMessageError error={errors.name?.message} />
                    </div>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='cnpj'>CNPJ</Label>
                        <Input type='text' id='cnpj' {...register('cnpj')} />
                        <FormMessageError error={errors.cnpj?.message} />
                    </div>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='phone'>Telefone</Label>
                        <Input type='text' id='phone' {...register('phone')} />
                        <FormMessageError error={errors.phone?.message} />
                    </div>
                    <div className="col-span-3 space-y-1">
                        <Label htmlFor='address'>Endereço</Label>
                        <Input type='text' id='address' {...register('address')} />
                        <FormMessageError error={errors.address?.message} />
                    </div>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='email'>Email</Label>
                        <Input id='email' {...register('email')} />
                        <FormMessageError error={errors.email?.message} />
                    </div>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='logo_16x16_url'>Logo 16x16 URL</Label>
                        <Input type='url' id='logo_16x16_url' {...register('logo_16x16_url')} />
                        <FormMessageError error={errors.logo_16x16_url?.message} />
                    </div>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='logo_512x512_url'>Logo 512x512 URL</Label>
                        <Input type='url' id='logo_512x512_url' {...register('logo_512x512_url')} />
                        <FormMessageError error={errors.logo_512x512_url?.message} />
                    </div>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='social_reason'>Razão Social</Label>
                        <Input type='text' id='social_reason' {...register('social_reason')} />
                        <FormMessageError error={errors.social_reason?.message} />
                    </div>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='state_registration'>Inscrição Estadual</Label>
                        <Input type='text' id='state_registration' {...register('state_registration')} />
                        <FormMessageError error={errors.state_registration?.message} />
                    </div>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor='tax_regime'>Regime Tributário</Label>
                        <Input type='text' id='tax_regime' {...register('tax_regime')} />
                        <FormMessageError error={errors.tax_regime?.message} />
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