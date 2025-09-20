import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { createCheckoutSession } from "@/services/stripe/create-checkou-service";
import { createCheckoutSessionRequest } from '@idiomax/http-schemas/create-checkout-session';
import type z from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { getProducts } from "@/services/stripe/get-products";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { LoaderIcon } from "lucide-react";
import { useSessionContext } from "@/contexts/session-context";

type CreateCheckoutSessionRequest = z.infer<typeof createCheckoutSessionRequest>;

export function SubscriptionForm() {

    const navigate = useNavigate();

    const { getCompanyId } = useSessionContext();

    const {
        handleSubmit,
        setValue,
        watch,
    } = useForm<CreateCheckoutSessionRequest>({
        resolver: zodResolver(createCheckoutSessionRequest),
        mode: 'all',
        criteriaMode: 'all',
    });

    const { data: products, isLoading: isLoadingProducts } = useQuery({
        queryKey: ['products'],
        queryFn: async () => await getProducts(),
        retry: false,
    });

    const { mutate, isPending: isMutating } = useMutation({
        mutationFn: async ({ productId, companyId }: CreateCheckoutSessionRequest) => {
            const response = await createCheckoutSession({ productId, companyId });
            return response;
        },
        onSuccess: async (res) => {
            window.location.href = res.url;
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    useEffect(() => {
        setValue("productId", products?.[0]?.id || "");
        setValue("companyId", getCompanyId() || "");
    }, [navigate, products, getCompanyId, setValue]);

    return (
        <div className="bg-card border border-slate-200/10 rounded-xl shadow-lg p-8 flex flex-col items-center w-">
            <div className="mb-4 flex flex-col items-center">
                <img src="/images/logo.png" className='size-14' alt="" />
                <h2 className="text-2xl font-bold text-foreground mb-1">Assinatura necessária</h2>
                <p className="text-muted-foreground text-center text-sm">
                    Renove sua assinatura para continuar aproveitando todos os recursos.
                </p>
            </div>
            <form className="w-full mt-6" onSubmit={handleSubmit((data) => mutate(data))}>
                <div className="flex flex-wrap gap-4 items-center justify-center">
                    {products?.map((product) => (
                        <Card
                            key={product.id}
                            className={`w-80 cursor-pointer min-h-72 flex flex-col transition-all ${product.id === watch("productId") ? "ring-2 ring-primary" : "hover:ring-1"}`}
                            onClick={() => setValue("productId", product.id)}
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
                            <CardContent className="flex-1 flex flex-col">
                                <div className="text-3xl font-bold mb-1">
                                    {product.prices[0]?.unit_amount
                                        ? `R$ ${(Number(product.prices[0].unit_amount) / 100).toFixed(2)}`
                                        : "--"}
                                    <span className="text-base font-normal text-muted-foreground">
                                        {product.prices[0]?.interval === "year" ? " /ano" : " /mês"}
                                    </span>
                                </div>
                                <div className="text-muted-foreground">
                                    {product.description?.toLowerCase().includes("10%") && (
                                        <Badge>
                                            10% de desconto
                                        </Badge>
                                    )}
                                </div>
                                {product.prices[0]?.interval === "year" && (
                                    <div className="mt-4 text-sm">
                                        <span className="font-semibold">Parcelamento:</span>
                                        <div className="mt-1">
                                            {product.prices[0]?.unit_amount && (
                                                <span className="text-xs">
                                                    Até 12x de R$ {(Number(product.prices[0].unit_amount) / 100 / 12).toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="mt-auto">
                                <Button
                                    type="button"
                                    variant={product.id === watch("productId") ? "default" : "outline"}
                                    className="w-full"
                                    onClick={() => setValue("productId", product.id)}
                                >
                                    Selecionar
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <Button className='w-full mt-6' type="submit" disabled={isMutating || isLoadingProducts || !watch("productId")}>
                    {isMutating ? "Indo para o pagamento..." : "Assinar agora"}
                    {isMutating && <LoaderIcon className="animate-spin" />}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                    Precisa de ajuda? <a href="/contato" className="underline hover:text-primary">Fale conosco</a>
                </p>
            </form>
        </div>
    );
}