import React, { useState } from "react";
import UserForm from "../components/UserForm";
import { createUser } from "../services/api";
import { useToast } from "../contexts/ToastContext";

const AddUserPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      await createUser(userData);
      setSuccess(true);
      showSuccess("User created successfully!");

      // Redirect to users page after successful creation
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      const errorMessage =
        err.message || "Failed to create user. Please try again.";
      setError(errorMessage);
      showError(errorMessage);
      console.error("Error creating user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = "/";
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            User Created Successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            The new user has been added to the system.
          </p>
          <p className="text-sm text-gray-500">Redirecting to users page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Users
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Add New User</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to create a new user account.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <UserForm user={null} onSubmit={handleSubmit} onCancel={handleCancel} />

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <span className="text-gray-700">Creating user...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUserPage;
