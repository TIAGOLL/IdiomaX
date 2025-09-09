import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
    sub: string;
    profile: {
        role: string;
        name: string;
        email: string;
        company: string;
    };
    iat: number;
};

export function tokenDecode(jwt: string) {
    return jwtDecode<TokenPayload>(jwt);
}