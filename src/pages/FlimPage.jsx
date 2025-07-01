import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FilmService from '../api/FilmService.js';
import Layout from '../layouts/layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Pagination from '../components/Pagination.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { BASE_URL } from "../api/config.js";
import CreateFilm from '../components/Create/CreateFilm.jsx';
import { Calendar, Star, Clock, Eye, Film as FilmIcon, Edit2, RefreshCw, Trash2 } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';

const FlimPage = () => {
    const navigate = useNavigate();
    // const { user, isAdmin, hasRole, initAuth } = useAuth();
    // Dummy auth functions for now
    const user = { id: 1, roles: [{ name: 'ADMIN' }] };
    const isAdmin = () => true;
    const hasRole = () => true;
    const initAuth = async () => console.log('Auth refreshed');
    
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [authError, setAuthError] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await FilmService.getAll(page, 10, 'id', 'asc', searchKeyword);
            if (response && response.data && response.data.data) {
                setMovies(response.data.data.content || []);
                setTotalPages(response.data.data.totalPages || 1);
            } else {
                setMovies([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phim:", error);
            setMovies([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, searchKeyword]);

    const handleEditMovie = (movie) => {
        console.log('Original movie data:', movie);
        
        if (!movie || !movie.id) {
            alert('Lỗi: Thông tin phim không hợp lệ!');
            console.error('Invalid movie data:', movie);
            return;
        }
        
        // Kiểm tra quyền trước khi cho phép edit
        if (!user) {
            alert('Bạn cần đăng nhập để chỉnh sửa phim!');
            return;
        }
        
        if (!isAdmin() && !hasRole('EDITOR')) {
            alert('Bạn không có quyền chỉnh sửa phim!');
            return;
        }
        
        setEditingMovie({ ...movie });
        setEditModal(true);
    };

    const handleUpdateMovie = async () => {
        if (!editingMovie) return;
        
        // Debug: Kiểm tra dữ liệu trước khi gửi
        console.log('=== DEBUG UPDATE MOVIE ===');
        console.log('editingMovie data:', JSON.stringify(editingMovie, null, 2));
        console.log('editingMovie.id:', editingMovie.id);
        
        // Lưu dữ liệu cũ để so sánh
        const oldMovieData = movies.find(m => m.id === editingMovie.id);
        console.log('Original movie data:', JSON.stringify(oldMovieData, null, 2));
        
        // Debug: Kiểm tra token
        const token = localStorage.getItem('authToken');
        console.log('Current auth token:', token ? 'Token exists' : 'No token found');
        if (token) {
            console.log('Token length:', token.length);
            console.log('Token preview:', token.substring(0, 20) + '...');
        }
        
        if (!editingMovie.id) {
            alert('Lỗi: Không tìm thấy ID của phim!');
            console.error('Movie ID is missing:', editingMovie);
            return;
        }
        
        try {
            console.log('Sending update request...');
            const response = await FilmService.update(editingMovie.id, editingMovie);
            console.log('Update response:', response);
            
            // Kiểm tra response từ server
            if (response && response.data) {
                console.log('Response data:', response.data);
            }
            
            setEditModal(false);
            setEditingMovie(null);
            
            // Refresh dữ liệu để kiểm tra xem có thay đổi không
            console.log('Refreshing data to verify update...');
            await fetchData();
            
            // Kiểm tra dữ liệu sau khi refresh
            setTimeout(() => {
                const updatedMovieData = movies.find(m => m.id === editingMovie.id);
                console.log('Updated movie data after refresh:', JSON.stringify(updatedMovieData, null, 2));
                
                // So sánh để xem có thay đổi thực sự không
                if (JSON.stringify(oldMovieData) === JSON.stringify(updatedMovieData)) {
                    console.warn('⚠️ Dữ liệu không thay đổi sau khi update!');
                    alert('Cảnh báo: Dữ liệu có thể chưa được cập nhật trong database!');
                } else {
                    console.log('✅ Dữ liệu đã thay đổi thành công!');
                }
            }, 1000);
            
            alert('Cập nhật phim thành công!');
        } catch (error) {
            console.error('Lỗi khi cập nhật phim:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
                
                // Xử lý lỗi 403 cụ thể
                if (error.response.status === 403) {
                    const errorData = error.response.data;
                    setAuthError(true); // Đánh dấu có lỗi auth
                    if (errorData && errorData.message) {
                        alert(`Lỗi quyền truy cập: ${errorData.message}`);
                    } else {
                        alert('Lỗi 403: Bạn không có quyền chỉnh sửa phim này. Vui lòng kiểm tra quyền tài khoản hoặc đăng nhập lại.');
                    }
                    return; // Không show alert "Có lỗi xảy ra" nữa
                }
            }
            alert('Có lỗi xảy ra khi cập nhật phim!');
        }
    };

    const handleDeleteMovie = async (movie) => {
        if (!movie || !movie.id) {
            alert('Lỗi: Thông tin phim không hợp lệ!');
            return;
        }
        
        const confirmDelete = window.confirm(
            `Bạn có chắc chắn muốn xóa phim "${movie.title}"?\n\n` +
            'Lưu ý: Bạn cần xóa tất cả video liên quan trước khi xóa phim.'
        );
        
        if (!confirmDelete) return;
        
        try {
            await FilmService.deleteById(movie.id);
            alert('Xóa phim thành công!');
            fetchData(); // Refresh the movie list
        } catch (error) {
            console.error('Lỗi khi xóa phim:', error);
            
            // Handle relationship constraint errors
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
                fetchData(); // Refresh to remove from list
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
    };

    const MovieCard = ({ movie, index }) => (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group relative"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Edit Button */}
            <button
                onClick={() => handleEditMovie(movie)}
                className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                title="Chỉnh sửa phim"
            >
                <Edit2 size={16} className="text-blue-600" />
            </button>

            {/* Delete Button */}
            <button
                onClick={() => handleDeleteMovie(movie)}
                className="absolute top-2 left-2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                title="Xóa phim"
            >
                <Trash2 size={16} className="text-red-600" />
            </button>

            <Link to={`/film/${movie.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                        src={movie.imgMovie 
                            ? `${BASE_URL}/api/videos/view?bucketName=thanh&path=${movie.imgMovie}` 
                            : 'https://via.placeholder.com/300x400?text=No+Poster'
                        }
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Rating Badge */}
                    {movie.rating && (
                        <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-lg flex items-center gap-1">
                            <Star size={12} className="text-yellow-400 fill-current" />
                            <span className="text-xs font-medium">{movie.rating}</span>
                        </div>
                    )}
                    
                    {/* Duration Badge */}
                    {movie.duration && (
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-lg flex items-center gap-1">
                            <Clock size={12} />
                            <span className="text-xs">{movie.duration} min</span>
                        </div>
                    )}
                </div>
                
                <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {movie.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                        {movie.releaseDate && (
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <span>{new Date(movie.releaseDate).getFullYear()}</span>
                            </div>
                        )}
                        
                        {movie.genres && movie.genres.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {movie.genres.slice(0, 2).map((genre, idx) => (
                                    <span 
                                        key={idx} 
                                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                                {movie.genres.length > 2 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                        +{movie.genres.length - 2}
                                    </span>
                                )}
                            </div>
                        )}
                        
                        {movie.views && (
                            <div className="flex items-center gap-2 text-gray-500">
                                <Eye size={14} />
                                <span>{movie.views.toLocaleString()} views</span>
                            </div>
                        )}
                    </div>
                    
                    {movie.description && (
                        <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                            {movie.description}
                        </p>
                    )}
                </div>
            </Link>
        </div>
    );

    return (
        <Layout>
            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="🎬 Movie Collection"
                    description="Discover and explore our vast collection of movies"
                    showAddButton={true}
                    addButtonText="Add New Movie"
                    onAddClick={() => setShowModal(true)}
                    gradient="from-purple-600 to-pink-600"
                />

                {/* Search Bar */}
                <SearchBar
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search movies by title, genre, or year..."
                    showFilters={true}
                    showExport={true}
                    onFilterClick={() => console.log('Filter clicked')}
                    onExportClick={() => console.log('Export clicked')}
                />

                {/* Movies Grid */}
                {loading ? (
                    <LoadingSpinner text="Loading movies..." />
                ) : (
                    <>
                        {movies.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {movies.map((movie, index) => (
                                    <MovieCard key={movie.id} movie={movie} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FilmIcon size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No movies found</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchKeyword 
                                        ? `No movies match "${searchKeyword}". Try a different search term.`
                                        : "Start building your movie collection by adding your first movie."
                                    }
                                </p>
                                {searchKeyword ? (
                                    <button
                                        onClick={() => setSearchKeyword('')}
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Clear Search
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Add First Movie
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

                {/* Add Movie Modal */}
                {showModal && (
                    <CreateFilm
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        onSuccess={() => {
                            setShowModal(false);
                            fetchData();
                        }}
                    />
                )}

                {/* Edit Movie Modal */}
                {editModal && editingMovie && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-4">Chỉnh sửa phim</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Tiêu đề</label>
                                        <input
                                            type="text"
                                            value={editingMovie.title || ''}
                                            onChange={(e) => setEditingMovie({...editingMovie, title: e.target.value})}
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Mô tả</label>
                                        <textarea
                                            value={editingMovie.description || ''}
                                            onChange={(e) => setEditingMovie({...editingMovie, description: e.target.value})}
                                            className="w-full p-2 border rounded-lg h-20"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Ngày phát hành</label>
                                        <input
                                            type="date"
                                            value={editingMovie.releaseDate ? editingMovie.releaseDate.split('T')[0] : ''}
                                            onChange={(e) => setEditingMovie({...editingMovie, releaseDate: e.target.value})}
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Thời lượng (phút)</label>
                                        <input
                                            type="number"
                                            value={editingMovie.duration || ''}
                                            onChange={(e) => setEditingMovie({...editingMovie, duration: e.target.value})}
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Đánh giá</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            value={editingMovie.rating || ''}
                                            onChange={(e) => setEditingMovie({...editingMovie, rating: e.target.value})}
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 mt-6">
                                    {authError && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await initAuth();
                                                    setAuthError(false);
                                                    alert('Đã làm mới xác thực! Vui lòng thử lại.');
                                                } catch (err) {
                                                    console.error('Refresh auth failed:', err);
                                                    alert('Không thể làm mới xác thực. Vui lòng đăng nhập lại.');
                                                }
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                                        >
                                            <RefreshCw size={16} />
                                            Làm mới
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setEditModal(false);
                                            setEditingMovie(null);
                                            setAuthError(false);
                                        }}
                                        className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleUpdateMovie}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        disabled={authError}
                                    >
                                        Cập nhật
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default FlimPage;
