import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BrowserRouter } from 'react-router';

import { RoutesApp } from './routes/index.tsx';
import { ThemeProvider } from './components/ui/theme-provider';
import { AuthProvider } from './contexts/auth-context.tsx';

export function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <RoutesApp />
            <SpeedInsights />
            <Analytics />
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
