import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';
import DataTable from '../components/DataTable.jsx';
import Pagination from '../components/Pagination.jsx';
import performerService from '../api/PerformerService.js';
import CreatePerformer from '../components/Create/CreatePerformer.jsx';
import PerformerDetails from '../components/Update/PerformerDetails.jsx';
import { BASE_URL } from "../api/config.js";
import { Calendar, Globe } from 'lucide-react';

const PerformerPage = () => {
    // States
    const [performer, setPerformer] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newPerformer, setNewPerformer] = useState({
        fullName: '',
        avatar: '',
        birthday: '',
        country: '',
        gender: '',
        description: ''
    });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState(null);

    // Data fetching function
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await performerService.getAll(page, 10, 'id', 'asc', searchQuery);
            console.log('🔍 Full Performer API response:', response);
            console.log('🔍 Response data:', response?.data);
            
            let performers = [];
            let pages = 1;
            
            if (response?.data) {
                // Try different structures
                if (response.data.data?.content) {
                    performers = response.data.data.content;
                    pages = response.data.data.totalPages || 1;
                    console.log('✅ Using structure: response.data.data.content');
                } else if (response.data.content) {
                    performers = response.data.content;
                    pages = response.data.totalPages || 1;
                    console.log('✅ Using structure: response.data.content');
                } else if (Array.isArray(response.data)) {
                    performers = response.data;
                    pages = 1;
                    console.log('✅ Using structure: response.data (array)');
                } else {
                    console.log('❌ Unknown API structure, setting empty array');
                    console.log('Available keys:', Object.keys(response.data));
                }
            }
            
            console.log('📋 Final performers array:', performers);
            setPerformer(performers || []);
            setTotalPages(pages);
            
        } catch (error) {
            console.error("❌ Error fetching performers:", error);
            setPerformer([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // API call when parameters change
    useEffect(() => {
        fetchData();
    }, [page]);

    // Search handler with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (page !== 0) {
                setPage(0);
            } else {
                fetchData();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Dialog handlers
    const openDialog = (author) => {
        setSelectedAuthor(author);
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        setSelectedAuthor(null);
    };

    // Modal handlers
    const openAddModal = () => {
        setIsEditing(false);
        setNewPerformer({
            fullName: '',
            avatar: '',
            birthday: '',
            country: '',
            gender: true,
            description: ''
        });
        setIsAddModalOpen(true);
    };

    const openEditModal = (author) => {
        const editableAuthor = { ...author };
        if (editableAuthor.birthday) {
            const date = new Date(editableAuthor.birthday);
            editableAuthor.birthday = date.toISOString().split('T')[0];
        }
        setNewPerformer(editableAuthor);
        setIsEditing(true);
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        fetchData();
    };

    // Form submission handler
    const handleSubmit = async () => {
        try {
            const formattedAuthor = {
                ...newPerformer,
                birthday: newPerformer.birthday ? new Date(newPerformer.birthday).toISOString() : null
            };

            if (isEditing) {
                await performerService.update(formattedAuthor);
            } else {
                await performerService.add(formattedAuthor);
            }

            closeAddModal();
            fetchData();
        } catch (err) {
            console.error("Error saving performer:", err);
            alert("Failed to save performer. Please try again.");
        }
    };

    // Confirmation dialog for delete
    const confirmDelete = (author) => {
        setAuthorToDelete(author);
        setDeleteConfirmOpen(true);
    };

    // Handle author deletion
    const handleDelete = async () => {
        if (!authorToDelete) return;
        try {
            await performerService.delete(authorToDelete.id);
            setDeleteConfirmOpen(false);
            if (isOpen && selectedAuthor && selectedAuthor.id === authorToDelete.id) {
                closeDialog();
            }
            fetchData();
        } catch (err) {
            console.error("Error deleting performer:", err);
            alert("Failed to delete performer. Please try again.");
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Filter performers by search
    const filteredPerformers = searchQuery.trim()
        ? performer.filter(p =>
            p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.country && p.country.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : performer;

    // DataTable columns configuration
    const columns = [
        {
            header: 'Avatar',
            key: 'avatar',
            render: (performer) => (
                <div className="flex items-center">
                    <img
                        src={performer.avatar 
                            ? `${BASE_URL}/api/videos/view?bucketName=thanh&path=${performer.avatar}` 
                            : 'https://via.placeholder.com/40'
                        }
                        alt={performer.fullName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                </div>
            )
        },
        {
            header: 'Full Name',
            key: 'fullName',
            render: (performer) => (
                <div>
                    <div className="font-medium text-gray-900">{performer.fullName}</div>
                    {performer.description && (
                        <div className="text-sm text-gray-500 line-clamp-1">{performer.description}</div>
                    )}
                </div>
            )
        },
        {
            header: 'Country',
            key: 'country',
            render: (performer) => (
                <div className="flex items-center gap-2">
                    <Globe size={14} className="text-gray-500" />
                    <span>{performer.country || 'Unknown'}</span>
                </div>
            )
        },
        {
            header: 'Birthday',
            key: 'birthday',
            render: (performer) => (
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-500" />
                    <span>{formatDate(performer.birthday)}</span>
                </div>
            )
        },
        {
            header: 'Gender',
            key: 'gender',
            render: (performer) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    performer.gender 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-pink-100 text-pink-800'
                }`}>
                    {performer.gender ? 'Male' : 'Female'}
                </span>
            )
        }
    ];

    return (
        <Layout>
            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="🎭 Performer Management"
                    description="Manage your talented performers"
                    showAddButton={true}
                    addButtonText="Add New Performer"
                    onAddClick={openAddModal}
                    gradient="from-purple-600 to-pink-600"
                />
                
                {/* Search Bar */}
                <SearchBar
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or country..."
                    showFilters={true}
                    showExport={true}
                    onFilterClick={() => console.log('Filter clicked')}
                    onExportClick={() => console.log('Export clicked')}
                />
                
                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={filteredPerformers}
                    loading={loading}
                    onView={openDialog}
                    onEdit={openEditModal}
                    onDelete={confirmDelete}
                    emptyMessage="No performers found"
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
                
                {/* Add Performer Modal */}
                {isAddModalOpen && (
                    <CreatePerformer
                        isOpen={isAddModalOpen}
                        closeModal={closeAddModal}
                        newPerformer={newPerformer}
                        setNewPerformer={setNewPerformer}
                        handleSubmit={handleSubmit}
                        isEditing={isEditing}
                    />
                )}

                {/* Performer Details Modal */}
                {isOpen && selectedAuthor && (
                    <PerformerDetails
                        isOpen={isOpen}
                        closeDialog={closeDialog}
                        selectedPerformer={selectedAuthor}
                        formatDate={formatDate}
                        openEditModal={openEditModal}
                        onDelete={confirmDelete}
                    />
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirmOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                                <h2 className="text-xl font-bold text-gray-800">Confirm Delete</h2>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-2">
                                    Are you sure you want to delete <span className="font-semibold">{authorToDelete?.fullName}</span>?
                                </p>
                                <p className="text-gray-500 text-sm">
                                    This action cannot be undone.
                                </p>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
                                <button
                                    onClick={() => setDeleteConfirmOpen(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
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

export default PerformerPage;
