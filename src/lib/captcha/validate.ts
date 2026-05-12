export async function validateCaptcha(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.SMARTCAPTCHA_SERVER_KEY;
  if (!secret) throw new Error('SMARTCAPTCHA_SERVER_KEY is not set');

  const params = new URLSearchParams({ secret, token });
  if (ip) params.set('ip', ip);

  const res = await fetch('https://smartcaptcha.cloud.yandex.ru/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const data: { status: 'ok' | 'failed'; message: string } = await res.json();
  return data.status === 'ok';
}
