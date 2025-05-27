import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Film, PlayCircle, Filter, PlusCircle } from 'lucide-react';
import CreateVideoFilm from '../components/Create/CreateVideoFilm.jsx';
import VideoFilmService from "../api/VideoFilmService.js"; // Dùng để quản lý video
import { BASE_URL } from "../api/config.js";

const VideoFilmPage = () => {
    const navigate = useNavigate(); // Hook để điều hướng
    const [videos, setVideos] = useState([]);
    const [newFilm, setNewFilm] = useState({
        movieProductId: '',
        file: null
    });
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [error, setError] = useState(null);

    // Xử lý phát video - điều hướng sang trang WatchPage
    const handlePlayVideo = (video) => {
        if (!video || !video.id) {
            alert('Không có video để phát!');
            return;
        }

        console.log('Điều hướng đến trang xem video với ID:', video.id);
        navigate(`/watch/${video.id}`);
    };

    const fetchVideos = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching videos, page:', page);

            // Gọi API để lấy danh sách video
            const response = await VideoFilmService.getAll(page, 10, 'id', 'asc');
            console.log('API response:', response);

            // Kiểm tra cấu trúc dữ liệu phản hồi
            if (response && response.data) {
                // Xác định cấu trúc dữ liệu phản hồi
                let videoData = response.data;

                // Nếu phản hồi có cấu trúc { data: { ... } }
                if (videoData.data) {
                    videoData = videoData.data;
                }

                // Kiểm tra nếu có thuộc tính content (Spring Data JPA Page)
                if (videoData.content && Array.isArray(videoData.content)) {
                    setVideos(videoData.content);
                    if (videoData.totalPages) {
                        setTotalPages(videoData.totalPages);
                    }
                }
                // Nếu phản hồi là mảng trực tiếp
                else if (Array.isArray(videoData)) {
                    setVideos(videoData);
                    setTotalPages(1);
                }
                // Nếu phản hồi là một đối tượng khác
                else {
                    console.warn('Unexpected response structure:', videoData);
                    setVideos([]);
                    setTotalPages(1);
                }
            } else {
                console.warn('Empty or invalid response:', response);
                setVideos([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            setError('Không thể tải danh sách video. Vui lòng thử lại sau.');
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [page]);

    // Lọc video theo từ khóa tìm kiếm và thể loại
    const filteredVideos = videos.filter((video) => {
        const movieProduct = video.movieProduct || {};
        const matchesSearch = !searchTerm ||
            (movieProduct.title &&
                movieProduct.title.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesGenre = !selectedGenre ||
            (movieProduct.genres &&
                movieProduct.genres.some(genre => genre.name === selectedGenre));

        return matchesSearch && matchesGenre;
    });

    // Xử lý thêm video mới
    const handleAddVideo = async (videoData) => {
        try {
            // Tạo FormData
            const formData = new FormData();
            formData.append('file', videoData.file);
            formData.append('movieProductId', videoData.movieProductId);

            // Gọi API để thêm video
            await VideoFilmService.add(formData);

            // Tải lại danh sách video
            fetchVideos();

            // Đóng modal và reset form
            setIsAddModalOpen(false);
            setNewFilm({
                movieProductId: '',
                file: null
            });

            // Thông báo thành công
            alert('Thêm video thành công!');
        } catch (error) {
            console.error('Lỗi khi thêm video:', error);
            alert('Có lỗi xảy ra khi thêm video. Vui lòng thử lại.');
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
                                    Thư Viện Video
                                </h2>
                                <p className="text-blue-100">Khám phá và thưởng thức những video tuyệt vời</p>
                            </div>

                            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm video..."
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
                                    Thêm Video
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Loading indicator */}
                    {loading && (
                        <div className="flex justify-center py-8">
                            <div className="flex items-center gap-3">
                                <RefreshCw size={24} className="animate-spin text-blue-600" />
                                <span className="text-gray-600 font-medium">Đang tải danh sách video...</span>
                            </div>
                        </div>
                    )}

                    {/* Error message */}
                    {error && !loading && (
                        <div className="bg-red-50 text-red-700 p-4 m-6 rounded-lg border border-red-200">
                            <p>{error}</p>
                            <button
                                onClick={fetchVideos}
                                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Thử lại
                            </button>
                        </div>
                    )}

                    {/* Debug info - có thể xóa sau khi debug xong */}
                    <div className="p-4 bg-gray-100 m-6 rounded-lg">
                        <h3 className="font-semibold mb-2">Debug Info:</h3>
                        <p>Số lượng video: {videos.length}</p>
                        <p>Số lượng video đã lọc: {filteredVideos.length}</p>
                        <p>Trang hiện tại: {page + 1}/{totalPages}</p>
                        <button
                            onClick={() => {
                                console.log('Raw videos data:', videos);
                                console.log('Filtered videos:', filteredVideos);
                            }}
                            className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs mt-1"
                        >
                            Log Data
                        </button>
                    </div>

                    {/* Danh sách video */}
                    <div className="p-6">
                        {!loading && !error && filteredVideos.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredVideos.map((video) => {
                                    const movie = video.movieProduct || {};
                                    return (
                                        <div
                                            key={video.id}
                                            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl"
                                        >
                                            <div className="relative">
                                                <img
                                                    src={movie.imgMovie
                                                        ? `${BASE_URL}/api/videos/view?bucketName=thanh&path=${movie.imgMovie}`
                                                        : "https://via.placeholder.com/400x250?text=No+Image"}
                                                    alt={movie.title || "Video thumbnail"}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div
                                                    className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                                    onClick={() => handlePlayVideo(video)}
                                                >
                                                    <PlayCircle size={48} className="text-white" />
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-xs text-gray-500 block mb-1">ID: {video.id}</span>
                                                        <h3 className="text-lg font-bold text-gray-800">
                                                            {movie.title || 'Không có tiêu đề'}
                                                        </h3>
                                                    </div>
                                                    {movie.genres && movie.genres.length > 0 && (
                                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                            {movie.genres[0].name}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                                                    <span className="truncate max-w-xs">
                                                        File: {video.originalFileName || 'N/A'}
                                                    </span>
                                                    <span className="font-medium">{movie.time}</span>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500">
                                                    <div className="flex justify-between">
                                                        <span>Định dạng: {video.fileFormat || 'N/A'}</span>
                                                        <span>
                                                            {video.fileSize
                                                                ? `${(video.fileSize / (1024 * 1024)).toFixed(2)} MB`
                                                                : 'N/A'}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1">
                                                        <span>
                                                            URL: {(video.videoFilm || video.urlVideo || video.hlsPath || 'N/A').substring(0, 30)}...
                                                        </span>
                                                    </div>
                                                    <div className="mt-1">
                                                        <span>Chất lượng: {video.availableQualities
                                                            ? (Array.isArray(video.availableQualities)
                                                                ? video.availableQualities.join(', ')
                                                                : video.availableQualities)
                                                            : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                                                    <div className="flex items-center gap-1">
                                                        <span>👀 {movie.views || 0} lượt xem</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span>❤️ {movie.likes || 0}</span>
                                                        <span>👎 {movie.dislikes || 0}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handlePlayVideo(video)}
                                                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
                                                >
                                                    <PlayCircle size={20} />
                                                    Xem Video
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            !loading && !error && (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                                        <Search size={48} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Không tìm thấy video</h3>
                                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                                        Rất tiếc, không có video nào phù hợp với tiêu chí tìm kiếm của bạn.
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={() => {
                                                setSearchTerm("");
                                                setSelectedGenre("");
                                                fetchVideos();
                                            }}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                                        >
                                            Đặt lại bộ lọc
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* Pagination controls */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-center">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setPage(prev => Math.max(0, prev - 1))}
                                    disabled={page === 0 || loading}
                                    className={`px-4 py-2 rounded ${page === 0 || loading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                >
                                    Trước
                                </button>
                                <span className="px-4 py-2 bg-white border border-gray-300 rounded">
                                    {page + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={page === totalPages - 1 || loading}
                                    className={`px-4 py-2 rounded ${page === totalPages - 1 || loading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                >
                                    Tiếp
                                </button>
                            </div>
                        </div>
                    )}

                    {/* CreateVideoFilm modal */}
                    <CreateVideoFilm
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        newFilm={newFilm}
                        setNewFilm={setNewFilm}
                        onAddFilm={handleAddVideo}
                    />
                </div>
            </div>
        </div>
    );
};

export default VideoFilmPage;
