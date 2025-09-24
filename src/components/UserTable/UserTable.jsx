import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const UserTable = ({ users, onEdit, onDelete }) => {
  const { isDark } = useTheme();

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table
          className={`min-w-full border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <thead className={isDark ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                ID
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                First Name
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                Last Name
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                Email
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                Department
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDark
                ? "bg-gray-800 divide-gray-700"
                : "bg-white divide-gray-200"
            }`}
          >
            {users.map((user) => (
              <tr
                key={user.id}
                className={isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}
              >
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.id}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.firstName}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.lastName}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.email}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.department}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className={`border rounded-lg p-4 mb-4 shadow-sm ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.firstName} {user.lastName}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  ID: {user.id}
                </p>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {user.department}
              </span>
            </div>

            <div className="mb-4">
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <span className="font-medium">Email:</span> {user.email}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => onEdit(user)}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(user.id)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserTable;
