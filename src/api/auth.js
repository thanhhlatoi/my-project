import { BASE_URL } from "./config.js";

const API_URL = `${BASE_URL}/api/auth/login`;

// Thêm class AuthTokenManager và export nó
export class AuthTokenManager {
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

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Đăng nhập thất bại");
        }

        // Lưu token vào localStorage sau khi đăng nhập thành công
        if (data.authentication && data.authentication.token) {
            AuthTokenManager.setToken(data.authentication.token);
        }

        return data;
    } catch (error) {
        throw error;
    }
};
