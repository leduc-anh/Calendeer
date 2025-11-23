import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  rectIntersection,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { toast } from "react-toastify";
import { TaskCard } from "./TaskCard";
import { SortableItem } from "./SortableItem";
import { ColumnDropArea } from "./ColumnDropArea";
import { Plus } from "lucide-react";
import {
  updateTask,
  createTask,
  setTasks,
  fetchTaskbyId,
} from "../../features/taskSlice";

const statusColumns = ["Todo", "InProgress", "Review", "Done"];

export default function KanbanBoard() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.items || []);
  const [activeTask, setActiveTask] = useState(null);

  const tasksByStatus = {
    Todo: [],
    InProgress: [],
    Review: [],
    Done: [],
  };

  tasks.forEach((t) => {
    if (tasksByStatus.hasOwnProperty(t.status)) {
      tasksByStatus[t.status].push(t);
    }
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = ({ active }) => {
    const [, id] = String(active.id).split(":");
    const task = tasks.find((t) => t.id === id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    const [fromStatus, fromId] = String(active.id).split(":");
    const overId = String(over.id);
    let toStatus;

    if (overId.startsWith("column-drop-")) {
      toStatus = overId.replace("column-drop-", "");
    } else {
      toStatus = overId.split(":")[0];
    }

    if (fromStatus === toStatus) {
      const overTaskId = overId.split(":")[1];
      const oldIndex = tasks.findIndex((t) => t.id === fromId);
      const newIndex = tasks.findIndex((t) => t.id === overTaskId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newTasks = arrayMove(tasks, oldIndex, newIndex);
        dispatch(setTasks(newTasks));
      }
    } else {
      const taskToUpdate = tasks.find((t) => t.id === fromId);
      if (taskToUpdate) {
        // Create complete updated task object with all fields
        const updatedTask = {
          ...taskToUpdate,
          status: toStatus,
        };
        dispatch(
          updateTask({
            id: fromId,
            data: updatedTask,
          })
        );
        toast.success(`Task moved to ${toStatus}`);
      }
    }
  };

  const handleAddTask = (status) => {
    dispatch(
      createTask({
        name: "New task",
        status: status,
        priority: "Medium",
        description: "",
        note: "",
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
      })
    );
    toast.success("Task added!");
  };

  const handleTaskClick = (taskId) => {
    dispatch(fetchTaskbyId(taskId));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="max-w-7xl w-full flex gap-4">
          {statusColumns.map((status) => (
            <div
              key={status}
              className="flex-1 bg-slate-100/50 dark:bg-slate-800/50 p-3 rounded-xl flex flex-col border border-slate-200 dark:border-slate-700 max-h-[85vh]"
            >
              <div className="flex items-center justify-center gap-2 p-2 mb-2 shrink-0">
                <h3 className="font-medium text-sm text-slate-600 dark:text-slate-300 tracking-widest">
                  {status}
                </h3>
                <span className="text-xs font-light text-slate-500 dark:text-slate-400/50 bg-slate-200 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">
                  {tasksByStatus[status].length}
                </span>
              </div>

              <SortableContext
                items={[
                  ...tasksByStatus[status].map((t) => `${status}:${t.id}`),
                  `column-drop-${status}`,
                ]}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-3 grow p-1 overflow-y-auto">
                  {tasksByStatus[status].map((task) => (
                    <SortableItem key={task.id} id={`${status}:${task.id}`}>
                      <TaskCard
                        task={task}
                        onClick={() => handleTaskClick(task.id)}
                      />
                    </SortableItem>
                  ))}
                  {tasksByStatus[status].length === 0 && (
                    <SortableItem id={`column-drop-${status}`}>
                      <ColumnDropArea id={`column-drop-${status}`} />
                    </SortableItem>
                  )}
                </div>
              </SortableContext>

              <button
                onClick={() => handleAddTask(status)}
                className="cursor-pointer mt-2 flex items-center justify-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-500 p-2 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition"
              >
                <Plus size={14} /> Add Task
              </button>
            </div>
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="shadow-2xl rounded-lg -rotate-3">
            <TaskCard task={activeTask} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
