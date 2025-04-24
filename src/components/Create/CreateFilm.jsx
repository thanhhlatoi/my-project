import React, { useEffect, useState } from 'react';
import GenreService from "../../api/GenreService.js";
import PerformerService from "../../api/PerformerService.js";
import AuthorService from "../../api/AuthorService.js";

// Component UI cơ bản
const InputField = ({ label, ...props }) => (
    <div className="flex flex-col gap-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input {...props} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" />
    </div>
);

const TextAreaField = ({ label, ...props }) => (
    <div className="flex flex-col gap-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea {...props} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" />
    </div>
);

const SelectField = ({ label, value, onChange, options, loading, placeholder }) => (
    <div className="flex flex-col gap-1 relative">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select
            value={value}
            onChange={onChange}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 appearance-none cursor-pointer transition-all duration-200"
        >
            <option value="">{placeholder || `-- Chọn ${label} --`}</option>
            {loading ? (
                <option value="" disabled>Đang tải dữ liệu...</option>
            ) : (
                options.map(option => (
                    <option key={option.id} value={option.id}>
                        {option.name || option.fullName}
                    </option>
                ))
            )}
        </select>
        <div className="absolute right-0 top-8 mr-4 mt-2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    </div>
);

const Tag = ({ id, text, onRemove }) => (
    <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full transition-all hover:bg-blue-200">
        <span>{text}</span>
        <button
            type="button"
            onClick={() => onRemove(id)}
            className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
            aria-label={`Remove ${text}`}
        >
            ✕
        </button>
    </div>
);

// Component hiển thị danh sách đã chọn (Tag)
const SelectedItems = ({ items, onRemove, emptyMessage }) => (
    <div className="min-h-[60px] p-3 bg-white rounded-lg border border-gray-200">
        {items.length > 0 ? (
            <div className="flex flex-wrap gap-2">
                {items.map(item => (
                    <Tag
                        key={item.id}
                        id={item.id}
                        text={item.name || item.fullName}
                        onRemove={onRemove}
                    />
                ))}
            </div>
        ) : (
            <p className="text-sm text-gray-500">{emptyMessage}</p>
        )}
    </div>
);

