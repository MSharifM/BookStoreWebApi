import { toEnglishDigits } from '@/utils/format';
import { cn } from '@/utils/cn';

interface Props {
  fromValue: string;
  toValue: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  error: 'from' | 'to' | 'range' | null;
}

export function PriceRangeInput({
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  error,
}: Props) {
  const sanitize = (v: string) => toEnglishDigits(v).replace(/[^\d]/g, '');

  return (
    <div>
      <div className="flex items-center gap-2">
        <NumberField
          id="filter-from-price"
          label="از"
          value={fromValue}
          onChange={(v) => onFromChange(sanitize(v))}
          hasError={error === 'from' || error === 'range'}
        />
        <span className="text-ink-600" aria-hidden="true">—</span>
        <NumberField
          id="filter-to-price"
          label="تا"
          value={toValue}
          onChange={(v) => onToChange(sanitize(v))}
          hasError={error === 'to' || error === 'range'}
        />
      </div>
      {error === 'range' && (
        <p role="alert" className="mt-2 text-xs font-medium text-copper-300">
          حداقل قیمت نمی‌تواند بیشتر از حداکثر باشد.
        </p>
      )}
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
  hasError,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
}) {
  return (
    <div className="flex-1">
      <label htmlFor={id} className="sr-only">{label}</label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className={cn(
          'h-9 w-full rounded-lg border bg-ink-900/60 px-2.5 text-xs text-ink-50 fa-num',
          'placeholder:text-ink-500 transition-colors',
          'focus:outline-none focus:ring-2',
          hasError
            ? 'border-copper-500/60 focus:border-copper-400 focus:ring-copper-500/20'
            : 'border-ink-700 focus:border-accent-500/70 focus:ring-accent-500/20',
        )}
      />
    </div>
  );
}
