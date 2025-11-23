import { Plus } from "lucide-react";

/**
 * @param {Object} props
 * @param {string} props.id
 * @param {Object} props.listeners
 */
export function ColumnDropArea({ id, listeners }) {
  return (
    <div
      id={id}
      {...listeners}
      className="flex items-center justify-center p-8 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 min-h-[200px] cursor-grab"
    >
      <div className="text-center pointer-events-none">
        <Plus size={24} className="mx-auto mb-2 opacity-50" />
        <p className="text-xs">Drop tasks here</p>
      </div>
    </div>
  );
}
