import axios from 'axios';
import { BASE_URL } from "./config.js";


const API_URL = `${BASE_URL}/api/movievideo`;

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
    // Chi tiết log lỗi
    if (error.response) {
      // Server trả về lỗi
      console.error('Server Error Details:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error('No response received:', error.request);
    } else {
      // Lỗi trong quá trình setup request
      console.error('Request setup error:', error.message);
    }

    // Ném lỗi để component xử lý
    throw error;
  }
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
