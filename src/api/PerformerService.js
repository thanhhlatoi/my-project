import { BASE_URL } from './config.js';
import axios from 'axios';

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
const PerformerService = {
    auth: AuthManager,

    // GET all performers
    getAll: async (page = 0, limit = 10, sortBy = 'id', order = 'asc') => {
        try {
            const token = AuthManager.getToken();
            console.log("Token khi getAll:", token);

            const response = await axios.get(`${BASE_URL}/api/performer`, {
                params: { page, limit, sortBy, order },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching performers:", error);
            throw error;
        }
    },

    // GET performer by ID
    getById: async (id) => {
        try {
            const token = AuthManager.getToken();
            const response = await axios.get(`${BASE_URL}/api/performer/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching performer #${id}:`, error);
            throw error;
        }
    },

    // POST new performer (with FormData support)
    add: async (formData) => {
        try {
            const token = AuthManager.getToken();
            console.log("Token khi add:", token);

            // Log để kiểm tra formData
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const response = await axios.post(`${BASE_URL}/api/performer`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error adding performer:", error);
            console.error("Response data:", error.response?.data);
            console.error("Status code:", error.response?.status);
            throw error;
        }
    },

    // PUT update performer (with FormData support)
    update: async (id, formData) => {
        try {
            const token = AuthManager.getToken();
            console.log("Token khi update:", token);

            const response = await axios.put(`${BASE_URL}/api/performer/update/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating performer #${id}:`, error);
            console.error("Response data:", error.response?.data);
            throw error;
        }
    },

    // DELETE performer
    delete: async (id) => {
        try {
            const token = AuthManager.getToken();
            const response = await axios.delete(`${BASE_URL}/api/performer/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting performer #${id}:`, error);
            throw error;
        }
    }
};

export default PerformerService;

