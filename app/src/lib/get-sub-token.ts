import nookies from 'nookies';
import { tokenDecode } from './token-decode';

export function getSessionProfile() {
    const token = nookies.get(null, 'token').token;
    const payload = tokenDecode(token);
    return payload;
}