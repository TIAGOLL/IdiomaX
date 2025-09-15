import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import nookies from "nookies";

export function AuthLayout() {
    const navigate = useNavigate();
    const token = nookies.get(null).token;

    useEffect(() => {
        if (token) {
            navigate("/", { replace: true });
        }
    }, [token, navigate]);

    return <Outlet />;
}