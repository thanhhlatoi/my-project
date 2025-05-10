// Import các component
import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import userService from '../api/UserService.js';
import CreateUser from '../components/Create/CreateUser.jsx';
import UserDetails from '../components/Update/UserDetails.jsx';
import Pagination from '../components/Pagination';
import { BASE_URL } from "../api/config.js";

const UserPage = () => {
    // States
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    // Modal states
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        fullName: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
        address: '',
        gender: false,
        profilePictureUrl: ''
    });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Hàm fetch dữ liệu
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await userService.getAll(page, 10, 'id', 'asc');
            if (response && response.data ) {
                setUsers(response.data);
                setFilteredUsers(response.data);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi các tham số thay đổi
    useEffect(() => {
        fetchData();
    }, [page]);

    // Lọc người dùng khi searchTerm thay đổi
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredUsers(users);
            return;
        }

        const lowercasedSearch = searchTerm.toLowerCase();
        const filtered = users.filter(user =>
            user.fullName?.toLowerCase().includes(lowercasedSearch) ||
            user.email?.toLowerCase().includes(lowercasedSearch) ||
            (user.roles && user.roles.some(role =>
                role.name.toLowerCase().includes(lowercasedSearch)
            ))
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Not provided';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB');
    };

    // Dialog handlers
    const openDialog = (user) => {
        setSelectedUser(user);
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        setSelectedUser(null);
    };

    // Modal handlers
    const openAddModal = () => {
        setIsEditing(false);
        setNewUser({
            email: '',
            fullName: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dateOfBirth: '',
            address: '',
            gender: false,
            profilePictureUrl: ''
        });
        setIsAddModalOpen(true);
    };

    const openEditModal = (user) => {
        const editableUser = { ...user };
        if (editableUser.dateOfBirth) {
            const date = new Date(editableUser.dateOfBirth);
            editableUser.dateOfBirth = date.toISOString().split('T')[0];
        }
        setNewUser(editableUser);
        setIsEditing(true);
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    // Handle form submission for adding or updating user
    const handleSubmit = async () => {
        try {
            const formattedUser = {
                ...newUser,
                dateOfBirth: newUser.dateOfBirth ? new Date(newUser.dateOfBirth).toISOString() : null
            };

            if (isEditing) {
                await userService.update(formattedUser);
            } else {
                await userService.add(formattedUser);
            }

            closeAddModal();
            fetchData();
        } catch (err) {
            console.error("Error saving user:", err);
            alert("Failed to save user. Please try again.");
        }
    };

    // Confirmation dialog for delete
    const confirmDelete = (user) => {
        setUserToDelete(user);
        setDeleteConfirmOpen(true);
    };

    // Handle user deletion
    const handleDelete = async () => {
        if (!userToDelete) return;

        try {
            await userService.delete(userToDelete.id);
            setDeleteConfirmOpen(false);
            if (isOpen && selectedUser && selectedUser.id === userToDelete.id) {
                closeDialog();
            }
            fetchData();
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user. Please try again.");
        }
    };

    // Hiển thị vai trò người dùng
    const displayRoles = (roles) => {
        if (!roles || roles.length === 0) return 'No roles';
        return roles.map(role => role.name).join(', ');
    };

    // Hiển thị badge dựa trên vai trò
    const getRoleBadgeClass = (roles) => {
        if (!roles || roles.length === 0) return "bg-gray-100 text-gray-800";

        const roleNames = roles.map(role => role.name.toUpperCase());

        if (roleNames.includes("ADMIN")) {
            return "bg-red-100 text-red-800";
        } else if (roleNames.includes("USERS")) {
            return "bg-blue-100 text-blue-800";
        } else {
            return "bg-green-100 text-green-800";
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-8 px-4">
                {/* Header và Search */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">User Management</h1>
                        <p className="text-gray-500 text-sm md:text-base mt-1">Manage users and their access</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                        </div>

                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm w-full sm:w-auto"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Add User
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Users</p>
                                <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Admin Users</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {users.filter(user => user.roles && user.roles.some(role => role.name.toUpperCase() === "ADMIN")).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Standard Users</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {users.filter(user => user.roles && user.roles.some(role => role.name.toUpperCase() === "USERS")).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading indicator */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {filteredUsers.length > 0 ? (
                            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                                {/* Table Header */}
                                <div className="hidden md:grid md:grid-cols-5 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                                    <div className="px-6 py-3 col-span-2">User</div>
                                    <div className="px-6 py-3">Role</div>
                                    <div className="px-6 py-3">Gender</div>
                                    <div className="px-6 py-3 text-right">Actions</div>
                                </div>

                                {/* Mobile Cards / Desktop Table Rows */}
                                <div className="divide-y divide-gray-200">
                                    {filteredUsers.map(user => (
                                        <div key={user.id} className="block md:grid md:grid-cols-5 md:items-center hover:bg-gray-50 transition-colors">
                                            {/* User info - Mobile and Desktop */}
                                            <div className="px-6 py-4 col-span-2 flex items-center" onClick={() => openDialog(user)} role="button" tabIndex="0">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={user.profilePictureUrl ? `${BASE_URL}/api/videos/view?bucketName=thanh&path=${user.profilePictureUrl}` : '/api/placeholder/40/40'}
                                                        alt={user.fullName}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>

                                            {/* Role - Mobile and Desktop */}
                                            <div className="px-6 py-4 md:py-0">
                                                <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getRoleBadgeClass(user.roles)}`}>
                                                    {displayRoles(user.roles)}
                                                </span>
                                            </div>

                                            {/* Gender - Mobile and Desktop */}
                                            <div className="px-6 py-4 md:py-0 text-sm text-gray-500">
                                                {user.gender ? 'Male' : 'Female'}
                                            </div>

                                            {/* Actions - Mobile and Desktop */}
                                            <div className="px-6 py-4 md:py-0 text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(user)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm ? `No results match "${searchTerm}"` : 'Get started by adding a new user'}
                                </p>
                                {searchTerm && (
                                    <div className="mt-3">
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Pagination */}
                <div className="mt-6">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>

                {/* Modals */}
                <CreateUser
                    isOpen={isAddModalOpen}
                    closeModal={closeAddModal}
                    newUser={newUser}
                    setNewUser={setNewUser}
                    handleSubmit={handleSubmit}
                    isEditing={isEditing}
                />

                <UserDetails
                    isOpen={isOpen}
                    closeDialog={closeDialog}
                    selectedUser={selectedUser}
                    formatDate={formatDate}
                    openEditModal={openEditModal}
                    onDelete={confirmDelete}
                />

                {/* Confirm delete modal */}
                {deleteConfirmOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Confirm Delete
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Delete user</h3>
                                        <p className="text-gray-500 mt-1">
                                            Are you sure you want to delete {userToDelete?.fullName}? This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
                                <button
                                    onClick={() => setDeleteConfirmOpen(false)}
                                    className="px-4 py-2 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default UserPage;
