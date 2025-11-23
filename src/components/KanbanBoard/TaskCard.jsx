import {
  User,
  Star,
  GripVertical,
  Calendar as CalendarIcon,
  AlertCircle,
} from "lucide-react";

const statusClassNames = {
  Todo: { bg: "bg-slate-100", text: "text-slate-600" },
  InProgress: { bg: "bg-amber-100", text: "text-amber-700" },
  Review: { bg: "bg-blue-100", text: "text-blue-700" },
  Done: { bg: "bg-green-100", text: "text-green-700" },
};

/**
 * @param {Object} props
 * @param {Object} props.task
 * @param {boolean} props.isDragging
 * @param {Object} props.listeners
 * @param {Function} props.onClick
 */
export function TaskCard({
  task,
  isDragging,
  listeners,
  onClick,
}) {
  const statusInfo = statusClassNames[task.status] || statusClassNames.Todo;

  const formattedDate = task.endTime
    ? new Date(task.endTime).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(task.endTime);
  due.setHours(0, 0, 0, 0);
  const isOverdue = due < today && task.status !== "Done";

  return (
    <div
      onClick={onClick}
      className={`
        flex items-start gap-3 p-3 rounded-lg border
        border-slate-200 dark:border-slate-700
        bg-white/70 dark:bg-slate-800/70
        transition-all duration-200 ease-in-out cursor-pointer
        ${
          isDragging
            ? "opacity-50 shadow-2xl"
            : "hover:shadow-md hover:-translate-y-1"
        }
      `}
    >
      <div className="grow">
        <div className="flex justify-between items-center mb-1">
          <span
            className={`font-semibold text-sm ${
              isOverdue
                ? "text-red-600 dark:text-red-400"
                : "text-slate-800 dark:text-slate-100"
            }`}
          >
            {task.name}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.bg} ${statusInfo.text}`}
          >
            {task.status}
          </span>
        </div>

        {formattedDate && (
          <div
            className={`flex items-center text-xs mb-1 gap-1 ${
              isOverdue
                ? "text-red-600 dark:text-red-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <CalendarIcon size={12} />
            {formattedDate}
            {isOverdue && <AlertCircle size={12} className="ml-1" />}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <User size={12} /> {task.assignee || "Unassigned"}
          </div>
          <div className="flex items-center gap-1.5">
            <Star size={12} /> {task.priority || "Medium"}
          </div>
        </div>
      </div>
      <div
        className="text-slate-400 dark:text-slate-500 cursor-grab p-1"
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={20} />
      </div>
    </div>
  );
}
