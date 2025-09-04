
export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Acesso não autorizado!');
  }
}
