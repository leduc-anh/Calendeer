import React from "react";

const CalendarLegend = ({ label, color }) => {
  const getColorClasses = (color) => {
    const colorMap = {
      blue: "bg-blue-200 dark:bg-blue-900/40",
      purple: "bg-purple-200 dark:bg-purple-900/40",
      pink: "bg-pink-200 dark:bg-pink-900/40",
      beige: "bg-amber-100 dark:bg-amber-900/40",
    };
    return colorMap[color] || colorMap.purple;
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-6 h-3 rounded-full ${getColorClasses(color)}`}></div>
      <span className="text-[10px] text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </div>
  );
};

export default CalendarLegend;
