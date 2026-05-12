export const DADATA_ENDPOINTS = {
  address: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
  party: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party',
  'party-suggest': 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party',
  bank: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/bank',
  'bank-suggest': 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/bank',
  fio: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio',
} as const;

export type DadataEntity = keyof typeof DADATA_ENDPOINTS;
