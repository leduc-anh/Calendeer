import React from "react";
import { useDispatch } from "react-redux";
import { fetchTaskbyId } from "../../features/taskSlice";

const TaskListModal = ({ isOpen, onClose, date, events }) => {
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const dateStr = date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleTaskClick = (taskId) => {
    dispatch(fetchTaskbyId(taskId));
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 animate-fadeIn backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto animate-scaleIn">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tasks
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {dateStr}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {events.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p>No tasks for this day</p>
              </div>
            ) : (
              <div className="space-y-2">
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleTaskClick(event.id)}
                    className={`p-3 rounded-lg cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-600 ${
                      event.color === "purple"
                        ? "bg-purple-50 dark:bg-purple-900/20"
                        : event.color === "pink"
                        ? "bg-pink-50 dark:bg-pink-900/20"
                        : event.color === "beige"
                        ? "bg-amber-50 dark:bg-amber-900/20"
                        : "bg-blue-50 dark:bg-blue-900/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </h4>
                        {event.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {event.description.replace(/<[^>]*>/g, "")}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          event.color === "purple"
                            ? "bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            : event.color === "pink"
                            ? "bg-pink-200 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                            : event.color === "beige"
                            ? "bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                            : "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-in-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default TaskListModal;
