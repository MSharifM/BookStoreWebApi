import { useParams } from 'react-router-dom';
import { PlaceholderPage } from '@/components/common/PlaceholderPage';

export default function BookDetailPage() {
  const { bookId } = useParams<{ bookId: string }>();
  return (
    <PlaceholderPage
      title="جزئیات کتاب"
      description={bookId ? `کتاب با شناسه ${bookId} به‌زودی نمایش داده می‌شود.` : undefined}
    />
  );
}