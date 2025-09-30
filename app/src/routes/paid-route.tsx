import { useEffect, useState, } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubscriptionForm } from '@/components/subscription-form';
import { ChevronDownIcon, SlashIcon } from "lucide-react";
import { getBreadcrumbConfig } from '@/components/side-bar/navigation-data';
import { getCurrentCompanyId } from '@/lib/company-utils';

export function PaidRoute() {
  const { currentCompanyMember: company, isLoadingUserProfile } = useSessionContext();
  const [subscriptionIsActive, setSubscriptionIsActive] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Configuração dos breadcrumbs baseada na navegação da sidebar
  const breadcrumbConfig = getBreadcrumbConfig();

  const pathnames = location.pathname.split('/').filter((x) => x);

  const generateBreadcrumbItems = () => {
    const items = [
      <BreadcrumbItem key="home">
        <BreadcrumbLink asChild>
          <Link to="/">Home</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
    ];

    pathnames.forEach((value, index) => {
      // Pular o segmento 'admin' pois 'Home' já representa o dashboard
      if (value === 'admin') return;

      const to = '/' + pathnames.slice(0, index + 1).join('/');
      const isLast = index === pathnames.length - 1;
      const config = breadcrumbConfig[value as keyof typeof breadcrumbConfig];

      items.push(
        <BreadcrumbSeparator key={`sep-${index}`}>
          <SlashIcon />
        </BreadcrumbSeparator>
      );

      if (config) {
        // Item com dropdown (sempre que há configuração)
        items.push(
          <BreadcrumbItem key={value}>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded-md transition-colors text-sm font-medium cursor-pointer">
                  {config.label}
                  <ChevronDownIcon className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {config.items.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link to={item.href} className="cursor-pointer">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
        );
      } else {
        // Item sem dropdown
        items.push(
          <BreadcrumbItem key={value}>
            {isLast ? (
              <BreadcrumbPage>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to={to}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        );
      }
    });

    return items;
  };

  useEffect(() => {
    async function checkSubscriptionIsActive() {
      if (!company?.company_id) return true;
      const subscription = await getCompanySubscription({
        company_id: getCurrentCompanyId()
      });
      if (subscription && subscription.status !== 'active' && subscription.status !== 'trialing') {
        return false
      }
      return true;
    }

    if (company !== undefined || !isLoadingUserProfile) {
      checkSubscriptionIsActive()
        .then((isActive) => setSubscriptionIsActive(isActive))
        .catch(() => {
          setSubscriptionIsActive(false);
        });
    }

  }, [company, isLoadingUserProfile, navigate]);

  const breadcrumbItems = generateBreadcrumbItems();

  if (!subscriptionIsActive) return (
    <SidebarProvider>
      <Sidebar />
      <main className='flex-1 min-h-screen min-w-[calc(100vw-16rem)]'>
        <div className='hidden fixed top-0 z-50 w-full p-2 border-b h-12 bg-sidebar border-b-slate-200/5 items-center gap-4 sm:flex'>
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex-1 min-h-screen pt-12 flex items-center justify-center">
          <SubscriptionForm />
        </div>
      </main>
    </SidebarProvider>
  )

  return (
    <SidebarProvider>
      <Sidebar />
      <main className='flex-1 min-h-screen min-w-[calc(100vw-24rem)]'>
        <div className='hidden fixed top-0 z-50 w-full p-2 border-b h-12 bg-sidebar border-b-slate-200/5 items-center gap-4 sm:flex'>
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="pt-12">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
