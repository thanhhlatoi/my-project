import React, { useState, useEffect } from 'react';
import GenreService from '../api/GenreService.js';
import Layout from '../layouts/layout.jsx';

const Genre = () => {
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState({ name: '' });
  const [editGenre, setEditGenre] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchGenres();
  }, [page]);

  // Lấy danh sách thể loại
  const fetchGenres = async () => {
    try {
      const response = await GenreService.getAll(page, 10, 'id', 'asc');
      const data = response.data.data;
      setGenres(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách genre:', error);
    }
  };

  // Thêm thể loại mới
  const handleAddGenre = async () => {
    if (newGenre.name.trim() === '') return;

    try {
      await GenreService.add(newGenre);
      setNewGenre({ name: '' });
      fetchGenres();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Lỗi khi thêm genre:', err);
    }
  };

  // Cập nhật thể loại
  const handleUpdate = async () => {
    if (!editGenre.name.trim()) return;

    try {
      console.log('Đang cập nhật với dữ liệu:', editGenre); // Thêm log này
      const response = await GenreService.update(editGenre);
      console.log('Kết quả response:', response); // Thêm log này

      if (response.status === 200) {
        console.log('Cập nhật thành công:', response.data);
        setEditGenre(null);
        fetchGenres();
      } else {
        console.error('Cập nhật không thành công:', response);
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật thể loại:', err);
    }
  };

  // Xóa thể loại
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await GenreService.delete(id);
        fetchGenres();
      } catch (err) {
        console.error('Lỗi khi xóa genre:', err);
      }
    }
  };

  // Chỉnh sửa thể loại
  const handleEdit = (genre) => {
    setEditGenre({ ...genre });
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Quản lý Thể Loại Phim</h2>

      {/* Nút thêm thể loại, mở Modal */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => setIsModalOpen(true)}
      >
        Thêm Thể Loại
      </button>

      {/* Modal Thêm Thể Loại */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Thêm Thể Loại Mới</h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tên thể loại"
                className="border p-2 rounded w-full"
                value={newGenre.name}
                onChange={(e) => setNewGenre({ ...newGenre, name: e.target.value })}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleAddGenre}
              >
                Thêm
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setIsModalOpen(false)} // Đóng Modal
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bảng danh sách thể loại */}
      <table className="w-full table-auto border-collapse mt-6">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Tên</th>
            <th className="border px-4 py-2">Trạng thái</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {genres.map((genre) => (
            <tr key={genre.id}>
              <td className="border px-4 py-2">{genre.id}</td>
              <td className="border px-4 py-2">
                {editGenre?.id === genre.id ? (
                  <input
                    value={editGenre.name}
                    onChange={(e) => setEditGenre({ ...editGenre, name: e.target.value })}
                    className="border p-1 rounded"
                  />
                ) : (
                  genre.name
                )}
              </td>
              <td className="border px-4 py-2">
                {editGenre?.id === genre.id ? (
                  <select
                    value={editGenre.active}
                    onChange={(e) => setEditGenre({ ...editGenre, active: e.target.value === 'true' })}
                    className="border p-1 rounded"
                  >
                    <option value="true">Hoạt động</option>
                    <option value="false">Không hoạt động</option>
                  </select>
                ) : genre.active ? 'Hoạt động' : 'Không hoạt động'}
              </td>
              <td className="border px-4 py-2 flex gap-2">
                {editGenre?.id === genre.id ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditGenre(null)}
                      className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(genre)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(genre.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Trước
        </button>
        <span className="px-3 py-1">
          {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page + 1 >= totalPages}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </Layout>
  );
};

export default Genre;
