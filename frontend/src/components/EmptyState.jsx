export default function EmptyState({ onClearSearch }) {
  return (
    <div className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
      <p>No items found.</p>
      {onClearSearch && (
        <button type="button" onClick={onClearSearch} className="btn-text mt-2">
          clear search
        </button>
      )}
    </div>
  );
}
