/**
 * Utilitário para gerenciar a empresa atual do usuário
 */

const CURRENT_COMPANY_KEY = 'idiomaX_currentCompanyId';

export function getCurrentCompanyId(): string {
    const companyId = localStorage.getItem(CURRENT_COMPANY_KEY);

    if (!companyId) {
        throw new Error('Nenhuma empresa selecionada. Por favor, selecione uma empresa.');
    }

    return companyId;
}

export function setCurrentCompanyId(companyId: string): void {
    localStorage.setItem(CURRENT_COMPANY_KEY, companyId);
}

export function clearCurrentCompanyId(): void {
    localStorage.removeItem(CURRENT_COMPANY_KEY);
}

export function hasCurrentCompanyId(): boolean {
    return localStorage.getItem(CURRENT_COMPANY_KEY) !== null;
}