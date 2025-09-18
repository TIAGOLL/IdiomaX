import { Sidebar } from "@/components/side-bar";
import { useSession } from "@/hooks/use-session";
import AdminDashboard from "./admin";


export function DashboardPage() {
    const { currentRole } = useSession()

    return (
        <div className="flex justify-center min-h-screen items-center bg-slate-100 dark:bg-slate-600 sm:!w-screen">
            <Sidebar />
            <div className="justify-center items-center flex w-full">
                {
                    currentRole === 'ADMIN' && <AdminDashboard />
                }
            </div>
        </div>
    );
}
