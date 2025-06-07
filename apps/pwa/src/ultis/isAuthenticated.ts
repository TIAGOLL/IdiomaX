import nookies from 'nookies';

export function isAuthenticated() {
  const token = nookies.get(null, 'token');

  if (Object.keys(token).find((value) => value === 'token') !== 'token') {
    return false;
  }

  return true;
}
