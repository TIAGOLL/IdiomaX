import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { tokenDecode } from "@/lib/token-decode";
import { getRolesByUserAndCompany } from "@/services/roles/get-roles-by-user-and-company";
import { LucideLogOut } from "lucide-react";
import nookies from 'nookies';
import { useNavigate } from "react-router";



export function SwitchCompany() {
    const { token, logout, setCompany } = useAuth();
    const navigate = useNavigate();

    async function directUser(companyId: string) {
        nookies.set(null, "companyId", companyId);
        setCompany(companyId)
        const roles = await getRolesByUserAndCompany({ companyId: companyId })

        if (roles[0] == "ADMIN" || roles[0] == "TEACHER") {
            console.log("aqui")
            navigate("/admin/dashboard");
        } else {
            console.log("aqui")
            navigate("/dashboard")
        }
    }

    return (
        <Card className="w-96 mx-auto mt-20 p-6 text-center">
            <CardTitle>Selecione uma empresa</CardTitle>
            <CardDescription>Você precisa selecionar uma empresa e função para continuar.</CardDescription>
            <CardContent className="mt-4 space-y-2 flex flex-wrap">
                {token && tokenDecode(token)?.profile?.companies?.map((comp) => (
                    <Button
                        key={comp.id}
                        className="w-full p-8 rounded flex flex-col"
                        onClick={async () => {
                            directUser(comp.id)
                        }}
                    >
                        <div>{comp.name}</div>
                        <div className="flex flex-col">
                            {comp.role.map((item) => {
                                return item === "ADMIN"
                                    ? <div>ADMIN</div>
                                    : item === "TEACHER"
                                        ? <div>PROFESSOR</div>
                                        : item === "STUDENT"
                                            ? <div>ESTUDANTE</div>
                                            : item;
                            })}
                        </div>
                    </Button>
                ))}
                <Button
                    className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mt-4"
                    onClick={logout}
                >
                    <LucideLogOut />
                    Logar com outra conta
                </Button>
                <CardDescription>Você está logado como: {tokenDecode(token)?.profile?.name}</CardDescription>
            </CardContent>
        </Card>
    );
}
