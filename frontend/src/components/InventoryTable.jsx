import { useState } from 'react';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';
import Loader from './Loader';
import Pagination from './Pagination';
import EditItemModal from './EditItemModal';

export default function InventoryTable({
  items,
  loading,
  search,
  onSearchChange,
  sortDir,
  onToggleSort,
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onUpdate,
  onDelete,
}) {
  const [editingItem, setEditingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    setDeletingId(item.id);
    try {
      await onDelete(item.id, item.name);
    } finally {
      setDeletingId(null);
    }
  };

  const sortLabel = sortDir === 'asc' ? 'qty ↑' : 'qty ↓';

  return (
    <>
      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-stone-200 px-3 py-2 sm:flex-row sm:items-center sm:justify-between dark:border-stone-700">
          <h2 className="text-sm font-medium text-stone-800 dark:text-stone-200">
            Items ({totalCount})
          </h2>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="filter name or sku"
            className="input max-w-xs text-sm"
          />
        </div>

        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <EmptyState onClearSearch={search ? () => onSearchChange('') : undefined} />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-800/80">
                    <th className="px-3 py-2 font-medium text-stone-600 dark:text-stone-400">Name</th>
                    <th className="px-3 py-2 font-medium text-stone-600 dark:text-stone-400">SKU</th>
                    <th className="px-3 py-2 font-medium text-stone-600 dark:text-stone-400">
                      <button type="button" onClick={onToggleSort} className="btn-text no-underline hover:underline">
                        {sortLabel}
                      </button>
                    </th>
                    <th className="px-3 py-2 font-medium text-stone-600 dark:text-stone-400">Status</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`border-b border-stone-100 dark:border-stone-800 ${
                        idx % 2 === 1 ? 'bg-stone-50/80 dark:bg-stone-900/50' : ''
                      }`}
                    >
                      <td className="px-3 py-2 text-stone-900 dark:text-stone-100">{item.name}</td>
                      <td className="px-3 py-2 font-mono text-xs text-stone-600 dark:text-stone-400">
                        {item.sku}
                      </td>
                      <td className="px-3 py-2 tabular-nums">{item.quantity}</td>
                      <td className="px-3 py-2">
                        <StatusBadge status={item.stockStatus} />
                      </td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="btn-text"
                        >
                          edit
                        </button>
                        <span className="mx-1 text-stone-300 dark:text-stone-600">|</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={deletingId === item.id}
                          className="btn-text btn-danger disabled:opacity-40"
                        >
                          delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-stone-200 md:hidden dark:divide-stone-700">
              {items.map((item) => (
                <li key={item.id} className="px-3 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="font-mono text-xs text-stone-500">{item.sku}</p>
                    </div>
                    <StatusBadge status={item.stockStatus} />
                  </div>
                  <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                    qty {item.quantity}
                  </p>
                  <p className="mt-2 text-sm">
                    <button type="button" onClick={() => setEditingItem(item)} className="btn-text">
                      edit
                    </button>
                    <span className="mx-1 text-stone-300">|</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                      className="btn-text btn-danger"
                    >
                      delete
                    </button>
                  </p>
                </li>
              ))}
            </ul>

            <Pagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </>
        )}
      </section>

      <EditItemModal item={editingItem} onClose={() => setEditingItem(null)} onSave={onUpdate} />
    </>
  );
}
