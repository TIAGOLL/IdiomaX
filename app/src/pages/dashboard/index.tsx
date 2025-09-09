import { Sidebar } from "@/components/side-bar";


export function Dashboard() {
    return (
        <div className="h-screen w-screen">
            <Sidebar />
            <div className=" justify-center items-center flex">
                <h1>Esse recurso ainda não esta disponivel!</h1>
            </div>
        </div>
    );
}
