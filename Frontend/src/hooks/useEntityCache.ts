import { useCallback, useState } from 'react';
import type { Entity } from '@/types/search';

export function useEntityCache(cacheKey: string, initial: Entity[] = []) {
  const [entities, setEntities] = useState<Entity[]>(() => {
    try {
      const raw = sessionStorage.getItem(cacheKey);
      const parsed = raw ? (JSON.parse(raw) as Entity[]) : [];
      // merge with initial (URL-derived)، بدون تکرار
      const seen = new Set(parsed.map((e) => e.id));
      const merged = [...parsed];
      for (const item of initial) {
        if (!seen.has(item.id)) merged.push(item);
      }
      return merged;
    } catch {
      return initial;
    }
  });

  const persist = useCallback(
    (next: Entity[]) => {
      setEntities(next);
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(next));
      } catch {
        /* ignore quota errors */
      }
    },
    [cacheKey],
  );

  const upsert = useCallback(
    (items: Entity[]) => {
      persist(
        [...entities, ...items].filter(
          (item, i, arr) => arr.findIndex((x) => x.id === item.id) === i,
        ),
      );
    },
    [entities, persist],
  );

  const remove = useCallback(
    (id: number) => persist(entities.filter((e) => e.id !== id)),
    [entities, persist],
  );

  const replace = useCallback(
    (ids: number[]) => {
      const map = new Map(entities.map((e) => [e.id, e]));
      const next = ids.map(
        (id) => map.get(id) ?? { id, name: `#${id}`, image: '' },
      );
      persist(next);
    },
    [entities, persist],
  );

  return { entities, persist, upsert, remove, replace };
}
