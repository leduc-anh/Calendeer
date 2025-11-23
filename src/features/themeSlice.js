import { createSlice } from "@reduxjs/toolkit";

// Get initial dark mode from localStorage
const getInitialDarkMode = () => {
  try {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : false;
  } catch (error) {
    console.error("Error reading darkMode from localStorage:", error);
    return false;
  }
};

const initialState = {
  darkMode: getInitialDarkMode(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      // Save to localStorage
      try {
        localStorage.setItem("darkMode", JSON.stringify(state.darkMode));
      } catch (error) {
        console.error("Error saving darkMode to localStorage:", error);
      }
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      try {
        localStorage.setItem("darkMode", JSON.stringify(action.payload));
      } catch (error) {
        console.error("Error saving darkMode to localStorage:", error);
      }
    },
  },
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
