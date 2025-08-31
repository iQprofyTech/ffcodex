import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTelegramAuth } from './hooks/useTelegram';
import { useUserStore } from './store';

export default function App() {
  const { token } = useUserStore();
  useTelegramAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen p-4">
      {pathname !== '/' && (
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-500"></div>
            <h1 className="text-xl font-bold">FlowForge AI</h1>
          </div>
          <div className="flex items-center gap-3 text-sm opacity-90">
            <Link className="underline" to="/desktop">Рабочий стол</Link>
            <button className="px-3 py-1 rounded-lg bg-emerald-500 text-white font-semibold" onClick={() => navigate('/desktop')}>Launch App</button>
            <span className="opacity-70">{token ? 'Signed in' : 'Guest'}</span>
          </div>
        </header>
      )}
      <Outlet />
    </div>
  );
}
