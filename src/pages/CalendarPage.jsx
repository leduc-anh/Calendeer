import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "../features/taskSlice";
import _ from "lodash";
import CalendarHeader from "../components/Calendar/CalendarHeader";
import CalendarGrid from "../components/Calendar/CalendarGrid";
import CalendarSidebar from "../components/Calendar/CalendarSidebar";
import TaskModal from "../components/TaskModal";
import TaskCreateEditModal from "../components/TaskCreateEditModal";
import TaskListModal from "../components/Calendar/TaskListModal";

const CalendarPage = () => {
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slideDirection, setSlideDirection] = useState('none');
  const [taskListModal, setTaskListModal] = useState({
    isOpen: false,
    date: null,
    events: [],
  });

  const tasks = useSelector((state) => state.tasks.items);
  const loading = useSelector((state) => state.tasks.loading);
  const selectedTask = useSelector((state) => state.tasks.selectedTask);
  const taskLoading = useSelector((state) => state.tasks.loadingDetail);

  // Fetch tasks from API
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Convert tasks to calendar events
  const events = _.map(tasks, (task) => {
    // Determine color based on status
    let color = "blue";
    switch (task.status) {
      case "Todo":
        color = "blue";
        break;
      case "InProgress":
        color = "beige";
        break;
      case "Review":
        color = "purple";
        break;
      case "Done":
        color = "pink";
        break;
      default:
        color = "blue";
    }

    return {
      id: task.id,
      title: task.name,
      date: task.startTime ? new Date(task.startTime) : new Date(),
      type: task.status.toLowerCase(),
      color: color,
      priority: task.priority,
      status: task.status,
      description: task.description,
      note: task.note,
      endTime: task.endTime,
    };
  });

  const handlePrevMonth = () => {
    setSlideDirection('right');
    setTimeout(() => {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
      setSlideDirection('none');
    }, 0);
  };

  const handleNextMonth = () => {
    setSlideDirection('left');
    setTimeout(() => {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
      setSlideDirection('none');
    }, 0);
  };

  const handleToday = () => {
    setSlideDirection('none');
    setCurrentDate(new Date());
  };

  const handleDateChange = (newDate) => {
    const isNext = newDate > currentDate;
    setSlideDirection(isNext ? 'left' : 'right');
    setTimeout(() => {
      setCurrentDate(newDate);
      setSlideDirection('none');
    }, 0);
  };

  const handleCreateTask = (date) => {
    setSelectedDate(date);
    setIsCreateModalOpen(true);
  };

  const handleShowTasks = (date, events) => {
    setTaskListModal({ isOpen: true, date, events });
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedDate(null);
  };

  const handleCloseTaskListModal = () => {
    setTaskListModal({ isOpen: false, date: null, events: [] });
  };

  return (
    <div >
      <div className="max-w-[1800px]  mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex gap-6">
            <div className="flex-1">
              <CalendarHeader
                currentDate={currentDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onToday={handleToday}
                onDateChange={handleDateChange}
              />
              <div className="relative overflow-hidden">
                <div
                  key={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
                  className={`transition-all duration-500 ease-out ${
                    slideDirection === 'left'
                      ? 'animate-slideOutLeft'
                      : slideDirection === 'right'
                      ? 'animate-slideOutRight'
                      : 'animate-slideIn'
                  }`}
                >
                  <CalendarGrid
                    currentDate={currentDate}
                    events={events}
                    onCreateTask={handleCreateTask}
                    onShowTasks={handleShowTasks}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <CalendarSidebar />
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <TaskModal
        task={selectedTask}
        loading={taskLoading}
        isOpen={!!selectedTask}
      />

      {/* Create Task Modal */}
      <TaskCreateEditModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        isCreateMode={true}
        task={
          selectedDate
            ? {
                name: "",
                description: "",
                status: "Todo",
                priority: "Medium",
                startTime: selectedDate.toISOString().slice(0, 16),
                endTime: selectedDate.toISOString().slice(0, 16),
                note: "",
              }
            : null
        }
      />

      {/* Task List Modal */}
      <TaskListModal
        isOpen={taskListModal.isOpen}
        onClose={handleCloseTaskListModal}
        date={taskListModal.date}
        events={taskListModal.events}
      />
    </div>
  );
};

export default CalendarPage;