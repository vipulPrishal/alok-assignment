import React, { useState } from "react";
import UserTable from "../components/UserTable/UserTable";
import SearchBar from "../components/SearchBar/SearchBar";
import UserForm from "../components/UserForm/UserForm";
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
  const [editingUser, setEditingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);

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

  const handleSortByName = () => {
    const sorted = [...filteredUsers].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
    setFilteredUsers(sorted);
  };

  const handleSortByEmail = () => {
    const sorted = [...filteredUsers].sort((a, b) => {
      return a.email.toLowerCase().localeCompare(b.email.toLowerCase());
    });
    setFilteredUsers(sorted);
  };

  const handleSortByDepartment = () => {
    const sorted = [...filteredUsers].sort((a, b) => {
      return a.department
        .toLowerCase()
        .localeCompare(b.department.toLowerCase());
    });
    setFilteredUsers(sorted);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setAddingUser(false);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleUpdateUser = (updatedUserData) => {
    const updatedUsers = allUsers.map((user) =>
      user.id === editingUser.id ? { ...user, ...updatedUserData } : user
    );
    setAllUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setEditingUser(null);
  };

  const handleAddUser = () => {
    setAddingUser(true);
    setEditingUser(null);
  };

  const handleCancelAdd = () => {
    setAddingUser(false);
  };

  const handleCreateUser = (newUserData) => {
    // Generate new ID (highest existing ID + 1)
    const newId = Math.max(...allUsers.map((user) => user.id)) + 1;

    const newUser = {
      id: newId,
      ...newUserData,
    };

    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setAddingUser(false);
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = allUsers.filter((user) => user.id !== userId);
      setAllUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    }
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

      {/* Add User Form */}
      {addingUser && (
        <div className="mb-6">
          <UserForm
            user={null}
            onSubmit={handleCreateUser}
            onCancel={handleCancelAdd}
          />
        </div>
      )}

      {/* Edit User Form */}
      {editingUser && (
        <div className="mb-6">
          <UserForm
            user={editingUser}
            onSubmit={handleUpdateUser}
            onCancel={handleCancelEdit}
          />
        </div>
      )}

      {/* User Table */}
      <div
        className={`rounded-lg shadow-sm border overflow-hidden mb-6 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <UserTable
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Sort Buttons */}
      <div
        className={`p-4 rounded-lg shadow-sm border ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSortByName}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Sort by Name
          </button>
          <button
            onClick={handleSortByEmail}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200"
          >
            Sort by Email
          </button>
          <button
            onClick={handleSortByDepartment}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200"
          >
            Sort by Department
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
