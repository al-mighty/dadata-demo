const store = new Map<string, number[]>();

export function rateLimit(ip: string, limit: number, windowMs: number): { ok: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = (store.get(ip) ?? []).filter(t => now - t < windowMs);
  if (timestamps.length >= limit) return { ok: false, remaining: 0 };
  timestamps.push(now);
  store.set(ip, timestamps);
  return { ok: true, remaining: limit - timestamps.length };
}
