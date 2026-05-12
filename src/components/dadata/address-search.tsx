'use client';

import { useState } from 'react';
import { useDadata } from '@/hooks/use-dadata';
import type { DadataAddress, DadataSuggestion } from '@/lib/dadata/types';

export function AddressSearch() {
  const { query, setQuery, suggestions, isLoading, setSuggestions } = useDadata<DadataAddress>('address');
  const [selected, setSelected] = useState<DadataSuggestion<DadataAddress> | null>(null);

  const handleSelect = (s: DadataSuggestion<DadataAddress>) => {
    setSelected(s);
    setQuery(s.value);
    setSuggestions([]);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(null); }}
          placeholder="Начните вводить адрес..."
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-blue-500 transition"
        />
        {isLoading && <div className="absolute right-3 top-3.5 text-neutral-500 text-sm">...</div>}

        {suggestions.length > 0 && !selected && (
          <ul className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 shadow-xl overflow-hidden" role="listbox">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => handleSelect(s)}
                className="px-4 py-3 cursor-pointer hover:bg-neutral-800 text-sm text-neutral-300 border-b border-neutral-800 last:border-0"
                role="option"
              >
                {s.value}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Индекс" value={selected.data.postal_code} />
          <Field label="Регион" value={selected.data.region_with_type} />
          <Field label="Город" value={selected.data.city_with_type} />
          <Field label="Улица" value={selected.data.street_with_type} />
          <Field label="Дом" value={selected.data.house} />
          <Field label="Квартира" value={selected.data.flat} />
          <Field label="Широта" value={selected.data.geo_lat} />
          <Field label="Долгота" value={selected.data.geo_lon} />
          <Field label="ФИАС ID" value={selected.data.fias_id} />
          {selected.data.metro && selected.data.metro.length > 0 && (
            <div className="md:col-span-2">
              <span className="text-xs text-neutral-500 uppercase tracking-wider">Метро</span>
              <div className="flex gap-2 mt-1 flex-wrap">
                {selected.data.metro.map((m, i) => (
                  <span key={i} className="text-sm bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                    {m.name} ({m.distance} м)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2 bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-400 text-sm">⭐</span>
            <span className="text-xs text-amber-400 uppercase tracking-wider font-medium">Доступно на платном тарифе</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['Часовой пояс', 'Код КЛАДР', 'Код ИФНС', 'Стоимость кв.м.', 'Район города', 'Федеральный округ', 'Кадастровый номер', 'Этаж', 'Подъезд'].map(f => (
              <div key={f} className="text-xs text-neutral-600 bg-neutral-800/50 rounded px-2.5 py-1.5 border border-neutral-800 border-dashed">
                {f}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="bg-neutral-900 rounded-lg p-3 border border-neutral-800">
      <span className="text-xs text-neutral-500 uppercase tracking-wider">{label}</span>
      <div className="text-sm text-white mt-1">{value}</div>
    </div>
  );
}
