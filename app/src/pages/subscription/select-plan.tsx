import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSubscription } from "@/services/stripe/create-subscription";
import { createSubscriptionRequest } from '@idiomax/http-schemas/create-subscription';
import type z from "zod";
import { useNavigate, useSearchParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/stripe/get-products";
import { useEffect } from "react";

type CreateSubscriptionRequest = z.infer<typeof createSubscriptionRequest>;

export default function SelectPlanPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => await getProducts(),
        retry: false,
    });

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

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateSubscriptionRequest) => {
            const response = await createSubscription(data)
            return response
        },
        onSuccess: async (res) => {
            toast.success(res.message);
            navigate('/congratulations')
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    useEffect(() => {
        setValue("priceId", products?.[0]?.prices[0]?.id || "");
        setValue("companyId", searchParams.get("companyId") || "");
    }, [navigate, products, searchParams, setValue]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Carregando planos...</div>;
    }

    if (!products || products.length === 0) {
        return <div className="flex justify-center items-center h-64">Nenhum plano disponível.</div>;
    }

    return (
        <form
            className="flex flex-col items-center gap-8 m-auto"
            onSubmit={handleSubmit((data) => mutate(data))}
        >
            <h2 className="text-2xl font-bold mb-2">Escolha seu plano</h2>
            <div className="flex flex-col md:flex-row gap-8">
                {products.map((product) => (
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
            </div>
            <Button
                className="mt-4"
                size="lg"
                type="submit"
                disabled={!selectedPriceId || isPending}
            >
                Criar conta e assinar
            </Button>
            {errors.priceId && (
                <span className="text-red-500 text-sm">{errors.priceId.message}</span>
            )}
        </form>
    );
}