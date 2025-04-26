import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FilmService from '../api/FilmService.js';
import Layout from '../layouts/layout.jsx';
import { BASE_URL } from "../api/config.js";
import CreateFilm from '../components/Create/CreateFilm.jsx';

// Thay thế các icon bằng emoji
const iconMap = {
    views: '👁️',
    time: '⏱️',
    calendar: '📅',
    user: '👤',
    folder: '📂',
    tag: '🏷️',
    heart: '❤️',
    thumbsDown: '👎'
};

const FlimPage = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await FilmService.getAll(page, 10, 'id', 'asc', searchKeyword);
            setMovies(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phim:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, searchKeyword]);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 shadow-lg">
                    <h1 className="text-3xl font-bold text-white text-center">
                        🎬 Khám phá thế giới phim
                    </h1>
                    <p className="text-blue-100 text-center mt-2">
                        Tìm kiếm và khám phá những bộ phim yêu thích của bạn
                    </p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="relative w-full md:w-2/3">
                        <input
                            type="text"
                            placeholder="Tìm kiếm phim yêu thích..."
                            className="w-full pl-12 pr-4 py-3 border-0 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <div className="absolute left-4 top-3.5 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full md:w-auto py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Thêm phim mới
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg font-medium text-blue-600">Đang tải phim...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {movies.map((movie, index) => (
                            <motion.div
                                key={movie.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <Link to={`/film/${movie.id}`} className="block h-full">
                                    <div className="relative overflow-hidden aspect-video">
                                        <img
                                            src={movie.imgMovie ? `${BASE_URL}/api/movieProduct/view?bucketName=thanh&path=${movie.imgMovie}` : 'default-image.png'}
                                            alt={movie.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300"
                                        />
                                        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                                            {movie.year}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h2 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{movie.title}</h2>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{movie.description}</p>

                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {movie.genres?.map(genre => (
                                                <span key={genre.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                    {genre.name}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <span className="text-blue-500">{iconMap.user}</span>
                                                <span className="truncate" title={movie.author?.fullName}>
                                                    {movie.author?.fullName}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-purple-500">{iconMap.folder}</span>
                                                <span className="truncate" title={movie.category?.name}>
                                                    {movie.category?.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-green-500">{iconMap.time}</span>
                                                <span>{movie.time}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-amber-500">{iconMap.views}</span>
                                                <span>{movie.views} lượt xem</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                                            <div className="flex items-center gap-1 text-red-500">
                                                <span>{iconMap.heart}</span>
                                                <span className="text-xs">{movie.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <span>{iconMap.thumbsDown}</span>
                                                <span className="text-xs">{movie.dislikes}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && movies.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-xl">
                        <div className="text-5xl mb-4">🎬</div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">Không tìm thấy phim</h3>
                        <p className="text-gray-500">Thử tìm kiếm với từ khóa khác hoặc thêm phim mới.</p>
                    </div>
                )}

                <div className="mt-10 mb-6 flex justify-center items-center gap-4">
                    <button
                        disabled={page <= 0}
                        onClick={() => setPage(page - 1)}
                        className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        ⬅️ Trang trước
                    </button>
                    <div className="px-4 py-2 bg-white text-sm font-medium text-gray-700 rounded-md shadow-sm border border-gray-300">
                        Trang <span className="font-bold text-blue-600">{page + 1}</span> / {totalPages}
                    </div>
                    <button
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(page + 1)}
                        className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        Trang sau ➡️
                    </button>
                </div>
            </div>

            {showModal && <CreateFilm onClose={() => setShowModal(false)} />}
            {isOpen && <CreateFilm onClose={() => setIsOpen(false)} />}
        </Layout>
    );
};

export default FlimPage;
