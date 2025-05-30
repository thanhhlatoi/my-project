import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const DataTable = ({ 
    columns, 
    data, 
    loading = false,
    onEdit,
    onDelete,
    onView,
    showActions = true,
    customActions,
    emptyMessage = "No data available"
}) => {
    if (loading) {
        return <LoadingSpinner text="Loading data..." />;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((column, index) => (
                                <th 
                                    key={index}
                                    className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                            {showActions && (
                                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length === 0 ? (
                            <tr>
                                <td 
                                    colSpan={columns.length + (showActions ? 1 : 0)} 
                                    className="py-12 text-center text-gray-500"
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0v-4a2 2 0 012-2h8a2 2 0 012 2v4"/>
                                            </svg>
                                        </div>
                                        <p className="text-lg font-medium">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((item, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="py-4 px-6 text-gray-900">
                                            {column.render ? column.render(item) : item[column.key]}
                                        </td>
                                    ))}
                                    {showActions && (
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                {onView && (
                                                    <button
                                                        onClick={() => onView(item)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(item)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                                {customActions && customActions(item)}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable; 