import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useSessionContext } from '@/contexts/session-context';
import { getCompanySubscription } from '@/services/stripe/get-company-subscription';

export function PaidRoute() {
  const location = useLocation();
  const [currentCompanyMember, setCurrentCompanyMember] = useState<boolean | null>(true);
  const { currentCompanyMember: company } = useSessionContext();


  useEffect(() => {
    async function subscriptionIsActive() {
      if (!company?.company_id) return false;
      const subscription = await getCompanySubscription({ companyId: company?.company_id });
      if (subscription && subscription.status !== 'active' && subscription.status !== 'trialing') {
        return false
      }
      return true;
    }

    if (company) {
      subscriptionIsActive()
        .then((res) => {
          if (res) {
            setCurrentCompanyMember(true);
          } else {
            setCurrentCompanyMember(false);
          }
        }
        );
    }
  }, [company]);

  if (!currentCompanyMember) return <Navigate to={`/auth/select-plan/?companyId=${company?.company_id}`} state={{ from: location }} replace />;

  return <Outlet />;
}
