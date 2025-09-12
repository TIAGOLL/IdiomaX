import { getUserProfile } from '@/services/users/get-user-profile';
import { useQuery } from '@tanstack/react-query';
import nookies from 'nookies';

export function useSession() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['user-session'],
        queryFn: async () =>
            await getUserProfile(),
    });

    const userProfile = {
        email: data?.email,
        name: data?.name,
        avatar: data?.avatar,
    };

    const memberOn = data?.member_on || [];

    const token = nookies.get(null).token;

    return {
        userProfile,
        isLoading,
        error,
        token,
        memberOn,
    };
}
