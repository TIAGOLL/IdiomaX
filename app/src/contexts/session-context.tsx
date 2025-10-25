import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { getUserProfile } from '@/services/users/get-user-profile';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import nookies from 'nookies';
import { useNavigate } from 'react-router';
import { getCompanySubscription } from '@/services/stripe/get-company-subscription';
import { type GetProfileResponseType } from '@idiomax/validation-schemas/auth/get-profile';
import { type GetCompanySubscriptionResponseType } from '@idiomax/validation-schemas/subscriptions/get-company-subscription';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { AbilityContext, defineAbilityFor, type AppAbility } from '@/lib/Can';
import type { User } from '@idiomax/authorization';


type SessionContextType = {
    userProfile: GetProfileResponseType | null;
    logout: () => void;
    error: unknown;
    token?: string;
    currentCompanyMember?: GetProfileResponseType['member_on'][number];
    setCompany: (company: GetProfileResponseType['member_on'][number]) => void;
    currentRole?: string;
    subscription: GetCompanySubscriptionResponseType | null;
    isLoadingSubscription: boolean;
    isLoadingUserProfile: boolean;
    subscriptionError: unknown;
    isInitializingCompany: boolean;
    getCompanyId: () => string | null;
    ability: AppAbility;
    isReady: boolean; // Indica quando sessão está completamente inicializada
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Chave para localStorage
const CURRENT_COMPANY_KEY = 'idiomaX_currentCompanyId';

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [currentCompanyMember, setCurrentCompanyMember] = useState<GetProfileResponseType['member_on'][number] | undefined>();
    const [currentRole, setCurrentRole] = useState<string | undefined>();
    const [isInitializingCompany, setIsInitializingCompany] = useState(true);

    // Query do perfil do usuário
    const { data: userProfile, isLoading: isLoadingUserProfile, error } = useQuery({
        queryKey: ['user-session'],
        queryFn: async () => await getUserProfile(),
        retry: false,
        enabled: !!nookies.get(null).token,
    });

    /**
     * Criar ability com fallback para guest user
     * SEMPRE retorna um ability válido, mesmo sem usuário logado
     * Isso previne erros quando ability é acessado antes do login
     */
    const ability = useMemo(() => {
        if (!userProfile || !currentRole) {
            // Fallback: ability de guest (permissões mínimas de STUDENT)
            return defineAbilityFor({
                id: '',
                role: 'STUDENT' as const
            });
        }

        // Criar objeto User compatível com o pacote de autorização
        const user: User = {
            id: userProfile.id,
            role: currentRole as 'ADMIN' | 'TEACHER' | 'STUDENT'
        };

        return defineAbilityFor(user);
    }, [userProfile, currentRole]);

    /**
     * Indicador global de "prontidão" da sessão
     * True quando: 
     * - Não tem token (usuário não logado - pode mostrar login)
     * - OU tem token e perfil já carregou (usuário logado - pode mostrar app)
     */
    const isReady = useMemo(() => {
        const hasToken = !!nookies.get(null).token;
        if (!hasToken) return true; // Sem token = pronto para mostrar login
        return !isLoadingUserProfile; // Com token = espera carregar perfil
    }, [isLoadingUserProfile]);

    const { data: subscription, isLoading: isLoadingSubscription, error: subscriptionError } = useQuery({
        queryKey: ['company-subscription', currentCompanyMember?.company.id, userProfile?.cpf],
        queryFn: async () => {
            if (!currentCompanyMember) return undefined;
            return await getCompanySubscription({
                company_id: getCurrentCompanyId()
            });
        },
        enabled: !!currentCompanyMember && !!userProfile,
        retry: false,
    });

    // Função para obter company ID salvo no localStorage
    const getCompanyId = (): string | null => {
        return localStorage.getItem(CURRENT_COMPANY_KEY);
    };

    // Função para salvar company ID no localStorage
    const saveCompanyId = (companyId: string): void => {
        localStorage.setItem(CURRENT_COMPANY_KEY, companyId);
    };

    // Função para limpar company ID do localStorage
    const clearSavedCompanyId = (): void => {
        localStorage.removeItem(CURRENT_COMPANY_KEY);
    };

    /**
     * Efeito para inicializar a empresa quando o perfil do usuário carrega
     * Também reinicializa se currentRole estiver undefined (caso de re-login)
     */
    useEffect(() => {
        // Se não tem perfil ou não tem empresas, marca como não inicializando e sai
        if (!userProfile || userProfile.member_on.length === 0) {
            setIsInitializingCompany(false);
            return;
        }

        // Se já tem currentRole definido e empresa definida, não precisa reinicializar
        if (currentRole && currentCompanyMember) {
            setIsInitializingCompany(false);
            return;
        }

        // Precisa inicializar/reinicializar a empresa
        const savedCompanyId = getCompanyId();
        let companyToSet: GetProfileResponseType['member_on'][number] | undefined;

        if (savedCompanyId) {
            // Verifica se a empresa salva ainda é válida
            companyToSet = userProfile.member_on.find(member => member.company.id === savedCompanyId);
        }

        // Se não encontrou a empresa salva ou não havia empresa salva, usa a primeira
        if (!companyToSet) {
            companyToSet = userProfile.member_on[0];
        }

        // Define a empresa atual
        setCurrentCompanyMember(companyToSet);
        setCurrentRole(companyToSet.role);
        saveCompanyId(companyToSet.company.id);
        setIsInitializingCompany(false);
    }, [userProfile, currentRole, currentCompanyMember]);

    const token = nookies.get(null).token;

    const setCompany = (company: GetProfileResponseType['member_on'][number]) => {
        setCurrentCompanyMember(company);
        setCurrentRole(company.role);
        saveCompanyId(company.company.id);
    };

    const logout = () => {
        // Limpar cookie de autenticação
        nookies.destroy(null, 'token', { path: '/' });

        // Limpar localStorage
        clearSavedCompanyId();

        // Limpar estados locais
        setCurrentCompanyMember(undefined);
        setCurrentRole(undefined);
        setIsInitializingCompany(true);

        // Invalidar todo o cache do React Query para garantir dados frescos no próximo login
        queryClient.clear();

        // Navegar para login
        navigate('/auth/sign-in');
    };

    return (
        <AbilityContext.Provider value={ability}>
            <SessionContext.Provider value={{
                userProfile: userProfile || null,
                getCompanyId,
                isLoadingUserProfile,
                logout,
                error,
                token,
                currentCompanyMember,
                setCompany,
                currentRole,
                subscription: subscription || null,
                isLoadingSubscription,
                subscriptionError,
                isInitializingCompany,
                ability,
                isReady, // Exporta o indicador de prontidão
            }}>
                {children}
            </SessionContext.Provider>
        </AbilityContext.Provider>
    );
};

export function useSessionContext() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSessionContext deve ser usado dentro de SessionProvider');
    }
    return context;
}
