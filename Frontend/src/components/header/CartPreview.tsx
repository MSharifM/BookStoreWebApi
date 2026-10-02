import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { useClickOutside } from '@/hooks/useClickOutside';
import { cartService } from '@/services/cartService';
import { SafeImage } from '@/components/common/SafeImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatNumber, formatPrice } from '@/utils/format';
import { TTL } from '@/utils/cache';
import { cn } from '@/utils/cn';

export function CartPreview() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useApi(
    isAuthenticated && open ? 'cart:current' : null,
    () => cartService.getCart(),
    { ttl: TTL.userScoped, enabled: isAuthenticated && open },
  );

  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open);
  const items = data?.cartItems ?? [];
  const totalItems = items.reduce((sum, i) => sum + i.countItemInCart, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.totalPrice, 0);

  if (!isAuthenticated) {
    return (
      <Link
        to="/cart"
        aria-label="سبد خرید"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-700/80 bg-ink-900/60 text-ink-300 transition-colors hover:border-ink-600 hover:text-ink-100"
      >
        <CartIcon />
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="سبد خرید"
        className={cn(
          'relative flex h-10 w-10 items-center justify-center rounded-xl border transition-colors',
          open
            ? 'border-accent-500/60 bg-accent-500/10 text-accent-200'
            : 'border-ink-700/80 bg-ink-900/60 text-ink-300 hover:border-ink-600 hover:text-ink-100',
        )}
      >
        <CartIcon />
        {totalItems > 0 && (
          <span className="absolute -end-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-extrabold text-ink-950 fa-num">
            {formatNumber(totalItems)}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="پیش‌نمایش سبد خرید"
          className="absolute end-0 top-full z-50 mt-2 w-[340px] max-w-[90vw] animate-fade-in overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/95 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-lg"
        >
          <div className="border-b border-ink-800 px-4 py-3">
            <p className="text-sm font-bold text-ink-100">سبد خرید</p>
          </div>

          {isLoading && (
            <div className="space-y-2 p-3">
              {[0, 1].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-14 w-10" rounded="md" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && items.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-ink-400">سبد خرید خالی است.</p>
              <Link
                to="/books"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex text-xs font-semibold text-accent-300 hover:text-accent-200"
              >
                شروع خرید →
              </Link>
            </div>
          )}

          {!isLoading && items.length > 0 && (
            <>
              <ul className="max-h-72 overflow-y-auto">
                {items.slice(0, 5).map((item) => (
                  <li
                    key={item.bookId}
                    className="flex items-center gap-3 border-b border-ink-800/60 px-3 py-2.5 last:border-b-0"
                  >
                    <SafeImage
                      src={item.bookImage}
                      alt={item.bookName}
                      className="h-14 w-10 shrink-0 rounded-md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-ink-100">
                        {item.bookName}
                      </p>
                      <p className="mt-0.5 text-[11px] text-ink-400">
                        تعداد: <span className="fa-num">{formatNumber(item.countItemInCart)}</span>
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-accent-300 fa-num">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-ink-800 bg-ink-900/60 p-3">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-ink-300">جمع کل</span>
                  <span className="font-extrabold text-accent-300 fa-num">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/cart"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-ink-700 px-3 py-2 text-center text-xs font-semibold text-ink-200 transition-colors hover:bg-ink-800"
                  >
                    مشاهده سبد
                  </Link>
                  <Link
                    to="/cart/checkout"
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-accent-500 px-3 py-2 text-center text-xs font-bold text-ink-950 transition-colors hover:bg-accent-400"
                  >
                    پرداخت
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
    </svg>
  );
}