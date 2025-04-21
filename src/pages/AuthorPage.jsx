// Import các component
import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import authorService from '../api/AuthorService.js';
import CreateAuthor from '../components/CreateAuthor.jsx';
import AuthorDetails from '../components/AuthorDetails.jsx';
import Pagination from '../components/Pagination';
import { BASE_URL } from "../api/config.js";

const AuthorsPage = () => {
    // States
    const [authors, setAuthors] = useState([]);
    //phan trang
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [ loading,setLoading] = useState(false);

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
        gender: true,
        describe: ''
    });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState(null);

    // Hàm fetch dữ liệu - đơn giản hóa giống FlimPage
    const fetchData = async () => {
        setLoading(true);
        try {
            // Nếu có từ khóa tìm kiếm, truyền vào API
            const response = await authorService.getAll(page, 10, 'id', 'asc');
            setAuthors(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phim:", error);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi các tham số thay đổi
    useEffect(() => {
        fetchData();
    }, [page]);
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Unknown';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB'); // hoặc 'vi-VN' nếu bạn muốn định dạng tiếng Việt
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
            describe: ''
        });
        setIsAddModalOpen(true);
    };

    const openEditModal = (author) => {
        // Clone và format author object for editing
        const editableAuthor = { ...author };

        // Format the birthday if it exists
        if (editableAuthor.birthday) {
            const date = new Date(editableAuthor.birthday);
            editableAuthor.birthday = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }

        setNewAuthor(editableAuthor);
        setIsEditing(true);
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    // Handle form submission for adding or updating author
    const handleSubmit = async () => {
        try {
            // Format the birthday in ISO format if it's provided
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
            fetchData(); // Gọi lại API để cập nhật dữ liệu
        } catch (err) {
            console.error("Error saving author:", err);
            alert("Failed to save author. Please try again.");
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
            await authorService.delete(authorToDelete.id);

            // Close dialogs
            setDeleteConfirmOpen(false);
            if (isOpen && selectedAuthor && selectedAuthor.id === authorToDelete.id) {
                closeDialog();
            }

            fetchData(); // Gọi lại API để cập nhật dữ liệu
        } catch (err) {
            console.error("Error deleting author:", err);
            alert("Failed to delete author. Please try again.");
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold text-blue-700 mb-6">📚 Author List</h1>

                {/* Search and display options */}
                <div className="flex flex-wrap justify-between mb-6 gap-4">
                    <div className="relative w-full max-w-md">

                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>


                </div>

                {/* Add author button */}
                <button
                    onClick={openAddModal}
                    className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add Author
                </button>
                {/* Loading indicator */}
                {loading ? (
                    <div className="flex justify-center my-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
                    </div>
                ) : (
                    <>
                        {/* Authors grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {authors.map((author) => (
                                <div
                                    key={author.id || author.fullName}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-4 flex flex-col items-center"
                                >
                                    <div
                                        className="cursor-pointer w-full flex flex-col items-center"
                                        onClick={() => openDialog(author)}
                                    >
                                        {/* Phần hiển thị hình ảnh - đơn giản giống FlimPage */}
                                        <div className="w-24 h-24 mb-4 overflow-hidden">
                                            <img
                                                loading="lazy"
                                                src={author.avatar ? `${BASE_URL}/api/videos/view?bucketName=thanh&path=${author.avatar}` : '/api/placeholder/120/120'}
                                                alt={author.fullName}
                                                className="w-24 h-24 rounded-full border object-cover"
                                            />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-800 text-center">{author.fullName}</h2>
                                        <p className="text-sm text-gray-600 text-center">{author.country || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500 text-center">Born: {formatDate(author.birthday)}</p>
                                        <p className="text-xs text-gray-500 text-center">Gender: {author.gender ? 'Male' : 'Female'}</p>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="mt-4 flex space-x-2 w-full justify-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEditModal(author);
                                            }}
                                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
                                        >
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                confirmDelete(author);
                                            }}
                                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center"
                                        >
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* No results message */}
                        {authors.length === 0 && (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-gray-500 mt-4">No authors found matching your search.</p>
                                {/*{searchTerm && (*/}
                                {/*    <button*/}
                                {/*        onClick={() => setSearchTerm('')}*/}
                                {/*        className="mt-2 text-blue-600 hover:underline"*/}
                                {/*    >*/}
                                {/*        Clear search*/}
                                {/*    </button>*/}
                                {/*)}*/}
                            </div>
                        )}
                    </>
                )}

                {/* Pagination */}
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
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
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Confirm Delete
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600">
                                    Are you sure you want to delete {authorToDelete?.fullName}? This action cannot be undone.
                                </p>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
                                <button
                                    onClick={() => setDeleteConfirmOpen(false)}
                                    className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none"
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
