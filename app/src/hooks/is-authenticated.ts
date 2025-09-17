import nookies from 'nookies';

export async function isAuthenticated() {
  const token = nookies.get(null, 'token').token;

  if (!token) {
    return false;
  }

  return true;
}
