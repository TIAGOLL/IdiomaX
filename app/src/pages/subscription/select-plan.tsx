import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCheckoutSession } from "@/services/stripe/create-checkou-service";

const PLANS = [
    {
        id: "monthly",
        name: "Mensal",
        price: 79.90,
        description: "Assinatura mensal, cancele quando quiser.",
        details: "Pagamento recorrente mensal.",
        highlight: false,
    },
    {
        id: "anual",
        name: "Anual",
        price: 862.92,
        description: "Assinatura anual com 10% de desconto.",
        details: "Pode ser parcelado em até 12x sem juros.",
        highlight: true,
    },
];

export default function SelectPlan() {
    const [selected, setSelected] = useState<{ name: string; productId: string }>({ name: "monthly", productId: "prod_T4DTaGczK2y3Lj" });

    const { mutate } = useMutation({
        mutationFn: async (data: { productId: string }) => {
            const response = await createCheckoutSession(data)
            return response
        },
        onSuccess: async (res) => {
            window.location.href = res.url
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    async function create({ productId }: { productId: string }) {
        mutate({ productId })
    }


    return (
        <div className="flex flex-col items-center gap-8 m-auto">
            <h2 className="text-2xl font-bold mb-2">Escolha seu plano</h2>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Plano Mensal */}
                <Card
                    className={`w-80 cursor-pointer transition-all ${selected.name === "monthly" ? "ring-2 ring-primary" : "hover:ring-1"
                        }`}
                    onClick={() => setSelected({ name: "monthly", productId: "prod_T4DSuvomDey36U" })}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {PLANS[0].name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-1">
                            R$ {PLANS[0].price.toFixed(2)}
                            <span className="text-base font-normal text-muted-foreground"> /mês</span>
                        </div>
                        <div className="text-muted-foreground mb-2">{PLANS[0].description}</div>
                        <div className="text-xs text-muted-foreground">{PLANS[0].details}</div>
                    </CardContent>
                    <CardFooter>
                        <Button variant={selected.name === "monthly" ? "default" : "outline"} className="w-full">
                            Selecionar
                        </Button>
                    </CardFooter>
                </Card>

                {/* Plano Anual */}
                <Card
                    className={`w-80 cursor-pointer transition-all ${selected.name === "anual" ? "ring-2 ring-primary" : "hover:ring-1"
                        } ${PLANS[1].highlight ? "border-primary" : ""}`}
                    onClick={() => setSelected({ name: "anual", productId: "prod_T4DTaGczK2y3Lj" })}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {PLANS[1].name}
                            <span className="ml-2 px-2 py-0.5 rounded bg-primary text-white text-xs font-semibold">10% OFF</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-1">
                            R$ {PLANS[1].price.toFixed(2)}
                            <span className="text-base font-normal text-muted-foreground"> /ano</span>
                        </div>
                        <div className="text-muted-foreground mb-2">{PLANS[1].description}</div>
                        <div className="text-xs text-muted-foreground">{PLANS[1].details}</div>
                        <div className="mt-4 text-sm">
                            <span className="font-semibold">Parcelamento:</span>
                            <div className="mt-1">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="text-xs">
                                        {i + 1}x de R$ {(PLANS[1].price / (i + 1)).toFixed(2)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant={selected.name === "anual" ? "default" : "outline"} className="w-full">
                            Selecionar
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <Button className="mt-4" size="lg" disabled={!selected} onClick={() => create(selected)}>
                Continuar para o pagamento
            </Button>
        </div>
    );
}
