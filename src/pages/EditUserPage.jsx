import React, { useState, useEffect } from "react";
import UserForm from "../components/UserForm";
import { getUser, updateUser } from "../services/api";
import { useToast } from "../contexts/ToastContext";

const EditUserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { showSuccess, showError } = useToast();

  // Get user ID from URL params (in a real app, you'd use React Router)
  const userId = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    if (userId) {
      fetchUser();
    } else {
      setError("No user ID provided");
      setLoading(false);
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getUser(userId);
      setUser(userData);
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch user details";
      setError(errorMessage);
      showError(errorMessage);
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (userData) => {
    try {
      setSaving(true);
      setError(null);
      await updateUser(userId, userData);
      setSuccess(true);
      showSuccess("User updated successfully!");

      // Redirect to users page after successful update
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      const errorMessage =
        err.message || "Failed to update user. Please try again.";
      setError(errorMessage);
      showError(errorMessage);
      console.error("Error updating user:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

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
            User Updated Successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            The user information has been updated.
          </p>
          <p className="text-sm text-gray-500">Redirecting to users page...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleCancel}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
          >
            Back to Users
          </button>
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
          <h1 className="text-3xl font-bold text-gray-800">Edit User</h1>
          <p className="text-gray-600 mt-2">
            Update the user information below.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {user && (
          <UserForm
            user={user}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        {saving && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <span className="text-gray-700">Updating user...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUserPage;
