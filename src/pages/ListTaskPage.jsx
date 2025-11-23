import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CirclePlus,Trash } from "lucide-react";
import { fetchTasks, fetchTaskbyId,deleteTask } from "../features/taskSlice";
import TaskModal from "../components/TaskModal";
import TaskCreateEditModal from "../components/TaskCreateEditModal";


const getStatusColor = (status) => {
  switch (status) {
    case "Todo":
      return "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200";
    case "InProgress":
      return "bg-blue-200 text-blue-800 dark:bg-blue-600 dark:text-blue-200";
    case "Review":
      return "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-200";
    case "Done":
      return "bg-green-200 text-green-800 dark:bg-green-600 dark:text-green-200";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "Low":
      return "text-green-600 dark:text-green-400";
    case "Medium":
      return "text-yellow-600 dark:text-yellow-400";
    case "High":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-600";
  }
};

export default function ListTaskPage() {
  const dispatch = useDispatch();
  const { items: tasks, loading, selectedTask, loadingDetail } = useSelector((state) => state.tasks);

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredAndSortedTasks = useCallback(() => {
    let filtered = tasks.filter((t) => {
      const matchStatus = filterStatus === "All" || t.status === filterStatus;
      const matchPriority = filterPriority === "All" || t.priority === filterPriority;
      const matchSearch =
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchPriority && matchSearch;
    });

    switch (sortBy) {
      case "date-desc":
        filtered.sort((a, b) => new Date(b.startTime || 0) - new Date(a.startTime || 0));
        break;
      case "date-asc":
        filtered.sort((a, b) => new Date(a.startTime || 0) - new Date(b.startTime || 0));
        break;
      case "priority":
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "status":
        const statusOrder = { Todo: 0, InProgress: 1, Review: 2, Done: 3 };
        filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        break;
      default:
        break;
    }

    return filtered;
  }, [tasks, filterStatus, filterPriority, searchTerm, sortBy]);

  const allFilteredTasks = filteredAndSortedTasks();

  const handleTaskClick = (taskId) => {
    dispatch(fetchTaskbyId(taskId));
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(taskId));
      toast.success("Task deleted successfully!");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading tasks...</p>
      </div>
    );

  return (
    <div className="p-6 scrollbar-w-2 scrollbar-track-gray-100 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your tasks efficiently</p>
        </div>

        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-md p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="mb-4">
               <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                Search
              </label>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value) {
                  toast.info(`Searching for "${e.target.value}"`);
                }
              }}
              className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  toast.info(`Filtered by Status: ${e.target.value}`);
                }}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Todo">Todo</option>
                <option value="InProgress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => {
                  setFilterPriority(e.target.value);
                  toast.info(`Filtered by Priority: ${e.target.value}`);
                }}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  toast.info(`Sorted by: ${e.target.value}`);
                }}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="priority">Priority</option>
                <option value="name">Name (A-Z)</option>
                <option value="status">Status</option>
              </select>
            </div>
            
            <div>
              <button
                onClick={() => {
                  setFilterStatus("All");
                  setFilterPriority("All");
                  setSortBy("date-desc");
                  setSearchTerm("");
                  toast.success("Filters reset!");
                }}
                className="px-2 cursor-pointer py-2 bg-red-500/70 hover:bg-red-600 text-white font-semibold rounded-lg transition mt-6"
              >
                Reset Filters
              </button>
            </div>
            <div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full cursor-pointer flex px-4 py-2 border-2 border-gray-200/70 text-black  hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800 dark:text-white/90 font-semibold rounded-lg transition mt-6"
              >
                <CirclePlus/> <span className="ml-2">Create Task</span>
              </button>
             </div>
             
          </div>
        </div>

        {allFilteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No tasks found</p>
          </div>
        ) : (
          <div className="bg-white/60 shadow-xl dark:bg-gray-800/60 rounded-lg  overflow-hidden max-h-[63vh] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-600 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Task Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Note</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allFilteredTasks.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => handleTaskClick(t.id)}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{t.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">{t.description || "-"}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-semibold ${getPriorityColor(t.priority)}`}>
                        ● {t.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {t.startTime ? new Date(t.startTime).toLocaleDateString("vi-VN") : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {t.note ? (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs">
                          Note
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(t.id);
                        }}
                        className="px-2 cursor-pointer py-1 bg-red-500/70 hover:bg-red-600 text-white font-semibold rounded-lg transition"
                      >
                        <Trash size={16}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TaskModal task={selectedTask} loading={loadingDetail} isOpen={!!selectedTask} />

      <TaskCreateEditModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        isCreateMode={true}
      />

      <style>{`
        /* Custom scrollbar */
        .scrollbar-w-2::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background: rgb(243, 244, 246);
        }
        .scrollbar-thumb-gray-400::-webkit-scrollbar-thumb {
          background: rgb(156, 163, 175);
          border-radius: 4px;
        }
        .scrollbar-thumb-gray-400::-webkit-scrollbar-thumb:hover {
          background: rgb(107, 114, 128);
        }
        .dark .scrollbar-track-gray-800::-webkit-scrollbar-track {
          background: rgb(31, 41, 55);
        }
        .dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background: rgb(75, 85, 99);
          border-radius: 4px;
        }
        .dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb:hover {
          background: rgb(107, 114, 128);
        }
      `}</style>
    </div>
  );
}
