import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from './components/ui/theme-provider';
import { RoutesApp } from './routes/index';
import { Toaster } from 'sonner';
import { SessionProvider, useSessionContext } from './contexts/session-context';
import { GlobalLoading } from './components/global-loading';

// QueryClient criado uma única vez (persiste entre re-renders)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Componente interno que espera sessão estar pronta
 * Mostra loading enquanto inicializa, previne flash de conteúdo
 */
function AppContent() {
  const { isReady, isLoadingUserProfile } = useSessionContext();

  // Mostra loading enquanto inicializa sessão
  if (!isReady || isLoadingUserProfile) {
    return <GlobalLoading />;
  }

  return (
    <>
      <Toaster />
      <SpeedInsights />
      <Analytics />
      <RoutesApp />
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <AppContent />
          </ThemeProvider>
        </SessionProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
