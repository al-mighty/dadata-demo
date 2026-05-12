import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DaData Demo — Address, Company & Bank Search',
  description: 'Next.js 15 demo: DaData API integration with address autocomplete, company/bank lookup, contractor validation and Yandex SmartCaptcha.',
};

const DEMOS = [
  { href: '/address', icon: '📍', title: 'Адрес', desc: 'Автокомплит адреса с разбором на поля: индекс, город, улица, координаты, метро' },
  { href: '/company', icon: '🏢', title: 'Компания', desc: 'Поиск по ИНН или названию: реквизиты, руководство, ОКВЭД, статус' },
  { href: '/bank', icon: '🏦', title: 'Банк', desc: 'Поиск по БИК или названию: корр. счёт, SWIFT, адрес' },
  { href: '/form', icon: '🔍', title: 'Проверка контрагента', desc: 'Введите ИНН + БИК — полный отчёт. Server Actions, Zod валидация, Yandex SmartCaptcha' },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-light mb-2">
          Da<span className="text-blue-500 font-semibold">Data</span> API Demo
        </h1>
        <p className="text-neutral-400 max-w-lg">
          Next.js 15, App Router, Server Actions, TypeScript strict, Tailwind 4, React Hook Form + Zod, Yandex SmartCaptcha, rate limiting.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DEMOS.map(d => (
          <Link key={d.href} href={d.href} className="group bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-blue-500/50 transition">
            <div className="text-2xl mb-3">{d.icon}</div>
            <h2 className="text-lg font-medium text-white group-hover:text-blue-400 transition">{d.title}</h2>
            <p className="text-sm text-neutral-500 mt-1">{d.desc}</p>
          </Link>
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-sm text-neutral-400 space-y-2">
        <p><span className="text-neutral-300">Stack:</span> Next.js 15 App Router · TypeScript · Tailwind CSS 4 · React Hook Form · Zod · DaData API · Yandex SmartCaptcha</p>
        <p><span className="text-neutral-300">Features:</span> Server Components · Server Actions · API Route Handlers · Rate Limiting · Debounced Search · Accessible Dropdowns</p>
      </div>
    </div>
  );
}
