import React from "react";
import CalendarCell from "./CalendarCell";

const CalendarGrid = ({ currentDate, events, onCreateTask, onShowTasks }) => {
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Get first day of month and total days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Create calendar grid
  const calendarDays = [];

  // Previous month's days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    });
  }

  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day),
    });
  }

  // Next month's days
  const remainingCells = 42 - calendarDays.length; // 6 rows * 7 days
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month + 1, day),
    });
  }

  // Filter events for each day - including multi-day events
  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.date);
      const eventEnd = event.endTime ? new Date(event.endTime) : eventStart;

      // Set to start of day for comparison
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(0, 0, 0, 0);

      // Check if date falls within event range
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Week days header */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7">
        {calendarDays.map((dayInfo, index) => (
          <CalendarCell
            key={index}
            day={dayInfo.day}
            isCurrentMonth={dayInfo.isCurrentMonth}
            date={dayInfo.date}
            events={getEventsForDate(dayInfo.date)}
            isToday={dayInfo.date.toDateString() === new Date().toDateString()}
            onCreateTask={onCreateTask}
            onShowTasks={onShowTasks}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
