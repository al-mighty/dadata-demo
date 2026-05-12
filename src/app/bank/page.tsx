import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BankSearch } from '@/components/dadata/bank-search';

export const metadata: Metadata = {
  title: 'Bank Lookup',
  description: 'DaData Bank API demo: search banks by BIC or name, view correspondent account, SWIFT code and address.',
};

export default function BankPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light mb-1">Поиск <span className="text-blue-500 font-semibold">банка</span></h1>
        <p className="text-sm text-neutral-400">DaData Bank API — поиск по БИК или названию банка</p>
      </div>
      <Suspense><BankSearch /></Suspense>
    </div>
  );
}
