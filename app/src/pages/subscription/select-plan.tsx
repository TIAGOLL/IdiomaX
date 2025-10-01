// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { createSubscription } from "@/services/stripe/create-subscription";
// import { CreateSubscriptionFormSchema } from '@idiomax/validation-schemas/subscriptions/create-subscription';
// import type z from "zod";
// import { useNavigate } from "react-router";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useQuery } from "@tanstack/react-query";
// import { getProducts } from "@/services/stripe/get-products";
// import { useEffect } from "react";

// type CreateSubscriptionRequest = z.infer<typeof CreateSubscriptionFormSchema>;

// export default function SelectPlanPage() {
//     

//     return (
//         <form
//             className="flex flex-col items-center gap-8 m-auto"
//             onSubmit={handleSubmit((data) => mutate(data))}
//         >
//             <h2 className="text-2xl font-bold mb-2">Escolha seu plano</h2>
//             <div className="flex flex-col md:flex-row gap-8">
//                 {products.map((product) => (
//                     <Card
//                         key={product.id}
//                         className={`w-80 cursor-pointer transition-all ${product.prices[0]?.id === selectedPriceId ? "ring-2 ring-primary" : "hover:ring-1"}`}
//                         onClick={() => setValue("priceId", product.prices[0]?.id)}
//                         tabIndex={0}
//                         role="button"
//                     >
//                         <CardHeader>
//                             <CardTitle className="flex items-center gap-2">
//                                 {product.name}
//                                 {product.description?.toLowerCase().includes("desconto") && (
//                                     <span className="ml-2 px-2 py-0.5 rounded bg-primary text-white text-xs font-semibold">Desconto</span>
//                                 )}
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold mb-1">
//                                 {product.prices[0]?.unit_amount
//                                     ? `R$ ${(Number(product.prices[0].unit_amount) / 100).toFixed(2)}`
//                                     : "--"}
//                                 <span className="text-base font-normal text-muted-foreground">
//                                     {product.prices[0]?.recurring?.interval === "year" ? " /ano" : " /mês"}
//                                 </span>
//                             </div>
//                             <div className="text-muted-foreground mb-2">{product.description}</div>
//                             <div className="text-xs text-muted-foreground">
//                                 {product.prices[0]?.recurring?.interval_count
//                                     ? `Pagamento recorrente a cada ${product.prices[0].recurring.interval_count} ${product.prices[0].recurring.interval}`
//                                     : ""}
//                             </div>
//                             {product.prices[0]?.recurring?.interval === "year" && (
//                                 <div className="mt-4 text-sm">
//                                     <span className="font-semibold">Parcelamento:</span>
//                                     <div className="mt-1">
//                                         {Array.from({ length: 12 }).map((_, i) => (
//                                             <div key={i} className="text-xs">
//                                                 {i + 1}x de R$ {product.prices[0]?.unit_amount
//                                                     ? (Number(product.prices[0].unit_amount) / 100 / (i + 1)).toFixed(2)
//                                                     : "--"}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </CardContent>
//                         <CardFooter>
//                             <Button
//                                 type="button"
//                                 variant={product.prices[0]?.id === selectedPriceId ? "default" : "outline"}
//                                 className="w-full"
//                                 onClick={() => setValue("priceId", product.prices[0]?.id)}
//                             >
//                                 Selecionar
//                             </Button>
//                         </CardFooter>
//                     </Card>
//                 ))}
//             </div>
//             <Button
//                 className="mt-4"
//                 size="lg"
//                 type="submit"
//                 disabled={!selectedPriceId || isPending}
//             >
//                 Criar conta e assinar
//             </Button>
//             {errors.priceId && (
//                 <span className="text-red-500 text-sm">{errors.priceId.message}</span>
//             )}
//         </form>
//     );
// }


import { CircleCheck, Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/stripe/get-products";
import { useForm } from "react-hook-form";
import { CreateSubscriptionFormSchema } from "@idiomax/validation-schemas/subscriptions/create-subscription";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSubscription } from "@/services/stripe/create-subscription";
import { toast } from "sonner";
import { FormMessageError } from "@/components/ui/form-message-error";
import { Badge } from "@/components/ui/badge";
import type z from "zod";
import { getCurrentCompanyId } from "@/lib/company-utils";

type CreateSubscriptionFormSchema = z.infer<typeof CreateSubscriptionFormSchema>;

export function SelectPlanPage() {
    const navigate = useNavigate();

    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => await getProducts({}),
        retry: false,
    });

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(CreateSubscriptionFormSchema),
        mode: 'all',
        criteriaMode: 'all',
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateSubscriptionFormSchema) => {
            const response = await createSubscription({
                price_id: data.priceId,
                company_id: getCurrentCompanyId()
            })
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

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Carregando planos...</div>;
    }

    if (!products || products.length === 0) {
        return <div className="flex justify-center items-center h-64">Nenhum plano disponível.</div>;
    }

    return (
        <form onSubmit={handleSubmit((data) => mutate(data))} className="m-auto">
            <div className="container">
                <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
                    <h2 className="text-4xl font-semibold text-pretty lg:text-6xl">
                        Preços
                    </h2>
                    <div className="flex flex-col items-stretch gap-6 md:flex-row">
                        {products.map((product) => (
                            <Card
                                onClick={() => setValue("priceId", product.prices[0]?.id)}
                                key={product.id}
                                className={`cursor-pointer flex w-80 flex-col justify-between text-left ${product.prices[0]?.id === watch('priceId') ? 'border-2 border-primary' : ''}`}>
                                <CardHeader>
                                    <CardTitle>
                                        <p>{product.name}</p>
                                    </CardTitle>
                                    <Badge>
                                        {product.description}
                                    </Badge>
                                    <div className="flex items-end">
                                        <span className="text-4xl font-semibold">
                                            {product.prices[0]?.unit_amount
                                                ? `R$ ${(Number(product.prices[0].unit_amount) / 100).toFixed(2)}`
                                                : "--"}
                                        </span>
                                        <span className="text-2xl font-semibold text-muted-foreground">
                                            {product.prices[0]?.recurring?.interval === "year" ? "/ano" : "/mês"}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Separator className="mb-6" />
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-2">
                                            <CircleCheck className="size-4 text-primary" />
                                            <span className="text-sm">Gestão completa de estudantes</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CircleCheck className="size-4 text-primary" />
                                            <span className="text-sm">Controle de matrículas e mensalidades</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CircleCheck className="size-4 text-primary" />
                                            <span className="text-sm">Dashboard administrativo avançado</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CircleCheck className="size-4 text-primary" />
                                            <span className="text-sm">Organização de cursos e turmas</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CircleCheck className="size-4 text-primary" />
                                            <span className="text-sm">Controle de presença e frequência</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CircleCheck className="size-4 text-primary" />
                                            <span className="text-sm">Gestão de professores e horários</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CircleCheck className="size-4 text-primary" />
                                            <span className="text-sm">Sistema de tarefas e materiais</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CircleCheck className="size-4 text-primary" />
                                            <span className="text-sm">Controle de acesso com permissões</span>
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter className="mt-auto">
                                    <Button
                                        className="w-full"
                                        onClick={() => setValue("priceId", product.prices[0]?.id || "")}
                                        variant="default"
                                    >
                                        Comprar
                                        {isPending && <Loader className="ml-2 size-4 animate-spin" />}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}

                        <FormMessageError error={errors?.priceId?.message} />
                    </div>
                </div>
            </div>
        </form>
    );
};
