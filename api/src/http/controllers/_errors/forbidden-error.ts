export class ForbiddenError extends Error {
    constructor(message?: string) {
        super(message ?? 'Acesso negado!');
    }
}
