import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderIcon, CreditCard } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

// Exemplo de schema, ajuste conforme necessário
const paymentMethodSchema = z.object({
    cardNumber: z.string().min(12, "Número do cartão inválido"),
    expMonth: z.string().min(1, "Mês inválido"),
    expYear: z.string().min(2, "Ano inválido"),
    cvc: z.string().min(3, "CVC inválido"),
});

type PaymentMethodForm = z.infer<typeof paymentMethodSchema>;

export function PaymentMethodForm({ onSuccess }: { onSuccess?: () => void }) {
    const { register, handleSubmit, formState: { errors } } = useForm<PaymentMethodForm>({
        resolver: zodResolver(paymentMethodSchema),
        mode: 'all',
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: PaymentMethodForm) => {
            // Chame sua API para atualizar método de pagamento
            // await updatePaymentMethod(data);
            await new Promise((r) => setTimeout(r, 1000)); // Simulação
        },
        onSuccess: () => {
            toast.success("Método de pagamento atualizado!");
            onSuccess?.();
        },
        onError: (err: any) => {
            toast.error(err.message || "Erro ao atualizar método de pagamento.");
        }
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <CreditCard className="inline mr-2" /> Atualizar Método de Pagamento
                </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit((data) => mutate(data))}>
                <CardContent className="flex flex-col gap-2">
                    <div>
                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                        <Input type="text" {...register('cardNumber')} />
                        <FormMessageError error={errors.cardNumber?.message} />
                    </div>
                    <div className="flex gap-2">
                        <div>
                            <Label htmlFor="expMonth">Mês</Label>
                            <Input type="text" {...register('expMonth')} placeholder="MM" />
                            <FormMessageError error={errors.expMonth?.message} />
                        </div>
                        <div>
                            <Label htmlFor="expYear">Ano</Label>
                            <Input type="text" {...register('expYear')} placeholder="AA" />
                            <FormMessageError error={errors.expYear?.message} />
                        </div>
                        <div>
                            <Label htmlFor="cvc">CVC</Label>
                            <Input type="text" {...register('cvc')} />
                            <FormMessageError error={errors.cvc?.message} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        Salvar
                        {isPending && <LoaderIcon className="ml-2 h-4 w-4 animate-spin" />}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}