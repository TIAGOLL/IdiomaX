import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import nookies from "nookies";
import { tokenDecode } from "@/lib/token-decode";

export type Role = "ADMIN" | "TEACHER" | "STUDENT";

type AuthContextType = {
    token: string | null;
    login: (token: string) => void;
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

    async function login(newToken: string) {
        nookies.set(null, "token", newToken);
        setToken(newToken);
        const decoded = tokenDecode(newToken);

        if (decoded?.profile.role === "STUDENT") {
            navigate("/dashboard");
        } else {
            navigate("/admin/dashboard");
        }
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
