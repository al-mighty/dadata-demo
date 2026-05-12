import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'DaData Demo — Address, Company & Bank Search',
  description: 'Next.js 15 demo: DaData API integration with Yandex SmartCaptcha',
};

const NAV = [
  { href: '/', label: 'Главная' },
  { href: '/address', label: 'Адрес' },
  { href: '/company', label: 'Компания' },
  { href: '/bank', label: 'Банк' },
  { href: '/form', label: 'Форма' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`${inter.className} bg-neutral-950 text-neutral-100 min-h-screen flex flex-col`}>
        <header className="border-b border-neutral-800 sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-lg font-light">
              Da<span className="text-blue-500 font-semibold">Data</span> Demo
            </Link>
            <nav className="flex gap-1">
              {NAV.map(n => (
                <Link key={n.href} href={n.href} className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
          {children}
        </main>

        <footer className="border-t border-neutral-800 py-6 text-center text-sm text-neutral-500">
          <a href="https://cheslav.space" className="hover:text-blue-400 transition">Vyacheslav Kovalev</a>
          {' · '}
          <a href="https://github.com/al-mighty/dadata-demo" className="hover:text-blue-400 transition">Source</a>
        </footer>
      </body>
    </html>
  );
}
