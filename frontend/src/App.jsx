import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import AddItemForm from './components/AddItemForm';
import InventoryTable from './components/InventoryTable';
import { useInventory } from './hooks/useInventory';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  const {
    items,
    loading,
    error,
    search,
    setSearch,
    sortDir,
    toggleSort,
    page,
    setPage,
    totalPages,
    totalCount,
    pageSize,
    summary,
    addItem,
    updateItem,
    deleteItem,
    fetchItems,
  } = useInventory();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setSearch, setPage]);

  return (
    <div className="min-h-screen">
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '13px',
            borderRadius: '4px',
            border: '1px solid #d6d3d1',
            background: '#fff',
            color: '#1c1917',
          },
          className: 'dark:!bg-stone-900 dark:!text-stone-100 dark:!border-stone-600',
        }}
      />

      <Header darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />

      <main className="mx-auto max-w-5xl space-y-4 px-4 py-5 sm:px-6">
        <SummaryCards summary={summary} />

        {error && !loading && items.length === 0 && (
          <p className="text-sm text-red-700 dark:text-red-400">
            {error}.{' '}
            <button type="button" onClick={() => fetchItems()} className="btn-text">
              try again
            </button>
          </p>
        )}

        <AddItemForm onSubmit={addItem} />

        <InventoryTable
          items={items}
          loading={loading}
          search={searchInput}
          onSearchChange={setSearchInput}
          sortDir={sortDir}
          onToggleSort={toggleSort}
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={setPage}
          onUpdate={updateItem}
          onDelete={deleteItem}
        />
      </main>
    </div>
  );
}
