// API service for user management using JSONPlaceholder
import axios from "axios";

// Base URL for JSONPlaceholder API
const API_BASE_URL = "https://jsonplaceholder.typicode.com";

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

// Note: JSONPlaceholder doesn't persist changes, so we'll maintain local state for CRUD operations
// This simulates a real backend by maintaining state locally

// Local state to track changes (since JSONPlaceholder doesn't persist)
let localUsers = null;
let nextId = 1000; // Start from 1000 to avoid conflicts with JSONPlaceholder IDs

// Helper function to assign department based on email domain or name
const getDepartmentFromEmail = (email) => {
  const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance"];
  // Simple hash-based assignment for consistency
  const hash = email.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
  return departments[Math.abs(hash) % departments.length];
};

// API functions
export const getUsers = async () => {
  try {
    // If we haven't loaded users yet, fetch from JSONPlaceholder
    if (!localUsers) {
      const response = await api.get("/users");
      // Transform JSONPlaceholder data to match our structure
      localUsers = response.data.map((user) => ({
        id: user.id,
        firstName: user.name.split(" ")[0],
        lastName: user.name.split(" ").slice(1).join(" "),
        email: user.email,
        department: getDepartmentFromEmail(user.email), // Helper function to assign department
      }));
    }

    // Return the current state (original + local changes)
    return [...localUsers];
  } catch (error) {
    throw new Error(
      `Failed to fetch users: ${error.response?.data?.message || error.message}`
    );
  }
};

export const getUser = async (id) => {
  try {
    // First check if we have local users loaded
    if (localUsers) {
      const user = localUsers.find((u) => u.id === parseInt(id));
      if (user) {
        return { ...user };
      }
    }

    // If not found locally, try to fetch from JSONPlaceholder
    const response = await api.get(`/users/${id}`);
    const user = response.data;
    return {
      id: user.id,
      firstName: user.name.split(" ")[0],
      lastName: user.name.split(" ").slice(1).join(" "),
      email: user.email,
      department: getDepartmentFromEmail(user.email),
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

    // Check if email already exists in local state
    if (localUsers) {
      const existingUser = localUsers.find((u) => u.email === userData.email);
      if (existingUser) {
        throw new Error("Email already exists");
      }
    }

    // Simulate API call (JSONPlaceholder won't actually persist)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Create new user with local ID
    const newUser = {
      id: nextId++,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      department: userData.department,
    };

    // Add to local state
    if (!localUsers) {
      localUsers = [];
    }
    localUsers.push(newUser);

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

    // Find user in local state
    if (!localUsers) {
      throw new Error("User not found");
    }

    const userIndex = localUsers.findIndex((u) => u.id === parseInt(id));
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    // Check if email already exists (excluding current user)
    const existingUser = localUsers.find(
      (u) => u.email === userData.email && u.id !== parseInt(id)
    );
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update user in local state
    const updatedUser = {
      ...localUsers[userIndex],
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      department: userData.department,
    };

    localUsers[userIndex] = updatedUser;

    return { ...updatedUser };
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

export const deleteUser = async (id) => {
  try {
    // Find user in local state
    if (!localUsers) {
      throw new Error("User not found");
    }

    const userIndex = localUsers.findIndex((u) => u.id === parseInt(id));
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Remove user from local state
    localUsers.splice(userIndex, 1);

    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

// Search users (client-side filtering since JSONPlaceholder doesn't support search)
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
