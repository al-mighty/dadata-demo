'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from './use-debounce';
import type { DadataSuggestion } from '@/lib/dadata/types';

export function useDadata<T>(entity: string, minLength = 2) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<DadataSuggestion<T>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < minLength) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    const base = window.location.pathname.startsWith('/dadata') ? '/dadata' : '';
    fetch(`${base}/api/dadata/${entity}?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(data => setSuggestions(data.suggestions || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [debouncedQuery, entity, minLength]);

  return { query, setQuery, suggestions, isLoading, setSuggestions };
}
