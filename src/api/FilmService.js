import axios from 'axios';
import { BASE_URL } from "./config.js";
const API_URL = `${BASE_URL}/api/movieProduct`;

// Hàm lấy token từ localStorage (hoặc sessionStorage, hoặc state)
const getAuthToken = () => {
    return localStorage.getItem('authToken');  // Hoặc bạn có thể thay đổi nơi lưu trữ token của bạn
};

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

// Hàm chung để thực hiện các request với token
const request = async (method, url, data = null, params = null) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    try {
        const response = await axios({
            method,
            url: `${API_URL}${url}`,
            data,
            params,
            headers: {
                Authorization: `Bearer ${token}`  // Thêm token vào header
            }
        });
        return response.data; // Trả về dữ liệu response
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error; // Ném lỗi để caller có thể xử lý
    }
};



//add
const add = async (formData) => {
    const token = getAuthToken();

    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi chi tiết khi gửi phim:', error);

        // In ra chi tiết lỗi từ server
        if (error.response) {
            console.error('Dữ liệu lỗi:', error.response.data);
            console.error('Trạng thái lỗi:', error.response.status);
            console.error('Headers lỗi:', error.response.headers);
        }

        throw error;
    }
};

// Hàm cập nhật phim
const update = (film) => {
    return request('put', `/update/${film.id}`, film);
};

// Hàm xóa thể loại phim
const deleteGenre = (id) => {
    return request('delete', `/${id}`);
};

// Hàm lấy chi tiết phim theo ID
const getById = (id) => {
    return request('get', `/${id}`);
};

export default {
    getAll,
    add,
    update,
    delete: deleteGenre,
    getById  // Đảm bảo thêm hàm getById vào export
};
