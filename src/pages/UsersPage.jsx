import React, { useState } from "react";
import UserTable from "../components/UserTable/UserTable";
import SearchBar from "../components/SearchBar/SearchBar";
import { useTheme } from "../contexts/ThemeContext";

const UsersPage = () => {
  const { isDark } = useTheme();

  // Sample users data
  const [allUsers, setAllUsers] = useState([
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      department: "Engineering",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      department: "Marketing",
    },
    {
      id: 3,
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@example.com",
      department: "Sales",
    },
    {
      id: 4,
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah.wilson@example.com",
      department: "HR",
    },
    {
      id: 5,
      firstName: "David",
      lastName: "Brown",
      email: "david.brown@example.com",
      department: "Finance",
    },
  ]);

  const [filteredUsers, setFilteredUsers] = useState(allUsers);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredUsers(allUsers);
      return;
    }

    const filtered = allUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    console.log("Edit user:", user);
    // TODO: Implement edit functionality
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = allUsers.filter((user) => user.id !== userId);
      setAllUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    }
  };

  const handleAddUser = () => {
    console.log("Add new user");
    // TODO: Implement add user functionality
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1
          className={`text-2xl md:text-3xl font-bold mb-2 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          User Management
        </h1>
        <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Manage your users with full CRUD operations
        </p>
      </div>

      {/* Search and Add User Section */}
      <div
        className={`p-4 rounded-lg shadow-sm border mb-6 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center space-x-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by name, email, or department..."
          />

          <button
            onClick={handleAddUser}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 whitespace-nowrap"
          >
            Add User
          </button>
        </div>
      </div>

      {/* User Table */}
      <div
        className={`rounded-lg shadow-sm border overflow-hidden ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <UserTable
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default UsersPage;
