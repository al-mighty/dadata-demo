export interface DadataSuggestion<T> {
  value: string;
  unrestricted_value: string;
  data: T;
}

export interface DadataResponse<T> {
  suggestions: DadataSuggestion<T>[];
}

export interface DadataAddress {
  postal_code: string | null;
  country: string;
  region_with_type: string | null;
  city_with_type: string | null;
  city: string | null;
  street_with_type: string | null;
  street: string | null;
  house: string | null;
  flat: string | null;
  geo_lat: string | null;
  geo_lon: string | null;
  fias_id: string | null;
  metro: { name: string; line: string; distance: number }[] | null;
}

export interface DadataParty {
  inn: string;
  ogrn: string;
  kpp: string;
  name: { full_with_opf: string; short_with_opf: string };
  management: { name: string; post: string } | null;
  address: { value: string };
  okved: string;
  okveds: { code: string; name: string; main: boolean }[];
  opf: { short: string; full: string };
  state: {
    status: 'ACTIVE' | 'LIQUIDATING' | 'LIQUIDATED' | 'BANKRUPT' | 'REORGANIZING';
    registration_date: number;
    actuality_date: number;
    liquidation_date: number | null;
  };
  type: 'LEGAL' | 'INDIVIDUAL';
  employee_count: number | null;
}

export interface DadataBank {
  bic: string;
  swift: string | null;
  inn: string | null;
  kpp: string | null;
  correspondent_account: string | null;
  name: { payment: string; short: string | null; full: string | null };
  payment_city: string;
  opf: { type: string };
  address: { value: string };
  state: { status: 'ACTIVE' | 'LIQUIDATING' | 'LIQUIDATED'; registration_date: number };
}

export interface DadataFio {
  surname: string | null;
  name: string | null;
  patronymic: string | null;
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN';
}
