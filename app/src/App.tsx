import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BrowserRouter } from 'react-router';

import { ThemeProvider } from './components/ui/theme-provider';
import { RoutesApp } from './routes/index.tsx';
import { Toaster } from 'sonner';
import { SessionProvider } from './contexts/session-context.tsx';

export function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <Toaster />
            <RoutesApp />
            <SpeedInsights />
            <Analytics />
          </ThemeProvider>
        </QueryClientProvider>
      </SessionProvider>
    </BrowserRouter >
  );
}
