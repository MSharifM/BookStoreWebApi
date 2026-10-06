import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { cartService } from '@/services/cartService';
import { cache } from '@/utils/cache';
import { formatPrice, toPersianDigits } from '@/utils/format';
import { resolveImageUrl } from '@/utils/image';
import { cn } from '@/utils/cn';
import type { BookDetailResponse } from '@/types/book';

const MAX_BACKEND_COUNT = 100;

interface Props {
  bookId: number;
  book: BookDetailResponse;
}

export function BookPurchasePanel({ bookId, book }: Props) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const maxAddable = Math.max(0, Math.min(book.stockQuantity, MAX_BACKEND_COUNT));
  const isOutOfStock = book.stockQuantity <= 0;

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setQuantity(1);
  }, [bookId]);

  async function handleAddToCart() {
    if (!isAuthenticated) {
      toast.info('برای افزودن به سبد خرید ابتدا وارد شوید.');
      navigate('/login', { state: { from: `/books/${bookId}` } });
      return;
    }
    if (quantity < 1 || quantity > maxAddable) {
      toast.error('تعداد انتخاب‌شده معتبر نیست.');
      return;
    }

    setIsAdding(true);
    try {
      await cartService.addToCart(bookId, quantity);
      cache.invalidate('cart');
      toast.success('به سبد خرید اضافه شد.');
    } catch {
      toast.error('افزودن به سبد خرید ناموفق بود.');
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="rounded-3xl border border-ink-700/70 bg-ink-900/50 p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-ink-400">قیمت</p>
          <p className="mt-1 text-2xl font-extrabold text-accent-300 fa-num sm:text-3xl">
            {formatPrice(book.price)}
          </p>
        </div>
        <StockBadge quantity={book.stockQuantity} />
      </div>

      {isOutOfStock ? (
        <div className="rounded-2xl border border-copper-500/30 bg-copper-500/5 px-4 py-4 text-center text-sm text-copper-200">
          این کتاب در حال حاضر موجود نیست.
        </div>
      ) : (
        <div className="space-y-4">
          <QuantitySelector
            value={quantity}
            min={1}
            max={Math.max(1, maxAddable)}
            onChange={setQuantity}
            disabled={isAdding}
          />
          <Button
            type="button"
            size="lg"
            fullWidth
            isLoading={isAdding}
            disabled={isAdding}
            onClick={handleAddToCart}
          >
            {isAdding ? 'داریم اضافه می‌کنیم…' : 'افزودن به سبد خرید'}
          </Button>
        </div>
      )}

      {book.demoPDFPath && (
        <a
          href={resolveImageUrl(book.demoPDFPath)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-ink-700 bg-ink-900/60 px-4 py-2.5 text-sm font-semibold text-ink-200 transition-colors hover:border-accent-500/50 hover:bg-accent-500/10 hover:text-accent-200"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
            <path d="M15 3v5h5" />
          </svg>
          مطالعه‌ی نمونه
        </a>
      )}
    </div>
  );
}

function StockBadge({ quantity }: { quantity: number }) {
  const isOut = quantity <= 0;
  return (
    <span
      className={cn(
        'shrink-0 rounded-full border px-3 py-1 text-xs font-semibold',
        isOut
          ? 'border-copper-500/40 bg-copper-500/10 text-copper-200'
          : 'border-moss-500/40 bg-moss-500/10 text-moss-200',
      )}
    >
      {isOut ? 'ناموجود' : `موجود · ${toPersianDigits(quantity)} نسخه`}
    </span>
  );
}

function QuantitySelector({
  value,
  min,
  max,
  onChange,
  disabled,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink-200">تعداد</span>
      <div className="inline-flex items-center overflow-hidden rounded-xl border border-ink-700 bg-ink-900/60">
        <button
          type="button"
          onClick={() => onChange(clamp(value + 1))}
          disabled={disabled || value >= max}
          aria-label="افزایش تعداد"
          className="flex h-10 w-10 items-center justify-center text-ink-200 transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={toPersianDigits(value)}
          onChange={(e) => {
            const raw = e.target.value.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
            const num = parseInt(raw, 10);
            if (!Number.isNaN(num)) onChange(clamp(num));
          }}
          aria-label="تعداد"
          className="h-10 w-14 border-x border-ink-700 bg-transparent text-center text-sm font-bold text-ink-50 outline-none focus:bg-ink-800"
        />
        <button
          type="button"
          onClick={() => onChange(clamp(value - 1))}
          disabled={disabled || value <= min}
          aria-label="کاهش تعداد"
          className="flex h-10 w-10 items-center justify-center text-ink-200 transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14" /></svg>
        </button>
      </div>
      {max <= 1 && (
        <p className="mt-1.5 text-xs text-ink-500 fa-num">
          حداکثر تعداد قابل سفارش: ۱
        </p>
      )}
    </div>
  );
}
