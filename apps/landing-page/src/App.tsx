import '@idiomax/ui/global-css';

import { ThemeProvider } from '@idiomax/ui/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BrowserRouter } from 'react-router';

import { RoutesApp } from './routes/index.tsx';

export function App() {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
          <RoutesApp />
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
