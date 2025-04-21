import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams và useNavigate
import FilmService from '../api/FilmService';
import Layout from '../layouts/layout.jsx';
import { BASE_URL } from '../api/config.js';


const FilmDetail = () => {
    const { id } = useParams(); // Lấy id từ URL
    const navigate = useNavigate(); // Sử dụng navigate để điều hướng
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await FilmService.getById(id); // Gọi API với id phim
                if (response && response.data) {
                    setMovie(response.data); // Lưu thông tin phim vào state
                } else {
                    throw new Error('Không có dữ liệu phim');
                }
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết phim:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
            try {
                await FilmService.deleteById(id); // Gọi API xóa phim
                alert('Phim đã được xóa thành công!');
                navigate('/movies'); // Điều hướng về trang danh sách phim
            } catch (error) {
                console.error("Lỗi khi xóa phim:", error);
                alert('Có lỗi xảy ra khi xóa phim.');
            }
        }
    };

    const handleEdit = () => {
        navigate(`/movies/edit/${id}`); // Điều hướng đến trang chỉnh sửa phim
    };

    const handleWatch = () => {
        navigate(`/movies/`); // Điều hướng đến trang xem phim (thay đổi URL theo nhu cầu)
    };

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-10 text-blue-600 font-medium">Đang tải phim...</div>
            </Layout>
        );
    }

    if (!movie) {
        return (
            <Layout>
                <div className="text-center py-10 text-red-600 font-medium">Không tìm thấy phim!</div>
            </Layout>
        );
    }

    // Đảm bảo rằng đường dẫn hình ảnh đầy đủ và hợp lệ
    const imgUrl = movie.imgMovie
        ? `${BASE_URL}/api/movieProduct/view?bucketName=thanh&path=${movie.imgMovie}`
        : 'default-image.png'; // Thêm ảnh mặc định nếu không có ảnh

    return (
        <Layout>
            <div className="max-w-3xl mx-auto mt-6 bg-white rounded-2xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-blue-700 mb-4">{movie.title}</h1>
                <img
                    src={imgUrl}
                    alt={movie.title}
                    className="w-full h-64 object-cover rounded mb-4"
                />
                <p className="text-gray-700 mb-4">{movie.description}</p>
                <div className="text-sm text-gray-600">
                    <p>📂 Thể loại: {movie.genre?.name}</p>
                    <p>👁️ Lượt xem: {movie.views}</p>
                    <p>📝 Tác giả: {movie.author?.[0]?.fullName || 'Chưa có thông tin'}</p>
                    <p>🎭 Diễn viên: {movie.performer?.length ? movie.performer.join(', ') : 'Chưa có thông tin'}</p>
                    <p>⏰ Thời gian: {movie.time || 'Chưa có thông tin'}</p>
                    <p>📅 Năm phát hành: {movie.year || 'Chưa có thông tin'}</p>
                    <p>👍 Likes: {movie.likes || 0}</p>
                    <p>👎 Dislikes: {movie.dislikes || 0}</p>
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                        Sửa
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        Xóa
                    </button>
                    <button
                        onClick={handleWatch}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                        Xem phim
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default FilmDetail;
