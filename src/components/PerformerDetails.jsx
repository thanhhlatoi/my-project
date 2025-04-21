import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BASE_URL } from "../api/config.js";

const PerformerDetails = ({
                           isOpen,
                           closeDialog,
                           selectedAuthor,
                           formatDate,
                           openEditModal,
                           onDelete
                       }) => {
    if (!selectedAuthor) return null;

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
                            <Dialog.Title className="text-xl font-bold text-blue-700 mb-4">
                                Author Details
                            </Dialog.Title>

                            <div className="flex flex-col items-center">
                                <img
                                    src={selectedAuthor.avatar ? `${BASE_URL}/api/videos/view?bucketName=thanh&path=${selectedAuthor.avatar}` : '/api/placeholder/120/120'}
                                    alt={selectedAuthor.fullName}
                                    className="w-24 h-24 rounded-full border object-cover"
                                    onError={(e) => e.target.src = '/api/placeholder/120/120'}
                                />

                                <h2 className="text-2xl font-semibold text-center mt-3">{selectedAuthor.fullName}</h2>

                                <div className="w-full mt-4 space-y-2">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium">Country:</span>
                                        <span>{selectedAuthor.country || 'N/A'}</span>
                                    </div>

                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium">Birthday:</span>
                                        <span>{formatDate(selectedAuthor.birthday)}</span>
                                    </div>

                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium">Gender:</span>
                                        <span>{selectedAuthor.gender ? 'Male' : 'Female'}</span>
                                    </div>

                                    {selectedAuthor.describe && (
                                        <div className="pt-2">
                                            <span className="font-medium block mb-1">Description:</span>
                                            <p className="text-gray-700">{selectedAuthor.describe}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-2">
                                <button
                                    onClick={closeDialog}
                                    className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        closeDialog();
                                        openEditModal(selectedAuthor);
                                    }}
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                                {onDelete && (
                                    <button
                                        onClick={() => {
                                            closeDialog();
                                            onDelete(selectedAuthor);
                                        }}
                                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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

export default PerformerDetails;
