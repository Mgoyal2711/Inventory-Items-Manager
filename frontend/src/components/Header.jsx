export default function Header({ darkMode, onToggleDark }) {
  return (
    <header className="border-b border-stone-300 bg-white dark:border-stone-700 dark:bg-stone-900">
      <div className="mx-auto flex max-w-5xl items-baseline justify-between gap-4 px-4 py-3 sm:px-6">
        <div>
          <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-50">Inventory</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">items &amp; stock counts</p>
        </div>
        <button type="button" onClick={onToggleDark} className="btn text-xs">
          {darkMode ? 'Light' : 'Dark'}
        </button>
      </div>
    </header>
  );
}
