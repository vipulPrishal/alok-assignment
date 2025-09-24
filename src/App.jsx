import React from "react";
import NavBar from "./components/NavBar/NavBar";
import UsersPage from "./pages/UsersPage";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

const AppContent = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <NavBar />
      <UsersPage />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
