import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const FilterPopup = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  const { isDark } = useTheme();
  const [filters, setFilters] = useState({
    firstName: currentFilters?.firstName || "",
    lastName: currentFilters?.lastName || "",
    email: currentFilters?.email || "",
    department: currentFilters?.department || "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      firstName: "",
      lastName: "",
      email: "",
      department: "",
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Filter Users
          </h3>
          <button
            onClick={onClose}
            className={`text-xl ${
              isDark
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className={`block text-sm font-medium mb-1 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={filters.firstName}
              onChange={handleFilterChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Filter by first name"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className={`block text-sm font-medium mb-1 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={filters.lastName}
              onChange={handleFilterChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Filter by last name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-1 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Filter by email"
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className={`block text-sm font-medium mb-1 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Department
            </label>
            <select
              id="department"
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleApply}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 ${
              isDark
                ? "bg-gray-600 text-white hover:bg-gray-500 focus:ring-gray-500"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-500"
            }`}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
