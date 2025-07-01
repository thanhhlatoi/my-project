// apiService.js
import axios from 'axios';

// Hàm lấy token từ localStorage (hoặc sessionStorage, hoặc state)
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

/**
 * Tạo API service với các phương thức CRUD cơ bản
 * @param {string} baseURL - Base URL cho API endpoint
 * @returns {Object} - Object chứa các phương thức API
 */
const createApiService = (baseURL) => {
    // Kiểm tra đầu vào
    if (!baseURL) {
        console.error('baseURL không được cung cấp cho createApiService');
        throw new Error('baseURL là bắt buộc');
    }

    // Tạo instance axios
    const apiClient = axios.create({
        baseURL: baseURL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Thêm interceptor để tự động thêm token vào header
    apiClient.interceptors.request.use(
        (config) => {
            const token = getAuthToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Auth manager
    const auth = {
        getToken: getAuthToken,
        setToken: (token) => localStorage.setItem('authToken', token),
        removeToken: () => localStorage.removeItem('authToken'),
        hasToken: () => !!getAuthToken()
    };

    // Các phương thức CRUD cơ bản
    return {
        // Lấy tất cả items, có hỗ trợ phân trang
        getAll: async (page = 0, limit = 10, sortBy = 'id', order = 'asc', search = '') => {
            try {
                const params = { page, limit, sortBy, order };
                if (search && search.trim()) {
                    params.search = search.trim();
                }
                
                console.log('API params:', params);
                const response = await apiClient.get('', { params });
                return response.data;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách:', error);
                throw error;
            }
        },

        // Lấy item theo ID
        getById: async (id) => {
            try {
                const response = await apiClient.get(`/${id}`);
                return response.data;
            } catch (error) {
                console.error(`Lỗi khi lấy item ID=${id}:`, error);
                throw error;
            }
        },

        // Thêm item mới
        add: async (item) => {
            try {
                // Kiểm tra xem item có phải là FormData không
                if (item instanceof FormData) {
                    // Nếu là FormData, đổi Content-Type
                    const response = await apiClient.post('', item, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    return response.data;
                } else {
                    // Nếu là JSON bình thường
                    const response = await apiClient.post('', item);
                    return response.data;
                }
            } catch (error) {
                console.error('Lỗi khi thêm item:', error);
                throw error;
            }
        },

        // Cập nhật item
        update: async (id, item) => {
            try {
                // Kiểm tra xem item có phải là FormData không
                if (item instanceof FormData) {
                    // Nếu là FormData, đổi Content-Type
                    const response = await apiClient.put(`/update/${id}`, item, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    return response.data;
                } else {
                    // Nếu là JSON bình thường
                    const response = await apiClient.put(`/update/${id}`, item);
                    return response.data;
                }
            } catch (error) {
                console.error(`Lỗi khi cập nhật item ID=${id}:`, error);
                throw error;
            }
        },

        // Xóa item
        delete: async (id) => {
            try {
                const response = await apiClient.delete(`/delete/${id}`);
                return response.data;
            } catch (error) {
                console.error(`Lỗi khi xóa item ID=${id}:`, error);
                throw error;
            }
        },

        // Export auth manager
        auth
    };
};

export default createApiService;
