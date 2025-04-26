import React from 'react';
import { X, PlusCircle } from 'lucide-react';

const CreateVideoFilm = ({
                             isOpen,
                             onClose,
                             newFilm,
                             setNewFilm,
                             genres,
                             onAddFilm
                         }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Thêm Phim Mới</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tiêu đề phim
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập tiêu đề phim"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={newFilm.title}
                            onChange={(e) => setNewFilm({...newFilm, title: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Đường dẫn video
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập đường dẫn video"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={newFilm.videoFilm}
                            onChange={(e) => setNewFilm({...newFilm, videoFilm: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Thời lượng
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập thời lượng phim"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={newFilm.duration}
                            onChange={(e) => setNewFilm({...newFilm, duration: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Thể loại
                        </label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={newFilm.genre}
                            onChange={(e) => setNewFilm({...newFilm, genre: e.target.value})}
                        >
                            <option value="">Chọn thể loại</option>
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onAddFilm}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <PlusCircle size={20} />
                            Thêm Phim
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateVideoFilm;
