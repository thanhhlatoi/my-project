import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Folder, Film, FileVideo } from 'lucide-react';
import FilmService from '../../api/FilmService.js';
import VideoFilmService from '../../api/VideoFilmService.js';

const CreateVideoFilm = ({
                             isOpen,
                             onClose,
                             onAddFilm
                         }) => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedVideoFile, setSelectedVideoFile] = useState(null);
    const [error, setError] = useState('');

    // Fetch movies list
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await FilmService.getAll(0, 100, 'title', 'asc');
                setMovies(response.data.data.content);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách phim:', error);
                setError('Không thể tải danh sách phim');
            }
        };

        if (isOpen) {
            fetchMovies();
            // Reset state khi mở modal
            setSelectedMovie(null);
            setSelectedVideoFile(null);
            setError('');
        }
    }, [isOpen]);

    const handleFileSelect = async (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            // Lọc chỉ các file video
            const videoFileList = Array.from(files)
                .filter(file =>
                    file.type.startsWith('video/') ||
                    ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv']
                        .some(ext => file.name.toLowerCase().endsWith(ext))
                )
                .map(file => file);

            if (videoFileList.length === 0) {
                setError('Vui lòng chọn file video hợp lệ');
                return;
            }

            setSelectedVideoFile(videoFileList[0]);
            setError('');
        }
    };

    const handleAddFilm = async () => {
        // Validate input
        if (!selectedMovie) {
            setError('Vui lòng chọn phim');
            return;
        }

        if (!selectedVideoFile) {
            setError('Vui lòng chọn file video');
            return;
        }

        try {
            // Tạo FormData
            const formData = new FormData();

            // Debug: In ra thông tin để kiểm tra
            console.log('Selected movie ID:', selectedMovie.id, 'Type:', typeof selectedMovie.id);
            console.log('Selected file:', selectedVideoFile.name, 'Size:', selectedVideoFile.size);

            // Đảm bảo tên tham số đúng
            formData.append('file', selectedVideoFile);
            formData.append('movieProductId', selectedMovie.id);

            // Gọi service để thêm phim
            const response = await VideoFilmService.add(formData);

            // Hiển thị thông báo thành công
            alert('Thêm phim thành công');

            // Gọi callback nếu có
            if (onAddFilm) {
                onAddFilm(response.data);
            }

            // Đóng modal
            onClose();
        } catch (error) {
            console.error('Lỗi khi thêm phim:', error);

            // Hiển thị lỗi chi tiết
            let errorMessage = 'Có lỗi xảy ra khi thêm phim';

            if (error.response) {
                console.log('Error response data:', error.response.data);
                errorMessage = error.response.data.error || error.response.data.message || errorMessage;
            } else if (error.data) {
                console.log('Error data:', error.data);
                errorMessage = error.data.error || error.data.message || errorMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Thêm Video Phim</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Hiển thị lỗi */}
                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Film className="mr-2" size={16} />
                            Chọn Phim
                        </label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={selectedMovie ? selectedMovie.id : ''}
                            onChange={(e) => {
                                const movie = movies.find(m => m.id === parseInt(e.target.value));
                                setSelectedMovie(movie);
                                setError('');
                            }}
                        >
                            <option value="">Chọn phim</option>
                            {movies.map((movie) => (
                                <option key={movie.id} value={movie.id}>
                                    {movie.title} ({movie.year})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Folder className="mr-2" size={16} />
                            Chọn File Video
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                id="videoFileInput"
                                accept="video/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <label
                                htmlFor="videoFileInput"
                                className="flex-grow"
                            >
                                <div className="w-full p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center gap-2">
                                    <FileVideo size={20} className="text-gray-500" />
                                    <span className="text-gray-600">
                                        {selectedVideoFile
                                            ? selectedVideoFile.name
                                            : 'Chọn file video'}
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {selectedMovie && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Chi tiết phim</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                <div>
                                    <span className="font-medium">Tiêu đề:</span> {selectedMovie.title}
                                </div>
                                <div>
                                    <span className="font-medium">Năm:</span> {selectedMovie.year}
                                </div>
                                <div>
                                    <span className="font-medium">Thời lượng:</span> {selectedMovie.time}
                                </div>
                                {selectedMovie.genres && (
                                    <div>
                                        <span className="font-medium">Thể loại:</span>
                                        {selectedMovie.genres.map(genre => genre.name).join(', ')}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleAddFilm}
                            disabled={!selectedMovie || !selectedVideoFile}
                            className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 ${
                                selectedMovie && selectedVideoFile
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <PlusCircle size={20} />
                            Thêm Video
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateVideoFilm;
