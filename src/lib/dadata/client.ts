import { DADATA_ENDPOINTS, type DadataEntity } from './constants';
import type { DadataResponse } from './types';

export async function dadataQuery<T>(
  entity: DadataEntity,
  query: string,
  options?: Record<string, unknown>,
): Promise<DadataResponse<T>> {
  const apiKey = process.env.DADATA_API_KEY;
  if (!apiKey) throw new Error('DADATA_API_KEY is not set');

  const res = await fetch(DADATA_ENDPOINTS[entity], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Token ${apiKey}`,
    },
    body: JSON.stringify({ query, count: 10, ...options }),
  });

  if (!res.ok) throw new Error(`DaData API error: ${res.status}`);
  return res.json();
}
