import React from 'react';
import { Plus } from 'lucide-react';
import Pagination from './Pagination.jsx';

const PageHeader = ({ 
    title, 
    description, 
    showAddButton = false, 
    addButtonText = "Add New", 
    onAddClick,
    customActions,
    gradient = "from-blue-600 to-blue-700",
    // Pagination props
    showPagination = false,
    currentPage,
    totalPages,
    onPageChange,
    paginationClassName = ""
}) => {
    return (
        <div className="space-y-4">
            {/* Header Section */}
            <div className={`bg-gradient-to-r ${gradient} rounded-xl p-6 shadow-lg`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">{title}</h1>
                        {description && (
                            <p className="text-white/80 mt-2">{description}</p>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {showAddButton && (
                            <button
                                onClick={onAddClick}
                                className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-md flex items-center gap-2 font-medium"
                            >
                                <Plus size={18} />
                                {addButtonText}
                            </button>
                        )}
                        {customActions && customActions}
                    </div>
                </div>
            </div>

            {/* Pagination Section */}
            {showPagination && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        className={paginationClassName}
                    />
                </div>
            )}
        </div>
    );
};

export default PageHeader; 