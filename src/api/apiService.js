import axios from 'axios';

const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

const handleError = (error) => {
    console.error('API error:', error);

    if (error.response) {
        // Log chi tiết lỗi từ server
        console.error('Error response:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
        });

        switch (error.response.status) {
            case 401:
                console.error('Authentication error: Invalid token');
                break;
            case 403:
                console.error('Authorization error: You do not have permission');
                break;
            case 404:
                console.error('Resource not found');
                break;
            case 500:
                console.error('Internal Server Error');
                break;
            default:
                console.error('Unknown error');
        }
    } else if (error.request) {
        console.error('No response received:', error.request);
    } else {
        console.error('Error setting up request:', error.message);
    }

    throw error;
};

const createApiService = (baseUrl) => {
    const api = axios.create({
        baseURL: baseUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        // Thêm timeout để tránh request bị treo
        timeout: 10000
    });

    // Interceptor để thêm token vào mọi request
    api.interceptors.request.use(
        config => {
            const token = getAuthToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );

    // Interceptor để xử lý lỗi chung
    api.interceptors.response.use(
        response => response,
        error => {
            handleError(error);
            return Promise.reject(error);
        }
    );

    return {
        getAll: async (page = 0, limit = 10, sortBy = 'id', order = 'asc') => {
            try {
                const response = await api.get('', {
                    params: {
                        page,
                        limit,
                        sortBy,
                        order
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Error in getAll:', error);
                throw error;
            }
        },

        getById: async (id) => {
            try {
                const response = await api.get(`/${id}`);
                return response.data;
            } catch (error) {
                console.error('Error in getById:', error);
                throw error;
            }
        },

        add: async (data) => {
            try {
                const response = await api.post('', data);
                return response.data;
            } catch (error) {
                console.error('Error in add:', error);
                throw error;
            }
        },

        update: async (data) => {
            try {
                const response = await api.put(`/update/${data.id}`, data);
                return response.data;
            } catch (error) {
                console.error('Error in update:', error);
                throw error;
            }
        },

        delete: async (id) => {
            try {
                const response = await api.delete(`/${id}`);
                return response.data;
            } catch (error) {
                console.error('Error in delete:', error);
                throw error;
            }
        }
    };
};

export default createApiService;
