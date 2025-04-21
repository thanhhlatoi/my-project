import axios from 'axios';
import { BASE_URL } from "./config.js";
const API_URL = `${BASE_URL}/api/movieProduct`;

// Hàm lấy token từ localStorage (hoặc sessionStorage, hoặc state)
const getAuthToken = () => {
    return localStorage.getItem('authToken');  // Hoặc bạn có thể thay đổi nơi lưu trữ token của bạn
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

// Hàm gọi API lấy danh sách phim
const getAll = (page = 0, limit = 10, sortBy = 'id', order = 'asc') => {
    return request('get', '', null, { page, limit, sortBy, order });
};

// Hàm thêm phim mới
const add = (film) => {
    return request('post', '', film);
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
