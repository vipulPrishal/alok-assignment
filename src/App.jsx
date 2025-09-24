import React from "react";
import NavBar from "./components/NavBar/NavBar";
import UsersPage from "./pages/UsersPage";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <UsersPage />
    </div>
  );
};

export default App;
