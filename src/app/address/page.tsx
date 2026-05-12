import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AddressSearch } from '@/components/dadata/address-search';

export const metadata: Metadata = {
  title: 'Address Autocomplete',
  description: 'DaData Suggestions API demo: address autocomplete with breakdown into postal code, city, street, coordinates and metro stations.',
};

export default function AddressPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light mb-1">Поиск <span className="text-blue-500 font-semibold">адреса</span></h1>
        <p className="text-sm text-neutral-400">DaData Suggestions API — автокомплит с разбором на составляющие</p>
      </div>
      <Suspense><AddressSearch /></Suspense>
    </div>
  );
}
