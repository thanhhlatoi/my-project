import React from 'react';
import { BASE_URL } from "../../api/config.js";

const UserDetails = ({ isOpen, closeDialog, selectedUser, formatDate, openEditModal, onDelete }) => {
    if (!isOpen || !selectedUser) return null;

    // Hiển thị vai trò người dùng
    const displayRoles = (roles) => {
        if (!roles || roles.length === 0) return 'No roles';
        return roles.map(role => role.name).join(', ');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
                <div className="bg-gray-50 px-6 py-4 border-b sticky top-0 z-10 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        User Details
                    </h2>
                    <button
                        onClick={closeDialog}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar section */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-40 h-40 border rounded-full overflow-hidden">
                                <img
                                    src={selectedUser.profilePictureUrl ? `${BASE_URL}/api/videos/view?bucketName=thanh&path=${selectedUser.profilePictureUrl}` : '/api/placeholder/160/160'}
                                    alt={selectedUser.fullName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-center">
                                <div className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                                    {displayRoles(selectedUser.roles)}
                                </div>
                            </div>
                        </div>

                        {/* Details section */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">{selectedUser.fullName}</h3>
                                <p className="text-gray-600">{selectedUser.email}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                                    <p className="text-gray-800">{selectedUser.phoneNumber || 'Not provided'}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Date of Birth</h4>
                                    <p className="text-gray-800">{formatDate(selectedUser.dateOfBirth)}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Gender</h4>
                                    <p className="text-gray-800">{selectedUser.gender ? 'Male' : 'Female'}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Address</h4>
                                    <p className="text-gray-800">{selectedUser.address || 'Not provided'}</p>
                                </div>
                            </div>

                            {selectedUser.firstName && selectedUser.lastName && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">First Name</h4>
                                        <p className="text-gray-800">{selectedUser.firstName}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Last Name</h4>
                                        <p className="text-gray-800">{selectedUser.lastName}</p>
                                    </div>
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex space-x-3 pt-6">
                                <button
                                    onClick={() => openEditModal(selectedUser)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(selectedUser)}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
