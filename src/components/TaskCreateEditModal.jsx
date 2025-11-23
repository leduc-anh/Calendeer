import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateTask,createTask } from "../features/taskSlice";

const STATUS_OPTIONS = ["Todo", "InProgress", "Review", "Done"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

export default function TaskCreateEditModal({ task, isOpen, onClose, isCreateMode = false }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(task || {});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isCreateMode) {
      setFormData({
        name: "",
        description: "",
        status: "Todo",
        priority: "Medium",
        startTime: "",
        endTime: "",
        note: ""
      });
    } else if (task) {
      setFormData(task);
    }
  }, [task, isOpen, isCreateMode]);
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
    if (!formData.name || formData.name.trim() === "") {
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
      console.error(isCreateMode ? "Error creating task:" : "Error updating task:", error);
      toast.error(isCreateMode ? "Error creating task. Please try again." : "Error updating task. Please try again.");
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

  if (!isOpen ) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn backdrop-blur-sm"
        onClick={handleCancel}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl pointer-events-auto animate-scaleIn max-h-[90vh] overflow-y-auto">
          <div className="px-8 py-7 flex justify-between items-start bg-linear-to-r from-blue-500 to-blue-600 rounded-t-3xl">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">{isCreateMode ? "Create New Task" : "Edit Task"}</h2>
              <p className="text-blue-100 text-sm">{isCreateMode ? "Add a new task to your list" : "Modify task details and save changes"}</p>
            </div>
            <button
              onClick={handleCancel}
              className="cursor-pointer w-9 h-9 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition duration-200 shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!isCreateMode && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Task ID
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-500 rounded-xl border border-gray-200 dark:border-gray-600 cursor-not-allowed"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Task Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition duration-200"
                  placeholder="Enter task name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition duration-200"
                >
                  {PRIORITY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition duration-200"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition duration-200 resize-none"
                rows="4"
                placeholder="Enter task description"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Note
              </label>
              <textarea
                name="note"
                value={formData.note || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition duration-200 resize-none"
                rows="3"
                placeholder="Add a note"
              />
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-8 py-5 flex gap-3 justify-end rounded-b-3xl">
            <button
              onClick={handleCancel}
              className="cursor-pointer px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-semibold transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="cursor-pointer px-7 py-2.5 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white rounded-xl font-semibold transition duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading && <span className="inline-block animate-spin">⟳</span>}
              {loading ? "Saving..." : isCreateMode ? "Create Task" : "Save Changes"}
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
      `}</style>
    </>
  );
}
