import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import authorService from '../api/AuthorService.js';
import CreateAuthor from '../components/Create/CreateAuthor.jsx';
import AuthorDetails from '../components/Update/AuthorDetails.jsx';
import Pagination from '../components/Pagination';
import { BASE_URL } from "../api/config.js";

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
            setAuthors(response?.data?.content || []);
            setTotalPages(response?.data?.totalPages || 1);
        } catch (error) {
            console.error("Error fetching authors:", error);
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

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-6 px-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">Author Management</h1>
                                <p className="text-blue-100 mt-1">Manage your list of authors and directors</p>
                            </div>
                            <button
                                onClick={openAddModal}
                                className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition shadow-md flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                <span className="font-medium">Add New Author</span>
                            </button>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="bg-gray-50 border-b px-6 py-4">
                        <div className="relative max-w-md mx-auto md:mx-0">
                            <input
                                type="text"
                                placeholder="Search by name or country..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            {searchTerm && (
                                <button
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                        {/* Loading indicator */}
                        {loading ? (
                            <div className="flex justify-center my-12">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin"></div>
                                    <p className="mt-4 text-gray-600 font-medium">Loading authors...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Authors grid */}
                                {filteredAuthors.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {filteredAuthors.map((author) => (
                                            <div
                                                key={author.id || author.fullName}
                                                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                                            >
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => openDialog(author)}
                                                >
                                                    <div className="relative h-40 bg-gradient-to-b from-blue-50 to-gray-50 flex items-center justify-center p-4">
                                                        <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                                                            <img
                                                                loading="lazy"
                                                                src={author.avatar ? `${BASE_URL}/api/videos/view?bucketName=thanh&path=${author.avatar}` : '/api/placeholder/120/120'}
                                                                alt={author.fullName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="p-4 text-center">
                                                        <h2 className="text-lg font-bold text-gray-800 mb-1">{author.fullName}</h2>
                                                        <div className="flex items-center justify-center gap-2 mb-2">
                                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                            <span className="text-sm text-gray-600">{author.country || 'Unknown'}</span>
                                                        </div>
                                                        <div className="flex items-center justify-center gap-2 mb-1">
                                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                            </svg>
                                                            <span className="text-sm text-gray-600">Born: {formatDate(author.birthday)}</span>
                                                        </div>
                                                        <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                                                            {author.gender ? 'Male' : 'Female'}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="border-t border-gray-200 flex divide-x">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEditModal(author);
                                                        }}
                                                        className="flex-1 py-3 flex items-center justify-center gap-1 text-blue-600 hover:bg-blue-50 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                        </svg>
                                                        <span>Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            confirmDelete(author);
                                                        }}
                                                        className="flex-1 py-3 flex items-center justify-center gap-1 text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                        <span>Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-gray-50 rounded-xl">
                                        <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No authors found</h3>
                                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                                            {searchTerm
                                                ? `No authors match your search for "${searchTerm}"`
                                                : "You haven't added any authors yet. Click the 'Add New Author' button to get started."}
                                        </p>
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                            >
                                                Clear search
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Pagination */}
                        {filteredAuthors.length > 0 && (
                            <div className="mt-8">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={(newPage) => setPage(newPage)}
                                />
                            </div>
                        )}
                    </div>
                </div>

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