// Component phần multi-select (thể loại, diễn viên)
const MultiSelectSection = ({
                                title,
                                bgColor,
                                items,
                                selectedItems,
                                selectedValue,
                                setSelectedValue,
                                onAdd,
                                onRemove,
                                loading,
                                placeholder,
                                emptyMessage
                            }) => {
    // Xác định các class dựa trên bgColor
    let bgClasses = "bg-gray-50";
    let buttonClasses = "bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300";
    let textClasses = "text-gray-700";
    let borderClasses = "border-gray-100";

    // Dựa vào bgColor để xác định các class cụ thể
    if (bgColor === "bg-purple-50") {
        bgClasses = "bg-purple-50";
        buttonClasses = "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300";
        textClasses = "text-purple-700";
        borderClasses = "border-purple-100";
    } else if (bgColor === "bg-red-50") {
        bgClasses = "bg-red-50";
        buttonClasses = "bg-red-600 hover:bg-red-700 disabled:bg-red-300";
        textClasses = "text-red-700";
        borderClasses = "border-red-100";
    } else if (bgColor === "bg-blue-50") {
        bgClasses = "bg-blue-50";
        buttonClasses = "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300";
        textClasses = "text-blue-700";
        borderClasses = "border-blue-100";
    }

    return (
        <div className={`p-4 ${bgClasses} rounded-lg border ${borderClasses}`}>
            <h4 className={`font-medium ${textClasses} mb-3`}>{title}</h4>
            <div className="flex space-x-2 mb-3">
                <select
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 cursor-pointer"
                    disabled={loading}
                >
                    <option value="">{placeholder}</option>
                    {items && items.length > 0 ? (
                        items.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.name || item.fullName}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>Đang tải dữ liệu...</option>
                    )}
                </select>
                <button
                    type="button"
                    onClick={onAdd}
                    className={`px-4 py-2 ${buttonClasses} text-white rounded-lg transition-colors duration-200 flex-shrink-0`}
                    disabled={!selectedValue || loading}
                >
                    Thêm
                </button>
            </div>

            {/* Hiển thị trạng thái loading */}
            {loading && (
                <div className={`flex items-center ${textClasses} text-sm`}>
                    <svg className={`animate-spin -ml-1 mr-2 h-4 w-4 ${textClasses}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang tải dữ liệu...</span>
                </div>
            )}

            {/* Danh sách đã chọn */}
            <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Đã chọn:</label>
                <SelectedItems
                    items={selectedItems}
                    onRemove={onRemove}
                    emptyMessage={emptyMessage}
                />
            </div>
        </div>
    );
};

// Component form section
const FormSection = ({ title, bgColor, children }) => {
    // Xác định các class dựa trên bgColor
    let textClass = "text-gray-700";
    let borderClass = "border-gray-100";

    if (bgColor === "bg-blue-50") {
        textClass = "text-blue-700";
        borderClass = "border-blue-100";
    } else if (bgColor === "bg-green-50") {
        textClass = "text-green-700";
        borderClass = "border-green-100";
    } else if (bgColor === "bg-yellow-50") {
        textClass = "text-yellow-700";
        borderClass = "border-yellow-100";
    } else if (bgColor === "bg-gray-50") {
        textClass = "text-gray-700";
        borderClass = "border-gray-100";
    }

    return (
        <div className={`p-4 ${bgColor} rounded-lg border ${borderClass}`}>
            <h4 className={`font-medium ${textClass} mb-3`}>{title}</h4>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};

// Component chính
const CreateFilm = ({ onClose }) => {
    // State cho dữ liệu phim
    const [newMovie, setNewMovie] = useState({
        title: '',
        description: '',
        views: 0,
        year: null,
        imgMovie: '',
        genres: [],
        author: {
            fullName: '',
            birthday: '',
            gender: '',
            country: '',
            describe: '',
            avatar: null
        },
        performer: []
    });



    // State cho danh sách dữ liệu từ API
    const [genresList, setGenresList] = useState([]);
    const [performerList, setPerformerList] = useState([]);
    const [authorList, setAuthorList] = useState([]);
    // State cho giá trị đang chọn
    const [selectedPerformer, setSelectedPerformer] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedAuthor, setSelectedAuthor] = useState("");
    // State cho trạng thái loading
    const [loading, setLoading] = useState(false);
    const [loadingGenres, setLoadingGenres] = useState(false);
    const [loadingPerformers, setLoadingPerformers] = useState(false);
    const [loadingAuthor, setLoadingAuthor] = useState(false);

    // State cho thông báo lỗi
    const [error, setError] = useState('');

    // Fetch dữ liệu từ API khi component mount
    useEffect(() => {
        const fetchGenres = async () => {
            setLoadingGenres(true);
            try {
                const response = await GenreService.getAll(0, 100, 'id', 'asc');
                const genresArray = response?.data?.data?.content;
                console.log(response);
                if (Array.isArray(genresArray)) {
                    setGenresList(genresArray);
                } else {
                    setGenresList([]);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách thể loại:', error);
            } finally {
                setLoadingGenres(false);
            }
        };

        const fetchPerformer = async () => {
            setLoadingPerformers(true);
            try {
                const response = await PerformerService.getAll(0, 100, 'id', 'asc');
                const performerArray = response?.data?.data?.content; // <-- response.data chính là content
                console.log(response);

                if (Array.isArray(performerArray)) {
                    setPerformerList(performerArray);
                } else {
                    setPerformerList([]);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách diễn viên:', error);
            } finally {
                setLoadingPerformers(false);
            }
        };

        const fetchAuthor = async () => {
            setLoadingAuthor(true);
            try {
                const response = await AuthorService.getAll(0, 100, 'id', 'asc');
                console.log('Author response:', response);

                // Kiểm tra cấu trúc response và trích xuất dữ liệu
                if (response?.data?.data?.content) {
                    setAuthorList(response.data.data.content);
                } else {
                    setAuthorList([]);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tác giả:', error);
            } finally {
                setLoadingAuthor(false); // Sửa lại từ setLoadingPerformers
            }
        };

        // Gọi cả hai API đồng thời
        setLoading(true);
        Promise.all([fetchGenres(), fetchPerformer(),fetchAuthor()])
            .finally(() => setLoading(false));
    }, []);

    // Hàm xử lý sự kiện input thay đổi
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('author.')) {
            const key = name.split('.')[1];
            setNewMovie(prev => ({
                ...prev,
                author: { ...prev.author, [key]: value }
            }));
        } else {
            setNewMovie(prev => ({ ...prev, [name]: value }));
        }
    };

    // Xử lý chọn hình ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewMovie(prev => ({
                ...prev,
                imgMovie: URL.createObjectURL(file),
                imageFile: file
            }));
        }
    };

    // Xử lý thay đổi năm
    const handleYearChange = (e) => {
        const dateValue = e.target.value;
        const yearOnly = dateValue.split('-')[0];
        setNewMovie(prev => ({ ...prev, year: yearOnly }));
    };

    // Hàm thêm thể loại vào danh sách
    const handleAddGenre = () => {
        if (!selectedGenre) return;

        const genreId = parseInt(selectedGenre);
        const genreToAdd = genresList.find(g => g.id === genreId);
        const alreadyAdded = newMovie.genres.some(g => g.id === genreId);

        if (genreToAdd && !alreadyAdded) {
            setNewMovie(prev => ({
                ...prev,
                genres: [...prev.genres, genreToAdd]
            }));
            setSelectedGenre("");
        }
    };

    // Hàm thêm diễn viên vào danh sách
    const handleAddPerformer = () => {
        if (!selectedPerformer) return;

        const performerId = parseInt(selectedPerformer);
        const performerToAdd = performerList.find(p => p.id === performerId);
        const alreadyAdded = newMovie.performer.some(p => p.id === performerId);

        if (performerToAdd && !alreadyAdded) {
            setNewMovie(prev => ({
                ...prev,
                performer: [...prev.performer, performerToAdd]
            }));
            setSelectedPerformer("");
        }
    };

    // Hàm xóa thể loại khỏi danh sách
    const handleRemoveGenre = (genreId) => {
        setNewMovie(prev => ({
            ...prev,
            genres: prev.genres.filter(g => g.id !== genreId)
        }));
    };

    // Hàm xóa diễn viên khỏi danh sách
    const handleRemovePerformer = (performerId) => {
        setNewMovie(prev => ({
            ...prev,
            performer: prev.performer.filter(p => p.id !== performerId)
        }));
    };

    // Xử lý lưu dữ liệu
    const handleSave = () => {
        if (!newMovie.title || !newMovie.description || newMovie.views <= 0 ||
            newMovie.genres.length === 0 || !newMovie.author.fullName) {
            setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
            return;
        }

        console.log('Dữ liệu gửi lên:', newMovie);
        alert('Chức năng sẽ xử lý sau');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="border-b pb-4 mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                        <span className="text-2xl mr-2">🎬</span> Thêm phim mới
                    </h3>
                    {error && (
                        <div className="mt-4 text-sm text-red-600 p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}
                </div>

                {/* Loading indicator */}
                {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                            <p className="mt-4 text-blue-600 font-medium">Đang tải dữ liệu...</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Cột trái - Thông tin cơ bản */}
                    <div className="space-y-5">
                        {/* Thông tin cơ bản */}
                        <FormSection title="Thông tin cơ bản" bgColor="bg-blue-50">
                            <InputField
                                label="Tiêu đề"
                                name="title"
                                value={newMovie.title}
                                onChange={handleInputChange}
                                placeholder="Nhập tiêu đề phim"
                            />

                            <div className="flex flex-col gap-1">
                                <label className="block text-sm font-medium text-gray-700">Năm phát hành</label>
                                <input
                                    type="date"
                                    onChange={handleYearChange}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                />
                                {newMovie.year && (
                                    <p className="text-xs text-gray-600 mt-1">Đã chọn năm: {newMovie.year}</p>
                                )}
                            </div>

                            <InputField
                                label="Lượt xem"
                                name="views"
                                type="number"
                                value={newMovie.views}
                                onChange={handleInputChange}
                                min="0"
                                placeholder="0"
                            />
                        </FormSection>

                        {/* Hình ảnh */}
                        <FormSection title="Hình ảnh" bgColor="bg-gray-50">
                            <div className="flex flex-col gap-1">
                                <label className="block text-sm font-medium text-gray-700">Ảnh phim (chọn từ máy)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="text-sm p-2 border border-dashed border-gray-300 rounded-lg"
                                />
                                {newMovie.imgMovie ? (
                                    <div className="mt-3">
                                        <img
                                            src={newMovie.imgMovie}
                                            alt="Preview"
                                            className="w-full h-auto max-h-40 object-cover rounded-lg border shadow-sm"
                                        />
                                    </div>
                                ) : (
                                    <div className="mt-2 bg-gray-100 rounded-lg p-4 flex items-center justify-center h-32 text-gray-400">
                                        Chưa có ảnh
                                    </div>
                                )}
                            </div>
                        </FormSection>
                    </div>

                    {/* Cột phải - Mô tả và tác giả */}
                    <div className="space-y-5">
                        {/* Thông tin mô tả */}
                        <FormSection title="Thông tin mô tả" bgColor="bg-green-50">
                            <TextAreaField
                                label="Mô tả"
                                name="description"
                                value={newMovie.description}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Nhập mô tả về phim..."
                            />
                        </FormSection>

                        {/* Thông tin tác giả */}
                        <FormSection title="Thông tin tác giả" bgColor="bg-yellow-50">
                            <SelectField
                                label="Tác giả"
                                value={selectedAuthor}
                                onChange={(e) => {
                                    const authorId = e.target.value;
                                    if (authorId) {
                                        // Tìm author trong danh sách
                                        const selectedAuthorObj = authorList.find(a => a.id.toString() === authorId);
                                        if (selectedAuthorObj) {
                                            // Cập nhật author trong newMovie
                                            setNewMovie(prev => ({
                                                ...prev,
                                                author: selectedAuthorObj
                                            }));
                                        }
                                        setSelectedAuthor(authorId);
                                    } else {
                                        // Reset author khi không chọn
                                        setNewMovie(prev => ({
                                            ...prev,
                                            author: {
                                                fullName: '',
                                                birthday: '',
                                                gender: '',
                                                country: '',
                                                describe: '',
                                                avatar: null
                                            }
                                        }));
                                        setSelectedAuthor("");
                                    }
                                }}
                                options={authorList}
                                loading={loadingAuthor}
                                placeholder="Chọn tác giả"
                            />

                            {/* Hiển thị thông tin tác giả đã chọn */}
                            {newMovie.author.fullName && (
                                <div className="mt-2 p-3 bg-gray-50 rounded">
                                    <p className="text-sm"><strong>Tác giả đã chọn:</strong> {newMovie.author.fullName}</p>
                                    <p className="text-sm"><strong>Quốc gia:</strong> {newMovie.author.country || 'N/A'}</p>
                                </div>
                            )}
                        </FormSection>
                    </div>

                    {/* Thể loại - Chiếm toàn bộ chiều rộng */}
                    <div className="sm:col-span-2">
                        <MultiSelectSection
                            title="Thể loại phim"
                            bgColor="bg-purple-50"
                            items={genresList}
                            selectedItems={newMovie.genres}
                            selectedValue={selectedGenre}
                            setSelectedValue={setSelectedGenre}
                            onAdd={handleAddGenre}
                            onRemove={handleRemoveGenre}
                            loading={loadingGenres}
                            placeholder="-- Chọn thể loại --"
                            emptyMessage="Chưa có thể loại nào được chọn"
                        />
                    </div>

                    {/* Diễn viên - Chiếm toàn bộ chiều rộng */}
                    <div className="sm:col-span-2">
                        <MultiSelectSection
                            title="Diễn viên"
                            bgColor="bg-red-50"
                            items={performerList}
                            selectedItems={newMovie.performer}
                            selectedValue={selectedPerformer}
                            setSelectedValue={setSelectedPerformer}
                            onAdd={handleAddPerformer}
                            onRemove={handleRemovePerformer}
                            loading={loadingPerformers}
                            placeholder="-- Chọn diễn viên --"
                            emptyMessage="Chưa có diễn viên nào được chọn"
                        />
                    </div>
                </div>

                {/* Nút điều khiển */}
                <div className="mt-8 pt-4 border-t flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateFilm;
