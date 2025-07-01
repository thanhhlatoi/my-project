// Import các component
import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';
import DataTable from '../components/DataTable.jsx';
import Pagination from '../components/Pagination.jsx';
import userService from '../api/UserService.js';
import CreateUser from '../components/Create/CreateUser.jsx';
import UserDetails from '../components/Update/UserDetails.jsx';
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
            console.log('User API response:', response);
            
            // Try different response structures
            if (response && response.data) {
                if (response.data.data && response.data.data.content) {
                    // New API structure: response.data.data.content
                    setUsers(response.data.data.content || []);
                    setFilteredUsers(response.data.data.content || []);
                    setTotalPages(response.data.data.totalPages || 1);
                    console.log('Using new API structure - data.data.content');
                } else if (response.data.content) {
                    // Alternative structure: response.data.content
                    setUsers(response.data.content || []);
                    setFilteredUsers(response.data.content || []);
                    setTotalPages(response.data.totalPages || 1);
                    console.log('Using alternative API structure - data.content');
                } else if (Array.isArray(response.data)) {
                    // Direct array: response.data
                    setUsers(response.data);
                    setFilteredUsers(response.data);
                    setTotalPages(1);
                    console.log('Using direct array API structure - data');
                } else {
                    console.log('Unknown API structure:', response.data);
                    setUsers([]);
                    setFilteredUsers([]);
                    setTotalPages(1);
                }
            } else {
                setUsers([]);
                setFilteredUsers([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
            setUsers([]);
            setFilteredUsers([]);
            setTotalPages(1);
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

    // Cấu hình columns cho DataTable
    const columns = [
        {
            header: 'Avatar',
            key: 'avatar',
            render: (user) => (
                <div className="flex items-center">
                    <img
                        src={user.profilePictureUrl 
                            ? `${BASE_URL}/api/images/${user.profilePictureUrl}` 
                            : 'https://via.placeholder.com/40'
                        }
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                </div>
            )
        },
        {
            header: 'Full Name',
            key: 'fullName',
            render: (user) => (
                <div>
                    <div className="font-medium text-gray-900">{user.fullName || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                </div>
            )
        },
        {
            header: 'Phone',
            key: 'phoneNumber',
            render: (user) => user.phoneNumber || 'Not provided'
        },
        {
            header: 'Date of Birth',
            key: 'dateOfBirth',
            render: (user) => formatDate(user.dateOfBirth)
        },
        {
            header: 'Gender',
            key: 'gender',
            render: (user) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.gender 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-pink-100 text-pink-800'
                }`}>
                    {user.gender ? 'Male' : 'Female'}
                </span>
            )
        },
        {
            header: 'Roles',
            key: 'roles',
            render: (user) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.roles)}`}>
                    {displayRoles(user.roles)}
                </span>
            )
        }
    ];

    return (
        <Layout>
            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="👥 User Management"
                    description="Manage your user accounts"
                    showAddButton={true}
                    addButtonText="Add New User"
                    onAddClick={openAddModal}
                    gradient="from-green-600 to-green-700"
                />

                {/* Search Bar */}
                <SearchBar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users by name, email, or role..."
                    showFilters={true}
                    showExport={true}
                    onFilterClick={() => console.log('Filter clicked')}
                    onExportClick={() => console.log('Export clicked')}
                />

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    loading={loading}
                    onView={openDialog}
                    onEdit={openEditModal}
                    onDelete={confirmDelete}
                    emptyMessage="No users found"
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        className="mt-6"
                    />
                )}

                {/* Modals */}
                {isAddModalOpen && (
                    <CreateUser
                        isOpen={isAddModalOpen}
                        onClose={closeAddModal}
                        user={newUser}
                        setUser={setNewUser}
                        onSubmit={handleSubmit}
                        isEditing={isEditing}
                    />
                )}

                {isOpen && selectedUser && (
                    <UserDetails
                        isOpen={isOpen}
                        onClose={closeDialog}
                        user={selectedUser}
                        onEdit={() => {
                            closeDialog();
                            openEditModal(selectedUser);
                        }}
                        onDelete={() => {
                            closeDialog();
                            confirmDelete(selectedUser);
                        }}
                    />
                )}

                {/* Delete Confirmation */}
                {deleteConfirmOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete {userToDelete?.fullName}? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirmOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
