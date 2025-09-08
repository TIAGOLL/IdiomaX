import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
    sub: string;
    profile: {
        companies: {
            id: string;
            name: string;
            role: string[];
        }[];
        name: string;
        email: string;
        avatar: string | null;
    };
    iat: number;
} | undefined;

export function tokenDecode(jwt?: string): TokenPayload {
    if (!jwt) return
    return jwtDecode<TokenPayload>(jwt);
}