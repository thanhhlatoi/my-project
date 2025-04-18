// src/pages/FlimPage.jsx
import React, { useEffect, useState } from 'react';
import FilmService from '../api/FilmService.js';

const FlimPage = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = async () => {
        try {
            const response = await FilmService.getAll(page, 10, 'id', 'asc');
            setMovies(response.data.data.content);  // dữ liệu phim
            setTotalPages(response.data.data.totalPages);  // tổng số trang
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phim:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Danh sách phim</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {movies.map((movie) => (
                    <div key={movie.id} className="bg-white rounded shadow p-2">
                        <img
                            src={`http://192.168.100.193:8082/api/movieProduct/view?bucketName=thanh&path=${movie.imgMovie}`}  // Đảm bảo API backend cho phép truy cập ảnh

                            alt={movie.title}
                            className="w-full h-40 object-cover rounded mb-2"
                        />
                        <h2 className="font-semibold">{movie.title}</h2>
                        <p className="text-sm text-gray-700">{movie.description}</p>
                        <p className="text-xs text-gray-500">Thể loại: {movie.genre?.name}</p>
                        <p className="text-xs text-gray-500">Lượt xem: {movie.views}</p>
                    </div>
                ))}
            </div>

            {/* Phân trang đơn giản */}
            <div className="mt-4 flex justify-center gap-2">
                <button
                    disabled={page <= 0}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Trước
                </button>
                <span className="px-3 py-1">Trang {page + 1} / {totalPages}</span>
                <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default FlimPage;
