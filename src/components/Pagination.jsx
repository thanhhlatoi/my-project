// src/components/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const canGoPrev = currentPage > 0;
    const canGoNext = currentPage < totalPages - 1;

    return (
        <div className="mt-8 flex justify-center items-center space-x-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!canGoPrev}
                className="px-3 py-1 rounded bg-gray-200 text-gray-600 disabled:opacity-50"
            >
                ⬅ Prev
            </button>

            <span className="px-4 text-sm text-gray-700">
                Page {currentPage + 1} of {totalPages}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!canGoNext}
                className="px-3 py-1 rounded bg-gray-200 text-gray-600 disabled:opacity-50"
            >
                Next ➡
            </button>
        </div>
    );
};

export default Pagination;
