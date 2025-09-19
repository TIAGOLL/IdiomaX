import { useSessionContext } from "@/contexts/session-context";
import AdminFinances from "./admin";


export function FinanceDashboard() {
    const { currentRole } = useSessionContext()

    return (
        <div className="flex justify-center items-center bg-slate-100 dark:bg-slate-600 sm:w-full">
            {
                currentRole === 'ADMIN' && <AdminFinances />
            }
        </div>
    );
}
