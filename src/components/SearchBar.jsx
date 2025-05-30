import React from 'react';
import { Search, Filter, Download } from 'lucide-react';

const SearchBar = ({ 
    value, 
    onChange, 
    placeholder = "Search...", 
    showFilters = false,
    showExport = false,
    onFilterClick,
    onExportClick,
    customActions
}) => {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    {showFilters && (
                        <button
                            onClick={onFilterClick}
                            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <Filter size={18} />
                            <span className="hidden sm:inline">Filter</span>
                        </button>
                    )}
                    
                    {showExport && (
                        <button
                            onClick={onExportClick}
                            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <Download size={18} />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                    )}
                    
                    {customActions && customActions}
                </div>
            </div>
        </div>
    );
};

export default SearchBar; 