import React from "react";
import CalendarEvent from "./CalendarEvent";

const CalendarCell = ({
  day,
  isCurrentMonth,
  date,
  events,
  isToday,
  onCreateTask,
  onShowTasks,
}) => {
  const handleCellClick = (e) => {
    // Only trigger if clicking on the cell itself, not on event cards
    if (e.target === e.currentTarget || e.target.closest(".cell-content")) {
      if (events.length > 0) {
        onShowTasks(date, events);
      }
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    onCreateTask(date);
  };

  return (
    <div
      onClick={handleCellClick}
      className={`min-h-[85px] p-2.5 border-r border-b border-gray-200 dark:border-gray-700 ${
        !isCurrentMonth ? "bg-gray-50 dark:bg-gray-900/50" : ""
      } ${
        isToday ? "bg-blue-50 dark:bg-blue-900/20" : ""
      } hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer`}
    >
      <div className="flex flex-col h-full cell-content">
        {/* Day number */}
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-xs font-semibold ${
              isCurrentMonth
                ? isToday
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
                : "text-gray-400 dark:text-gray-600"
            }`}
          >
            {String(day).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1">
            {isToday && (
              <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
            )}
            {/* Add button - show when hovering or no events */}
            {isCurrentMonth && (
              <button
                onClick={handleAddClick}
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  events.length === 0
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 opacity-0 hover:opacity-100"
                } hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all`}
                title="Add task"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Events */}
        <div className="flex-1 space-y-0.5">
          {events.slice(0, 3).map((event) => (
            <CalendarEvent key={event.id} event={event} />
          ))}
          {events.length > 3 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
              +{events.length - 3} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarCell;
