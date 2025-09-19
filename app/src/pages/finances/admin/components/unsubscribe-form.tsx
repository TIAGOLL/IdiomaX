import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Unsubscribe } from "@/services/stripe/unsubscribe";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { unsubscribeRequest } from '@idiomax/http-schemas/unsubscribe';
import type z from "zod";

type UnsubscribeRequest = z.infer<typeof unsubscribeRequest>;

export function UnsubscribeButton({ subscriptionId }: { subscriptionId: string }) {
    const [confirmText, setConfirmText] = useState("");

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: UnsubscribeRequest) => {
            const response = await Unsubscribe(data)
            return response;
        },
        onSuccess: async (res) => {
            toast.error(res.message);
            window.location.reload();
        },
        onError: (err) => {
            setConfirmText("");
            toast.error(err.message);
        },
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" disabled={isPending}>
                    {isPending ? <LoaderIcon className="animate-spin mr-2 h-4 w-4" /> : null}
                    Cancelar assinatura
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cancelar assinatura</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja cancelar sua assinatura? Esta ação não pode ser desfeita.<br />
                        Para confirmar, digite <b>cancelar assinatura</b> abaixo:
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                    className="my-4"
                    placeholder="Digite: cancelar assinatura"
                    value={confirmText}
                    onChange={e => setConfirmText(e.target.value)}
                    disabled={isPending}
                />
                <div className="flex justify-end gap-2">
                    <AlertDialogCancel asChild onClick={() => setConfirmText("")}>
                        <Button variant="outline">Voltar</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            onClick={() => mutate({ subscriptionId: subscriptionId })}
                            disabled={isPending || confirmText.trim().toLowerCase() !== "cancelar assinatura"}
                            variant={"destructive"}
                            className="text-white"
                        >
                            Confirmar cancelamento
                            {isPending ? <LoaderIcon className="animate-spin mr-2 h-4 w-4" /> : null}
                        </Button>
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}