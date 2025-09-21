import { useSessionContext } from "@/contexts/session-context";
import AdminFinances from "./admin";


export function FinanceDashboard() {
    const { currentRole } = useSessionContext()

    return (
        <div className="flex justify-center items-center sm:w-full">
            {
                currentRole === 'ADMIN' && <AdminFinances />
            }
        </div>
    );
}
