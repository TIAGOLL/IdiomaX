import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
    sub: string;
    profile: {
        role: string;
        name: string;
        email: string;
        avatar: string | null;
        company: string;
    };
    iat: number;
};

export function tokenDecode(jwt: string): TokenPayload {
    return jwtDecode<TokenPayload>(jwt);
}