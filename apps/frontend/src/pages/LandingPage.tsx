import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectsStore } from '../store';
import { Image, Video, Type, Music, Workflow, Wand2 } from 'lucide-react';

function TopBar() {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
      <div className="font-semibold">FlowForge AI</div>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold" onClick={() => navigate('/desktop')}>Launch App</button>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  const Icon = icon;
  return (
    <div className="glass rounded-xl p-4 text-sm">
      <div className="flex items-center gap-2 mb-2"><Icon size={18} /> <b>{title}</b></div>
      <div className="opacity-70 leading-snug">{desc}</div>
    </div>
  );
}

function PriceCard({ name, price, items, highlighted }: { name: string; price: string; items: string[]; highlighted?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 border ${highlighted ? 'border-emerald-400 shadow-lg' : 'border-slate-200'} bg-white`}>
      <div className="text-sm opacity-70 mb-1">{name}</div>
      <div className="text-2xl font-bold mb-3">{price}<span className="text-base font-normal opacity-60">/мес</span></div>
      <ul className="text-sm mb-4 opacity-90 list-disc ml-5">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
      <button className={`w-full px-4 py-2 rounded-xl ${highlighted ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>Выбрать</button>
    </div>
  );
}

export default function LandingPage() {
  const ensureDefault = useProjectsStore((s) => s.ensureDefault);
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);
  useEffect(() => ensureDefault(), [ensureDefault]);

  return (
    <div className="min-h-screen">
      <TopBar />
      <section className="dot-bg">
        <div className="max-w-4xl mx-auto text-center py-16 px-4">
          <h1 className="text-4xl font-extrabold mb-4">Каскадная генерация контента при помощи AI</h1>
          <p className="opacity-70 mb-6">Создавайте изображения, видео, тексты и музыку при помощи визуального редактора и мини‑приложения Telegram.</p>
          <div className="flex gap-3 justify-center">
            <button className="px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold" onClick={() => navigate('/desktop')}>Начать сегодня</button>
            <a className="px-5 py-3 rounded-xl border" href="#features">Узнать больше</a>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1400&auto=format&fit=crop" className="w-full rounded-2xl shadow" alt="hero" />
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold mb-6">Все инструменты в одном месте</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Feature icon={Image} title="Генерация изображений" desc="SDXL, Flux, GPT‑4o image и др." />
          <Feature icon={Video} title="Генерация видео" desc="Sora, Runway, Luma, Kling, Veo" />
          <Feature icon={Type} title="Генерация текстов" desc="GPT‑4.5, Claude, Gemini, Llama" />
          <Feature icon={Music} title="Генерация аудио" desc="Suno v4, TTS провайдеры" />
          <Feature icon={Workflow} title="Каскадные цепочки" desc="Соединяйте ноды и создавайте пайплайны" />
          <Feature icon={Wand2} title="Визуальный редактор" desc="Живой предпросмотр, аспекты, модели" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Простые и понятные тарифы</h2>
          <div className="text-sm flex items-center gap-2">
            <span className={!annual ? 'font-semibold' : ''}>Месяц</span>
            <button className={`w-12 h-6 rounded-full border relative ${annual ? 'bg-emerald-400' : 'bg-white'}`} onClick={()=>setAnnual(!annual)}>
              <span className={`absolute top-0.5 ${annual ? 'right-0.5' : 'left-0.5'} w-5 h-5 rounded-full bg-white border`}></span>
            </button>
            <span className={annual ? 'font-semibold' : ''}>Год <span className="text-emerald-600">−20%</span></span>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <PriceCard name="Free" price="$0" items={["3 генерации","Базовые модели","Поддержка"]} />
          <PriceCard name="Creator" price={annual?"$16":"$20"} items={["500 генераций","Расширенные модели","Доступ к редактору Canva","Поддержка"]} highlighted />
          <PriceCard name="Pro Creator" price={annual?"$40":"$50"} items={["Безлимитные генерации","Про‑модели, новые релизы","Ранний доступ к фичам","Поддержка"]} />
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-4 py-8 text-sm opacity-70">
        <div className="flex items-center justify-between">
          <div>Flowforge AI</div>
          <div>© {new Date().getFullYear()} Flowforge. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
