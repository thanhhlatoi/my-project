import axios from 'axios';
import { BASE_URL } from './config.js';

const API_URL = `${BASE_URL}/api/performer`;

// Hàm lấy token từ localStorage (hoặc sessionStorage, hoặc state)
const getAuthToken = () => {
    return localStorage.getItem('authToken');  // Hoặc bạn có thể thay đổi nơi lưu trữ token của bạn
};

// Hàm xử lý lỗi chung
const handleError = (error) => {
    console.error('API error:', error);
    // Bạn có thể tùy chỉnh thêm việc xử lý lỗi ở đây
    throw error;  // Thêm `throw` để các hàm gọi API có thể bắt lỗi nếu cần
};

const getAll = async (page = 0, limit = 10, sortBy = 'id', order = 'asc') => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    try {
        const response = await axios.get(API_URL, {
            params: {
                page,
                limit,
                sortBy,
                order,
            },
            headers: {
                Authorization: `Bearer ${token}`,  // Thêm token vào header
            },
        });
        return response.data;  // Trả về dữ liệu
    } catch (error) {
        handleError(error);  // Xử lý lỗi chung
    }
};

const add = async (performer) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    try {
        const response = await axios.post(API_URL, performer, {
            headers: {
                Authorization: `Bearer ${token}`,  // Thêm token vào header
            },
        });
        return response.data;  // Trả về dữ liệu sau khi thêm tác giả
    } catch (error) {
        handleError(error);  // Xử lý lỗi chung
    }
};

const update = async (performer) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    try {
        const response = await axios.put(`${API_URL}/update/${performer.id}`, performer, {
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
    add,
    update,
    delete: deleteGenre,
};
