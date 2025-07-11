import React, { useState, useEffect } from 'react';
import GenreService from '../api/GenreService.js';
import Layout from '../layouts/layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';
import DataTable from '../components/DataTable.jsx';
import Pagination from '../components/Pagination.jsx';
import { Edit2, Save, X, Calendar } from 'lucide-react';

const Genre = () => {
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState({ name: '' });
  const [editGenre, setEditGenre] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGenres();
  }, [page]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 0) {
        setPage(0); // Reset to first page when searching
      } else {
        fetchGenres();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Lấy danh sách thể loại
  const fetchGenres = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      console.log('Fetching genres with page:', page, 'searchTerm:', searchTerm);
      const response = await GenreService.getAll(page, 10, 'id', 'asc', searchTerm);
      console.log('🔍 Full Genre API response:', response);
      console.log('🔍 Response data:', response?.data);
      
      let genres = [];
      let pages = 1;
      
      if (response?.data) {
        // Try different structures
        if (response.data.data?.content) {
          genres = response.data.data.content;
          pages = response.data.data.totalPages || 1;
          console.log('✅ Using structure: response.data.data.content');
        } else if (response.data.content) {
          genres = response.data.content;
          pages = response.data.totalPages || 1;
          console.log('✅ Using structure: response.data.content');
        } else if (Array.isArray(response.data)) {
          genres = response.data;
          pages = 1;
          console.log('✅ Using structure: response.data (array)');
        } else {
          console.log('❌ Unknown API structure, setting empty array');
          console.log('Available keys:', Object.keys(response.data));
        }
      }
      
      console.log('📋 Final genres array:', genres);
      setGenres(genres || []);
      setTotalPages(pages);
      
    } catch (error) {
      console.error("❌ Error fetching genres:", error);
      setGenres([]);
      setTotalPages(1);
      
      // Better error handling
      let errorMessage = "Failed to load genres. ";
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        
        if (error.response.status === 500) {
          errorMessage += "Server error occurred. Please try again later or contact support.";
        } else if (error.response.data && error.response.data.message) {
          errorMessage += "Reason: " + error.response.data.message;
        }
      } else if (error.message) {
        errorMessage += "Reason: " + error.message;
      }
      
      // Show error to user
      setError(errorMessage);
      console.error("Full error message:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Thêm thể loại mới
  const handleAddGenre = async () => {
    if (newGenre.name.trim() === '') return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vui lòng đăng nhập lại');
      return;
    }

    setLoading(true);
    try {
      await GenreService.add({
        ...newGenre,
        active: true
      });
      setNewGenre({ name: '' });
      fetchGenres();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Chi tiết lỗi khi thêm genre:', err);
      alert('Không thể thêm thể loại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật thể loại
  const handleUpdate = async () => {
    if (!editGenre.name.trim()) return;

    setLoading(true);
    try {
      console.log('Updating genre with ID:', editGenre.id);
      const response = await GenreService.update(editGenre.id, editGenre);
      if (response.status === 200) {
        setEditGenre(null);
        fetchGenres();
      } else {
        alert('Cập nhật thể loại thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật thể loại:', err);
      alert('Có lỗi xảy ra khi cập nhật thể loại: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  // Xóa thể loại
  const handleDelete = async (genre) => {
    setLoading(true);
    try {
      await GenreService.delete(genre.id);
      fetchGenres();
      setConfirmDelete(null);
    } catch (err) {
      console.error('Lỗi khi xóa genre:', err);
    } finally {
      setLoading(false);
    }
  };

  // Chỉnh sửa thể loại
  const handleEdit = (genre) => {
    setEditGenre({ ...genre });
  };

  // Hủy chỉnh sửa
  const cancelEdit = () => {
    setEditGenre(null);
  };

  // Lọc thể loại theo từ khóa tìm kiếm
  const filteredGenres = genres.filter(genre =>
      genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cấu hình columns cho DataTable
  const columns = [
    {
      header: 'ID',
      key: 'id',
      render: (genre) => (
        <span className="text-sm font-mono text-gray-600">#{genre.id}</span>
      )
    },
    {
      header: 'Name',
      key: 'name',
      render: (genre) => {
        if (editGenre?.id === genre.id) {
          return (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editGenre.name}
                onChange={(e) => setEditGenre({ ...editGenre, name: e.target.value })}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                autoFocus
              />
            </div>
          );
        }
        return (
          <div>
            <span className="font-medium text-gray-900">{genre.name}</span>
          </div>
        );
      }
    },
    {
      header: 'Status',
      key: 'active',
      render: (genre) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          genre.active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {genre.active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    
  ];

  // Custom actions cho từng row
  const customActions = (genre) => {
    if (editGenre?.id === genre.id) {
      return (
        <>
          <button
            onClick={handleUpdate}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Save changes"
          >
            <Save size={16} />
          </button>
          <button
            onClick={cancelEdit}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Cancel edit"
          >
            <X size={16} />
          </button>
        </>
      );
    }
    return null;
  };

  return (
      <Layout>
        <div className="space-y-6">
          {/* Page Header */}
          <PageHeader
            title="🗂️ Genre Management"
            description="Organize your content by genres"
            showAddButton={true}
            addButtonText="Add New Genre"
            onAddClick={() => setIsModalOpen(true)}
            gradient="from-blue-600 to-blue-700"
          />

          {/* Search Bar */}
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search genres..."
            showFilters={false}
            showExport={true}
            onExportClick={() => console.log('Export genres')}
          />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex justify-between items-start">
                <p>{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    fetchGenres();
                  }}
                  className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={filteredGenres}
            loading={loading}
            onEdit={handleEdit}
            onDelete={(genre) => setConfirmDelete(genre)}
            customActions={customActions}
            emptyMessage="No genres found"
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

          {/* Add Genre Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Genre</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre Name
                  </label>
                  <input
                    type="text"
                    value={newGenre.name}
                    onChange={(e) => setNewGenre({ ...newGenre, name: e.target.value })}
                    placeholder="Enter genre name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddGenre}
                    disabled={!newGenre.name.trim() || loading}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Adding...' : 'Add Genre'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {confirmDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{confirmDelete.name}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(confirmDelete)}
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

export default Genre;
