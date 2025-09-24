import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const UserForm = ({ user, onSubmit, onCancel }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        department: user.department || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Real-time validation for better UX
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required";
        } else if (value.trim().length < 2) {
          error = "First name must be at least 2 characters long";
        } else if (value.trim().length > 50) {
          error = "First name must be less than 50 characters";
        } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
          error =
            "First name can only contain letters, spaces, hyphens, and apostrophes";
        }
        break;

      case "lastName":
        if (!value.trim()) {
          error = "Last name is required";
        } else if (value.trim().length < 2) {
          error = "Last name must be at least 2 characters long";
        } else if (value.trim().length > 50) {
          error = "Last name must be less than 50 characters";
        } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
          error =
            "Last name can only contain letters, spaces, hyphens, and apostrophes";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Please enter a valid email address";
        } else if (value.trim().length > 100) {
          error = "Email must be less than 100 characters";
        } else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())
        ) {
          error = "Please enter a valid email format (e.g., user@example.com)";
        }
        break;

      case "department":
        if (!value) {
          error = "Department is required";
        } else if (
          !["Engineering", "Marketing", "Sales", "HR", "Finance"].includes(
            value
          )
        ) {
          error = "Please select a valid department";
        }
        break;

      default:
        break;
    }

    // Only update error if there's an actual error (don't clear on empty)
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // First Name Validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters long";
    } else if (formData.firstName.trim().length > 50) {
      errors.firstName = "First name must be less than 50 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName.trim())) {
      errors.firstName =
        "First name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Last Name Validation
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters long";
    } else if (formData.lastName.trim().length > 50) {
      errors.lastName = "Last name must be less than 50 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName.trim())) {
      errors.lastName =
        "Last name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Email Validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    } else if (formData.email.trim().length > 100) {
      errors.email = "Email must be less than 100 characters";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formData.email.trim()
      )
    ) {
      errors.email =
        "Please enter a valid email format (e.g., user@example.com)";
    }

    // Department Validation
    if (!formData.department) {
      errors.department = "Department is required";
    } else if (
      !["Engineering", "Marketing", "Sales", "HR", "Finance"].includes(
        formData.department
      )
    ) {
      errors.department = "Please select a valid department";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  return (
    <div
      className={`max-w-md mx-auto p-4 md:p-6 rounded-lg shadow-md ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`text-xl md:text-2xl font-bold mb-4 md:mb-6 ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        {user ? "Edit User" : "Add New User"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            value={formData.firstName}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={50}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.firstName
                ? "border-red-500 bg-red-50"
                : isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            placeholder="Enter first name (2-50 characters)"
          />
          {errors.firstName && (
            <div className="mt-1 flex items-center">
              <svg
                className="w-4 h-4 text-red-500 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-600">{errors.firstName}</p>
            </div>
          )}
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
            value={formData.lastName}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={50}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.lastName
                ? "border-red-500 bg-red-50"
                : isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            placeholder="Enter last name (2-50 characters)"
          />
          {errors.lastName && (
            <div className="mt-1 flex items-center">
              <svg
                className="w-4 h-4 text-red-500 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-600">{errors.lastName}</p>
            </div>
          )}
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
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            maxLength={100}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.email
                ? "border-red-500 bg-red-50"
                : isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            placeholder="Enter user email (e.g., user@example.com)"
          />
          {errors.email && (
            <div className="mt-1 flex items-center">
              <svg
                className="w-4 h-4 text-red-500 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-600">{errors.email}</p>
            </div>
          )}
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
            value={formData.department}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.department
                ? "border-red-500 bg-red-50"
                : isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
          {errors.department && (
            <div className="mt-1 flex items-center">
              <svg
                className="w-4 h-4 text-red-500 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-600">{errors.department}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
          <button
            type="submit"
            disabled={Object.keys(errors).length > 0}
            className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 ${
              Object.keys(errors).length > 0
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
            }`}
          >
            {user ? "Update User" : "Add User"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 ${
              isDark
                ? "bg-gray-600 text-white hover:bg-gray-500 focus:ring-gray-500"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-500"
            }`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
