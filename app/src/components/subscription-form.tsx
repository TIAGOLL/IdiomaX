import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { createCheckoutSession } from "@/services/stripe/create-checkou-service";
import { CreateCheckoutSessionFormSchema } from '@idiomax/http-schemas/subscriptions/create-checkout-session';
import type z from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { getProducts } from "@/services/stripe/get-products";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { LoaderIcon } from "lucide-react";
import { useSessionContext } from "@/contexts/session-context";

type CreateCheckoutSessionFormData = z.infer<typeof CreateCheckoutSessionFormSchema>;

export function SubscriptionForm() {
    const { getCompanyId, userProfile } = useSessionContext();
    const [selectedPriceId, setSelectedPriceId] = useState<string>("");

    const {
        handleSubmit,
        setValue,
    } = useForm<CreateCheckoutSessionFormData>({
        resolver: zodResolver(CreateCheckoutSessionFormSchema),
        mode: 'all',
        criteriaMode: 'all',
    });

    const { data: products, isLoading: isLoadingProducts } = useQuery({
        queryKey: ['products'],
        queryFn: async () => await getProducts(),
        retry: false,
    });

    const { mutate, isPending: isMutating } = useMutation({
        mutationFn: async ({ priceId }: CreateCheckoutSessionFormData) => {
            const response = await createCheckoutSession({
                price_id: priceId,
                company_id: getCompanyId() || "",
                user_id: userProfile?.id || "",
                mode: "subscription"
            });
            return response;
        },
        onSuccess: async (res) => {
            window.location.href = res.checkout_url;
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    const onSubmit = (data: CreateCheckoutSessionFormData) => {
        mutate(data);
    };

    useEffect(() => {
        if (products && products.length > 0 && products[0].prices.length > 0) {
            const firstPriceId = products[0].prices[0].id;
            setValue("priceId", firstPriceId);
            setSelectedPriceId(firstPriceId);
        }
    }, [products, setValue]);

    if (isLoadingProducts) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <LoaderIcon className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                    product.prices.map((price) => (
                        <Card
                            key={price.id}
                            className={`cursor-pointer transition-all ${price.id === selectedPriceId ? "ring-2 ring-primary" : "hover:ring-1"
                                }`}
                            onClick={() => {
                                setValue("priceId", price.id);
                                setSelectedPriceId(price.id);
                            }}
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    {product.name}
                                    {price.recurring?.interval === "year" && (
                                        <Badge variant="secondary">Anual</Badge>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    R$ {(price.unit_amount / 100).toFixed(2)}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        {price.recurring?.interval === "year" ? " /ano" : " /mês"}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {product.description}
                                </p>
                                {price.recurring?.interval === "year" && (
                                    <div className="mt-4">
                                        <Badge variant="outline" className="text-green-600">
                                            Economize 20%
                                        </Badge>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="button"
                                    className="w-full"
                                    variant={price.id === selectedPriceId ? "default" : "outline"}
                                    onClick={() => {
                                        setValue("priceId", price.id);
                                        setSelectedPriceId(price.id);
                                    }}
                                >
                                    {price.id === selectedPriceId ? "Selecionado" : "Selecionar"}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ))}
            </div>

            <Button
                className='w-full mt-6'
                type="submit"
                disabled={isMutating || isLoadingProducts || !selectedPriceId}
                size="lg"
            >
                {isMutating ? (
                    <>
                        <LoaderIcon className="animate-spin mr-2" size={16} />
                        Processando...
                    </>
                ) : (
                    "Assinar Plano"
                )}
            </Button>
        </form>
    );
}