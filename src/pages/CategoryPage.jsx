import React, { useState, useEffect } from 'react';
import CategoryService from '../api/CategoryService.js';
import Layout from '../layouts/layout.jsx';
import { PlusCircle, Edit2, Trash2, Save, X, Search, RefreshCw } from 'lucide-react';

const CategoryPage = () => {
    const [category, setCategory] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '' });
    const [editCategory, setEditCategory] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        fetchCategory();
    }, [page]);

    // Lấy danh sách thể loại
    const fetchCategory = async () => {
        setLoading(true);
        try {
            const response = await CategoryService.getAll(page, 10, 'id', 'asc');
            const data = response.data.data;
            setCategory(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách category:', error);
        } finally {
            setLoading(false);
        }
    };

    // Thêm thể loại mới
    const handleAddGenre = async () => {
        if (newCategory.name.trim() === '') return;

        setLoading(true);
        try {
            await CategoryService.add(newCategory);
            setNewCategory({ name: '' });
            fetchCategory();
            setIsModalOpen(false);
        } catch (err) {
            console.error('Lỗi khi thêm category:', err);
        } finally {
            setLoading(false);
        }
    };

    // Cập nhật thể loại
    const handleUpdate = async () => {
        if (!editCategory.name.trim()) return;

        setLoading(true);
        try {
            console.log('Đang cập nhật với dữ liệu:', editCategory);
            const response = await CategoryService.update(editCategory);
            console.log('Kết quả response:', response);

            if (response.status === 200) {
                console.log('Cập nhật thành công:', response.data);
                setEditCategory(null);
                fetchCategory();
            } else {
                console.error('Cập nhật không thành công:', response);
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật thể loại:', err);
        } finally {
            setLoading(false);
        }
    };

    // Xóa thể loại
    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await CategoryService.delete(id);
            fetchCategory();
            setConfirmDelete(null);
        } catch (err) {
            console.error('Lỗi khi xóa genre:', err);
        } finally {
            setLoading(false);
        }
    };

    // Chỉnh sửa thể loại
    const handleEdit = (genre) => {
        setEditCategory({ ...genre });
    };

    // Lọc thể loại theo từ khóa tìm kiếm filteredCategory
    const filteredCategory = category.filter(genre =>
        genre.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Quản lý Danh Mục Phim</h2>
                            <p className="text-gray-500 mt-1">Thêm, chỉnh sửa và xóa các danh mục phim</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm thể loại..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} className="text-gray-400" />
                                </div>
                            </div>

                            <button
                                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-sm"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <PlusCircle size={18} />
                                <span>Thêm Thể Loại</span>
                            </button>
                        </div>
                    </div>

                    {/* Loading indicator */}
                    {loading && (
                        <div className="flex justify-center my-8">
                            <div className="flex items-center gap-2">
                                <RefreshCw size={24} className="animate-spin text-blue-600" />
                                <span className="text-gray-600 font-medium">Đang tải dữ liệu...</span>
                            </div>
                        </div>
                    )}

                    {/* Card View */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {filteredCategory.map((genre) => (
                            <div
                                key={genre.id}
                                className={`bg-gray-50 rounded-lg border p-4 transition-all duration-300 ${
                                    editCategory?.id === genre.id ? 'ring-2 ring-blue-400 shadow-md' : 'hover:shadow-md'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className="text-xs font-medium text-gray-500">ID: {genre.id}</span>

                                        {editCategory?.id === genre.id ? (
                                            <input
                                                value={editCategory.name}
                                                onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                                                className="block w-full mt-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Tên thể loại"
                                            />
                                        ) : (
                                            <h3 className="text-lg font-semibold text-gray-800 mt-1">{genre.name}</h3>
                                        )}
                                    </div>

                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        genre.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {genre.active ? 'Hoạt động' : 'Không hoạt động'}
                                    </div>
                                </div>

                                {editCategory?.id === genre.id && (
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái:</label>
                                        <select
                                            value={editCategory.active}
                                            onChange={(e) => setEditCategory({ ...editCategory, active: e.target.value === 'true' })}
                                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="true">Hoạt động</option>
                                            <option value="false">Không hoạt động</option>
                                        </select>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2 mt-4">
                                    {editCategory?.id === genre.id ? (
                                        <>
                                            <button
                                                onClick={handleUpdate}
                                                className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition duration-300"
                                            >
                                                <Save size={16} />
                                                <span>Lưu</span>
                                            </button>
                                            <button
                                                onClick={() => setEditCategory(null)}
                                                className="flex items-center gap-1 bg-gray-400 text-white px-3 py-1.5 rounded-md hover:bg-gray-500 transition duration-300"
                                            >
                                                <X size={16} />
                                                <span>Hủy</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(genre)}
                                                className="flex items-center gap-1 bg-amber-500 text-white px-3 py-1.5 rounded-md hover:bg-amber-600 transition duration-300"
                                            >
                                                <Edit2 size={16} />
                                                <span>Sửa</span>
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete(genre)}
                                                className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition duration-300"
                                            >
                                                <Trash2 size={16} />
                                                <span>Xóa</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty state */}
                    {filteredCategory.length === 0 && !loading && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                <Search size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy thể loại nào</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">
                                Không có thể loại nào phù hợp với tìm kiếm của bạn hoặc chưa có thể loại nào được tạo.
                            </p>
                            <button
                                onClick={() => {setSearchTerm(""); fetchCategory();}}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    )}

                    {/* Phân trang */}
                    {filteredCategory.length > 0 && (
                        <div className="flex justify-center items-center mt-6 gap-2">
                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                                disabled={page === 0}
                                className="flex items-center justify-center w-10 h-10 rounded-md border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <span>&laquo;</span>
                            </button>

                            <div className="flex items-center justify-center">
                <span className="px-4 py-2 rounded-md bg-blue-50 text-blue-700 font-medium">
                  {page + 1}
                </span>
                                <span className="mx-2 text-gray-500">của</span>
                                <span className="text-gray-700 font-medium">{totalPages}</span>
                            </div>

                            <button
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                                disabled={page + 1 >= totalPages}
                                className="flex items-center justify-center w-10 h-10 rounded-md border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <span>&raquo;</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Thêm Thể Loại */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Thêm Thể Loại Mới</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="genreName" className="block text-sm font-medium text-gray-700 mb-1">
                                Tên thể loại
                            </label>
                            <input
                                id="genreName"
                                type="text"
                                placeholder="Nhập tên thể loại"
                                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleAddGenre}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2"
                                disabled={newCategory.name.trim() === ''}
                            >
                                <PlusCircle size={18} />
                                <span>Thêm thể loại</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xác nhận xóa */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
                        <div className="text-center mb-4">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <Trash2 size={24} className="text-red-600" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Xác nhận xóa thể loại</h3>
                            <p className="text-gray-500">
                                Bạn có chắc chắn muốn xóa thể loại "{confirmDelete.name}"? Hành động này không thể hoàn tác.
                            </p>
                        </div>

                        <div className="flex gap-3 justify-center mt-6">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDelete.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                            >
                                Xác nhận xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default CategoryPage;
