import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CompanySearch } from '@/components/dadata/company-search';

export const metadata: Metadata = {
  title: 'Company Lookup',
  description: 'DaData Party API demo: search companies by TIN or name, view details including management, OKVED codes and registration status.',
};

export default function CompanyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light mb-1">Поиск <span className="text-blue-500 font-semibold">компании</span></h1>
        <p className="text-sm text-neutral-400">DaData Party API — поиск по ИНН или названию организации</p>
      </div>
      <Suspense><CompanySearch /></Suspense>
    </div>
  );
}
