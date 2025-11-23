import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import KanbanBoard from "../components/KanbanBoard/KanbanBoard";
import { fetchTasks } from "../features/taskSlice";

export default function KanbanPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="w-full h-full">
      <KanbanBoard />
    </div>
  );
}
