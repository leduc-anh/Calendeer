import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/themeSlice";
import taskReducer from "../features/taskSlice";
import bgReducer from "../features/bgSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    tasks: taskReducer,
    bg: bgReducer,
  },
});
