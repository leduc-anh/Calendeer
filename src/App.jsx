import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ListTaskPage from "./pages/ListTaskPage";
import DefaultLayout from "./components/layout/DefaultLayout";
import DashBoard from "./pages/DashBoard";
import KanbanPage from "./pages/KanbanPage";
import CalendarPage from "./pages/CalendarPage";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<DashBoard />} />
          <Route path="tasks" element={<ListTaskPage />} />
          <Route path="kanban" element={<KanbanPage />} />
          <Route path="calendar" element={<CalendarPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
