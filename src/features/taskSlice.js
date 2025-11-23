import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import taskAPI from "../lib/taskAPI";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async () => {
    const response = await taskAPI.getAll();
    return response.data;
  }
);
export const fetchTaskbyId = createAsyncThunk(
  "tasks/fetchTaskbyId",
  async (id) => {
    const response = await taskAPI.getById(id);
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, data }) => {
    const response = await taskAPI.update(id, data);
    return response.data;
  }
);
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (data) => {
    const response = await taskAPI.create(data);
    return response.data;
  }
);
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id) => {
    await taskAPI.delete(id);
    return id;
  } 
);
const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    taskList: [],
    loading: false,
    selectedTask: null,
    loadingDetail: false,
    activities: [],
  },
  reducers: {
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
    setTasks: (state, action) => {
      state.items = action.payload;
      state.taskList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.taskList = action.payload;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchTaskbyId.pending, (state) => {
        state.loadingDetail = true;
      })
      .addCase(fetchTaskbyId.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.selectedTask = action.payload;
      })
      .addCase(fetchTaskbyId.rejected, (state) => {
        state.loadingDetail = false;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          // Merge response với data cũ để đảm bảo không mất field
          state.items[index] = {
            ...state.items[index],
            ...action.payload
          };
        }
        if (state.selectedTask && state.selectedTask.id === action.payload.id) {
          state.selectedTask = {
            ...state.selectedTask,
            ...action.payload
          };
        }
        state.taskList = state.items;
        state.activities.unshift({
          id: Date.now(),
          type: "update",
          details: "Task updated",
          taskSummary: action.payload.name || state.items[index]?.name,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(updateTask.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.taskList = state.items;
        state.activities.unshift({
          id: Date.now(),
          type: "add",
          details: "Task created",
          taskSummary: action.payload.name,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(createTask.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        const deletedTask = state.items.find(task => task.id === action.payload);
        state.items = state.items.filter(task => task.id !== action.payload);
        state.taskList = state.items;
        if (deletedTask) {
          state.activities.unshift({
            id: Date.now(),
            type: "delete",
            details: "Task deleted",
            taskSummary: deletedTask.name,
            timestamp: new Date().toISOString(),
          });
        }
      })
      .addCase(deleteTask.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default taskSlice.reducer;

export const { clearSelectedTask, setTasks } = taskSlice.actions;
