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
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl pointer-events-auto animate-scaleIn max-h-[90vh] overflow-y-auto">
          <div className="px-8 py-7 flex justify-between items-start bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-3xl">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">{task.name}</h2>
              <p className="text-blue-100 text-sm">Task ID: #{task.id}</p>
            </div>
            <button
              onClick={handleClose}
              className="cursor-pointer w-9 h-9 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition duration-200 shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Status
                    </label>
                    <span className={`inline-block px-4 py-2.5 rounded-xl font-semibold text-sm ${getStatusBadgeColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Priority
                    </label>
                    <span className={`inline-block px-4 py-2.5 rounded-xl font-semibold text-sm ${getPriorityBadgeColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>

                {task.description && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Description
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {task.startTime && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Start Time
                      </label>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {new Date(task.startTime).toLocaleString("vi-VN", {day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  )}
                  {task.endTime && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                        End Time
                      </label>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {new Date(task.endTime).toLocaleString("vi-VN", {day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  )}
                </div>

                {task.note && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Note
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border-l-4 border-blue-500 leading-relaxed">
                      {task.note}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-8 py-5 flex gap-3 justify-end rounded-b-3xl">
            <button
              onClick={handleClose}
              className="cursor-pointer px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-semibold transition duration-200"
            >
              Close
            </button>
            <button
              onClick={handleEdit}
              className="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition duration-200 shadow-lg hover:shadow-xl"
            >
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
      `}</style>
    </>
  );
}
