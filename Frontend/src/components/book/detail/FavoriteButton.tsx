import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useApi } from '@/hooks/useApi';
import { favoriteService } from '@/services/favoriteService';
import { cache } from '@/utils/cache';
import { cn } from '@/utils/cn';

interface Props {
  bookId: number;
}

export function FavoriteButton({ bookId }: Props) {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const { data: initial, isLoading } = useApi(
    isAuthenticated ? `favorite:${bookId}` : null,
    () => favoriteService.isBookFavorite(bookId),
    { enabled: isAuthenticated },
  );

  const [isFavorite, setIsFavorite] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (initial !== null && initial !== undefined) setIsFavorite(initial);
  }, [initial]);

  useEffect(() => {
    setIsFavorite(false);
  }, [bookId]);

  async function toggle() {
    if (!isAuthenticated) {
      toast.info('برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید.');
      navigate('/login', { state: { from: `/books/${bookId}` } });
      return;
    }
    if (isPending) return;

    const previous = isFavorite;
    setIsPending(true);
    try {
      if (isFavorite) {
        await favoriteService.removeFromFavorite(bookId);
        setIsFavorite(false);
        toast.success('از علاقه‌مندی‌ها حذف شد.');
      } else {
        await favoriteService.addToFavorite(bookId);
        setIsFavorite(true);
        toast.success('به علاقه‌مندی‌ها اضافه شد.');
      }
      cache.invalidate('favorites');
    } catch {
      setIsFavorite(previous);
      toast.error('عملیات ناموفق بود. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending || (isAuthenticated && isLoading)}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all',
        isFavorite
          ? 'border-copper-500/60 bg-copper-500/15 text-copper-300'
          : 'border-ink-700 bg-ink-900/60 text-ink-300 hover:border-copper-500/40 hover:text-copper-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
        'disabled:cursor-not-allowed disabled:opacity-60',
      )}
    >
      <HeartIcon filled={isFavorite} />
    </button>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20.5S4.5 16.2 4.5 10.5A3.9 3.9 0 0 1 12 8.3a3.9 3.9 0 0 1 7.5 2.2c0 5.7-7.5 10-7.5 10Z" />
    </svg>
  );
}
