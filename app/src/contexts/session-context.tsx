import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile } from '@/services/users/get-user-profile';
import { useQuery } from '@tanstack/react-query';
import nookies from 'nookies';
import { useNavigate } from 'react-router';
import { getCompanySubscription } from '@/services/stripe/get-company-subscription';
import { type GetProfileResponseType } from '@idiomax/validation-schemas/auth/get-profile';
import { type GetCompanySubscriptionHttpResponse } from '@idiomax/validation-schemas/subscriptions/get-company-subscription';


type SessionContextType = {
    userProfile: GetProfileResponseType | null;
    logout: () => void;
    error: unknown;
    token?: string;
    currentCompanyMember?: GetProfileResponseType['member_on'][number];
    setCompany: (company: GetProfileResponseType['member_on'][number]) => void;
    currentRole?: string;
    subscription: GetCompanySubscriptionHttpResponse | null;
    isLoadingSubscription: boolean;
    isLoadingUserProfile: boolean;
    subscriptionError: unknown;
    isInitializingCompany: boolean;
    getCompanyId: () => string | null;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Chave para localStorage
const CURRENT_COMPANY_KEY = 'idiomaX_currentCompanyId';

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [currentCompanyMember, setCurrentCompanyMember] = useState<GetProfileResponseType['member_on'][number] | undefined>();
    const [currentRole, setCurrentRole] = useState<string | undefined>();
    const [isInitializingCompany, setIsInitializingCompany] = useState(true);

    const { data: userProfile, isLoading: isLoadingUserProfile, error } = useQuery({
        queryKey: ['user-session'],
        queryFn: async () => await getUserProfile(),
        retry: false,
        enabled: !!nookies.get(null).token,
    });

    const { data: subscription, isLoading: isLoadingSubscription, error: subscriptionError } = useQuery({
        queryKey: ['company-subscription', currentCompanyMember?.company.id, userProfile?.cpf],
        queryFn: async () => {
            if (!currentCompanyMember) return undefined;
            return await getCompanySubscription();
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

    // Efeito para inicializar a empresa quando o perfil do usuário carrega
    useEffect(() => {
        if (!userProfile || userProfile.member_on.length === 0) {
            setIsInitializingCompany(false);
            return;
        }

        // Tenta usar a empresa salva no localStorage
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
    }, [userProfile]);

    const token = nookies.get(null).token;

    const setCompany = (company: GetProfileResponseType['member_on'][number]) => {
        setCurrentCompanyMember(company);
        setCurrentRole(company.role);
        saveCompanyId(company.company.id);
    };

    const logout = () => {
        nookies.destroy(null, 'token', { path: '/' });
        clearSavedCompanyId();
        setCurrentCompanyMember(undefined);
        setCurrentRole(undefined);
        setIsInitializingCompany(true);
        navigate('/auth/sign-in');
    };

    return (
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
            isInitializingCompany
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export function useSessionContext() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSessionContext deve ser usado dentro de SessionProvider');
    }
    return context;
}
