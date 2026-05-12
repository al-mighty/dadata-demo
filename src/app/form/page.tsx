import { RegistrationForm } from '@/components/form/registration-form';

export default function FormPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light mb-1">Форма <span className="text-blue-500 font-semibold">регистрации</span></h1>
        <p className="text-sm text-neutral-400">DaData подсказки + Zod валидация + Yandex SmartCaptcha + Server Actions</p>
      </div>
      <RegistrationForm />
    </div>
  );
}
