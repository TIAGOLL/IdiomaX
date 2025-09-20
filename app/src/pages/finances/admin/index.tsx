import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSessionContext } from "@/contexts/session-context";
import { Skeleton } from "@/components/ui/skeleton";
import { SubscriptionForm } from "./components/subscription-form";
import { UpdateCompanyForm } from "./components/update-company-form";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router";

export default function AdminFinances() {
    const { currentCompanyMember, subscription, isLoadingSubscription } = useSessionContext();

    if (isLoadingSubscription || !currentCompanyMember) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    return (
        <div className="flex-1 max-w-11/12 mx-auto py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <Card className="col-span-1 sm:col-span-2">
                <CardHeader className="flex flex-row justify-between">
                    <div className="w-6/12">
                        <CardTitle>Minha assinatura</CardTitle>
                        <CardDescription>Para alterar método de pagamento, ver faturas ou alterar planos, clique em gerenciar assinatura</CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {subscription?.trial_end && `Renova em: ${new Date(subscription.trial_end).toLocaleDateString()}`}
                        {/* {subscription?.current_period_end && `Renova em: ${new Date(subscription.current_period_end).toLocaleDateString()}`} */}
                    </div>
                </CardHeader>
                <CardContent>
                    {!subscription ? (
                        <div>Nenhuma assinatura ativa.</div>
                    ) : (
                        <ul className="space-y-4">
                            <li key={subscription.id} className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <span className="font-semibold">{subscription.price?.product?.name}</span>
                                    <Badge className="ml-2" variant={subscription.status === "active" || subscription.status === "trialing" ? "default" : "destructive"}>
                                        {subscription.status == "active" && "Ativa"}
                                        {subscription.status == "trialing" && "Em teste"}
                                    </Badge>
                                    <div className="text-sm text-muted-foreground">
                                        R${(Number(subscription?.price?.unit_amount) / 100).toFixed(2)}
                                        {" "}/{" "}
                                        {subscription.price?.interval == "month" && "mês"}
                                        {subscription.price?.interval == "day" && "dia"}
                                        {subscription.price?.interval == "year" && "ano"}
                                        {subscription.price?.interval == "week" && "semana"}
                                    </div>
                                </div>
                                <Link
                                    to={import.meta.env.VITE_STRIPE_CUSTOMER_PORTAL_URL}
                                    className={buttonVariants({ variant: "outline" })}
                                    rel="noopener noreferrer"
                                >
                                    Gerenciar assinatura
                                </Link>
                            </li>
                        </ul>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Cliente Stripe</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <span className="font-semibold">E-mail:</span>
                        {subscription?.company_customer?.company?.email && <span>{subscription.company_customer.company.email}</span>}
                        {!subscription?.company_customer?.company?.email && <span className="text-muted-foreground">{" "}Nenhum e-mail cadastrado</span>}
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-3">
                <CardHeader className='flex space-x-4 flex-col justify-between sm:mx-6 sm:flex-row sm:items-center'>
                    <div className='flex-col'>
                        <CardTitle>
                            Dados da Empresa
                        </CardTitle>
                        <CardDescription>Atualize as informações da sua empresa</CardDescription>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                        Data de entrada: {subscription?.company_customer?.company?.created_at ? new Date(subscription.company_customer.company.created_at).toLocaleDateString() : '--'}
                    </div>
                </CardHeader>
                <CardContent>
                    <UpdateCompanyForm company={subscription?.company_customer?.company} />
                </CardContent>
            </Card>
        </div>
    );
}