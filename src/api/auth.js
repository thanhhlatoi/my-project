const API_URL = "http://192.168.100.193:8082/auth/login";

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
