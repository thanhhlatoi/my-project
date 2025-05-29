import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';
import DataTable from '../components/DataTable.jsx';
import authorService from '../api/AuthorService.js';
import CreateAuthor from '../components/Create/CreateAuthor.jsx';
import AuthorDetails from '../components/Update/AuthorDetails.jsx';
import { BASE_URL } from "../api/config.js";
import { Calendar, Globe, User } from 'lucide-react';

const AuthorsPage = () => {
    // States
    const [authors, setAuthors] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newAuthor, setNewAuthor] = useState({
        fullName: '',
        avatar: '',
        birthday: '',
        country: '',
        gender: '',
        description: ''
    });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState(null);

    // Fetch data function
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await authorService.getAll(page, 10, 'id', 'asc');
            console.log('🔍 Full Author API response:', response);
            console.log('🔍 Response data:', response?.data);
            
            let authors = [];
            let pages = 1;
            
            if (response?.data) {
                // Try different structures
                if (response.data.data?.content) {
                    authors = response.data.data.content;
                    pages = response.data.data.totalPages || 1;
                    console.log('✅ Using structure: response.data.data.content');
                } else if (response.data.content) {
                    authors = response.data.content;
                    pages = response.data.totalPages || 1;
                    console.log('✅ Using structure: response.data.content');
                } else if (Array.isArray(response.data)) {
                    authors = response.data;
                    pages = 1;
                    console.log('✅ Using structure: response.data (array)');
                } else {
                    console.log('❌ Unknown API structure, setting empty array');
                    console.log('Available keys:', Object.keys(response.data));
                }
            }
            
            console.log('📋 Final authors array:', authors);
            setAuthors(authors || []);
            setTotalPages(pages);
            
        } catch (error) {
            console.error("❌ Error fetching authors:", error);
            setAuthors([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // Call API when parameters change
    useEffect(() => {
        fetchData();
    }, [page]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Unknown';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB');
    };

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
        setNewAuthor({
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
        setNewAuthor(editableAuthor);
        setIsEditing(true);
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        fetchData();
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const formattedAuthor = {
                ...newAuthor,
                birthday: newAuthor.birthday ? new Date(newAuthor.birthday).toISOString() : null
            };

            if (isEditing) {
                await authorService.update(formattedAuthor);
            } else {
                await authorService.add(formattedAuthor);
            }

            closeAddModal();
            fetchData();
        } catch (err) {
            console.error("Error saving author:", err);
            alert("Failed to save author. Please try again.");
        }
    };

    // Delete confirmation
    const confirmDelete = (author) => {
        setAuthorToDelete(author);
        setDeleteConfirmOpen(true);
    };

    // Handle author deletion
    const handleDelete = async () => {
        if (!authorToDelete) return;

        try {
            await authorService.delete(authorToDelete.id);
            setDeleteConfirmOpen(false);
            if (isOpen && selectedAuthor && selectedAuthor.id === authorToDelete.id) {
                closeDialog();
            }
            fetchData();
        } catch (err) {
            console.error("Error deleting author:", err);
            alert("Failed to delete author. Please try again.");
        }
    };

    // Filter authors based on search term
    const filteredAuthors = searchTerm.trim()
        ? authors.filter(author =>
            author.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (author.country && author.country.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : authors;

    // DataTable columns configuration
    const columns = [
        {
            header: 'Avatar',
            key: 'avatar',
            render: (author) => (
                <div className="flex items-center">
                    <img
                        src={author.avatar 
                            ? `${BASE_URL}/api/videos/view?bucketName=thanh&path=${author.avatar}` 
                            : 'https://via.placeholder.com/40'
                        }
                        alt={author.fullName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                </div>
            )
        },
        {
            header: 'Full Name',
            key: 'fullName',
            render: (author) => (
                <div>
                    <div className="font-medium text-gray-900">{author.fullName}</div>
                    {author.description && (
                        <div className="text-sm text-gray-500 line-clamp-1">{author.description}</div>
                    )}
                </div>
            )
        },
        {
            header: 'Country',
            key: 'country',
            render: (author) => (
                <div className="flex items-center gap-2">
                    <Globe size={14} className="text-gray-500" />
                    <span>{author.country || 'Unknown'}</span>
                </div>
            )
        },
        {
            header: 'Birthday',
            key: 'birthday',
            render: (author) => (
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-500" />
                    <span>{formatDate(author.birthday)}</span>
                </div>
            )
        },
        {
            header: 'Gender',
            key: 'gender',
            render: (author) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    author.gender 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-pink-100 text-pink-800'
                }`}>
                    {author.gender ? 'Male' : 'Female'}
                </span>
            )
        }
    ];

    return (
        <Layout>
            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="👨‍🎬 Author Management"
                    description="Manage your list of authors and directors"
                    showAddButton={true}
                    addButtonText="Add New Author"
                    onAddClick={openAddModal}
                    gradient="from-teal-600 to-teal-700"
                    showPagination={totalPages > 1}
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />

                {/* Search Bar */}
                <SearchBar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or country..."
                    showFilters={true}
                    showExport={true}
                    onFilterClick={() => console.log('Filter clicked')}
                    onExportClick={() => console.log('Export clicked')}
                />

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={filteredAuthors}
                    loading={loading}
                    onView={openDialog}
                    onEdit={openEditModal}
                    onDelete={confirmDelete}
                    emptyMessage="No authors found"
                />

                {/* Sử dụng component CreateAuthor */}
                <CreateAuthor
                    isOpen={isAddModalOpen}
                    closeModal={closeAddModal}
                    newAuthor={newAuthor}
                    setNewAuthor={setNewAuthor}
                    handleSubmit={handleSubmit}
                    isEditing={isEditing}
                />

                {/* Sử dụng component AuthorDetails */}
                <AuthorDetails
                    isOpen={isOpen}
                    closeDialog={closeDialog}
                    selectedAuthor={selectedAuthor}
                    formatDate={formatDate}
                    openEditModal={openEditModal}
                    onDelete={confirmDelete}
                />

                {/* Confirm delete modal */}
                {deleteConfirmOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-fadeIn">
                            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 mr-4">
                                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">Confirm Delete</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-2">
                                    Are you sure you want to delete <span className="font-semibold">{authorToDelete?.fullName}</span>?
                                </p>
                                <p className="text-gray-500 text-sm">
                                    This action cannot be undone and will remove all data associated with this author.
                                </p>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
                                <button
                                    onClick={() => setDeleteConfirmOpen(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none transition-colors"
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

export default AuthorsPage;
