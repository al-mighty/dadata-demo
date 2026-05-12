'use client';

import { useState } from 'react';
import { useDadata } from '@/hooks/use-dadata';
import type { DadataBank, DadataSuggestion } from '@/lib/dadata/types';

export function BankSearch() {
  const { query, setQuery, suggestions, isLoading, setSuggestions } = useDadata<DadataBank>('bank-suggest');
  const [selected, setSelected] = useState<DadataSuggestion<DadataBank> | null>(null);

  const handleSelect = (s: DadataSuggestion<DadataBank>) => {
    setSelected(s);
    setQuery(s.value);
    setSuggestions([]);
  };

  const d = selected?.data;

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(null); }}
          placeholder="БИК или название банка..."
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-blue-500 transition"
        />
        {isLoading && <div className="absolute right-3 top-3.5 text-neutral-500 text-sm">...</div>}

        {suggestions.length > 0 && !selected && (
          <ul className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 shadow-xl overflow-hidden" role="listbox">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => handleSelect(s)}
                className="px-4 py-3 cursor-pointer hover:bg-neutral-800 border-b border-neutral-800 last:border-0"
                role="option"
              >
                <div className="text-sm text-white">{s.value}</div>
                <div className="text-xs text-neutral-500 mt-0.5">БИК {s.data.bic}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {d && (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="p-5 border-b border-neutral-800">
            <h3 className="text-lg font-semibold text-white">{d.name.payment}</h3>
            {d.name.full && <p className="text-sm text-neutral-400 mt-1">{d.name.full}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-800">
            <Cell label="БИК" value={d.bic} />
            <Cell label="SWIFT" value={d.swift || 'Нет'} />
            <Cell label="ИНН" value={d.inn || 'Нет'} />
            <Cell label="КПП" value={d.kpp || 'Нет'} />
            <Cell label="Корр. счёт" value={d.correspondent_account || 'Нет'} />
            <Cell label="Город" value={d.payment_city} />
            <div className="md:col-span-2 bg-neutral-900 p-4">
              <span className="text-xs text-neutral-500 uppercase tracking-wider">Адрес</span>
              <div className="text-sm text-white mt-1">{d.address?.value}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-neutral-900 p-4">
      <span className="text-xs text-neutral-500 uppercase tracking-wider">{label}</span>
      <div className="text-sm text-white mt-1 font-mono">{value}</div>
    </div>
  );
}
