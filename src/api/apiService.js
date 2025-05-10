import axios from 'axios';

class AuthTokenManager {
    // Static method to get the auth token
    static getToken() {
        return localStorage.getItem('authToken');
    }

    // Static method to set the auth token
    static setToken(token) {
        localStorage.setItem('authToken', token);
    }

    // Static method to remove the auth token
    static removeToken() {
        localStorage.removeItem('authToken');
    }

    // Static method to check if token exists
    static hasToken() {
        return !!this.getToken();
    }
}

const handleError = (error) => {
    console.error('API error:', error);

    if (error.response) {
        // Detailed error logging from server
        console.error('Error response:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
        });

        switch (error.response.status) {
            case 401:
                console.error('Authentication error: Invalid or expired token');
                // Optional: Trigger logout or token refresh logic
                AuthTokenManager.removeToken();
                // Redirect to login or refresh token
                break;
            case 403:
                console.error('Authorization error: Insufficient permissions');
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
        // Add timeout to prevent hanging requests
        timeout: 10000
    });

    // Interceptor to add token to every request
    api.interceptors.request.use(
        config => {
            const token = AuthTokenManager.getToken();
            console.log('Token being sent:', token); // Thêm log này
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );

    // Response interceptor for global error handling
    api.interceptors.response.use(
        response => response,
        error => {
            handleError(error);
            return Promise.reject(error);
        }
    );

    return {
        // Expose token management methods
        auth: AuthTokenManager,

        getAll: async (page = 0, limit = 10, sortBy = 'id', order = 'asc') => {
            // Kiểm tra token trước khi thực hiện request
            if (!AuthTokenManager.hasToken()) {
                throw new Error('No authentication token found');
            }

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
            // Kiểm tra token trước khi thực hiện request
            if (!AuthTokenManager.hasToken()) {
                throw new Error('No authentication token found');
            }

            try {
                const response = await api.get(`/${id}`);
                return response.data;
            } catch (error) {
                console.error('Error in getById:', error);
                throw error;
            }
        },

        add: async (data) => {
            // Kiểm tra token trước khi thực hiện request
            if (!AuthTokenManager.hasToken()) {
                throw new Error('No authentication token found');
            }

            try {
                // Sử dụng api đã được cấu hình với interceptor thay vì axios trực tiếp
                const response = await api.post('', data);
                return response.data;
            } catch (error) {
                console.error('Error in add:', error);
                throw error;
            }
        },

        update: async (data) => {
            // Kiểm tra token trước khi thực hiện request
            if (!AuthTokenManager.hasToken()) {
                throw new Error('No authentication token found');
            }

            try {
                const response = await api.put(`/update/${data.id}`, data);
                return response.data;
            } catch (error) {
                console.error('Error in update:', error);
                throw error;
            }
        },

        delete: async (id) => {
            // Kiểm tra token trước khi thực hiện request
            if (!AuthTokenManager.hasToken()) {
                throw new Error('No authentication token found');
            }

            try {
                const response = await api.delete(`/delete/${id}`);
                return response.data;
            } catch (error) {
                console.error('Error in delete:', error);
                throw error;
            }
        }
    };
};

export default createApiService;
