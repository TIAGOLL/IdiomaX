import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentMethodForm } from './components/payment-method-form';
import { useSessionContext } from "@/contexts/session-context";
import { Skeleton } from "@/components/ui/skeleton";
import { SubscriptionForm } from "./components/subscription-form";
import { UpdateCompanyForm } from "./components/update-company-form";

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
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle>Assinaturas Ativas</CardTitle>
                    <div className="text-sm text-muted-foreground">
                        Válida até: {subscription?.trial_end ? new Date(subscription.trial_end).toLocaleDateString("pt-BR") : "-"}
                        {subscription?.cancel_at_period_end && (
                            <span className="ml-2 text-red-500">(Cancelada ao final do período)</span>
                        )}
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
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    R${(Number(subscription?.price?.unit_amount) / 100).toFixed(2)}
                                    {" "}/{" "}
                                    {subscription.price?.interval == "month" && "mês"}
                                    {subscription.price?.interval == "day" && "dia"}
                                    {subscription.price?.interval == "year" && "ano"}
                                    {subscription.price?.interval == "week" && "semana"}
                                </div>
                            </li>
                        </ul>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Métodos de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* {data.paymentMethods.length === 0 ? (
                            <div>Nenhum método de pagamento cadastrado.</div>
                            ) : (
                            <ul className="space-y-2">
                                {data.paymentMethods.map((pm) => (
                                    <li key={pm.id} className="flex items-center gap-4">
                                        <span className="uppercase">{pm.brand}</span>
                                        <span>•••• {pm.last4}</span>
                                        <span>
                                            Expira {pm.exp_month}/{pm.exp_year}
                                        </span>
                                        </li>
                                        ))}
                            </ul>
                            )} */}
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

            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <PaymentMethodForm />
            </div>

            {subscription && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <SubscriptionForm data={subscription} />
                </div>
            )}
        </div>
    );
}