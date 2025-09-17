import { getUserProfile } from '@/services/users/get-user-profile';
import { useQuery } from '@tanstack/react-query';
import nookies from 'nookies';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

type CompanyMember = {
    id: string;
    role: "STUDENT" | "TEACHER" | "ADMIN";
    company_id: string;
    user_id: string;
    company: {
        id: string;
        email: string;
        name: string;
        created_at: Date | null;
        phone: string;
        address: string;
        updated_at: Date | null;
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
        queryFn: async () => await getUserProfile(),
        retry: false,
    });

    useEffect(() => {
        if (!isLoading && (error || (userProfile && !userProfile.name))) {
            nookies.destroy(null, 'token');
            toast.error('Sua sessão expirou. Por favor, faça login novamente.');
            navigate('/auth/sign-in', { replace: true });
        }
    }, [isLoading, error, userProfile, navigate]);

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
