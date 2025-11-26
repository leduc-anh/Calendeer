import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";
import { updateTask, createTask } from "../features/taskSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const STATUS_OPTIONS = ["Todo", "InProgress", "Review", "Done"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

const formatDateTimeLocal = (isoString) => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    return "";
  }
};

export default function TaskCreateEditModal({
  task,
  isOpen,
  onClose,
  isCreateMode = false,
  initialDate
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(task || {});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isCreateMode) {
      let defaultStartTime = "";
      let defaultEndTime = "";
      
      if (initialDate) {
        defaultStartTime = formatDateTimeLocal(initialDate.toISOString());
        
        const endDate = new Date(initialDate);
        endDate.setHours(endDate.getHours() + 1);
        defaultEndTime = formatDateTimeLocal(endDate.toISOString());
      }
      
      setFormData({
        name: "",
        description: "",
        status: "Todo",
        priority: "Medium",
        startTime: defaultStartTime,
        endTime: defaultEndTime,
        note: "",
      });
    } else if (task) {
      setFormData({
        ...task,
        startTime: formatDateTimeLocal(task.startTime),
        endTime: formatDateTimeLocal(task.endTime),
      });
    }
  }, [task, isOpen, isCreateMode, initialDate]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    if (name === "startTime" && value) {
      const dateOnly = value.split("T")[0];
      updated.date = dateOnly;
    }

    setFormData(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    if (_.isEmpty(_.trim(formData.name))) {
      toast.error("Task Name is required.");
      setLoading(false);
      return;
    }
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (start >= end) {
        toast.error("Start Time must be before End Time.");
        setLoading(false);
        return;
      }
    }
    try {
      if (isCreateMode) {
        await dispatch(createTask(formData)).unwrap();
        toast.success("Task created successfully!");
      } else {
        await dispatch(updateTask({ id: task.id, data: formData })).unwrap();
        toast.success("Task updated successfully!");
      }
      onClose();
    } catch (error) {
      console.error(
        isCreateMode ? "Error creating task:" : "Error updating task:",
        error
      );
      toast.error(
        isCreateMode
          ? "Error creating task. Please try again."
          : "Error updating task. Please try again."
      );
    }
    setLoading(false);
  };

  const handleCancel = () => {
    if (isCreateMode) {
      setFormData({});
    } else {
      setFormData(task);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 animate-fadeIn backdrop-blur-sm"
        onClick={handleCancel}
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
                    d={
                      isCreateMode
                        ? "M12 4v16m8-8H4"
                        : "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    }
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isCreateMode ? "Create New Task" : "Edit Task"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isCreateMode
                    ? "Add a new task to your list"
                    : "Modify task details and save changes"}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
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
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {!isCreateMode && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Task ID
                </label>
                <input
                  type="text"
                  value={formData.id}
                  disabled
                  className="w-full px-3 py-2.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg border border-gray-200 dark:border-gray-600 cursor-not-allowed"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter task name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  {_.map(STATUS_OPTIONS, (opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  {_.map(PRIORITY_OPTIONS, (opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              <div className="rich-text-editor">
                <ReactQuill
                  theme="snow"
                  value={formData.description || ""}
                  onChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                  placeholder="Enter task description with formatting..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ color: [] }, { background: [] }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ align: [] }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "color",
                    "background",
                    "list",
                    "bullet",
                    "align",
                    "link",
                    "image",
                  ]}
                  className="bg-white dark:bg-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              <textarea
                name="note"
                value={formData.note || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                rows="3"
                placeholder="Add a note"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="cursor-pointer px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition duration-200 shadow-sm hover:shadow flex items-center gap-2 min-w-[120px] justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
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
                      d={isCreateMode ? "M12 4v16m8-8H4" : "M5 13l4 4L19 7"}
                    />
                  </svg>
                  {isCreateMode ? "Create Task" : "Save Changes"}
                </>
              )}
            </button>
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

        /* Rich Text Editor Styling */
        .rich-text-editor .quill {
          border-radius: 0.5rem;
          border: 1px solid rgb(209 213 219);
        }

        .dark .rich-text-editor .quill {
          border-color: rgb(75 85 99);
        }

        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: white;
          border-bottom: 1px solid rgb(229 231 235);
        }

        .dark .rich-text-editor .ql-toolbar {
          background: rgb(55 65 81 / 0.5);
          border-color: rgb(75 85 99);
        }

        .rich-text-editor .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          font-size: 0.875rem;
          min-height: 120px;
          background: white;
        }

        .dark .rich-text-editor .ql-container {
          background: rgb(55 65 81 / 0.5);
        }

        .rich-text-editor .ql-editor {
          min-height: 120px;
          color: rgb(17 24 39);
        }

        .dark .rich-text-editor .ql-editor {
          color: white;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          color: rgb(156 163 175);
          font-style: normal;
        }

        .dark .rich-text-editor .ql-editor.ql-blank::before {
          color: rgb(107 114 128);
        }

        /* Toolbar button colors for dark mode */
        .dark .rich-text-editor .ql-toolbar button {
          color: rgb(209 213 219);
        }

        .dark .rich-text-editor .ql-toolbar button:hover {
          color: white;
        }

        .dark .rich-text-editor .ql-toolbar button.ql-active {
          color: rgb(96 165 250);
        }

        .dark .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: rgb(209 213 219);
        }

        .dark .rich-text-editor .ql-toolbar .ql-fill {
          fill: rgb(209 213 219);
        }

        .dark .rich-text-editor .ql-toolbar button:hover .ql-stroke {
          stroke: white;
        }

        .dark .rich-text-editor .ql-toolbar button:hover .ql-fill {
          fill: white;
        }

        .dark .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: rgb(96 165 250);
        }

        .dark .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: rgb(96 165 250);
        }

        .dark .rich-text-editor .ql-toolbar .ql-picker-label {
          color: rgb(209 213 219);
        }

        .dark .rich-text-editor .ql-toolbar .ql-picker-options {
          background: rgb(55 65 81);
          border-color: rgb(75 85 99);
        }

        .dark .rich-text-editor .ql-toolbar .ql-picker-item {
          color: rgb(209 213 219);
        }

        .dark .rich-text-editor .ql-toolbar .ql-picker-item:hover {
          color: white;
          background: rgb(75 85 99);
        }

        /* Focus state */
        .rich-text-editor .quill:focus-within {
          outline: none;
          border-color: rgb(59 130 246);
          box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
        }
      `}</style>
    </>
  );
}