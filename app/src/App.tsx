import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BrowserRouter } from 'react-router';

import { ThemeProvider } from './components/ui/theme-provider';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar.tsx';
import { RoutesApp } from './routes/index.tsx';
import { Toaster } from 'sonner';

export function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
          <Toaster />
          <SidebarProvider>
            <RoutesApp />
            <SpeedInsights />
            <Analytics />
          </SidebarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter >
  );
}
