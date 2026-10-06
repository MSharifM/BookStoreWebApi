import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { StarRatingInput } from '@/components/ui/StarRatingInput';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { reviewService } from '@/services/reviewService';
import { AuthServiceError } from '@/utils/errors';

interface Props {
  bookId: number;
  onSuccess: () => void;
}

export function ReviewForm({ bookId, onSuccess }: Props) {
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();

  const [rate, setRate] = useState(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canAttemptReview = isAuthenticated && user?.roles?.some((r) => r.toLowerCase() === 'user');

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-ink-700/70 bg-ink-900/40 p-5 text-center">
        <p className="text-sm text-ink-300">
          برای ثبت نظر ابتدا وارد حساب کاربری خود شوید.
        </p>
        <Link
          to="/login"
          className="mt-3 inline-flex rounded-xl bg-accent-500 px-4 py-2 text-sm font-bold text-ink-950 transition-colors hover:bg-accent-400"
        >
          ورود به حساب
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);

    if (rate < 1 || rate > 5) {
      setErrorMessage('امتیاز باید بین ۱ تا ۵ باشد.');
      return;
    }
    if (content.trim().length < 3) {
      setErrorMessage('متن نظر باید حداقل ۳ کاراکتر باشد.');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.addReview({ bookId, content: content.trim(), rate });
      setContent('');
      setRate(5);
      toast.success('نظر شما ثبت شد. ممنون از همراهی!');
      onSuccess();
    } catch (err) {
      let msg = 'ثبت نظر ناموفق بود. لطفاً دوباره تلاش کنید.';
      if (err instanceof AuthServiceError) msg = err.message;
      else if (typeof err === 'object' && err && 'response' in err) {
        const axiosErr = err as { response?: { data?: { errorMessage?: string } } };
        msg = axiosErr.response?.data?.errorMessage ?? msg;
      }
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-ink-700/70 bg-ink-900/40 p-5"
      noValidate
    >
      <h3 className="mb-4 text-base font-bold text-ink-100">نظر خود را بنویسید</h3>

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 animate-fade-in rounded-xl border border-copper-500/40 bg-copper-500/10 px-3.5 py-3 text-sm text-copper-200"
        >
          {errorMessage}
        </div>
      )}

      <div className="space-y-4">
        <StarRatingInput value={rate} onChange={setRate} disabled={isSubmitting} />

        <div>
          <label htmlFor="review-content" className="mb-1.5 block text-sm font-medium text-ink-200">
            متن نظر
          </label>
          <textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            rows={4}
            maxLength={2000}
            placeholder="تجربه‌ی خود را از این کتاب بنویسید…"
            className="block w-full resize-none rounded-xl border border-ink-700 bg-ink-900/60 px-3.5 py-3 text-sm text-ink-50 placeholder:text-ink-500 transition-colors hover:border-ink-600 focus:border-accent-500/70 focus:bg-ink-900 focus:outline-none focus:ring-4 focus:ring-accent-500/15 disabled:opacity-60"
          />
          <p className="mt-1.5 text-xs text-ink-500">
            {canAttemptReview
              ? 'نظر شما پس از تأیید نمایش داده می‌شود.'
              : 'توجه: امکان ثبت نظر تنها برای خریداران این کتاب فعال است.'}
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'داریم ثبت می‌کنیم…' : 'ثبت نظر'}
        </Button>
      </div>
    </form>
  );
}
