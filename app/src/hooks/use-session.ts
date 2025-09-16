import { getUserProfile } from '@/services/users/get-user-profile';
import { useQuery } from '@tanstack/react-query';
import nookies from 'nookies';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

type CompanyMember = {
    id: string;
    role: "STUDENT" | "TEACHER" | "ADMIN";
    company_id: string;
    user_id: string;
    company: {
        id: string;
        email: string;
        name: string;
        created_at: string;
        phone: string;
        address: string;
        updated_at: string;
        cnpj: string;
        social_reason: string | null;
        state_registration: string | null;
        tax_regime: string | null;
        owner_id: string;
        logo_16x16_url?: string | null | undefined;
        logo_512x512_url?: string | null | undefined;
    };
};

export function useSession() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [currentCompanyMember, setCurrentCompanyMember] = useState<CompanyMember | undefined>();
    const [currentRole, setCurrentRole] = useState<string | undefined>();
    const { data: userProfile, isLoading, error } = useQuery({
        queryKey: ['user-session'],
        queryFn: async () =>
            await getUserProfile(),
    });

    useEffect(() => {
        setCurrentCompanyMember(userProfile?.member_on.find(c => c.company.id === searchParams.get('company')));
        if (!searchParams.get('company')) {
            setSearchParams({ ...Object.fromEntries(searchParams.entries()), company: userProfile?.member_on[0]?.company.id || "" });
        }
        setCurrentRole(currentCompanyMember?.role);
    }, [userProfile, searchParams, currentCompanyMember, setSearchParams]);

    const token = nookies.get(null).token;

    const setCompany = (company: CompanyMember) => {
        setCurrentCompanyMember(company);
        setSearchParams(prev => ({ ...Object.fromEntries(prev.entries()), company: company.company.id }));
    }

    const logout = () => {
        nookies.destroy(null, 'token');
        navigate('/auth/sign-in');
    }

    return {
        userProfile,
        isLoading,
        logout,
        error,
        token,
        currentCompanyMember,
        setCompany,
        currentRole,
    };
}
