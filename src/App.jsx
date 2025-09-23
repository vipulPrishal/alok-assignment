import React from "react";
import UsersPage from "./pages/UsersPage";
import AddUserPage from "./pages/AddUserPage";
import EditUserPage from "./pages/EditUserPage";
import { ToastProvider } from "./contexts/ToastContext";

const App = () => {
  // Simple routing based on pathname
  const getCurrentPage = () => {
    const path = window.location.pathname;

    switch (path) {
      case "/add-user":
        return <AddUserPage />;
      case "/edit-user":
        return <EditUserPage />;
      case "/":
      default:
        return <UsersPage />;
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-800">
                  User Management Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Users
                </button>
                <button
                  onClick={() => (window.location.href = "/add-user")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>{getCurrentPage()}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-gray-600">
              <p>
                &copy; 2024 User Management Dashboard. Built with React and
                Tailwind CSS.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
};

export default App;
