import { Outlet } from 'react-router-dom';
import { useTelegramAuth } from './hooks/useTelegram';
import { useUserStore } from './store';

export default function App() {
  const { token } = useUserStore();
  useTelegramAuth();
  return (
    <div className="min-h-screen p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Flow Forge</h1>
        <div className="text-sm opacity-80">{token ? 'Signed in' : 'Guest'}</div>
      </header>
      <Outlet />
    </div>
  );
}

