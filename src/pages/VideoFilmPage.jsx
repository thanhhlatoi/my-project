import React, { useState, useEffect } from 'react';
import {Search, RefreshCw, Film, PlayCircle, Filter, PlusCircle} from 'lucide-react';
import CreateVideoFilm from '../components/Create/CreateVideoFilm.jsx';
import VideoFilmService from "../api/VideoFilmService.js";
import { BASE_URL } from "../api/config.js";

const VideoFilmPage = () => {
    const [videoFilms, setVideoFilms] = useState([]);
    const [newFilm, setNewFilm] = useState({
        title: '',
        genre: '',
        thumbnailUrl: '',
        videoFilm: '',
        duration: ''
    });
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchFilms = async () => {
        setLoading(true);
        try {
            const response = await VideoFilmService.getAll(page, 10, 'id', 'asc');
            setVideoFilms(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách phim:', error);
            setVideoFilms([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilms();
    }, [page]);

    // Filter films based on search term and selected genre
    const filteredFilms = videoFilms.filter((film) => {
        const movieProduct = film.movieProduct || {};
        const matchesSearch = movieProduct.title &&
            movieProduct.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = !selectedGenre ||
            (movieProduct.genres &&
                movieProduct.genres.some(genre => genre.name === selectedGenre));
        return matchesSearch && matchesGenre;
    });

    // Handle adding a new film
    const handleAddFilm = async (filmData) => {
        try {
            // eslint-disable-next-line no-undef
            await add(filmData);
            // Refresh danh sách phim sau khi thêm thành công
            fetchFilms();
            // Đóng modal
            setIsAddModalOpen(false);
        } catch (error) {
            // Xử lý lỗi, có thể hiển thị thông báo cho người dùng
            console.error('Lỗi khi thêm phim:', error);
        }
    };
    return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen py-10">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0">
                                <h2 className="text-3xl font-bold mb-2 flex items-center">
                                    <Film className="mr-3" size={32} />
                                    Thư Viện Phim
                                </h2>
                                <p className="text-blue-100">Khám phá và thưởng thức những bộ phim tuyệt vời</p>
                            </div>

                            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm phim..."
                                        className="w-full pl-10 pr-4 py-2 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>

                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                                >
                                    <PlusCircle size={20} />
                                    Thêm Phim
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Loading indicator */}
                    {loading && (
                        <div className="flex justify-center py-8">
                            <div className="flex items-center gap-3">
                                <RefreshCw size={24} className="animate-spin text-blue-600" />
                                <span className="text-gray-600 font-medium">Đang tải danh sách phim...</span>
                            </div>
                        </div>
                    )}

                    {/* Danh sách phim */}
                    <div className="p-6">
                        {filteredFilms.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredFilms.map((film) => {
                                    const movie = film.movieProduct || {};
                                    return (
                                        <div
                                            key={film.id}
                                            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl"
                                        >
                                            <div className="relative">
                                                <img
                                                    src={movie.imgMovie
                                                        ? `${BASE_URL}/api/movieProduct/view?bucketName=thanh&path=${movie.imgMovie}`
                                                        : "/api/placeholder/400/320"}
                                                    alt={movie.title}
                                                    className="w-full h-48 object-cover"
                                                    // onError={(e) => {
                                                    //     e.target.src = "/api/placeholder/400/320";
                                                    // }}
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                                    <PlayCircle size={48} className="text-white" />
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-xs text-gray-500 block mb-1">ID: {film.id}</span>
                                                        <h3 className="text-lg font-bold text-gray-800">{movie.title}</h3>
                                                    </div>
                                                    {movie.genres && movie.genres.length > 0 && (
                                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                            {movie.genres[0].name}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                                                    <span className="truncate max-w-xs">Đường dẫn: {film.videoFilm}</span>
                                                    <span className="font-medium">{movie.time}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <span>👀 {movie.views} lượt xem</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span>❤️ {movie.likes}</span>
                                                        <span>👎 {movie.dislikes}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
                                                >
                                                    <PlayCircle size={20} />
                                                    Xem Phim
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                                    <Search size={48} className="text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Không tìm thấy phim</h3>
                                <p className="text-gray-600 max-w-md mx-auto mb-6">
                                    Rất tiếc, không có phim nào phù hợp với tiêu chí tìm kiếm của bạn.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedGenre("");
                                        }}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                                    >
                                        Đặt lại bộ lọc
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pagination controls */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-center">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setPage(prev => Math.max(0, prev - 1))}
                                    disabled={page === 0}
                                    className={`px-4 py-2 rounded ${page === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                >
                                    Trước
                                </button>
                                <span className="px-4 py-2 bg-white border border-gray-300 rounded">
                                    {page + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={page === totalPages - 1}
                                    className={`px-4 py-2 rounded ${page === totalPages - 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                >
                                    Tiếp
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Sử dụng component CreateVideoFilm */}
                    <CreateVideoFilm
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        newFilm={newFilm}
                        setNewFilm={setNewFilm}
                        onAddFilm={handleAddFilm}
                    />
                </div>
            </div>
        </div>
    );
};

export default VideoFilmPage;
