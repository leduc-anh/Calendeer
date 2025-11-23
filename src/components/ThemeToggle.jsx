import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode, setDarkMode } from "../features/themeSlice";
import { useEffect } from "react"; 
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const savedDarkMode = localStorage.getItem("darkMode");
      if (savedDarkMode !== null) {
        const isDark = JSON.parse(savedDarkMode);
        dispatch(setDarkMode(isDark));
      }
    } catch (error) {
      console.error("Error loading darkMode from localStorage:", error);
    }
  }, [dispatch]);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <button
      className="px-2 w-10 h-10 flex items-center justify-center bg-amber-200 cursor-pointer dark:bg-gray-700 text-black dark:text-white rounded-full transition-colors duration-200 hover:bg-amber-300 dark:hover:bg-gray-500"
      onClick={handleToggle}
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
