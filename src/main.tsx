import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { getPoolConfig, resolveApiUrl } from './config/leagueConfig';

if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      const headers = new Headers(init?.headers || {});
      if (!headers.has('X-League-Id')) {
        headers.set('X-League-Id', getPoolConfig().leagueCode || 'DAWSON-2026');
      }
      return nativeFetch(resolveApiUrl(input), { ...init, headers });
    }
    return nativeFetch(input, init);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
