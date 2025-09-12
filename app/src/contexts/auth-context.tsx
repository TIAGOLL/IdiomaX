import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import nookies from "nookies";
import { signInWithPassword } from "@/services/users/sign-in-with-password";
import { toast } from "sonner";
import { getUserProfile } from "@/services/users/get-user-profile";

export type Role = "ADMIN" | "TEACHER" | "STUDENT";

type AuthContextType = {
    token: string | null;
    login: ({ password, username }: { password: string, username: string }) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = nookies.get(null, "token").token;

        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    async function login(data: { password: string, username: string }) {
        const response = await signInWithPassword(data)
        nookies.set(null, "token", response.token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days 
        });
        setToken(response.token);
        toast.success(response.message);
        if ((await getUserProfile()).member_on.length === 0) {
            toast.error("Nenhuma instituição encontrada para este usuário.");
        } else {
            navigate("/dashboard");
        }
        return response
    }

    function logout() {
        nookies.destroy(null, "token");
        setToken(null);
        navigate("/auth/sign-in");
    }

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
