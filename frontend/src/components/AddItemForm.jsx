import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function AddItemForm({ onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', sku: '', quantity: 0 },
  });

  const submit = async (data) => {
    setSubmitting(true);
    try {
      await onSubmit({
        name: data.name.trim(),
        sku: data.sku.trim(),
        quantity: Number(data.quantity),
      });
      reset({ name: '', sku: '', quantity: 0 });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel p-4">
      <h2 className="mb-3 text-sm font-medium text-stone-800 dark:text-stone-200">Add item</h2>

      <form onSubmit={handleSubmit(submit)} className="space-y-3" noValidate>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="name" className="mb-1 block text-xs text-stone-600 dark:text-stone-400">
              Name
            </label>
            <input
              id="name"
              type="text"
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              {...register('name', { required: 'Required' })}
            />
            {errors.name && <p className="mt-0.5 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="sku" className="mb-1 block text-xs text-stone-600 dark:text-stone-400">
              SKU
            </label>
            <input
              id="sku"
              type="text"
              className={`input font-mono text-xs uppercase ${errors.sku ? 'border-red-500' : ''}`}
              {...register('sku', { required: 'Required' })}
            />
            {errors.sku && <p className="mt-0.5 text-xs text-red-600">{errors.sku.message}</p>}
          </div>

          <div>
            <label htmlFor="quantity" className="mb-1 block text-xs text-stone-600 dark:text-stone-400">
              Qty
            </label>
            <input
              id="quantity"
              type="number"
              min="0"
              className={`input ${errors.quantity ? 'border-red-500' : ''}`}
              {...register('quantity', {
                valueAsNumber: true,
                min: { value: 0, message: 'Min 0' },
                validate: (v) => !Number.isNaN(v) || 'Invalid',
              })}
            />
            {errors.quantity && (
              <p className="mt-0.5 text-xs text-red-600">{errors.quantity.message}</p>
            )}
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn btn-main">
          {submitting ? 'Saving…' : 'Add'}
        </button>
      </form>
    </section>
  );
}
