import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FilmService from '../api/FilmService';
import Layout from '../layouts/layout.jsx';

const FilmWatch = () => {
    const { id } = useParams(); // Lấy id từ URL
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await FilmService.getById(id); // Gọi API với id phim
                setMovie(response.data); // Lưu thông tin phim vào state
            } catch (error) {
                console.error("Lỗi khi lấy phim:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-10 text-blue-600 font-medium">Đang tải video...</div>
            </Layout>
        );
    }

    if (!movie) {
        return (
            <Layout>
                <div className="text-center py-10 text-red-600 font-medium">Không tìm thấy phim!</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-3xl mx-auto mt-6 bg-white rounded-2xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-blue-700 mb-4">{movie.title}</h1>
                <video
                    controls
                    className="w-full h-64 object-cover rounded mb-4"
                    src={`http://192.168.100.193:8082/api/movieProduct/view?bucketName=thanh&path=${movie.videoPath}`} // Thay videoPath theo API thực tế
                >
                    Trình duyệt của bạn không hỗ trợ video tag.
                </video>
            </div>
        </Layout>
    );
};

export default FilmWatch;
