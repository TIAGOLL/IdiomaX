import { Sidebar } from "@/components/side-bar";
import { useSession } from "@/hooks/use-session";


export function Dashboard() {
    const { memberOn } = useSession()
    return (
        <div className="h-screen w-screen">
            <Sidebar />
            <div className=" justify-center items-center flex">
                {

                }
            </div>
        </div>
    );
}
