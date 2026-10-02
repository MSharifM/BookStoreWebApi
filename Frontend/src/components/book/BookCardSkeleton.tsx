import { Skeleton } from '@/components/ui/Skeleton';

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-900/50">
      <Skeleton className="aspect-[2/3] w-full" rounded="md" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="mt-2 flex justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="mt-2 h-5 w-24" />
      </div>
    </div>
  );
}

export function BookCardSkeletonGrid({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-[44%] shrink-0 snap-start sm:w-[32%] md:w-[24%] lg:w-[19.2%]"
        >
          <BookCardSkeleton />
        </div>
      ))}
    </>
  );
}