'use server';

import { z } from 'zod';
import { validateCaptcha } from '@/lib/captcha/validate';

const formSchema = z.object({
  lastName: z.string().min(1, 'Укажите фамилию'),
  firstName: z.string().min(1, 'Укажите имя'),
  patronymic: z.string().optional(),
  address: z.string().min(1, 'Укажите адрес'),
  phone: z.string().regex(/^\+7\d{10}$/, 'Формат: +7XXXXXXXXXX'),
  email: z.string().email('Некорректный email'),
  captchaToken: z.string().min(1, 'Пройдите проверку'),
});

export type FormState = {
  success: boolean;
  errors?: Record<string, string>;
  message?: string;
};

export async function submitForm(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = {
    lastName: formData.get('lastName') as string,
    firstName: formData.get('firstName') as string,
    patronymic: formData.get('patronymic') as string,
    address: formData.get('address') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    captchaToken: formData.get('captchaToken') as string,
  };

  const result = formSchema.safeParse(raw);
  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      errors[issue.path[0] as string] = issue.message;
    }
    return { success: false, errors };
  }

  const captchaValid = await validateCaptcha(result.data.captchaToken);
  if (!captchaValid) {
    return { success: false, errors: { captchaToken: 'Проверка не пройдена' } };
  }

  return { success: true, message: 'Форма успешно отправлена!' };
}
