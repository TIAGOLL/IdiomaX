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
