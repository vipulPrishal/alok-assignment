import React, { useState, useEffect } from "react";
import UserTable from "../components/UserTable/UserTable";
import SearchBar from "../components/SearchBar/SearchBar";
import UserForm from "../components/UserForm/UserForm";
import Pagination from "../components/Pagination/Pagination";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { getUsers, createUser, updateUser, deleteUser } from "../services/api";
// import { sampleUsers } from "../data/sampleUsers"; // Commented out - using API data now

const UsersPage = () => {
  const { isDark } = useTheme();
  const { showSuccess, showError, showWarning } = useToast();

  // State for API data
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch users from API on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const users = await getUsers(100, 0); // Get 100 users from API
      setAllUsers(users);
      setFilteredUsers(users);
    } catch (err) {
      const errorMessage =
        err.message ||
        "Failed to fetch users. Please check your internet connection and try again.";
      setError(errorMessage);
      showError(`Failed to load users: ${errorMessage}`);
      console.error("Error fetching users:", err);

      // Set empty arrays to prevent crashes
      setAllUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredUsers(allUsers);
      setCurrentPage(1);
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
    setCurrentPage(1);
  };

  const handleSortByName = () => {
    const sorted = [...filteredUsers].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
    setFilteredUsers(sorted);
    setCurrentPage(1);
  };

  const handleSortByEmail = () => {
    const sorted = [...filteredUsers].sort((a, b) => {
      return a.email.toLowerCase().localeCompare(b.email.toLowerCase());
    });
    setFilteredUsers(sorted);
    setCurrentPage(1);
  };

  const handleSortByDepartment = () => {
    const sorted = [...filteredUsers].sort((a, b) => {
      return a.department
        .toLowerCase()
        .localeCompare(b.department.toLowerCase());
    });
    setFilteredUsers(sorted);
    setCurrentPage(1);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setAddingUser(false);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleUpdateUser = async (updatedUserData) => {
    try {
      await updateUser(editingUser.id, updatedUserData);
      const updatedUsers = allUsers.map((user) =>
        user.id === editingUser.id ? { ...user, ...updatedUserData } : user
      );
      setAllUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setEditingUser(null);
      showWarning("User Data Updated");
    } catch (err) {
      const errorMessage =
        err.message || "Failed to update user. Please try again.";
      console.error("Error updating user:", err);
      setError(errorMessage);
      showError(`Update Failed: ${errorMessage}`);
    }
  };

  const handleAddUser = () => {
    setAddingUser(true);
    setEditingUser(null);
  };

  const handleCancelAdd = () => {
    setAddingUser(false);
  };

  const handleCreateUser = async (newUserData) => {
    try {
      const newUser = await createUser(newUserData);
      const updatedUsers = [...allUsers, newUser];
      setAllUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setAddingUser(false);
      showSuccess("User Data Added");
    } catch (err) {
      const errorMessage =
        err.message ||
        "Failed to create user. Please check your input and try again.";
      console.error("Error creating user:", err);
      setError(errorMessage);
      showError(`Create Failed: ${errorMessage}`);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const deleteResponse = await deleteUser(userId);
        console.log("Delete API Response:", deleteResponse);

        // Update local state to remove the deleted user
        const updatedUsers = allUsers.filter((user) => user.id !== userId);
        setAllUsers(updatedUsers);
        setFilteredUsers(updatedUsers);

        // Show success toast with user name
        showError(
          `User Data Deleted: ${deleteResponse.deletedUser?.firstName} ${deleteResponse.deletedUser?.lastName}`
        );
      } catch (err) {
        const errorMessage =
          err.message || "Failed to delete user. Please try again.";
        console.error("Error deleting user:", err);
        setError(errorMessage);
        showError(`Delete Failed: ${errorMessage}`);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <div
            className={`text-lg mb-4 ${
              isDark ? "text-white" : "text-gray-600"
            }`}
          >
            Loading users...
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

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

      {error && (
        <div
          className={`border px-4 py-3 rounded mb-4 flex items-center justify-between ${
            isDark
              ? "bg-red-900 border-red-700 text-red-200"
              : "bg-red-100 border-red-400 text-red-700"
          }`}
        >
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Error:</span>
            <span className="ml-1">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className={`ml-4 text-lg font-bold hover:opacity-75 ${
              isDark ? "text-red-200" : "text-red-700"
            }`}
          >
            ×
          </button>
        </div>
      )}

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
      {filteredUsers.length === 0 && !loading ? (
        <div
          className={`rounded-lg shadow-sm border p-8 text-center mb-6 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div
            className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {allUsers.length === 0
              ? "No users found. Please check your connection and try refreshing the page."
              : "No users match your search criteria. Try adjusting your search terms."}
          </div>
          {allUsers.length === 0 && (
            <button
              onClick={fetchUsers}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
            >
              Retry Loading Users
            </button>
          )}
        </div>
      ) : (
        <div
          className={`rounded-lg shadow-sm border overflow-hidden mb-6 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <UserTable
            users={currentUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredUsers.length}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}

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
