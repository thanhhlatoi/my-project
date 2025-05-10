import { BASE_URL } from './config.js';
import axios from 'axios';

// Tạo class quản lý token riêng cho AuthorService
class AuthManager {
    static getToken() {
        return localStorage.getItem('authToken');
    }

    static setToken(token) {
        localStorage.setItem('authToken', token);
    }

    static removeToken() {
        localStorage.removeItem('authToken');
    }

    static hasToken() {
        return !!this.getToken();
    }
}

// Tạo service riêng cho Author thay vì dùng apiService chung
const AuthorService = {
    auth: AuthManager,

    // GET all authors
    getAll: async (page = 0, limit = 10, sortBy = 'id', order = 'asc') => {
        try {
            const token = AuthManager.getToken();
            console.log("Token khi getAll:", token);

            const response = await axios.get(`${BASE_URL}/api/author`, {
                params: { page, limit, sortBy, order },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching authors:", error);
            throw error;
        }
    },

    // GET author by ID
    getById: async (id) => {
        try {
            const token = AuthManager.getToken();
            const response = await axios.get(`${BASE_URL}/api/author/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching author #${id}:`, error);
            throw error;
        }
    },

    // POST new author (with FormData support)
    add: async (formData) => {
        try {
            const token = AuthManager.getToken();
            console.log("Token khi add:", token);

            // Log để kiểm tra formData
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const response = await axios.post(`${BASE_URL}/api/author`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error adding author:", error);
            console.error("Response data:", error.response?.data);
            console.error("Status code:", error.response?.status);
            throw error;
        }
    },

    // PUT update author (with FormData support)
    update: async (id, formData) => {
        try {
            const token = AuthManager.getToken();
            console.log("Token khi update:", token);

            const response = await axios.put(`${BASE_URL}/api/author/update/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating author #${id}:`, error);
            console.error("Response data:", error.response?.data);
            throw error;
        }
    },

    // DELETE author
    delete: async (id) => {
        try {
            const token = AuthManager.getToken();
            const response = await axios.delete(`${BASE_URL}/api/author/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting author #${id}:`, error);
            throw error;
        }
    }
};

export default AuthorService;
