import nookies from 'nookies';

export function getToken() {
    return nookies.get().token
}