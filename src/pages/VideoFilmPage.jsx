import React, { useState, useEffect } from 'react';
import {Search, RefreshCw, Film, PlayCircle, Filter, PlusCircle} from 'lucide-react';
import CreateVideoFilm from '../components/Create/CreateVideoFilm.jsx';

const VideoFilmPage = () => {
    // Dữ liệu mẫu về phim với thêm thông tin
    const [films, setFilms] = useState([
        {
            id: 1,
            title: "Chi Hàng Xóm May Mắn",
            videoFilm: "kk/output1.m3u8",
            duration: "1h 45m",
            genre: "Hài Hước",
            thumbnailUrl: "/api/placeholder/300/200"
        },
        {
            id: 2,
            title: "Cuộc Phiêu Lưu Mới",
            videoFilm: "kk/output2.m3u8",
            duration: "2h 10m",
            genre: "Phiêu Lưu",
            thumbnailUrl: "/api/placeholder/300/200"
        },
        {
            id: 3,
            title: "Tình Yêu Vô Biên",
            videoFilm: "kk/output3.m3u8",
            duration: "1h 30m",
            genre: "Lãng Mạn",
            thumbnailUrl: "/api/placeholder/300/200"
        }
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // State cho form thêm phim
    const [newFilm, setNewFilm] = useState({
        title: "",
        videoFilm: "",
        duration: "",
        genre: "",
        thumbnailUrl: "/api/placeholder/300/200"
    });

    // Giả lập việc tải dữ liệu
    const fetchFilms = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        fetchFilms();
    }, []);

    // Lọc phim theo từ khóa tìm kiếm và thể loại
    const filteredFilms = films.filter(film =>
        film.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedGenre === "" || film.genre === selectedGenre)
    );

    // Danh sách thể loại
    const genres = ["Hài Hước", "Phiêu Lưu", "Lãng Mạn"];

    // Xử lý thêm phim mới
    const handleAddFilm = () => {
        // Validate form
        if (!newFilm.title || !newFilm.videoFilm || !newFilm.duration || !newFilm.genre) {
            alert("Vui lòng điền đầy đủ thông tin");
            return;
        }

        // Thêm phim mới
        const filmToAdd = {
            ...newFilm,
            id: films.length + 1  // Tạo ID mới
        };

        setFilms([...films, filmToAdd]);

        // Đóng modal và reset form
        setIsAddModalOpen(false);
        setNewFilm({
            title: "",
            videoFilm: "",
            duration: "",
            genre: "",
            thumbnailUrl: "/api/placeholder/300/200"
        });
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
                                <div className="relative">
                                    <select
                                        value={selectedGenre}
                                        onChange={(e) => setSelectedGenre(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="">Tất cả thể loại</option>
                                        {genres.map((genre) => (
                                            <option key={genre} value={genre}>{genre}</option>
                                        ))}
                                    </select>
                                    <Filter size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                                {filteredFilms.map((film) => (
                                    <div
                                        key={film.id}
                                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl"
                                    >
                                        <div className="relative">
                                            <img
                                                src={film.thumbnailUrl}
                                                alt={film.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                                <PlayCircle size={48} className="text-white" />
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="text-xs text-gray-500 block mb-1">ID: {film.id}</span>
                                                    <h3 className="text-lg font-bold text-gray-800">{film.title}</h3>
                                                </div>
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                    {film.genre}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-gray-600">
                                                <span>Đường dẫn: {film.videoFilm}</span>
                                                <span className="font-medium">{film.duration}</span>
                                            </div>
                                            <button
                                                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
                                            >
                                                <PlayCircle size={20} />
                                                Xem Phim
                                            </button>
                                        </div>
                                    </div>
                                ))}
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

                    {/* Sử dụng component CreateVideoFilm */}
                    <CreateVideoFilm
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        newFilm={newFilm}
                        setNewFilm={setNewFilm}
                        genres={genres}
                        onAddFilm={handleAddFilm}
                    />
                </div>
            </div>
        </div>
    );
};

export default VideoFilmPage;
