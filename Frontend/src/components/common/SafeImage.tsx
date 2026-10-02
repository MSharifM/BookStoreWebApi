import { useState } from 'react';
import { cn } from '@/utils/cn';
import { resolveImageUrl } from '@/utils/image';

interface Props {
  src: string | null | undefined;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: 'lazy' | 'eager';
}

export function SafeImage({
  src,
  alt,
  className,
  imgClassName,
  loading = 'lazy',
}: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const url = resolveImageUrl(src);

  if (!url || failed) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-ink-800/60 text-ink-500',
          className,
        )}
        aria-label={alt}
        role="img"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M4 5h7a2 2 0 0 1 2 2v13" />
          <path d="M20 5h-7a2 2 0 0 0-2 2v13" />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden bg-ink-800/40', className)}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-ink-800/60" aria-hidden="true" />
      )}
      <img
        src={url}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </div>
  );
}