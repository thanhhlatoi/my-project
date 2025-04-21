import axios from 'axios';
import { BASE_URL } from "./config.js";


const API_URL = `${BASE_URL}/api/category`;

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

const add = (genre) => {
  const token = getAuthToken();  // Lấy token từ nơi lưu trữ

  return axios.post(API_URL, genre, {
    headers: {
      Authorization: `Bearer ${token}`  // Thêm token vào header
    }
  });
};

const update = (genre) => {
  const token = getAuthToken();  // Lấy token từ nơi lưu trữ

  return axios.put(`${API_URL}/update/${genre.id}`, genre, {
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
