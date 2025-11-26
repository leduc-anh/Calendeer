import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import KanbanBoard from "../components/KanbanBoard/KanbanBoard";
import TaskModal from "../components/TaskModal";
import { fetchTasks } from "../features/taskSlice";

export default function KanbanPage() {
  const dispatch = useDispatch();
  const selectedTask = useSelector((state) => state.tasks.selectedTask);
  const loadingDetail = useSelector((state) => state.tasks.loadingDetail);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="w-full h-full">
      <KanbanBoard />
      <TaskModal
        task={selectedTask}
        loading={loadingDetail}
        isOpen={!!selectedTask}
      />
    </div>
  );
}