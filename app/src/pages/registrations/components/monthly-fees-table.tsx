import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { registerMonthlyFeePayment } from '@/services/registrations/register-monthly-fee-payment';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { LoaderIcon } from 'lucide-react';
import type { GetRegistrationByIdResponseType } from '@idiomax/validation-schemas/registrations';

type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'CASH';

export function MonthlyFeesTable({ registration }: { registration: GetRegistrationByIdResponseType }) {
    const queryClient = useQueryClient();
    const [selectedFee, setSelectedFee] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ monthlyFeeId, paidAmount, payment_method }: {
            monthlyFeeId: string;
            paidAmount: number;
            payment_method: PaymentMethod;
        }) => {
            const response = await registerMonthlyFeePayment({
                monthly_fee_id: monthlyFeeId,
                registration_id: registration.id,
                company_id: getCurrentCompanyId(),
                paid_amount: paidAmount,
                payment_method
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['registration', registration.id] });
            setSelectedFee(null);
        },
        onError: (err) => {
            console.log(err);
            toast.error(err.message);
        }
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'default';
            case 'PENDING':
                return 'secondary';
            case 'OVERDUE':
                return 'destructive';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'Pago';
            case 'PENDING':
                return 'Pendente';
            case 'OVERDUE':
                return 'Atrasado';
            default:
                return status;
        }
    };

    return (
        <div className="max-h-[31rem] overflow-y-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Valor com Desconto</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data Pagamento</TableHead>
                        <TableHead>Valor Pago</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {registration.monthly_fees.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                                Nenhuma mensalidade encontrada
                            </TableCell>
                        </TableRow>
                    ) : (
                        registration.monthly_fees.map((fee) => (
                            <TableRow key={fee.id}>
                                <TableCell>{formatDate(fee.due_date)}</TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(fee.amount)}
                                </TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(fee.amount_with_discount)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusColor(fee.status)}>
                                        {getStatusText(fee.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {fee.paid_at ? formatDate(fee.paid_at) : '-'}
                                </TableCell>
                                <TableCell>
                                    {fee.paid_amount ? new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(fee.paid_amount) : '-'}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <DotsHorizontalIcon className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <AlertDialog
                                                open={selectedFee === fee.id}
                                                onOpenChange={(open) => {
                                                    if (!open) {
                                                        setSelectedFee(null);
                                                        setPaymentMethod(null);
                                                    }
                                                }}
                                            >
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            setSelectedFee(fee.id);
                                                        }}
                                                        disabled={fee.status === 'PAID'}
                                                    >
                                                        Registrar Pagamento
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Registrar Pagamento</AlertDialogTitle>
                                                        <AlertDialogDescription className="space-y-4">
                                                            <p>
                                                                Confirma o pagamento da mensalidade com vencimento em {formatDate(fee.due_date)}?
                                                            </p>
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <div className="space-y-2 ">
                                                        <Label>Forma de Pagamento *</Label>
                                                        <Select
                                                            value={paymentMethod || undefined}
                                                            onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione a forma de pagamento" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                                                                <SelectItem value="DEBIT_CARD">Cartão de Débito</SelectItem>
                                                                <SelectItem value="PIX">PIX</SelectItem>
                                                                <SelectItem value="CASH">Dinheiro</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <p>
                                                        {new Date(fee.due_date) >= new Date() ? (
                                                            <>
                                                                Valor com desconto: {new Intl.NumberFormat('pt-BR', {
                                                                    style: 'currency',
                                                                    currency: 'BRL'
                                                                }).format(fee.amount_with_discount)}
                                                            </>
                                                        ) : (
                                                            <>
                                                                Valor sem desconto: {new Intl.NumberFormat('pt-BR', {
                                                                    style: 'currency',
                                                                    currency: 'BRL'
                                                                }).format(fee.amount)}
                                                            </>
                                                        )}
                                                    </p>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel disabled={isPending}>
                                                            Cancelar
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => {
                                                                if (!paymentMethod) {
                                                                    toast.error('Selecione a forma de pagamento');
                                                                    return;
                                                                }
                                                                mutate({
                                                                    monthlyFeeId: fee.id,
                                                                    paidAmount: new Date(fee.due_date) >= new Date()
                                                                        ? fee.amount_with_discount
                                                                        : fee.amount,
                                                                    payment_method: paymentMethod
                                                                });
                                                            }}
                                                            disabled={isPending || !paymentMethod}
                                                        >
                                                            {isPending ? (
                                                                <>
                                                                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                                                                    Registrando...
                                                                </>
                                                            ) : (
                                                                'Confirmar Pagamento'
                                                            )}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}