import { Button } from "@/components/ui/button";
import { useSessionContext } from "@/contexts/session-context";
import { Unsubscribe } from "@/services/stripe/unsubscribe";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function UnsubscribeForm() {
    const navigate = useNavigate();
    const { logout } = useSessionContext()
    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const response = await Unsubscribe()
            logout();
            return response;
        },
        onSuccess: async (res) => {
            toast.error(res.message);
            navigate('/auth/create-company');
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    return (
        <form onSubmit={() => { mutate() }}>
            <Button type="button" disabled={isPending} variant="ghost">
                Cancelar assinatura
                {isPending && <LoaderIcon className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
        </form>
    )
}