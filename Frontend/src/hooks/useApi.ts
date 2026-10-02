import { useCallback, useEffect, useState } from 'react';
import { cache } from '@/utils/cache';

interface Options {
  ttl?: number;
  enabled?: boolean;
}

interface Result<T> {
  data: T | null;
  error: unknown;
  isLoading: boolean;
  refetch: () => void;
}

export function useApi<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  options: Options = {},
): Result<T> {
  const { ttl, enabled = true } = options;
  const [data, setData] = useState<T | null>(() =>
    key && enabled ? cache.get<T>(key) : null,
  );
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState<boolean>(
    enabled && !(key && cache.get<T>(key)),
  );
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!key || !enabled) return;

    const cached = cache.get<T>(key);
    if (cached !== null) {
      setData(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        if (ttl) cache.set(key, result, ttl);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled, reloadKey]);

  const refetch = useCallback(() => {
    if (key) cache.invalidate(key);
    setReloadKey((k) => k + 1);
  }, [key]);

  return { data, error, isLoading, refetch };
}