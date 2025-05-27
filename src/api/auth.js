// auth.js
import axios from 'axios';

// API endpoint cho authentication
const API_URL = 'http://192.168.1.73:8082/api/auth';

// Hàm login - gọi API đăng nhập
const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password
        });

        return response.data;
    } catch (error) {
        console.error('Login error:', error);

        // Trả về lỗi để component xử lý
        if (error.response) {
            // Lỗi từ server (status code không phải 2xx)
            throw new Error(error.response.data.message || 'Đăng nhập thất bại');
        } else if (error.request) {
            // Không nhận được phản hồi từ server
            throw new Error('Không thể kết nối đến server');
        } else {
            // Lỗi khi thiết lập request
            throw new Error('Lỗi khi thực hiện yêu cầu đăng nhập');
        }
    }
};

// AuthService class
class AuthService {
    // Lưu thông tin đăng nhập vào localStorage
    static saveAuth(authResponse) {
        if (!authResponse) return false;

        try {
            // Lưu token, refreshToken và user
            localStorage.setItem('accessToken', authResponse.token);
            localStorage.setItem('refreshToken', authResponse.refreshToken);
            localStorage.setItem('expiresIn', authResponse.expiresIn);
            localStorage.setItem('user', JSON.stringify(authResponse.user));

            // Tính thời gian hết hạn
            const expiresAt = new Date().getTime() + (authResponse.expiresIn * 1000);
            localStorage.setItem('expiresAt', expiresAt);

            return true;
        } catch (error) {
            console.error('Error saving auth data:', error);
            return false;
        }
    }

    // Kiểm tra người dùng hiện tại có phải ADMIN không
    static isAdmin() {
        const user = this.getCurrentUser();
        if (!user || !user.roles) return false;

        // Kiểm tra nếu có vai trò ADMIN
        return user.roles.some(role => role.name === 'ADMIN');
    }

    // Lấy thông tin người dùng hiện tại
    static getCurrentUser() {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    // Kiểm tra đã đăng nhập hay chưa
    static isAuthenticated() {
        const expiresAt = localStorage.getItem('expiresAt');
        if (!expiresAt) return false;

        // Kiểm tra token còn hiệu lực không
        return new Date().getTime() < parseInt(expiresAt);
    }

    // Lấy token hiện tại
    static getToken() {
        return localStorage.getItem('accessToken') || localStorage.getItem('authToken');
    }

    // Đăng xuất - xóa tất cả dữ liệu
    static logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiresIn');
        localStorage.removeItem('expiresAt');
        localStorage.removeItem('user');
        localStorage.removeItem('authToken'); // Xóa cả authToken để tương thích với code cũ
    }
}

// Export cả hàm login và AuthService
export { login };
export default AuthService;
