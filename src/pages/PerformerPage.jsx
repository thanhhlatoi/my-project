import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import CreatePerformer from '../components/Create/CreatePerformer.jsx';
import PerformerDetails from '../components/Update/PerformerDetails.jsx';
import PerformerService from '../api/PerformerService.js';
import { BASE_URL } from "../api/config.js";
import Pagination from '../components/Pagination';

const PerformerPage = () => {
    // States
    const [performer, setPerformer] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('id');
    const [order, setOrder] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterGender, setFilterGender] = useState('all');

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
            const response = await PerformerService.getAll(page, 10, sortBy, order, searchQuery);
            setPerformer(response?.data?.data?.content || []);
            setTotalPages(response?.data?.totalPages || 1);
        } catch (error) {
            console.error("Error fetching performers:", error);
        } finally {
            setLoading(false);
        }
    };

    // API call when parameters change
    useEffect(() => {
        fetchData();
    }, [page, sortBy, order, searchQuery]);

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
    };

    // Form submission handler
    const handleSubmit = async () => {
        try {
            const formattedAuthor = {
                ...newPerformer,
                birthday: newPerformer.birthday ? new Date(newPerformer.birthday).toISOString() : null
            };

            if (isEditing) {
                await PerformerService.update(formattedAuthor);
            } else {
                await PerformerService.add(formattedAuthor);
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
            await PerformerService.delete(authorToDelete.id);
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
        return date.toLocaleDateString();
    };

    // Filter performers by gender
    const filteredPerformers = filterGender === 'all'
        ? performer
        : performer.filter(p =>
            filterGender === 'male' ? p.gender : !p.gender
        );

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-10 px-4">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-blue-700 mb-4 md:mb-0">
                        Performer Management
                    </h1>
                    <button
                        onClick={openAddModal}
                        className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition duration-300 shadow-md flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Add New Performer
                    </button>
                </div>

                {/* Search and filter section */}
                <div className="bg-white p-5 rounded-xl shadow-md mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search box */}
                        <div className="col-span-1 md:col-span-2">
                            <label className="text-sm text-gray-600 mb-1 block">Search Performers:</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by name, country..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Gender filter */}
                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">Filter by Gender:</label>
                            <select
                                value={filterGender}
                                onChange={(e) => setFilterGender(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        {/* Sort controls */}
                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">Sort by:</label>
                            <div className="flex space-x-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="id">ID</option>
                                    <option value="fullName">Name</option>
                                    <option value="birthday">Birthday</option>
                                    <option value="country">Country</option>
                                </select>
                                <button
                                    onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                                >
                                    {order === 'asc' ?
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                                        </svg> :
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                                        </svg>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading indicator */}
                {loading ? (
                    <div className="flex justify-center my-12">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-700"></div>
                    </div>
                ) : (
                    <>
                        {/* Performers grid */}
                        {filteredPerformers.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredPerformers.map((author) => (
                                    <div
                                        key={author.id || author.fullName}
                                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden transform hover:-translate-y-1"
                                    >
                                        <div
                                            className="cursor-pointer w-full flex flex-col items-center p-4"
                                            onClick={() => openDialog(author)}
                                        >
                                            <div className="w-28 h-28 mb-4 overflow-hidden rounded-full border-4 border-blue-100 shadow-md">
                                                <img
                                                    src={author.avatar ? `${BASE_URL}/api/videos/view?bucketName=thanh&path=${author.avatar}` : '/api/placeholder/120/120'}
                                                    alt={author.fullName}
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                />
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-800 text-center">{author.fullName}</h2>
                                            <div className="flex items-center mt-1">
                                                <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <p className="text-sm text-gray-600">{author.country || 'Unknown'}</p>
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                <p className="text-sm text-gray-600">Born: {formatDate(author.birthday)}</p>
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                                <p className="text-sm text-gray-600">
                                                    {author.gender ? 'Male' : 'Female'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex border-t">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditModal(author);
                                                }}
                                                className="flex-1 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center justify-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    confirmDelete(author);
                                                }}
                                                className="flex-1 py-3 bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-gray-50 rounded-xl shadow">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <p className="text-gray-500 text-xl font-medium mb-2">No performers found</p>
                                <p className="text-gray-400 mb-6">Try changing your search or filter criteria</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setFilterGender('all');
                                        setSortBy('id');
                                        setOrder('asc');
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Pagination */}
                {filteredPerformers.length > 0 && !loading && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    </div>
                )}

                {/* CreatePerformer component */}
                <CreatePerformer
                    isOpen={isAddModalOpen}
                    closeModal={closeAddModal}
                    newAuthor={newPerformer}
                    setNewAuthor={setNewPerformer}
                    handleSubmit={handleSubmit}
                    isEditing={isEditing}
                />

                {/* PerformerDetails component */}
                <PerformerDetails
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
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-fadeIn">
                            <div className="bg-gray-50 px-6 py-4 border-b">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                    </svg>
                                    Confirm Delete
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600">
                                    Are you sure you want to delete <span className="font-semibold text-gray-800">{authorToDelete?.fullName}</span>? This action cannot be undone.
                                </p>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
                                <button
                                    onClick={() => setDeleteConfirmOpen(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none transition duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none transition duration-300"
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
