import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile } from '@/services/users/get-user-profile';
import { useQuery } from '@tanstack/react-query';
import nookies from 'nookies';
import { useNavigate, useSearchParams } from 'react-router';
import { getUserProfileResponse } from '@idiomax/http-schemas/get-user-profile';
import type z from 'zod';
import { getCompanySubscription } from '@/services/stripe/get-company-subscription';
import type { getCompanySubscriptionResponse } from '@idiomax/http-schemas/get-company-subscription';

type CompanyMember = z.infer<typeof getUserProfileResponse>['member_on'][number];
type GetUserProfileResponse = z.infer<typeof getUserProfileResponse>;

type SessionContextType = {
    userProfile?: GetUserProfileResponse;
    logout: () => void;
    error: unknown;
    token?: string;
    currentCompanyMember?: CompanyMember;
    setCompany: (company: CompanyMember) => void;
    currentRole?: string;
    subscription?: z.infer<typeof getCompanySubscriptionResponse>;
    isLoadingSubscription: boolean;
    isLoadingUserProfile: boolean;
    subscriptionError: unknown;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [currentCompanyMember, setCurrentCompanyMember] = useState<CompanyMember | undefined>();
    const [currentRole, setCurrentRole] = useState<string | undefined>();

    const { data: userProfile, isLoading: isLoadingUserProfile, error } = useQuery({
        queryKey: ['user-session'],
        queryFn: async () => await getUserProfile(),
        retry: false,
        enabled: !!nookies.get(null).token,
    });

    const { data: subscription, isLoading: isLoadingSubscription, error: subscriptionError } = useQuery({
        queryKey: [
            'company-subscription',
            currentCompanyMember?.company.id,
            userProfile?.cpf
        ],
        queryFn: async () => {
            if (!currentCompanyMember) return undefined;
            console.log(currentCompanyMember.company.id);
            return await getCompanySubscription({ companyId: currentCompanyMember.company.id });
        },
        enabled: !!currentCompanyMember && !!userProfile,
    });

    useEffect(() => {
        if (!userProfile) return;

        // Se não tem companyId na URL, define o primeiro disponível
        const urlCompanyId = searchParams.get('companyId');
        if (!urlCompanyId && userProfile.member_on.length > 0) {
            setSearchParams({ ...Object.fromEntries(searchParams.entries()), companyId: userProfile.member_on[0].company.id });
            return;
        }

        // Atualiza o membro atual se necessário
        const found = userProfile.member_on.find(c => c.company.id === urlCompanyId);
        if (found && found !== currentCompanyMember) {
            setCurrentCompanyMember(found);
            setCurrentRole(found.role);
        }
    }, [userProfile, searchParams, setSearchParams, currentCompanyMember]);

    const token = nookies.get(null).token;

    const setCompany = (company: CompanyMember) => {
        setCurrentCompanyMember(company);
        setSearchParams(prev => ({ ...Object.fromEntries(prev.entries()), companyId: company.company.id }));
    };

    const logout = () => {
        nookies.destroy(null, 'token', { path: '/' });
        navigate('/auth/sign-in');
    };

    return (
        <SessionContext.Provider value={{
            userProfile,
            isLoadingUserProfile,
            logout,
            error,
            token,
            currentCompanyMember,
            setCompany,
            currentRole,
            subscription,
            isLoadingSubscription,
            subscriptionError
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
