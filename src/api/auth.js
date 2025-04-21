import { BASE_URL } from "./config.js";


const API_URL = `${BASE_URL}/auth/login`;


export const login = async (email, password) => {
    // eslint-disable-next-line no-useless-catch
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

        return data;
    } catch (error) {
        throw error;
    }
};
