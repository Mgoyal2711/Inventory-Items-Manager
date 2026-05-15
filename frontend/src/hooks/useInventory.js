import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { itemApi } from '../services/itemApi';
import { getCachedItems, setCachedItems, clearItemCache } from '../utils/cache';

export function useInventory() {
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchItems = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);

    try {
      const { data } = await itemApi.getAll({
        search: search || undefined,
        sortBy: 'quantity',
        sortDir,
        page,
        pageSize,
      });

      setItems(data.items ?? []);
      setTotalCount(data.totalCount ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setCachedItems(data);

      try {
        const statsRes = await itemApi.getStats();
        const s = statsRes.data;
        setSummary({
          total: s.total,
          inStock: s.inStock,
          lowStock: s.lowStock,
          outOfStock: s.outOfStock,
        });
      } catch {
        // Stats are non-critical
      }
    } catch (err) {
      const cached = getCachedItems();
      if (cached?.items?.length) {
        setItems(cached.items);
        setTotalCount(cached.totalCount ?? cached.items.length);
        setTotalPages(cached.totalPages ?? 1);
        toast.error('Using cached data — API unavailable');
      } else {
        setError(err.message);
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [search, sortDir, page, pageSize]);

  useEffect(() => {
    const cached = getCachedItems();
    if (cached?.items?.length && !search) {
      setItems(cached.items);
      setTotalCount(cached.totalCount ?? cached.items.length);
    }
    fetchItems();
  }, [fetchItems]);

  const addItem = async (formData) => {
    const { data } = await itemApi.create(formData);
    clearItemCache();
    await fetchItems(false);
    toast.success(`"${data.name}" added successfully`);
    return data;
  };

  const updateItem = async (id, formData) => {
    const { data } = await itemApi.update(id, formData);
    clearItemCache();
    await fetchItems(false);
    toast.success(`"${data.name}" updated successfully`);
    return data;
  };

  const deleteItem = async (id, name) => {
    await itemApi.delete(id);
    clearItemCache();
    await fetchItems(false);
    toast.success(`"${name}" deleted`);
  };

  const toggleSort = () => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));

  return {
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
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
  };
}
