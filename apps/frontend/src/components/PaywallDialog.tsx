import { useUserStore } from '../store';

export default function PaywallDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const setSubscribed = useUserStore((s) => s.setSubscribed);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="glass rounded-xl p-6 w-[420px]">
        <h2 className="text-lg font-bold mb-2">Подписка Flow Forge</h2>
        <p className="opacity-80 mb-4">Вы исчерпали 3 бесплатные генерации. Оформите подписку в Telegram, чтобы продолжить без ограничений.</p>
        <div className="flex gap-3 justify-end">
          <button className="px-3 py-2 rounded-lg bg-slate-700" onClick={onClose}>Позже</button>
          <button className="px-3 py-2 rounded-lg bg-emerald-400 text-slate-900 font-semibold" onClick={() => {
            // TODO: интеграция Invoice/Stars. Пока — мок: помечаем подписку активной.
            setSubscribed(true);
            onClose();
          }}>Оформить</button>
        </div>
      </div>
    </div>
  );
}

