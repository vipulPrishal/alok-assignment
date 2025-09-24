// API service for user management using DummyJSON
import axios from "axios";

// Base URL for DummyJSON API
const API_BASE_URL = "https://dummyjson.com";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions
export const getUsers = async (limit = 100, skip = 0) => {
  try {
    const response = await api.get(`/users?limit=${limit}&skip=${skip}`);
    // Transform DummyJSON data to match our structure
    const users = response.data.users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      department: user.company?.department || "General", // Use company department or default
    }));
    return users;
  } catch (error) {
    throw new Error(
      `Failed to fetch users: ${error.response?.data?.message || error.message}`
    );
  }
};

export const getUser = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    const user = response.data;
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      department: user.company?.department || "General",
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("User not found");
    }
    throw new Error(
      `Failed to fetch user: ${error.response?.data?.message || error.message}`
    );
  }
};

export const createUser = async (userData) => {
  try {
    // Validate required fields
    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.department
    ) {
      throw new Error(
        "First name, last name, email, and department are required"
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error("Please enter a valid email address");
    }

    // Simulate API call (DummyJSON doesn't support POST for users)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Create new user with local ID (since DummyJSON doesn't persist)
    const newUser = {
      id: Date.now(), // Use timestamp as ID
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      department: userData.department,
    };

    return { ...newUser };
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

export const updateUser = async (id, userData) => {
  try {
    // Validate required fields
    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.department
    ) {
      throw new Error(
        "First name, last name, email, and department are required"
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error("Please enter a valid email address");
    }

    // Simulate API call (DummyJSON doesn't support PUT for users)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return updated user data
    const updatedUser = {
      id: parseInt(id),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      department: userData.department,
    };

    return { ...updatedUser };
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

export const deleteUser = async (id) => {
  try {
    // Simulate API call (DummyJSON doesn't support DELETE for users)
    await new Promise((resolve) => setTimeout(resolve, 300));

    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

// Search users (client-side filtering since DummyJSON doesn't support search)
export const searchUsers = async (query) => {
  try {
    const allUsers = await getUsers();

    if (!query) {
      return allUsers;
    }

    const filteredUsers = allUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query.toLowerCase()) ||
        user.lastName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.department.toLowerCase().includes(query.toLowerCase())
    );

    return filteredUsers;
  } catch (error) {
    throw new Error(`Failed to search users: ${error.message}`);
  }
};

// Filter users by department (client-side filtering)
export const filterUsersByDepartment = async (department) => {
  try {
    const allUsers = await getUsers();

    if (!department) {
      return allUsers;
    }

    return allUsers.filter((user) => user.department === department);
  } catch (error) {
    throw new Error(`Failed to filter users: ${error.message}`);
  }
};

// Get user statistics
export const getUserStats = async () => {
  try {
    const allUsers = await getUsers();
    const totalUsers = allUsers.length;
    const departments = [...new Set(allUsers.map((u) => u.department))];
    const departmentCounts = departments.map((dept) => ({
      department: dept,
      count: allUsers.filter((u) => u.department === dept).length,
    }));

    return {
      total: totalUsers,
      departments: departmentCounts,
    };
  } catch (error) {
    throw new Error(`Failed to get user statistics: ${error.message}`);
  }
};

// Export all functions as default object
export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  filterUsersByDepartment,
  getUserStats,
};
