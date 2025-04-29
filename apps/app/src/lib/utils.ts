import { type ClassValue, clsx } from 'clsx';
import nookies from 'nookies';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAuthenticated() {
  const token = nookies.get(null, 'token');

  if (Object.keys(token).find((value) => value === 'token') !== 'token') {
    return false;
  }

  return true;
}
