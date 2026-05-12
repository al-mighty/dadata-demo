'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDadata } from '@/hooks/use-dadata';
import type { DadataParty, DadataSuggestion } from '@/lib/dadata/types';

const PREMIUM_FIELDS_COMPANY = [
  'Выручка', 'Прибыль/убыток', 'Учредители и доли',
  'Лицензии', 'Налоговая задолженность', 'Контакты (тел, email)',
  'Филиалы', 'Предшественники', 'Правопреемники',
  'Количество филиалов', 'Среднесписочная численность', 'Система налогообложения',
];

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Действующая', color: 'text-green-400 bg-green-500/10' },
  LIQUIDATING: { label: 'Ликвидируется', color: 'text-yellow-400 bg-yellow-500/10' },
  LIQUIDATED: { label: 'Ликвидирована', color: 'text-red-400 bg-red-500/10' },
  BANKRUPT: { label: 'Банкрот', color: 'text-red-400 bg-red-500/10' },
  REORGANIZING: { label: 'Реорганизация', color: 'text-yellow-400 bg-yellow-500/10' },
};

export function CompanySearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { query, setQuery, suggestions, isLoading, setSuggestions } = useDadata<DadataParty>('party-suggest');
  const [selected, setSelected] = useState<DadataSuggestion<DadataParty> | null>(null);

  // Load from URL on mount
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !query) setQuery(q);
  }, []);

  const handleSelect = (s: DadataSuggestion<DadataParty>) => {
    setSelected(s);
    setQuery(s.value);
    setSuggestions([]);
    const inn = s.data.inn;
    if (inn) router.replace(`?q=${encodeURIComponent(inn)}`, { scroll: false });
  };

  const d = selected?.data;
  const status = d ? STATUS_MAP[d.state.status] : null;
  const regDate = d ? new Date(d.state.registration_date).toLocaleDateString('ru') : '';

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(null); }}
          placeholder="ИНН или название компании..."
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
                <div className="text-xs text-neutral-500 mt-0.5">ИНН {s.data.inn} · {s.data.address?.value}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {d && (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="p-5 border-b border-neutral-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{d.name.short_with_opf}</h3>
                <p className="text-sm text-neutral-400 mt-1">{d.name.full_with_opf}</p>
              </div>
              {status && (
                <span className={`text-xs px-2 py-1 rounded shrink-0 ${status.color}`}>{status.label}</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-800">
            <InfoCell label="ИНН" value={d.inn} />
            <InfoCell label="ОГРН" value={d.ogrn} />
            <InfoCell label="КПП" value={d.kpp} />
            <InfoCell label="Тип" value={d.type === 'LEGAL' ? 'Юридическое лицо' : 'ИП'} />
            <InfoCell label="Дата регистрации" value={regDate} />
            <InfoCell label="Сотрудников" value={d.employee_count?.toString() || 'Нет данных'} />
            {d.management && <InfoCell label={d.management.post} value={d.management.name} />}
            <InfoCell label="ОКВЭД" value={`${d.okved} — ${d.okveds?.find(o => o.main)?.name || ''}`} />
            <div className="md:col-span-2 bg-neutral-900 p-4">
              <span className="text-xs text-neutral-500 uppercase tracking-wider">Адрес</span>
              <div className="text-sm text-white mt-1">{d.address?.value}</div>
            </div>
          </div>
          <div className="p-4 border-t border-neutral-800 bg-neutral-900/50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-400 text-sm">⭐</span>
              <span className="text-xs text-amber-400 uppercase tracking-wider font-medium">Доступно на платном тарифе</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {PREMIUM_FIELDS_COMPANY.map(f => (
                <div key={f} className="text-xs text-neutral-600 bg-neutral-800/50 rounded px-2.5 py-1.5 border border-neutral-800 border-dashed">
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-neutral-900 p-4">
      <span className="text-xs text-neutral-500 uppercase tracking-wider">{label}</span>
      <div className="text-sm text-white mt-1">{value}</div>
    </div>
  );
}
