import React from "react";
import { useDispatch } from "react-redux";
import { fetchTaskbyId } from "../../features/taskSlice";

const CalendarEvent = ({ event }) => {
  const dispatch = useDispatch();
  const getColorClasses = (color) => {
    const colorMap = {
      purple:
        "bg-purple-200 text-purple-900 dark:bg-purple-900/40 dark:text-purple-200",
      pink: "bg-pink-200 text-pink-900 dark:bg-pink-900/40 dark:text-pink-200",
      beige:
        "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
      blue: "bg-blue-200 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200",
    };
    return colorMap[color] || colorMap.purple;
  };

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent cell click
    // Fetch full task details by ID
    dispatch(fetchTaskbyId(event.id));
  };

  return (
    <div
      onClick={handleClick}
      className={`px-2 py-1 rounded text-xs font-medium ${getColorClasses(
        event.color
      )} cursor-pointer hover:shadow-md hover:scale-105 transition-all z-10 relative`}
      title={event.title}
    >
      <p className="truncate">{event.title}</p>
    </div>
  );
};

export default CalendarEvent;
