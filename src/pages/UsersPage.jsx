import React, { useState, useEffect } from "react";
import UserTable from "../components/UserTable";
import SearchBar from "../components/SearchBar";
import FilterPopup from "../components/FilterPopup";
import Pagination from "../components/Pagination";
import { getUsers, deleteUser } from "../services/api";
import { useToast } from "../contexts/ToastContext";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useToast();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    sortBy: "firstName",
    sortOrder: "asc",
  });

  // UI state
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [sortField, setSortField] = useState("firstName");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    fetchUsers();
  }, []);

  // Refresh data when returning from add/edit pages
  useEffect(() => {
    const handleFocus = () => {
      fetchUsers();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [users, searchTerm, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch users";
      setError(errorMessage);
      showError(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply individual filters
    if (filters.firstName) {
      filtered = filtered.filter((user) =>
        user.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
      );
    }

    if (filters.lastName) {
      filtered = filtered.filter((user) =>
        user.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
      );
    }

    if (filters.email) {
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    if (filters.department) {
      filtered = filtered.filter(
        (user) => user.department === filters.department
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setSortField(newFilters.sortBy);
    setSortDirection(newFilters.sortOrder);
  };

  const handleSort = (field) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: newDirection,
    }));
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter((user) => user.id !== userId));
        showSuccess("User deleted successfully!");
      } catch (err) {
        const errorMessage = err.message || "Failed to delete user";
        setError(errorMessage);
        showError(errorMessage);
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleEdit = (user) => {
    // Navigate to edit page with user ID
    window.location.href = `/edit-user?id=${user.id}`;
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
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          User Management
        </h1>
        <p className="text-gray-600">
          Manage your users with search, filter, and pagination
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by name, email, or department..."
          />

          <div className="flex space-x-3">
            <button
              onClick={fetchUsers}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Refresh
            </button>
            <button
              onClick={() => setShowFilterPopup(true)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Filter
            </button>
            <button
              onClick={() => (window.location.href = "/add-user")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
            >
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <UserTable
          users={currentUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={filteredUsers.length}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {/* Filter Popup */}
      <FilterPopup
        isOpen={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default UsersPage;
