import 'react-toastify/dist/ReactToastify.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BrowserRouter } from 'react-router';

import { ThemeProvider } from '@/components/ui/theme-provider';

import { RoutesApp } from './routes';

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
