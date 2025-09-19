import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useSessionContext } from '@/contexts/session-context';
import { getCompanySubscription } from '@/services/stripe/get-company-subscription';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/side-bar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function PaidRoute() {
  const { currentCompanyMember: company, isLoadingUserProfile } = useSessionContext();
  const navigate = useNavigate()

  useEffect(() => {
    async function subscriptionIsActive() {
      if (!company?.company_id) return false;
      const subscription = await getCompanySubscription({ companyId: company?.company_id });
      if (subscription && subscription.status !== 'active' && subscription.status !== 'trialing') {
        return false
      }
      return true;
    }

    if (company !== undefined || !isLoadingUserProfile) {
      subscriptionIsActive()
        .catch(() => navigate(`/auth/select-plan?companyId=${company?.company_id}`));
    }

  }, [company, isLoadingUserProfile, navigate]);

  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbItems = [
    <BreadcrumbItem key="home">
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>,
    ...pathnames.map((value, index) => {
      const to = '/' + pathnames.slice(0, index + 1).join('/');
      const isLast = index === pathnames.length - 1;
      return (
        <span key={to} className='flex items-center gap-3'>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {isLast ? (
              <BreadcrumbPage>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={to}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </span>
      );
    }),
  ];

  return (
    <SidebarProvider>
      <Sidebar />
      <main className='flex-1 min-h-screen'>
        <div className='p-2 border-b h-12 bg-sidebar border-b-slate-200/5 flex items-center gap-4'>
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
