import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FilmService from '../api/FilmService';
import Layout from '../layouts/layout.jsx';
import { BASE_URL } from '../api/config.js';
import FavoriteButton from './FavoriteButton.jsx';

const FilmDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await FilmService.getById(id);
                if (response && response.data) {
                    setMovie(response.data);
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
                await FilmService.deleteById(id);
                alert('Phim đã được xóa thành công!');
                navigate('/movies');
            } catch (error) {
                console.error("Lỗi khi xóa phim:", error);
                
                // Handle relationship constraint errors with detailed instructions
                if (error.isRelationshipError) {
                    const confirmRetry = window.confirm(
                        error.message + '\n\nBạn có muốn chuyển đến trang quản lý video để xóa các video liên quan không?'
                    );
                    if (confirmRetry) {
                        navigate('/video-films');
                    }
                    return;
                }
                
                // Handle other constraint errors
                if (error.isConstraintError) {
                    alert(error.message);
                    return;
                }
                
                // Handle 403 Forbidden
                if (error.response?.status === 403) {
                    alert('Bạn không có quyền xóa phim này. Vui lòng kiểm tra quyền tài khoản hoặc đăng nhập lại.');
                    return;
                }
                
                // Handle 404 Not Found
                if (error.response?.status === 404) {
                    alert('Phim không tồn tại hoặc đã được xóa trước đó.');
                    navigate('/movies');
                    return;
                }
                
                // Handle network or other errors
                if (!error.response) {
                    alert('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.');
                    return;
                }
                
                // Generic error fallback
                const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi xóa phim.';
                alert(`Lỗi: ${errorMsg}`);
            }
        }
    };

    const handleEdit = () => {
        navigate(`/movies/edit/${id}`);
    };

    const handleWatch = () => {
        navigate(`/movies/watch/${id}`);
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[70vh]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                    <p className="ml-4 text-lg text-blue-600 font-medium">Đang tải phim...</p>
                </div>
            </Layout>
        );
    }

    if (!movie) {
        return (
            <Layout>
                <div className="min-h-[70vh] flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-red-600 mt-4">Không tìm thấy phim!</h2>
                    <button
                        onClick={() => navigate('/movies')}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Quay lại danh sách phim
                    </button>
                </div>
            </Layout>
        );
    }

    const imgUrl = movie.imgMovie
        ? `${BASE_URL}/api/movieProduct/view?bucketName=thanh&path=${movie.imgMovie}`
        : 'default-image.png';

    return (
        <Layout>
            <div className="max-w-6xl mx-auto mt-8 mb-12">
                {/* Header section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">{movie.title}</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/movies')}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Quay lại
                        </button>
                    </div>
                </div>

                {/* Main content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Banner image */}
                    <div className="relative h-96 overflow-hidden">
                        <img
                            src={imgUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover transition duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8">
                            <h2 className="text-4xl font-bold text-white mb-2">{movie.title}</h2>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {movie.genre && movie.genre.map((genre, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-600 bg-opacity-80 text-white text-sm rounded-full">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center text-white gap-4">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{movie.time || '-- phút'}</span>
                                </div>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{movie.year || '--'}</span>
                                </div>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span>{movie.views || 0} lượt xem</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                        {/* Left column - Details */}
                        <div className="md:col-span-2">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Nội dung</h3>
                                <p className="text-gray-700 leading-relaxed text-lg">{movie.description}</p>
                            </div>

                            {/* Cast section */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Diễn viên</h3>
                                {movie.performer && movie.performer.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {movie.performer.map((actor, index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition">
                                                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <p className="font-medium text-gray-800">{actor.fullName}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">Chưa có thông tin diễn viên</p>
                                )}
                            </div>
                        </div>

                        {/* Right column - Info */}
                        <div className="md:col-span-1">
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin phim</h3>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Tác giả</h4>
                                        <p className="text-gray-800 font-medium">{movie.author?.fullName || 'Chưa có thông tin'}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Danh mục</h4>
                                        <p className="text-gray-800 font-medium">{movie.category?.name || 'Chưa có thông tin'}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Thời lượng</h4>
                                        <p className="text-gray-800 font-medium">{movie.time || 'Chưa có thông tin'}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Năm phát hành</h4>
                                        <p className="text-gray-800 font-medium">{movie.year || 'Chưa có thông tin'}</p>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex justify-between mb-2">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                                </svg>
                                                <span className="text-green-600 font-medium">Thích</span>
                                            </div>
                                            <span className="text-gray-800 font-bold">{movie.likes || 0}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                                                </svg>
                                                <span className="text-red-600 font-medium">Không thích</span>
                                            </div>
                                            <span className="text-gray-800 font-bold">{movie.dislikes || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={handleWatch}
                                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                    Xem phim
                                </button>

                                <FavoriteButton
                                    movieId={movie.id}
                                    size="lg"
                                    variant="outline"
                                    className="w-full justify-center"
                                    readOnly={true}
                                />

                                <button
                                    onClick={handleEdit}
                                    className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Sửa phim
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Xóa phim
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default FilmDetail;
