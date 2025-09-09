import nookies from 'nookies';

export function isAuthenticated() {
  const token = nookies.get(null, 'token').token;

  if (!token) {
    return false;
  }

  return true;
}
