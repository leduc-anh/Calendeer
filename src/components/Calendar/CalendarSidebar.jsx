import React from "react";
import CalendarLegend from "./CalendarLegend";

const CalendarSidebar = () => {
  const legendItems = [
    { label: "Todo", color: "blue" },
    { label: "In Progress", color: "beige" },
    { label: "Review", color: "purple" },
    { label: "Done", color: "pink" },
  ];

  return (
    <div className="w-48">
      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-3">
        <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
          Task Status
        </h3>
        <div className="space-y-1.5">
          {legendItems.map((item, index) => (
            <CalendarLegend key={index} label={item.label} color={item.color} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;
