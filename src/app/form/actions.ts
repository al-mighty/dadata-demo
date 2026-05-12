'use server';

import { z } from 'zod';
import { validateCaptcha } from '@/lib/captcha/validate';
import { dadataQuery } from '@/lib/dadata/client';
import type { DadataParty, DadataBank, DadataResponse } from '@/lib/dadata/types';

const checkSchema = z.object({
  inn: z.string().regex(/^\d{10,12}$/, 'ИНН: 10 или 12 цифр'),
  bik: z.string().regex(/^\d{9}$/, 'БИК: 9 цифр').optional().or(z.literal('')),
  captchaToken: z.string().min(1, 'Пройдите проверку'),
});

export type CheckResult = {
  success: boolean;
  errors?: Record<string, string>;
  company?: any;
  bank?: any;
};

export async function checkContractor(_prev: CheckResult, formData: FormData): Promise<CheckResult> {
  const raw = {
    inn: (formData.get('inn') as string || '').replace(/\s/g, ''),
    bik: (formData.get('bik') as string || '').replace(/\s/g, ''),
    captchaToken: formData.get('captchaToken') as string,
  };

  const result = checkSchema.safeParse(raw);
  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      errors[issue.path[0] as string] = issue.message;
    }
    return { success: false, errors };
  }

  const captchaValid = await validateCaptcha(result.data.captchaToken);
  if (!captchaValid) {
    return { success: false, errors: { captchaToken: 'Проверка не пройдена. Попробуйте ещё раз.' } };
  }

  // Fetch company by INN
  let company = null;
  try {
    const res = await dadataQuery<DadataParty>('party', result.data.inn);
    if (res.suggestions.length > 0) {
      const d = res.suggestions[0].data;
      const regDate = d.state.registration_date ? new Date(d.state.registration_date).toLocaleDateString('ru') : '—';
      const status = d.state.status;
      company = {
        name: d.name.short_with_opf,
        fullName: d.name.full_with_opf,
        inn: d.inn,
        ogrn: d.ogrn,
        kpp: d.kpp || '—',
        type: d.type === 'LEGAL' ? 'Юридическое лицо' : 'ИП',
        status,
        statusLabel: STATUS_MAP[status] || status,
        regDate,
        director: d.management ? `${d.management.post}: ${d.management.name}` : '—',
        okved: d.okved,
        okvedName: d.okveds?.find(o => o.main)?.name || '',
        address: d.address?.value || '—',
        employees: d.employee_count?.toString() || 'Нет данных',
      };
    }
  } catch {}

  // Fetch bank by BIK if provided
  let bank = null;
  if (result.data.bik) {
    try {
      const res = await dadataQuery<DadataBank>('bank', result.data.bik);
      if (res.suggestions.length > 0) {
        const d = res.suggestions[0].data;
        bank = {
          name: d.name.payment,
          bic: d.bic,
          swift: d.swift || '—',
          inn: d.inn || '—',
          corrAccount: d.correspondent_account || '—',
          city: d.payment_city,
          address: d.address?.value || '—',
        };
      }
    } catch {}
  }

  if (!company) {
    return { success: false, errors: { inn: 'Компания не найдена по этому ИНН' } };
  }

  return { success: true, company, bank };
}

const STATUS_MAP: Record<string, string> = {
  ACTIVE: 'Действующая',
  LIQUIDATING: 'Ликвидируется',
  LIQUIDATED: 'Ликвидирована',
  BANKRUPT: 'Банкрот',
  REORGANIZING: 'Реорганизация',
};
