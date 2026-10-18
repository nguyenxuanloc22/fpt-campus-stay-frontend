import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { loadDictionary } from './shared-ui/i18n/t';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
});

// Nạp từ điển ngôn ngữ trước, rồi mới nạp ứng dụng — để mọi chuỗi t() (kể cả dữ liệu cấp module) dùng đúng ngôn ngữ.
async function bootstrap() {
  await loadDictionary();
  const { AppRouter } = await import('./app/router/AppRouter');
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

void bootstrap();
