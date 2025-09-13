import { getUserProfile } from '@/services/users/get-user-profile';
import { useQuery } from '@tanstack/react-query';
import nookies from 'nookies';

export function useSession() {
    const { data: userProfile, isLoading, error } = useQuery({
        queryKey: ['user-session'],
        queryFn: async () =>
            await getUserProfile(),
    });

    const token = nookies.get(null).token;

    return {
        userProfile,
        isLoading,
        error,
        token,
    };
}
