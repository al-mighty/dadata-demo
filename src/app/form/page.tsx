import type { Metadata } from 'next';
import { ContractorCheck } from '@/components/form/contractor-check';

export const metadata: Metadata = {
  title: 'Contractor Validation',
  description: 'Enter a TIN to get a full contractor report. Server Actions, Zod validation, Yandex SmartCaptcha protection.',
};

export default function FormPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light mb-1">Проверка <span className="text-blue-500 font-semibold">контрагента</span></h1>
        <p className="text-sm text-neutral-400">Введите ИНН — получите полный отчёт. Server Actions + Zod + SmartCaptcha</p>
      </div>
      <ContractorCheck />
    </div>
  );
}
