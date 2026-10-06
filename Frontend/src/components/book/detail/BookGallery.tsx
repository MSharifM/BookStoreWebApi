import { useState } from 'react';
import { SafeImage } from '@/components/common/SafeImage';
import { cn } from '@/utils/cn';

interface Props {
  images: string[];
  name: string;
}

export function BookGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  const validImages = images.filter(Boolean);
  const current = validImages[active] ?? null;

  return (
    <div>
      <div className="overflow-hidden rounded-3xl border border-ink-700/70 bg-ink-900/50">
        <SafeImage
          key={current ?? 'fallback'}
          src={current}
          alt={name}
          loading="eager"
          className="aspect-[2/3] w-full animate-fade-in"
          imgClassName="object-contain"
        />
      </div>

      {validImages.length > 1 && (
        <div
          role="tablist"
          aria-label="تصاویر کتاب"
          className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {validImages.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`تصویر ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                'shrink-0 overflow-hidden rounded-xl border-2 transition-all',
                i === active
                  ? 'border-accent-500 ring-2 ring-accent-500/30'
                  : 'border-ink-700/70 opacity-70 hover:opacity-100 hover:border-ink-600',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
              )}
            >
              <SafeImage
                src={img}
                alt={`${name} — تصویر ${i + 1}`}
                className="h-20 w-14 sm:h-24 sm:w-16"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
