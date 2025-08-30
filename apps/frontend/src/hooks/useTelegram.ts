import { useEffect } from 'react';
import { useUserStore } from '../store';

declare global {
  interface Window { Telegram?: any }
}

export function useTelegramAuth() {
  const setToken = useUserStore((s) => s.setToken);

  useEffect(() => {
    async function run() {
      const tg = window.Telegram?.WebApp;
      const initData = tg?.initData || 'dev';
      try {
        const res = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData })
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.token) setToken(data.token);
      } catch {}
    }
    run();
  }, [setToken]);
}

