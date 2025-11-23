import React from "react";

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth, onToday }) => {
  const monthNames = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {month} {year}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevMonth}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
              aria-label="Previous month"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={onToday}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={onNextMonth}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
              aria-label="Next month"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Monthly Social Media Content
        </p>
      </div>
    </div>
  );
};

export default CalendarHeader;
