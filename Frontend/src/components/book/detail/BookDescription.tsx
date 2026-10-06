export function BookDescription({ description }: { description: string | null }) {
  if (!description || !description.trim()) return null;

  return (
    <section aria-labelledby="description-title">
      <h2
        id="description-title"
        className="mb-4 text-lg font-extrabold tracking-tight text-ink-50 sm:text-xl"
      >
        درباره‌ی این کتاب
      </h2>
      <div className="rounded-2xl border border-ink-700/70 bg-ink-900/40 p-5">
        <p className="whitespace-pre-line text-sm leading-8 text-ink-200">
          {description}
        </p>
      </div>
    </section>
  );
}
