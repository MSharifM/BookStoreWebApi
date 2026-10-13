import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookService } from '@/services/bookService';
import { BookSortBy } from '@/types/home';
import type { BookSummaryResponse } from '@/types/home';
import type { SearchBooksParams } from '@/types/search';
import { useDebounce } from './useDebounce';

const PAGE_SIZE = 15;

export interface ParsedFilters {
  Name: string;
  ISBN: string;
  FromPrice: number | undefined;
  ToPrice: number | undefined;
  IsExist: boolean;
  CategoryIds: number[];
  PublisherIds: number[];
  AuthorIds: number[];
  SortBy: BookSortBy;
}

function parseIds(values: string[]): number[] {
  return values
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function parsePrice(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function parseFilters(params: URLSearchParams): ParsedFilters {
  const sort = Number(params.get('SortBy'));
  return {
    Name: params.get('Name')?.trim() ?? '',
    ISBN: params.get('ISBN')?.trim() ?? '',
    FromPrice: parsePrice(params.get('FromPrice')),
    ToPrice: parsePrice(params.get('ToPrice')),
    IsExist: params.get('IsExist') !== 'false',
    CategoryIds: parseIds(params.getAll('CategoryIds')),
    PublisherIds: parseIds(params.getAll('PublisherIds')),
    AuthorIds: parseIds(params.getAll('AuthorIds')),
    SortBy: (Number.isFinite(sort) && sort >= 1 && sort <= 5
      ? sort
      : BookSortBy.Newest) as BookSortBy,
  };
}

export function useBookSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  const [nameInput, setNameInput] = useState(filters.Name);
  const [isbnInput, setIsbnInput] = useState(filters.ISBN);
  const [fromPriceInput, setFromPriceInput] = useState(
    filters.FromPrice?.toString() ?? '',
  );
  const [toPriceInput, setToPriceInput] = useState(
    filters.ToPrice?.toString() ?? '',
  );

  // 🔑 آخرین مقداری که خودمان به URL پاس دادیم
  const lastAppliedRef = useRef({
    name: filters.Name,
    isbn: filters.ISBN,
    from: filters.FromPrice?.toString() ?? '',
    to: filters.ToPrice?.toString() ?? '',
  });

  const debouncedName = useDebounce(nameInput, 400);
  const debouncedIsbn = useDebounce(isbnInput, 400);
  const debouncedFrom = useDebounce(fromPriceInput, 500);
  const debouncedTo = useDebounce(toPriceInput, 500);

  const priceError = useMemo<'from' | 'to' | 'range' | null>(() => {
    const from = debouncedFrom ? Number(debouncedFrom) : NaN;
    const to = debouncedTo ? Number(debouncedTo) : NaN;
    if (debouncedFrom && (!Number.isFinite(from) || from < 0)) return 'from';
    if (debouncedTo && (!Number.isFinite(to) || to < 0)) return 'to';
    if (
      debouncedFrom &&
      debouncedTo &&
      Number.isFinite(from) &&
      Number.isFinite(to) &&
      from > to
    )
      return 'range';
    return null;
  }, [debouncedFrom, debouncedTo]);

  const updateParam = useCallback(
    (key: string, value: string | string[] | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete(key);
          if (Array.isArray(value)) {
            value.forEach((v) => next.append(key, v));
          } else if (value !== null && value !== '') {
            next.set(key, value);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Sync URL → input (فقط وقتی از بیرون عوض شده)
  useEffect(() => {
    if (filters.Name !== lastAppliedRef.current.name) {
      lastAppliedRef.current.name = filters.Name;
      setNameInput(filters.Name);
    }
  }, [filters.Name]);

  useEffect(() => {
    if (filters.ISBN !== lastAppliedRef.current.isbn) {
      lastAppliedRef.current.isbn = filters.ISBN;
      setIsbnInput(filters.ISBN);
    }
  }, [filters.ISBN]);

  useEffect(() => {
    const next = filters.FromPrice?.toString() ?? '';
    if (next !== lastAppliedRef.current.from) {
      lastAppliedRef.current.from = next;
      setFromPriceInput(next);
    }
  }, [filters.FromPrice]);

  useEffect(() => {
    const next = filters.ToPrice?.toString() ?? '';
    if (next !== lastAppliedRef.current.to) {
      lastAppliedRef.current.to = next;
      setToPriceInput(next);
    }
  }, [filters.ToPrice]);

  // Sync debounced → URL
  useEffect(() => {
    if (debouncedName === lastAppliedRef.current.name) return;
    lastAppliedRef.current.name = debouncedName;
    updateParam('Name', debouncedName || null);
  }, [debouncedName, updateParam]);

  useEffect(() => {
    if (debouncedIsbn === lastAppliedRef.current.isbn) return;
    lastAppliedRef.current.isbn = debouncedIsbn;
    updateParam('ISBN', debouncedIsbn || null);
  }, [debouncedIsbn, updateParam]);

  useEffect(() => {
    if (priceError) return;
    if (debouncedFrom === lastAppliedRef.current.from) return;
    lastAppliedRef.current.from = debouncedFrom;
    updateParam('FromPrice', debouncedFrom || null);
  }, [debouncedFrom, priceError, updateParam]);

  useEffect(() => {
    if (priceError) return;
    if (debouncedTo === lastAppliedRef.current.to) return;
    lastAppliedRef.current.to = debouncedTo;
    updateParam('ToPrice', debouncedTo || null);
  }, [debouncedTo, priceError, updateParam]);

  const [books, setBooks] = useState<BookSummaryResponse[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialError, setInitialError] = useState<unknown>(null);
  const [loadMoreError, setLoadMoreError] = useState<unknown>(null);

  const filtersKeyRef = useRef(filtersKey);
  filtersKeyRef.current = filtersKey;

  const buildParams = useCallback(
    (pageNum: number): SearchBooksParams => ({
      Name: filters.Name || undefined,
      ISBN: filters.ISBN || undefined,
      FromPrice: filters.FromPrice,
      ToPrice: filters.ToPrice,
      IsExist: filters.IsExist,
      CategoryIds: filters.CategoryIds,
      PublisherIds: filters.PublisherIds,
      AuthorIds: filters.AuthorIds,
      SortBy: filters.SortBy,
      page: pageNum,
    }),
    [filters],
  );

  useEffect(() => {
    if (priceError) return;
    let cancelled = false;

    setBooks([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
    setInitialError(null);
    setLoadMoreError(null);

    bookService
      .searchBooks(buildParams(1))
      .then((data) => {
        if (cancelled) return;
        setBooks(data);
        setHasMore(data.length === PAGE_SIZE);
      })
      .catch((err) => {
        if (cancelled) return;
        setInitialError(err);
      })
      .finally(() => {
        if (cancelled) return;
        setInitialLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, priceError]);

  const loadMore = useCallback(async () => {
    if (loadingMore || initialLoading || !hasMore || loadMoreError) return;
    const snapshotKey = filtersKeyRef.current;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const data = await bookService.searchBooks(buildParams(nextPage));
      if (snapshotKey !== filtersKeyRef.current) return;
      setBooks((prev) => {
        const seen = new Set(prev.map((b) => b.bookId));
        const unique = data.filter((b) => !seen.has(b.bookId));
        if (data.length > 0 && unique.length === 0) {
          setHasMore(false);
          return prev;
        }
        return [...prev, ...unique];
      });
      setPage(nextPage);
      if (data.length < PAGE_SIZE) setHasMore(false);
    } catch (err) {
      if (snapshotKey !== filtersKeyRef.current) return;
      setLoadMoreError(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, initialLoading, hasMore, loadMoreError, page, buildParams]);

  const retryLoadMore = useCallback(() => setLoadMoreError(null), []);

  const toggleCategory = useCallback(
    (id: number) => {
      const next = filters.CategoryIds.includes(id)
        ? filters.CategoryIds.filter((x) => x !== id)
        : [...filters.CategoryIds, id];
      updateParam('CategoryIds', next.map(String));
    },
    [filters.CategoryIds, updateParam],
  );

  const togglePublisher = useCallback(
    (id: number) => {
      const next = filters.PublisherIds.includes(id)
        ? filters.PublisherIds.filter((x) => x !== id)
        : [...filters.PublisherIds, id];
      updateParam('PublisherIds', next.map(String));
    },
    [filters.PublisherIds, updateParam],
  );

  const toggleAuthor = useCallback(
    (id: number) => {
      const next = filters.AuthorIds.includes(id)
        ? filters.AuthorIds.filter((x) => x !== id)
        : [...filters.AuthorIds, id];
      updateParam('AuthorIds', next.map(String));
    },
    [filters.AuthorIds, updateParam],
  );

  const setIsExist = useCallback(
    (value: boolean) => updateParam('IsExist', value ? null : 'false'),
    [updateParam],
  );

  const setSortBy = useCallback(
    (value: BookSortBy) =>
      updateParam('SortBy', value === BookSortBy.Newest ? null : String(value)),
    [updateParam],
  );

  const clearName = useCallback(() => {
    lastAppliedRef.current.name = '';
    setNameInput('');
    updateParam('Name', null);
  }, [updateParam]);

  const clearIsbn = useCallback(() => {
    lastAppliedRef.current.isbn = '';
    setIsbnInput('');
    updateParam('ISBN', null);
  }, [updateParam]);

  const clearPrice = useCallback(() => {
    lastAppliedRef.current.from = '';
    lastAppliedRef.current.to = '';
    setFromPriceInput('');
    setToPriceInput('');
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('FromPrice');
        next.delete('ToPrice');
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const clearAll = useCallback(() => {
    lastAppliedRef.current = { name: '', isbn: '', from: '', to: '' };
    setNameInput('');
    setIsbnInput('');
    setFromPriceInput('');
    setToPriceInput('');
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return {
    filters,
    inputs: {
      name: nameInput,
      setName: setNameInput,
      isbn: isbnInput,
      setIsbn: setIsbnInput,
      fromPrice: fromPriceInput,
      setFromPrice: setFromPriceInput,
      toPrice: toPriceInput,
      setToPrice: setToPriceInput,
    },
    priceError,
    books,
    hasMore,
    initialLoading,
    loadingMore,
    initialError,
    loadMoreError,
    loadMore,
    retryLoadMore,
    toggleCategory,
    togglePublisher,
    toggleAuthor,
    setIsExist,
    setSortBy,
    clearName,
    clearIsbn,
    clearPrice,
    clearAll,
    updateParam,
  };
}
