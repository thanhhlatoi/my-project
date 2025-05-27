import axios from 'axios';
import { BASE_URL } from "./config.js";

// Thay đổi đường dẫn API để phù hợp với controller mới
const API_URL = `${BASE_URL}/api/videos`;

// Hàm lấy token từ localStorage (hoặc sessionStorage, hoặc state)
const getAuthToken = () => {
  return localStorage.getItem('authToken');  // Hoặc bạn có thể thay đổi nơi lưu trữ token của bạn
};

// Lấy tất cả video với phân trang và tìm kiếm
const getAll = async (page = 0, size = 10, sortBy = 'id', order = 'asc') => {
  const token = getAuthToken();

  try {
    // Log để debug
    console.log(`Calling API: ${API_URL} with params:`, { page, size, sortBy, order });

    // Đơn giản hóa tham số để tránh lỗi
    const params = {
      page,
      size,
      sortBy: Array.isArray(sortBy) ? sortBy[0] : sortBy,
      order
    };

    const response = await axios.get(API_URL, {
      params,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined
      }
    });

    // Log phản hồi để debug
    console.log('API response:', response);

    return response;
  } catch (error) {
    console.error('Error in getAll:', error);

    // Log chi tiết lỗi
    if (error.response) {
      console.error('Response error data:', error.response.data);
      console.error('Response status:', error.response.status);
    }

    throw error;
  }
};

// Lấy video theo ID
const getById = (id) => {
  const token = getAuthToken();

  return axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    }
  });
};

// Thêm video mới - chuyển sang việc sử dụng FormData
const add = async (formData) => {
  const token = getAuthToken();

  // Debug: In ra tất cả các cặp key-value trong FormData
  console.log('Debug - FormData contents:');
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }

  try {
    // Sử dụng fetch thay vì axios để có nhiều kiểm soát hơn
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,  // Gửi FormData trực tiếp
      headers: {
        'Authorization': `Bearer ${token}`
        // KHÔNG đặt Content-Type khi dùng FormData với fetch
      }
    });

    console.log('Response status:', response.status);

    // Đọc phản hồi dưới dạng text trước
    const responseText = await response.text();
    console.log('Response text:', responseText);

    // Nếu có JSON, chuyển đổi
    let data;
    try {
      data = JSON.parse(responseText);
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      data = { text: responseText };
    }

    if (!response.ok) {
      throw {
        status: response.status,
        data: data,
        message: `Server responded with status ${response.status}`
      };
    }

    return { data };
  } catch (error) {
    console.error('Error details:', error);
    throw error;
  }
};

// Cập nhật video
const update = async (id, movieProductId, file, updateWatchedTime = false) => {
  const token = getAuthToken();

  // Tạo FormData
  const formData = new FormData();

  if (movieProductId) {
    formData.append('movieProductId', movieProductId);
  }

  if (file) {
    formData.append('file', file);
  }

  formData.append('updateWatchedTime', updateWatchedTime);

  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    // Chi tiết log lỗi
    if (error.response) {
      console.error('Server Error Details:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    throw error;
  }
};

// Xóa video
const deleteVideo = (id) => {
  const token = getAuthToken();

  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    }
  });
};

// Cập nhật thumbnail
const updateThumbnail = (id, thumbnailPath) => {
  const token = getAuthToken();

  return axios.patch(`${API_URL}/${id}/thumbnail`, null, {
    params: { thumbnailPath },
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    }
  });
};

// Lấy video theo trạng thái
const getByStatus = (status) => {
  const token = getAuthToken();

  return axios.get(`${API_URL}/status/${status}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    }
  });
};

// Lấy video theo định dạng file
const getByFormat = (format) => {
  const token = getAuthToken();

  return axios.get(`${API_URL}/format/${format}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    }
  });
};

// Lấy danh sách video mới nhất
const getRecent = () => {
  const token = getAuthToken();

  return axios.get(`${API_URL}/recent`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    }
  });
};

export default {
  getAll,
  getById,
  add,
  update,
  delete: deleteVideo,
  updateThumbnail,
  getByStatus,
  getByFormat,
  getRecent
};
