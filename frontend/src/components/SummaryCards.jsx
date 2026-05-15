export default function SummaryCards({ summary }) {
  const items = [
    { label: 'total', value: summary.total ?? 0 },
    { label: 'in stock', value: summary.inStock ?? 0 },
    { label: 'low', value: summary.lowStock ?? 0 },
    { label: 'out', value: summary.outOfStock ?? 0 },
  ];

  return (
    <p className="text-sm text-stone-600 dark:text-stone-400">
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && <span className="mx-2 text-stone-300 dark:text-stone-600">·</span>}
          <span className="text-stone-800 dark:text-stone-200">{item.value}</span> {item.label}
        </span>
      ))}
    </p>
  );
}
