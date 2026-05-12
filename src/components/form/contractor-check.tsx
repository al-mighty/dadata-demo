'use client';

import { useActionState, useState } from 'react';
import { checkContractor, type CheckResult } from '@/app/form/actions';
import { SmartCaptcha } from '@/components/captcha/smart-captcha';

const initialState: CheckResult = { success: false };

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'text-green-400 bg-green-500/10',
  LIQUIDATING: 'text-yellow-400 bg-yellow-500/10',
  LIQUIDATED: 'text-red-400 bg-red-500/10',
  BANKRUPT: 'text-red-400 bg-red-500/10',
  REORGANIZING: 'text-yellow-400 bg-yellow-500/10',
};

export function ContractorCheck() {
  const [state, formAction, pending] = useActionState(checkContractor, initialState);
  const [captchaToken, setCaptchaToken] = useState('');
  const clientKey = process.env.NEXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY || '';

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4 max-w-md">
        <input type="hidden" name="captchaToken" value={captchaToken} />

        <div>
          <label className="block text-sm text-neutral-400 mb-1">ИНН компании или ИП</label>
          <input
            name="inn"
            placeholder="7707083893"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-blue-500 transition font-mono"
            maxLength={12}
          />
          {state.errors?.inn && <p className="text-red-400 text-xs mt-1">{state.errors.inn}</p>}
        </div>

        <div>
          <label className="block text-sm text-neutral-400 mb-1">БИК банка <span className="text-neutral-600">(необязательно)</span></label>
          <input
            name="bik"
            placeholder="044525225"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-blue-500 transition font-mono"
            maxLength={9}
          />
          {state.errors?.bik && <p className="text-red-400 text-xs mt-1">{state.errors.bik}</p>}
        </div>

        <div>
          <label className="block text-sm text-neutral-400 mb-2">Проверка</label>
          <SmartCaptcha siteKey={clientKey} onToken={setCaptchaToken} />
          {state.errors?.captchaToken && <p className="text-red-400 text-xs mt-1">{state.errors.captchaToken}</p>}
        </div>

        <button
          type="submit"
          disabled={pending || !captchaToken}
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 disabled:opacity-40 transition"
        >
          {pending ? 'Проверяю...' : 'Проверить контрагента'}
        </button>
      </form>

      {/* Results */}
      {state.success && state.company && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            Результат проверки
            <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[state.company.status] || ''}`}>
              {state.company.statusLabel}
            </span>
          </h2>

          <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
            <div className="p-5 border-b border-neutral-800">
              <h3 className="text-lg font-semibold text-white">{state.company.name}</h3>
              <p className="text-sm text-neutral-400 mt-1">{state.company.fullName}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-800">
              <Cell label="ИНН" value={state.company.inn} mono />
              <Cell label="ОГРН" value={state.company.ogrn} mono />
              <Cell label="КПП" value={state.company.kpp} mono />
              <Cell label="Тип" value={state.company.type} />
              <Cell label="Дата регистрации" value={state.company.regDate} />
              <Cell label="Сотрудников" value={state.company.employees} />
              <Cell label="Руководитель" value={state.company.director} />
              <Cell label="ОКВЭД" value={`${state.company.okved} — ${state.company.okvedName}`} />
              <div className="md:col-span-2 bg-neutral-900 p-4">
                <span className="text-xs text-neutral-500 uppercase tracking-wider">Адрес</span>
                <div className="text-sm text-white mt-1">{state.company.address}</div>
              </div>
            </div>
          </div>

          {state.bank && (
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
              <div className="p-4 border-b border-neutral-800">
                <h3 className="text-base font-medium text-white">🏦 Банк</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-800">
                <Cell label="Название" value={state.bank.name} />
                <Cell label="БИК" value={state.bank.bic} mono />
                <Cell label="SWIFT" value={state.bank.swift} mono />
                <Cell label="Корр. счёт" value={state.bank.corrAccount} mono />
                <Cell label="Город" value={state.bank.city} />
                <Cell label="ИНН" value={state.bank.inn} mono />
              </div>
            </div>
          )}

          <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-400 text-sm">⭐</span>
              <span className="text-xs text-amber-400 uppercase tracking-wider font-medium">На платном тарифе дополнительно</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Выручка и прибыль', 'Учредители и доли', 'Лицензии', 'Налоговая задолженность', 'Арбитражные дела', 'Связанные компании', 'История изменений', 'Контакты', 'Бух. отчётность'].map(f => (
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

function Cell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-neutral-900 p-4">
      <span className="text-xs text-neutral-500 uppercase tracking-wider">{label}</span>
      <div className={`text-sm text-white mt-1 ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  );
}
