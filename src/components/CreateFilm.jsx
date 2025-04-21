import React, { useState } from 'react';

const CreateFilm = ({ onClose }) => {
    const [newMovie, setNewMovie] = useState({
        title: '',
        description: '',
        views: 0,
        year: null,
        imgMovie: '',
        genre: {
            id: null,
            name: ''
        },
        author: [{
            fullName: '',
            birthday: '',
            gender: true,
            country: '',
            describe: '',
            avatar: null
        }],
        performer: []
    });
    const authorsList = [
        { id: 1, fullName: "Nguyễn Văn A" },
        { id: 2, fullName: "Trần Thị B" },
        { id: 3, fullName: "Lê Văn C" }
    ];


    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('genre.')) {
            const key = name.split('.')[1];
            setNewMovie(prev => ({
                ...prev,
                genre: { ...prev.genre, [key]: value }
            }));
        } else if (name.startsWith('author.')) {
            const key = name.split('.')[1];
            setNewMovie(prev => ({
                ...prev,
                author: [{ ...prev.author[0], [key]: value }]
            }));
        } else {
            setNewMovie({ ...newMovie, [name]: value });
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewMovie(prev => ({
                ...prev,
                imgMovie: URL.createObjectURL(file),
                imageFile: file // lưu thêm file nếu cần upload
            }));
        }
    };
    const handleYearChange = (e) => {
        const dateValue = e.target.value; // yyyy-MM-dd
        const yearOnly = dateValue.split('-')[0]; // Lấy phần năm
        setNewMovie(prev => ({ ...prev, year: yearOnly }));
    };


    const handleSave = () => {
        if (!newMovie.title || !newMovie.description || newMovie.views <= 0 || !newMovie.genre.name || !newMovie.author[0].fullName) {
            setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
            return;
        }

        console.log('Dữ liệu gửi lên:', newMovie);
        alert('Chức năng sẽ xử lý sau');
        onClose();
    };

    const InputField = ({ label, ...props }) => (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input {...props} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
    );

    const TextAreaField = ({ label, ...props }) => (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <textarea {...props} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">🎬 Thêm phim mới</h3>

                {error && (
                    <div className="text-sm text-red-600 mb-4 bg-red-100 p-2 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Thông tin phim */}
                    <InputField label="Tiêu đề" name="title" value={newMovie.title} onChange={handleInputChange} />
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Năm phát hành</label>
                        <input
                            type="date"
                            onChange={handleYearChange}
                            className="input"
                        />
                        {newMovie.year && (
                            <p className="text-sm text-gray-600">Đã chọn năm: {newMovie.year}</p>
                        )}
                    </div>

                    <InputField label="Lượt xem" name="views" type="number" value={newMovie.views} onChange={handleInputChange} />

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Ảnh phim (chọn từ máy)</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
                        {newMovie.imgMovie && (
                            <img src={newMovie.imgMovie} alt="Preview" className="mt-2 w-40 h-auto rounded-lg border" />
                        )}
                    </div>

                    <div className="sm:col-span-2">
                        <TextAreaField label="Mô tả" name="description" value={newMovie.description} onChange={handleInputChange} />
                    </div>
                    <InputField label="Quốc gia" name="author.country" value={newMovie.author[0].country} onChange={handleInputChange} />
                    <InputField label="Thoi Gian" name="author.country" value={newMovie.author[0].country} onChange={handleInputChange} />
                    {/* Thể loại */}
                    <h4 className="sm:col-span-2 text-lg font-semibold text-blue-700 mt-4">📂 Thể loại</h4>

                    {/* Dropdown thể loại */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">✂️ Thể loại</label>
                        <select
                            name="genre.id"
                            value={newMovie.genre.id || ''}
                            onChange={(e) => setNewMovie({
                                ...newMovie,
                                genre: { ...newMovie.genre, id: parseInt(e.target.value) }
                            })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 cursor-pointer"
                        >
                            <option value="">-- Chọn thể loại --</option>
                            <option value={1}>Hành động</option>
                            <option value={2}>Hài hước</option>
                            <option value={3}>Tâm lý</option>
                            <option value={4}>Kinh dị</option>
                            {/* Thêm các thể loại phim khác tại đây */}
                        </select>
                    </div>


                    {/* Tác giả */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">✍️ Tác giả</label>
                        <select
                            name="authorId"
                            value={newMovie.authorId || ''}
                            onChange={(e) => setNewMovie({ ...newMovie, authorId: parseInt(e.target.value) })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 appearance-none cursor-pointer"
                        >
                            <option value="">-- Chọn tác giả --</option>
                            {authorsList.map(author => (
                                <option key={author.id} value={author.id}>
                                    {author.fullName}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-0 top-8 mr-4 mt-2 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-gray-500">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    {/* Dropdown Diễn viên */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">🎬 Diễn viên</label>
                        <select
                            name="performer.id"
                            value={newMovie.performer.id || ''}
                            onChange={(e) => setNewMovie({
                                ...newMovie,
                                performer: [{ ...newMovie.performer[0], id: parseInt(e.target.value) }]
                            })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 cursor-pointer"
                        >
                            <option value="">-- Chọn diễn viên --</option>

                        </select>
                    </div>



                </div>

                {/* Nút */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateFilm;
