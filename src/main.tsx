import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { getPoolConfig, resolveApiUrl } from './config/leagueConfig';

if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      const cfg = getPoolConfig();
      const headers = new Headers(init?.headers || {});
      if (!headers.has('X-League-Id')) {
        headers.set('X-League-Id', cfg.leagueCode || 'DAWSON-2026');
      }
      if (!headers.has('X-Missed-Pick-Rule') && cfg.rules?.missedPickRule) {
        headers.set('X-Missed-Pick-Rule', cfg.rules.missedPickRule);
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
