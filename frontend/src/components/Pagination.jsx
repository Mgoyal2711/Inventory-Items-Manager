export default function Pagination({ page, totalPages, totalCount, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 px-3 py-2 text-sm dark:border-stone-700">
      <span className="text-stone-500 dark:text-stone-400">
        {start}–{end} of {totalCount}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="btn disabled:opacity-40"
        >
          ←
        </button>
        <span className="px-2 tabular-nums text-stone-600 dark:text-stone-300">
          {page}/{totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="btn disabled:opacity-40"
        >
          →
        </button>
      </div>
    </div>
  );
}
