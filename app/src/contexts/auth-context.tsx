import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import nookies from "nookies";

export type Role = "ADMIN" | "TEACHER" | "STUDENT";

type AuthContextType = {
    token: string | null;
    company: string | null;
    login: (token: string) => void;
    logout: () => void;
    setCompany: (companyId: string) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [company, setCompany] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = nookies.get(null, "token").token;
        const companyId = nookies.get(null, "companyId").companyId;

        if (storedToken) {
            setToken(storedToken);
        }
        if (companyId) {
            setCompany(companyId);
        }
    }, []);

    async function login(newToken: string) {
        nookies.set(null, "token", newToken);
        setToken(newToken);
    }

    function logout() {
        nookies.set(null, "token", '');
        setToken(null);
        nookies.set(null, "companyId", '');
        setCompany(null)
        navigate("/auth/sign-in");
    }

    return (
        <AuthContext.Provider value={{ token, login, logout, company, setCompany }}>
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
