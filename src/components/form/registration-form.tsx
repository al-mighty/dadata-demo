'use client';

import { useActionState, useState } from 'react';
import { submitForm, type FormState } from '@/app/form/actions';
import { useDadata } from '@/hooks/use-dadata';
import { SmartCaptcha } from '@/components/captcha/smart-captcha';
import type { DadataAddress, DadataFio } from '@/lib/dadata/types';

const initialState: FormState = { success: false };

export function RegistrationForm() {
  const [state, formAction, pending] = useActionState(submitForm, initialState);
  const [captchaToken, setCaptchaToken] = useState('');

  const fio = useDadata<DadataFio>('fio');
  const addr = useDadata<DadataAddress>('address');

  const [fioFocused, setFioFocused] = useState(false);
  const [addrFocused, setAddrFocused] = useState(false);

  const clientKey = process.env.NEXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY || '';

  if (state.success) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">&#10003;</div>
        <h2 className="text-xl text-green-400 font-medium">{state.message}</h2>
        <p className="text-neutral-400 mt-2 text-sm">Данные провалидированы через Zod, капча проверена на сервере</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5 max-w-lg">
      <input type="hidden" name="captchaToken" value={captchaToken} />

      {/* Name with DaData suggestions */}
      <div className="relative">
        <label className="block text-sm text-neutral-400 mb-1">Фамилия</label>
        <input
          name="lastName"
          value={fio.query}
          onChange={e => fio.setQuery(e.target.value)}
          onFocus={() => setFioFocused(true)}
          onBlur={() => setTimeout(() => setFioFocused(false), 200)}
          placeholder="Иванов"
          className={inputClass}
        />
        {fioFocused && fio.suggestions.length > 0 && (
          <ul className={dropdownClass}>
            {fio.suggestions.map((s, i) => (
              <li key={i} onClick={() => { fio.setQuery(s.value); fio.setSuggestions([]); }} className={dropdownItemClass}>
                {s.value} <span className="text-neutral-600">{s.data.gender === 'MALE' ? 'М' : s.data.gender === 'FEMALE' ? 'Ж' : ''}</span>
              </li>
            ))}
          </ul>
        )}
        {state.errors?.lastName && <p className="text-red-400 text-xs mt-1">{state.errors.lastName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-neutral-400 mb-1">Имя</label>
          <input name="firstName" placeholder="Иван" className={inputClass} />
          {state.errors?.firstName && <p className="text-red-400 text-xs mt-1">{state.errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm text-neutral-400 mb-1">Отчество</label>
          <input name="patronymic" placeholder="Иванович" className={inputClass} />
        </div>
      </div>

      {/* Address with DaData */}
      <div className="relative">
        <label className="block text-sm text-neutral-400 mb-1">Адрес</label>
        <input
          name="address"
          value={addr.query}
          onChange={e => addr.setQuery(e.target.value)}
          onFocus={() => setAddrFocused(true)}
          onBlur={() => setTimeout(() => setAddrFocused(false), 200)}
          placeholder="Москва, ул. Ленина..."
          className={inputClass}
        />
        {addrFocused && addr.suggestions.length > 0 && (
          <ul className={dropdownClass}>
            {addr.suggestions.map((s, i) => (
              <li key={i} onClick={() => { addr.setQuery(s.value); addr.setSuggestions([]); }} className={dropdownItemClass}>
                {s.value}
              </li>
            ))}
          </ul>
        )}
        {state.errors?.address && <p className="text-red-400 text-xs mt-1">{state.errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-neutral-400 mb-1">Телефон</label>
          <input name="phone" placeholder="+79001234567" className={inputClass} />
          {state.errors?.phone && <p className="text-red-400 text-xs mt-1">{state.errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm text-neutral-400 mb-1">Email</label>
          <input name="email" type="email" placeholder="user@mail.ru" className={inputClass} />
          {state.errors?.email && <p className="text-red-400 text-xs mt-1">{state.errors.email}</p>}
        </div>
      </div>

      {/* Captcha */}
      <div>
        <label className="block text-sm text-neutral-400 mb-2">Проверка</label>
        <SmartCaptcha siteKey={clientKey} onToken={setCaptchaToken} />
        {state.errors?.captchaToken && <p className="text-red-400 text-xs mt-1">{state.errors.captchaToken}</p>}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 disabled:opacity-50 transition"
      >
        {pending ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  );
}

const inputClass = 'w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:border-blue-500 transition text-sm';
const dropdownClass = 'absolute z-10 mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 shadow-xl overflow-hidden';
const dropdownItemClass = 'px-4 py-2.5 cursor-pointer hover:bg-neutral-800 text-sm text-neutral-300 border-b border-neutral-800 last:border-0';
