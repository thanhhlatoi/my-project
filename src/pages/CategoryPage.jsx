import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';
import DataTable from '../components/DataTable.jsx';
import Pagination from '../components/Pagination.jsx';
import CategoryService from '../api/CategoryService.js';
import CreateCategory from '../components/Create/CreateCategory.jsx';
import CategoryDetails from '../components/Update/CategoryDetails.jsx';
import { BASE_URL } from "../api/config.js";
import { Tag, Calendar, Eye } from 'lucide-react';

const CategoryPage = () => {
    // States
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: ''
    });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // Data fetching function
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await CategoryService.getAll(page, 10, 'id', 'asc', searchQuery);
            console.log('🔍 Full Category API response:', response);
            console.log('🔍 Response data:', response?.data);
            
            let categories = [];
            let pages = 1;
            
            if (response?.data) {
                // Try different structures
                if (response.data.data?.content) {
                    categories = response.data.data.content;
                    pages = response.data.data.totalPages || 1;
                    console.log('✅ Using structure: response.data.data.content');
                } else if (response.data.content) {
                    categories = response.data.content;
                    pages = response.data.totalPages || 1;
                    console.log('✅ Using structure: response.data.content');
                } else if (Array.isArray(response.data)) {
                    categories = response.data;
                    pages = 1;
                    console.log('✅ Using structure: response.data (array)');
                } else {
                    console.log('❌ Unknown API structure, setting empty array');
                    console.log('Available keys:', Object.keys(response.data));
                }
            }
            
            console.log('📋 Final categories array:', categories);
            setCategories(categories || []);
            setTotalPages(pages);
            
        } catch (error) {
            console.error("❌ Error fetching categories:", error);
            setCategories([]);
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
    const openDialog = (category) => {
        setSelectedCategory(category);
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        setSelectedCategory(null);
    };

    // Modal handlers
    const openAddModal = () => {
        setIsEditing(false);
        setNewCategory({
            name: '',
            description: ''
        });
        setIsAddModalOpen(true);
    };

    const openEditModal = (category) => {
        setNewCategory({ ...category });
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
            if (isEditing) {
                await CategoryService.update(newCategory.id, newCategory);
            } else {
                await CategoryService.add(newCategory);
            }

            closeAddModal();
            fetchData();
        } catch (err) {
            console.error("Error saving category:", err);
            let errorMessage = "Failed to save category. Please try again.";
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage += " Reason: " + err.response.data.message;
            } else if (err.message) {
                errorMessage += " Reason: " + err.message;
            }
            alert(errorMessage);
        }
    };

    // Confirmation dialog for delete
    const confirmDelete = (category) => {
        setCategoryToDelete(category);
        setDeleteConfirmOpen(true);
    };

    // Handle category deletion
    const handleDelete = async () => {
        if (!categoryToDelete) return;
        try {
            await CategoryService.delete(categoryToDelete.id);
            setDeleteConfirmOpen(false);
            if (isOpen && selectedCategory && selectedCategory.id === categoryToDelete.id) {
                closeDialog();
            }
            fetchData();
        } catch (err) {
            console.error("Error deleting category:", err);
            let errorMessage = "Failed to delete category. Please try again.";
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage += " Reason: " + err.response.data.message;
            } else if (err.message) {
                errorMessage += " Reason: " + err.message;
            }
            alert(errorMessage);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Filter categories by search
    const filteredCategories = searchQuery.trim()
        ? categories.filter(category =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : categories;

    // DataTable columns configuration
    const columns = [
        {
            header: 'Category',
            key: 'name',
            render: (category) => (
                <div className="flex items-center gap-3">
                    <div>
                        <div className="font-medium text-gray-900">{category.name}</div>
                        {category.description && (
                            <div className="text-sm text-gray-500 line-clamp-1">{category.description}</div>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            key: 'status',
            render: (category) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    category.active !== false
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {category.active !== false ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Movies Count',
            key: 'movieCount',
            render: (category) => (
                <div className="flex items-center gap-2">
                    <Eye size={14} className="text-gray-500" />
                    <span>{category.movieCount || 0} movies</span>
                </div>
            )
        }
    ];

    return (
        <Layout>
            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="🏷️ Category Management"
                    description="Organize your content with categories"
                    showAddButton={true}
                    addButtonText="Add New Category"
                    onAddClick={openAddModal}
                    gradient="from-amber-600 to-amber-700"
                />
                
                {/* Search Bar */}
                <SearchBar
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or description..."
                    showFilters={true}
                    showExport={true}
                    onFilterClick={() => console.log('Filter clicked')}
                    onExportClick={() => console.log('Export clicked')}
                />
                
                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={filteredCategories}
                    loading={loading}
                    onView={openDialog}
                    onEdit={openEditModal}
                    onDelete={confirmDelete}
                    emptyMessage="No categories found"
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
                
                {/* Add Category Modal */}
                {isAddModalOpen && (
                    <CreateCategory
                        isOpen={isAddModalOpen}
                        closeModal={closeAddModal}
                        newCategory={newCategory}
                        setNewCategory={setNewCategory}
                        handleSubmit={handleSubmit}
                        isEditing={isEditing}
                    />
                )}

                {/* Category Details Modal */}
                {isOpen && selectedCategory && (
                    <CategoryDetails
                        isOpen={isOpen}
                        closeDialog={closeDialog}
                        selectedCategory={selectedCategory}
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
                                    Are you sure you want to delete <span className="font-semibold">{categoryToDelete?.name}</span>?
                                </p>
                                <p className="text-gray-500 text-sm">
                                    This action cannot be undone and may affect associated movies.
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

export default CategoryPage;
