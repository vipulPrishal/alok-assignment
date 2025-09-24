import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
}) => {
  const { isDark } = useTheme();

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 border-t ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        {/* Items per page selector - Mobile friendly */}
        <div className="flex items-center space-x-2">
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
            className={`px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Simple pagination controls - Mobile friendly */}
        <div className="flex items-center space-x-1">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm border rounded ${
              currentPage === 1
                ? `${
                    isDark
                      ? "bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`
                : `${
                    isDark
                      ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`
            }`}
          >
            Prev
          </button>

          {/* Current page info */}
          <span
            className={`px-3 py-1 text-sm ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {currentPage} / {totalPages}
          </span>

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm border rounded ${
              currentPage === totalPages
                ? `${
                    isDark
                      ? "bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`
                : `${
                    isDark
                      ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
