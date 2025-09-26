export class ForbiddenError extends Error {
    constructor(message?: string) {
        super(message ?? 'Você não tem permissão.');
    }
}
