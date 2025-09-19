import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderIcon, Repeat } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { getCompanySubscriptionResponse } from '@idiomax/http-schemas/get-company-subscription';
import { getProducts } from '@/services/stripe/get-products';
import { createSubscriptionRequest } from '@idiomax/http-schemas/create-subscription';
import { UnsubscribeForm } from './unsubscribe-form';

type GetCompanySubscriptionResponse = z.infer<typeof getCompanySubscriptionResponse>;

type CreateSubscriptionRequest = z.infer<typeof createSubscriptionRequest>;

export function SubscriptionForm({ data }: { data: GetCompanySubscriptionResponse }) {

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<CreateSubscriptionRequest>({
        resolver: zodResolver(createSubscriptionRequest),
        mode: 'all',
        criteriaMode: 'all',
    });
    const selectedPriceId = watch("priceId");

    const { data: products } = useQuery({
        queryKey: ['subscriptionPlans'],
        queryFn: async () => getProducts(),
    })

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateSubscriptionRequest) => {
            await new Promise((r) => setTimeout(r, 1000));
        },
        onSuccess: () => {
            toast.success("Plano de assinatura atualizado!");
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Repeat className="inline mr-2" /> Alterar Plano de Assinatura
                </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit((data) => mutate(data))}>
                <CardContent className="flex flex-col gap-2">
                    <Label htmlFor="plan">Plano</Label>
                    {products?.map((product) => (
                        <Card
                            key={product.id}
                            className={`w-80 cursor-pointer transition-all ${product.prices[0]?.id === selectedPriceId ? "ring-2 ring-primary" : "hover:ring-1"}`}
                            onClick={() => setValue("priceId", product.prices[0]?.id)}
                            tabIndex={0}
                            role="button"
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {product.name}
                                    {product.description?.toLowerCase().includes("desconto") && (
                                        <span className="ml-2 px-2 py-0.5 rounded bg-primary text-white text-xs font-semibold">Desconto</span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold mb-1">
                                    {product.prices[0]?.unit_amount
                                        ? `R$ ${(Number(product.prices[0].unit_amount) / 100).toFixed(2)}`
                                        : "--"}
                                    <span className="text-base font-normal text-muted-foreground">
                                        {product.prices[0]?.interval === "year" ? " /ano" : " /mês"}
                                    </span>
                                </div>
                                <div className="text-muted-foreground mb-2">{product.description}</div>
                                <div className="text-xs text-muted-foreground">
                                    {product.prices[0]?.interval_count
                                        ? `Pagamento recorrente a cada ${product.prices[0].interval_count} ${product.prices[0].interval}`
                                        : ""}
                                </div>
                                {product.prices[0]?.interval === "year" && (
                                    <div className="mt-4 text-sm">
                                        <span className="font-semibold">Parcelamento:</span>
                                        <div className="mt-1">
                                            {Array.from({ length: 12 }).map((_, i) => (
                                                <div key={i} className="text-xs">
                                                    {i + 1}x de R$ {product.prices[0]?.unit_amount
                                                        ? (Number(product.prices[0].unit_amount) / 100 / (i + 1)).toFixed(2)
                                                        : "--"}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="button"
                                    variant={product.prices[0]?.id === selectedPriceId ? "default" : "outline"}
                                    className="w-full"
                                    onClick={() => setValue("priceId", product.prices[0]?.id)}
                                >
                                    Selecionar
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </CardContent>
                <CardFooter className="flex justify-between mt-5">
                    <UnsubscribeForm />
                    <Button type="submit" disabled={isPending}>
                        Salvar
                        {isPending && <LoaderIcon className="ml-2 h-4 w-4 animate-spin" />}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}