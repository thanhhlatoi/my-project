// src/components/Pagination.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({ 
    currentPage = 0, 
    totalPages = 1, 
    onPageChange,
    showInfo = true,
    className = ""
}) => {
    const canGoPrev = currentPage > 0;
    const canGoNext = currentPage < totalPages - 1;

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
            // Show all pages if total is small
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show first page
            pages.push(0);
            
            if (currentPage <= 2) {
                // Show pages 0, 1, 2, 3, ..., last
                pages.push(1, 2, 3);
                if (totalPages > 4) pages.push('...');
                pages.push(totalPages - 1);
            } else if (currentPage >= totalPages - 3) {
                // Show pages 0, ..., n-3, n-2, n-1, n
                pages.push('...');
                pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
            } else {
                // Show pages 0, ..., current-1, current, current+1, ..., last
                pages.push('...');
                pages.push(currentPage - 1, currentPage, currentPage + 1);
                pages.push('...');
                pages.push(totalPages - 1);
            }
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();

    if (totalPages <= 1) return null;

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
            {/* Page Info */}
            {showInfo && (
                <div className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage + 1}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!canGoPrev}
                    className={`p-2 rounded-lg border transition-colors ${
                        canGoPrev
                            ? 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                            : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    title="Previous page"
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {pageNumbers.map((pageNum, index) => {
                        if (pageNum === '...') {
                            return (
                                <div key={`ellipsis-${index}`} className="px-3 py-2">
                                    <MoreHorizontal size={16} className="text-gray-400" />
                                </div>
                            );
                        }

                        const isActive = pageNum === currentPage;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`w-10 h-10 rounded-lg border transition-all font-medium ${
                                    isActive
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                                }`}
                            >
                                {pageNum + 1}
                            </button>
                        );
                    })}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!canGoNext}
                    className={`p-2 rounded-lg border transition-colors ${
                        canGoNext
                            ? 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                            : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    title="Next page"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
