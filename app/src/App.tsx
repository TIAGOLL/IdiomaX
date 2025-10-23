import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from './components/ui/theme-provider';
import { RoutesApp } from './routes/index';
import { Toaster } from 'sonner';
import { SessionProvider, useSessionContext } from './contexts/session-context';
import { AbilityContext } from './lib/Can';
import { defineAbilityFor } from '@idiomax/authorization';
import { useEffect, useState } from 'react';
import type { AppAbility } from '@idiomax/authorization';

function AppContent() {
  const { userProfile, currentCompanyMember } = useSessionContext();
  const [ability, setAbility] = useState<AppAbility | null>();

  useEffect(() => {
    if (userProfile && currentCompanyMember) {
      const user = {
        id: userProfile.id,
        role: currentCompanyMember.role
      };
      const newAbility = defineAbilityFor(user);
      setAbility(newAbility);
    }
  }, [userProfile, currentCompanyMember]);

  if (!ability) {
    return null; // Ou um loader
  }

  return (
    <AbilityContext.Provider value={ability}>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <Toaster />
        <SpeedInsights />
        <Analytics />
      </ThemeProvider>
    </AbilityContext.Provider>
  );
}

export function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <AppContent />
          <RoutesApp />
        </QueryClientProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}
