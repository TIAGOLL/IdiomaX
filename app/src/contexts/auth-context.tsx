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
        nookies.set(null, "token", response.token);
        setToken(response.token);
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
