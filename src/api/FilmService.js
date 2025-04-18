import axios from 'axios';

const API_URL = 'http://192.168.100.193:8082/api/movieProduct';

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

const add = (film) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    return axios.post(API_URL, film, {
        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
        }
    });
};

const update = (film) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    return axios.put(`${API_URL}/update/${film.id}`, film, {
        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
        }
    });
};

const deleteGenre = (id) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
        }
    });
};

export default {
    getAll,
    add,
    update,
    delete: deleteGenre
};
