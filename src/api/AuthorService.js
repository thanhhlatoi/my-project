import axios from 'axios';
import { BASE_URL } from './config.js';

const API_URL = `${BASE_URL}/api/author`;
const getAuthToken = () => {
    return localStorage.getItem('authToken');  // Hoặc bạn có thể thay đổi nơi lưu trữ token của bạn
};
const handleError = (error) => {
    console.error('API error:', error);
    // Bạn có thể tùy chỉnh thêm việc xử lý lỗi ở đây
    throw error;  // Thêm `throw` để các hàm gọi API có thể bắt lỗi nếu cần
};


// Hàm gọi API lấy danh sách phim
const getAll = (page = 0, limit = 10, sortBy = 'id', order = 'asc') => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    return axios.get(API_URL, {
        params: {
            page,
            limit,
            sortBy,
            order
        },
        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
        }
    });
};
const getById = (id) => {
    if (!id) {
        return Promise.reject(new Error('ID không hợp lệ'));
    }

    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    return axios.get(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
        }
    })
        .then(response => {
            // Kiểm tra và xử lý dữ liệu trả về
            if (response.data) {
                return response.data;  // Trả về dữ liệu từ response của Backend
            } else {
                throw new Error('Không tìm thấy thông tin tác giả');
            }
        })
        .catch(error => {
            handleError(error);  // Sử dụng hàm xử lý lỗi chung
            throw error;
        });
};


const add = async (author) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    try {
        const response = await axios.post(API_URL,author, {
            headers: {
                Authorization: `Bearer ${token}`,  // Thêm token vào header
            },
        });
        return response.data;  // Trả về dữ liệu sau khi thêm tác giả
    } catch (error) {
        handleError(error);  // Xử lý lỗi chung
    }
};


const update = async (author) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    try {
        const response = await axios.put(`${API_URL}/update/${author.id}`, author, {
            headers: {
                Authorization: `Bearer ${token}`,  // Thêm token vào header
            },
        });
        return response.data;  // Trả về dữ liệu sau khi cập nhật tác giả
    } catch (error) {
        handleError(error);  // Xử lý lỗi chung
    }
};

const deleteGenre = async (id) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Thêm token vào header
            },
        });
        return response.data;  // Trả về dữ liệu sau khi xóa tác giả
    } catch (error) {
        handleError(error);  // Xử lý lỗi chung
    }
};

export default {
    getAll,
    getById,
    add,
    update,
    delete: deleteGenre,
};
