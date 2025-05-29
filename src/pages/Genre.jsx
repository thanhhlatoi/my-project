import React, { useState, useEffect } from 'react';
import GenreService from '../api/GenreService.js';
import Layout from '../layouts/layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';
import DataTable from '../components/DataTable.jsx';
import { Edit2, Save, X, Calendar } from 'lucide-react';

const Genre = () => {
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState({ name: '' });
  const [editGenre, setEditGenre] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchGenres();
  }, []);

  // Lấy danh sách thể loại
  const fetchGenres = async () => {
    setLoading(true);
    try {
      const response = await GenreService.getAll(0, 10, 'id', 'asc');
      console.log('🔍 Full Genre API response:', response);
      console.log('🔍 Response data:', response?.data);
      
      let genres = [];
      
      if (response?.data) {
        // Try different structures
        if (response.data.data?.content) {
          genres = response.data.data.content;
          console.log('✅ Using structure: response.data.data.content');
        } else if (response.data.content) {
          genres = response.data.content;
          console.log('✅ Using structure: response.data.content');
        } else if (Array.isArray(response.data)) {
          genres = response.data;
          console.log('✅ Using structure: response.data (array)');
        } else {
          console.log('❌ Unknown API structure, setting empty array');
          console.log('Available keys:', Object.keys(response.data));
        }
      }
      
      console.log('📋 Final genres array:', genres);
      setGenres(genres || []);
      
    } catch (error) {
      console.error('❌ Error fetching genres:', error);
      setGenres([]);
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
      const response = await GenreService.update(editGenre);
      if (response.status === 200) {
        setEditGenre(null);
        fetchGenres();
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật thể loại:', err);
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
            title="🎭 Genre Management"
            description="Manage movie genres and categories"
            showAddButton={true}
            addButtonText="Add New Genre"
            onAddClick={() => setIsModalOpen(true)}
            gradient="from-emerald-600 to-emerald-700"
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
