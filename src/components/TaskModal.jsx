import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { clearSelectedTask } from "../features/taskSlice";
import TaskCreateEditModal from "./TaskCreateEditModal";

const getStatusBadgeColor = (status) => {
  switch (status) {
    case "Todo":
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    case "InProgress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    case "Review":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    case "Done":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPriorityBadgeColor = (priority) => {
  switch (priority) {
    case "Low":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case "Medium":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    case "High":
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function TaskModal({ task, loading, isOpen }) {
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isOpen || !task) return null;

  const handleClose = () => {
    dispatch(clearSelectedTask());
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    dispatch(clearSelectedTask());
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 animate-fadeIn backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl pointer-events-auto animate-scaleIn max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {task.name}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Task ID: #{task.id}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="cursor-pointer w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-200"
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
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg font-medium text-xs ${getStatusBadgeColor(
                        task.status
                      )}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
                      {task.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Priority
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg font-medium text-xs ${getPriorityBadgeColor(
                        task.priority
                      )}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
                      {task.priority}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {task.startTime && (
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Start Time
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                        {new Date(task.startTime).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                  {task.endTime && (
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        End Time
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                        {new Date(task.endTime).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {task.description && (
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      </svg>
                      Description
                    </label>
                    <div
                      className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg leading-relaxed border border-gray-200 dark:border-gray-600 task-description-content"
                      dangerouslySetInnerHTML={{ __html: task.description }}
                    />
                  </div>
                )}

                {task.note && (
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      Note
                    </label>
                    <div className="text-sm text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg leading-relaxed border-l-3 border-blue-500">
                      {task.note}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex gap-3 justify-end">
            <button
              onClick={handleClose}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg transition duration-200"
            >
              Close
            </button>
            <button
              onClick={handleEdit}
              className="cursor-pointer px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 shadow-sm hover:shadow flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Task
            </button>
          </div>
        </div>
      </div>

      <TaskCreateEditModal
        task={task}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
      />

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

        /* Task Description Content Styling */
        .task-description-content h1,
        .task-description-content h2,
        .task-description-content h3 {
          font-weight: 600;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .task-description-content h1 {
          font-size: 1.25rem;
        }

        .task-description-content h2 {
          font-size: 1.125rem;
        }

        .task-description-content h3 {
          font-size: 1rem;
        }

        .task-description-content p {
          margin-bottom: 0.5rem;
        }

        .task-description-content strong {
          font-weight: 600;
        }

        .task-description-content em {
          font-style: italic;
        }

        .task-description-content u {
          text-decoration: underline;
        }

        .task-description-content s {
          text-decoration: line-through;
        }

        .task-description-content ol,
        .task-description-content ul {
          margin-left: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .task-description-content ol {
          list-style-type: decimal;
        }

        .task-description-content ul {
          list-style-type: disc;
        }

        .task-description-content li {
          margin-bottom: 0.25rem;
        }

        .task-description-content a {
          color: rgb(59 130 246);
          text-decoration: underline;
        }

        .dark .task-description-content a {
          color: rgb(96 165 250);
        }

        .task-description-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 0.5rem 0;
        }

        .task-description-content blockquote {
          border-left: 3px solid rgb(209 213 219);
          padding-left: 1rem;
          margin: 0.5rem 0;
          font-style: italic;
        }

        .dark .task-description-content blockquote {
          border-left-color: rgb(75 85 99);
        }
      `}</style>
    </>
  );
}