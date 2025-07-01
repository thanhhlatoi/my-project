import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Film, PlayCircle } from 'lucide-react';
import Layout from '../layouts/layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Pagination from '../components/Pagination.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import CreateVideoFilm from '../components/Create/CreateVideoFilm.jsx';
import VideoFilmService from "../api/VideoFilmService.js";
import { BASE_URL } from "../api/config.js";

const VideoFilmPage = () => {
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [error, setError] = useState(null);

    // Xử lý phát video
    const handlePlayVideo = (video) => {
        if (!video || !video.id) {
            alert('Không có video để phát!');
            return;
        }
        navigate(`/watch/${video.id}`);
    };

    const fetchVideos = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await VideoFilmService.getAll(page, 10, 'id', 'asc');
            
            if (response && response.data && response.data.data) {
                setVideos(response.data.data.content || []);
                setTotalPages(response.data.data.totalPages || 1);
            } else {
                setVideos([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            setError('Không thể tải danh sách video. Vui lòng thử lại sau.');
            setVideos([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [page]);

    // Lọc video theo từ khóa tìm kiếm
    const filteredVideos = videos.filter((video) => {
        const movieProduct = video.movieProduct || {};
        return !searchTerm ||
            (movieProduct.title &&
                movieProduct.title.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    // Xử lý thêm video mới
    const handleAddVideo = async (videoData) => {
        try {
            const formData = new FormData();
            formData.append('file', videoData.file);
            formData.append('movieProductId', videoData.movieProductId);

            await VideoFilmService.add(formData);
            fetchVideos();
            setIsAddModalOpen(false);
            alert('Thêm video thành công!');
        } catch (error) {
            console.error('Lỗi khi thêm video:', error);
            alert('Có lỗi xảy ra khi thêm video. Vui lòng thử lại.');
        }
    };

    const VideoCard = ({ video }) => {
        const movie = video.movieProduct || {};
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="relative aspect-video">
                    <img
                        src={movie.imgMovie
                            ? `${BASE_URL}/api/videos/view?bucketName=thanh&path=${movie.imgMovie}`
                            : "https://via.placeholder.com/400x250?text=No+Image"}
                        alt={movie.title || "Video thumbnail"}
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        onClick={() => handlePlayVideo(video)}
                    >
                        <PlayCircle size={48} className="text-white" />
                    </div>
                    
                    {movie.genres && movie.genres.length > 0 && (
                        <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                            {movie.genres[0].name}
                        </div>
                    )}
                </div>
                
                <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                        {movie.title || 'Không có tiêu đề'}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>File: {video.originalFileName || 'N/A'}</span>
                            <span>{movie.time}</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span>Format: {video.fileFormat || 'N/A'}</span>
                            <span>
                                {video.fileSize
                                    ? `${(video.fileSize / (1024 * 1024)).toFixed(2)} MB`
                                    : 'N/A'}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs">
                            <span>👀 {movie.views || 0} views</span>
                            <div className="flex gap-2">
                                <span>❤️ {movie.likes || 0}</span>
                                <span>👎 {movie.dislikes || 0}</span>
                            </div>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => handlePlayVideo(video)}
                        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <PlayCircle size={16} />
                        Phát Video
                    </button>
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="🎬 Video Library"
                    description="Khám phá và thưởng thức những video tuyệt vời"
                    showAddButton={true}
                    addButtonText="Thêm Video"
                    onAddClick={() => setIsAddModalOpen(true)}
                    gradient="from-red-600 to-pink-600"
                />

                {/* Search Bar */}
                <SearchBar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm video..."
                    showFilters={false}
                    showExport={false}
                />

                {/* Error message */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                        <p>{error}</p>
                        <button
                            onClick={fetchVideos}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Videos Grid */}
                {loading ? (
                    <LoadingSpinner text="Đang tải danh sách video..." />
                ) : (
                    <>
                        {filteredVideos.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredVideos.map((video) => (
                                    <VideoCard key={video.id} video={video} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Film size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có video nào</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm 
                                        ? `Không tìm thấy video nào phù hợp với "${searchTerm}".`
                                        : "Bắt đầu bằng cách thêm video đầu tiên."
                                    }
                                </p>
                                {searchTerm ? (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Xóa tìm kiếm
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Thêm Video Đầu Tiên
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        className="mt-6"
                    />
                )}

                {/* Add Video Modal */}
                {isAddModalOpen && (
                    <CreateVideoFilm
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        onSubmit={handleAddVideo}
                    />
                )}
            </div>
        </Layout>
    );
};

export default VideoFilmPage; 