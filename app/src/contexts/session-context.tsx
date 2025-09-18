import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile } from '@/services/users/get-user-profile';
import { useQuery } from '@tanstack/react-query';
import nookies from 'nookies';
import { useNavigate, useSearchParams } from 'react-router';
import { getUserProfileResponse } from '@idiomax/http-schemas/get-user-profile';
import type z from 'zod';

type CompanyMember = z.infer<typeof getUserProfileResponse>['member_on'][number];
type GetUserProfileResponse = z.infer<typeof getUserProfileResponse>;

type SessionContextType = {
    userProfile?: GetUserProfileResponse;
    isLoading: boolean;
    logout: () => void;
    error: unknown;
    token?: string;
    currentCompanyMember?: CompanyMember;
    setCompany: (company: CompanyMember) => void;
    currentRole?: string;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [currentCompanyMember, setCurrentCompanyMember] = useState<CompanyMember | undefined>();
    const [currentRole, setCurrentRole] = useState<string | undefined>();

    const { data: userProfile, isLoading, error } = useQuery({
        queryKey: ['user-session'],
        queryFn: async () => await getUserProfile(),
        retry: false,
    });

    useEffect(() => {
        setCurrentCompanyMember(userProfile?.member_on.find(c => c.company.id === searchParams.get('companyId')));
        if (!searchParams.get('companyId')) {
            setSearchParams({ ...Object.fromEntries(searchParams.entries()), companyId: userProfile?.member_on[0]?.company.id || "" });
        }
        setCurrentRole(currentCompanyMember?.role);
    }, [userProfile, searchParams, currentCompanyMember, setSearchParams]);

    const token = nookies.get(null).token;

    const setCompany = (company: CompanyMember) => {
        setCurrentCompanyMember(company);
        setSearchParams(prev => ({ ...Object.fromEntries(prev.entries()), company: company.company.id }));
    };

    const logout = () => {
        nookies.destroy(null, 'token');
        navigate('/auth/sign-in');
    };

    return (
        <SessionContext.Provider value={{
            userProfile,
            isLoading,
            logout,
            error,
            token,
            currentCompanyMember,
            setCompany,
            currentRole,
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
