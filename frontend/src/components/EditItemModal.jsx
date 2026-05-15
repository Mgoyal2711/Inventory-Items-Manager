import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function EditItemModal({ item, onClose, onSave }) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (item) {
      reset({ name: item.name, sku: item.sku, quantity: item.quantity });
    }
  }, [item, reset]);

  if (!item) return null;

  const submit = async (data) => {
    setSubmitting(true);
    try {
      await onSave(item.id, {
        name: data.name.trim(),
        sku: data.sku.trim(),
        quantity: Number(data.quantity),
      });
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-16">
      <div className="panel w-full max-w-sm p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-medium text-stone-900 dark:text-stone-100">Edit</h3>
          <button type="button" onClick={onClose} className="btn-text">
            close
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-stone-600 dark:text-stone-400">Name</label>
            <input className={`input ${errors.name ? 'border-red-500' : ''}`} {...register('name', { required: 'Required' })} />
            {errors.name && <p className="mt-0.5 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs text-stone-600 dark:text-stone-400">SKU</label>
            <input className={`input font-mono text-xs uppercase ${errors.sku ? 'border-red-500' : ''}`} {...register('sku', { required: 'Required' })} />
            {errors.sku && <p className="mt-0.5 text-xs text-red-600">{errors.sku.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs text-stone-600 dark:text-stone-400">Qty</label>
            <input
              type="number"
              min="0"
              className={`input ${errors.quantity ? 'border-red-500' : ''}`}
              {...register('quantity', {
                valueAsNumber: true,
                min: { value: 0, message: 'Min 0' },
              })}
            />
            {errors.quantity && <p className="mt-0.5 text-xs text-red-600">{errors.quantity.message}</p>}
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn flex-1">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-main flex-1">
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
