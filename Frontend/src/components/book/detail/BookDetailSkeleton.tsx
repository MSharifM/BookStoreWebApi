import { Skeleton } from '@/components/ui/Skeleton';
import { BookCardSkeletonGrid } from '@/components/book/BookCardSkeleton';

export function BookDetailSkeleton() {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="mx-auto w-full max-w-sm">
          <Skeleton className="aspect-[2/3] w-full" rounded="2xl" />
          <div className="mt-3 flex gap-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-14" rounded="xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="mt-4 h-32 w-full" rounded="2xl" />
        </div>
      </div>
      <div className="flex gap-3">
        <BookCardSkeletonGrid count={5} />
      </div>
    </div>
  );
}
