import { useState } from 'react';
import { SafeImage } from '@/components/common/SafeImage';
import { Stars } from '@/components/ui/Stars';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { reviewService } from '@/services/reviewService';
import { formatPersianDate } from '@/utils/date';
import { toPersianDigits } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { ReviewResponse } from '@/types/review';

interface Props {
  review: ReviewResponse;
  onRefetch: () => void;
}

export function ReviewCard({ review, onRefetch }: Props) {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [isPending, setIsPending] = useState(false);

  const activeReaction = review.userReaction?.isLike ?? null;

  async function react(isLike: boolean) {
    if (!isAuthenticated) {
      toast.info('برای واکنش دادن ابتدا وارد شوید.');
      return;
    }
    if (isPending) return;

    setIsPending(true);
    try {
      await reviewService.reactToReview({ reviewId: review.reviewId, isLike });
      onRefetch();
    } catch {
      toast.error('واکنش ناموفق بود.');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <article className="rounded-2xl border border-ink-700/70 bg-ink-900/40 p-4">
      <header className="mb-3 flex items-start gap-3">
        <SafeImage
          src={review.userImage}
          alt={review.userName}
          className="h-10 w-10 shrink-0 rounded-full"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="truncate text-sm font-bold text-ink-100">
              {review.userName}
            </span>
            <Stars value={review.rate} size="sm" />
            <span className="text-xs text-ink-500 fa-num">
              {formatPersianDate(review.createDate)}
            </span>
          </div>
        </div>
      </header>

      <p className="whitespace-pre-line text-sm leading-7 text-ink-200">
        {review.content}
      </p>

      <footer className="mt-3 flex items-center gap-2 border-t border-ink-800/60 pt-3">
        <ReactionButton
          type="like"
          active={activeReaction === true}
          count={review.like}
          disabled={isPending}
          onClick={() => react(true)}
        />
        <ReactionButton
          type="dislike"
          active={activeReaction === false}
          count={review.dislike}
          disabled={isPending}
          onClick={() => react(false)}
        />
      </footer>
    </article>
  );
}

function ReactionButton({
  type,
  active,
  count,
  disabled,
  onClick,
}: {
  type: 'like' | 'dislike';
  active: boolean;
  count: number;
  disabled: boolean;
  onClick: () => void;
}) {
  const label = type === 'like' ? 'پسندیدن' : 'نپسندیدن';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-accent-500/50 bg-accent-500/10 text-accent-200'
          : 'border-ink-700 bg-ink-900/40 text-ink-300 hover:border-ink-600 hover:text-ink-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
        'disabled:cursor-not-allowed disabled:opacity-60',
      )}
    >
      {type === 'like' ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 10v11H3.5V10H7zm0 0l3.5-7c.8 0 1.5.7 1.5 1.5V9h5.5c1 0 1.8.9 1.6 1.9l-1.2 6.3a2 2 0 0 1-2 1.6H7" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4 rotate-180" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 10v11H3.5V10H7zm0 0l3.5-7c.8 0 1.5.7 1.5 1.5V9h5.5c1 0 1.8.9 1.6 1.9l-1.2 6.3a2 2 0 0 1-2 1.6H7" />
        </svg>
      )}
      <span className="fa-num">{toPersianDigits(count)}</span>
    </button>
  );
}
