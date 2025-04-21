import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FilmService from '../api/FilmService.js';
import Layout from '../layouts/layout.jsx';
import { BASE_URL } from "../api/config.js";
import CreateFilm from '../components/CreateFilm.jsx'; // Import CreateFilm

const FlimPage = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isOpen, setIsOpen] = useState(false); // Điều khiển việc mở dialog thêm phim
    const [showModal, setShowModal] = useState(false);
    const fetchData = async () => {
        setLoading(true);
        try {
            // Nếu có từ khóa tìm kiếm, truyền vào API
            const response = await FilmService.getAll(page, 10, 'id', 'asc', searchKeyword);
            setMovies(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phim:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, searchKeyword]); // Thêm searchKeyword vào dependency để tải lại khi thay đổi tìm kiếm

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">🎬 Danh sách phim</h1>

            <div className="flex justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="🔍 Tìm phim..."
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)} // Cập nhật từ khóa tìm kiếm
                />
                <div className="p-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        ➕ Thêm phim mới
                    </button>

                    {showModal && <CreateFilm onClose={() => setShowModal(false)} />}
                </div>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-4 text-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-2 text-blue-500 font-medium">Đang tải phim...</p>
                    </div>
                ) : (
                    movies.map((movie, index) => (
                        <motion.div
                            key={movie.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group"
                        >
                            <Link to={`/film/${movie.id}`}>
                                <div className="overflow-hidden">
                                    <img
                                        src={movie.imgMovie ? `${BASE_URL}/api/movieProduct/view?bucketName=thanh&path=${movie.imgMovie}` : 'default-image.png'}
                                        alt={movie.title}
                                        className="w-full h-40 object-cover transform group-hover:scale-110 transition duration-300"
                                    />
                                </div>
                                <div className="p-3">
                                    <h2 className="font-bold text-base text-gray-800 truncate">{movie.title}</h2>
                                    <p className="text-sm text-gray-600 line-clamp-2">{movie.description}</p>
                                    <div className="mt-2 text-xs text-gray-500 flex flex-col gap-1">
                                        <span>📂 Thể loại: {movie.genre?.name}</span>
                                        <span>👁️ Lượt xem: {movie.views}</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>

            <div className="mt-6 flex justify-center items-center gap-4">
                <button
                    disabled={page <= 0}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    ⬅️ Trước
                </button>
                <span className="text-sm font-medium text-gray-700">
                    Trang <span className="font-bold">{page + 1}</span> / {totalPages}
                </span>
                <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Sau ➡️
                </button>
            </div>

            {/* Hiển thị dialog CreateFilm khi isOpen là true */}
            {isOpen && (
                <CreateFilm onClose={() => setIsOpen(false)} />
            )}
        </Layout>
    );
};

export default FlimPage;
