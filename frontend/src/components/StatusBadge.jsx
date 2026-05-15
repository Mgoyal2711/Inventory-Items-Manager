import { STATUS_DOT } from '../utils/status';

export default function StatusBadge({ status }) {
  const dot = STATUS_DOT[status] ?? 'bg-stone-400';

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-stone-700 dark:text-stone-300">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}
