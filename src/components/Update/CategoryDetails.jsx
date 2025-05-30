import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Calendar, Tag, Palette } from 'lucide-react';

const CategoryDetails = ({
    isOpen,
    closeDialog,
    selectedCategory,
    formatDate,
    openEditModal,
    onDelete
}) => {
    if (!selectedCategory) return null;

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeDialog}>
                <div className="flex items-center justify-center min-h-screen px-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-30" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-50 relative">
                            <Dialog.Title className="text-xl font-bold text-amber-700 mb-4">
                                Category Details
                            </Dialog.Title>

                            <div className="flex flex-col items-center">
                                <div 
                                    className="w-24 h-24 rounded-lg flex items-center justify-center text-white text-2xl font-bold border"
                                    style={{ backgroundColor: selectedCategory.color || '#3B82F6' }}
                                >
                                    {selectedCategory.icon || '📂'}
                                </div>

                                <h2 className="text-2xl font-semibold text-center mt-3">{selectedCategory.name}</h2>

                                <div className="w-full mt-4 space-y-3">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="font-medium flex items-center gap-2">
                                            <Tag size={16} />
                                            Status:
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            selectedCategory.active !== false
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {selectedCategory.active !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="font-medium flex items-center gap-2">
                                            <Palette size={16} />
                                            Color:
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div 
                                                className="w-4 h-4 rounded border"
                                                style={{ backgroundColor: selectedCategory.color || '#3B82F6' }}
                                            ></div>
                                            <span className="text-sm">{selectedCategory.color || '#3B82F6'}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium">Movies Count:</span>
                                        <span>{selectedCategory.movieCount || 0}</span>
                                    </div>

                                    {selectedCategory.createdAt && (
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="font-medium flex items-center gap-2">
                                                <Calendar size={16} />
                                                Created:
                                            </span>
                                            <span>{formatDate(selectedCategory.createdAt)}</span>
                                        </div>
                                    )}

                                    {selectedCategory.description && (
                                        <div className="pt-2">
                                            <span className="font-medium block mb-1">Description:</span>
                                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                {selectedCategory.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-2">
                                <button
                                    onClick={closeDialog}
                                    className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        closeDialog();
                                        openEditModal(selectedCategory);
                                    }}
                                    className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                                >
                                    Edit
                                </button>
                                {onDelete && (
                                    <button
                                        onClick={() => {
                                            closeDialog();
                                            onDelete(selectedCategory);
                                        }}
                                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default CategoryDetails; 