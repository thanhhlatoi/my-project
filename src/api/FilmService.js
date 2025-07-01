import axios from 'axios';
import { BASE_URL } from "./config.js";
const API_URL = `${BASE_URL}/api/movieProduct`;

// Hàm lấy token từ localStorage (hoặc sessionStorage, hoặc state)
const getAuthToken = () => {
    return localStorage.getItem('authToken');  // Hoặc bạn có thể thay đổi nơi lưu trữ token của bạn
};

const getAll = (page = 0, limit = 10, sortBy = 'id', order = 'asc') => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    return axios.get(API_URL, {
        params: {
            page,
            limit,
            sortBy,
            order
        },
        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
        }
    });
};

// Hàm chung để thực hiện các request với token
const request = async (method, url, data = null, params = null) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    try {
        const response = await axios({
            method,
            url: `${API_URL}${url}`,
            data,
            params,
            headers: {
                Authorization: `Bearer ${token}`  // Thêm token vào header
            }
        });
        return response.data; // Trả về dữ liệu response
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error; // Ném lỗi để caller có thể xử lý
    }
};



//add
const add = async (formData) => {
    const token = getAuthToken();

    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi chi tiết khi gửi phim:', error);

        // In ra chi tiết lỗi từ server
        if (error.response) {
            console.error('Dữ liệu lỗi:', error.response.data);
            console.error('Trạng thái lỗi:', error.response.status);
            console.error('Headers lỗi:', error.response.headers);
        }

        throw error;
    }
};

// Hàm cập nhật phim
const update = async (id, film) => {
    console.log('=== FilmService.update DEBUG ===');
    console.log('Update ID:', id);
    console.log('Update URL:', `${API_URL}/update/${id}`);
    console.log('Update data:', JSON.stringify(film, null, 2));
    
    // Chuyển đổi object thành FormData để tương thích với @ModelAttribute
    const formData = new FormData();
    
    // Thêm từng field vào FormData
    if (film.title) formData.append('title', film.title);
    if (film.description) formData.append('description', film.description);
    if (film.releaseDate) formData.append('releaseDate', film.releaseDate);
    if (film.duration) formData.append('duration', film.duration);
    if (film.rating) formData.append('rating', film.rating);
    
    // Thêm các fields khác nếu có
    if (film.imgMovie) formData.append('imgMovie', film.imgMovie);
    if (film.views !== undefined) formData.append('views', film.views);
    if (film.likes !== undefined) formData.append('likes', film.likes);
    if (film.dislikes !== undefined) formData.append('dislikes', film.dislikes);
    if (film.time) formData.append('time', film.time);
    
    // Xử lý genres array nếu có
    if (film.genres && Array.isArray(film.genres)) {
        film.genres.forEach((genre, index) => {
            if (genre.id) {
                formData.append(`genres[${index}].id`, genre.id);
            }
            if (genre.name) {
                formData.append(`genres[${index}].name`, genre.name);
            }
        });
    }
    
    // Log FormData content để debug
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
    
    const token = getAuthToken();
    
    try {
        const response = await axios.put(`${API_URL}/update/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log('Update response from server:', response.data);
        return response.data;
    } catch (error) {
        console.error('Update request failed:', error);
        throw error;
    }
};

// Hàm xóa phim theo ID
const deleteById = async (id) => {
    console.log('=== FilmService.deleteById DEBUG ===');
    console.log('Delete ID:', id);
    
    const token = getAuthToken();
    const endpoint = `${API_URL}/delete/${id}`;
    
    console.log('Delete URL:', endpoint);
    console.log('Authorization token:', token ? 'Present' : 'Missing');
    
    try {
        const response = await axios.delete(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Delete successful');
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        return response.data;
        
    } catch (error) {
        console.error('❌ Delete failed');
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        console.error('Error headers:', error.response?.headers);
        
        // Log full request details for debugging
        if (error.config) {
            console.error('Request URL:', error.config.url);
            console.error('Request method:', error.config.method);
            console.error('Request headers:', error.config.headers);
        }
        
        // Handle specific database constraint errors
        if (error.response?.status === 500) {
            const errorMessage = error.response?.data?.message || '';
            const errorDetails = JSON.stringify(error.response?.data || {});
            
            // Check for TransientObjectException or related entity constraint errors
            if (errorMessage.includes('TransientObjectException') || 
                errorMessage.includes('persistent instance references an unsaved transient instance') ||
                errorDetails.includes('TransientObjectException')) {
                
                console.error('🔄 Database relationship constraint error detected');
                
                // Create a custom error with user-friendly message
                const relationshipError = new Error(
                    'Không thể xóa phim này vì nó đang được liên kết với các dữ liệu khác trong hệ thống. ' +
                    'Để xóa phim này, vui lòng:\n\n' +
                    '1. Xóa tất cả video liên quan đến phim này trước\n' +
                    '2. Xóa các liên kết với diễn viên và thể loại\n' +
                    '3. Sau đó thử xóa phim lần nữa\n\n' +
                    'Lỗi kỹ thuật: Lỗi ràng buộc cơ sở dữ liệu - có dữ liệu liên quan chưa được xử lý đúng cách.'
                );
                relationshipError.isRelationshipError = true;
                relationshipError.originalError = error;
                throw relationshipError;
            }
            
            // Check for other common constraint errors
            if (errorMessage.includes('constraint') || errorMessage.includes('foreign key')) {
                const constraintError = new Error(
                    'Không thể xóa phim này vì nó đang được tham chiếu bởi dữ liệu khác. ' +
                    'Vui lòng xóa tất cả dữ liệu liên quan (video, bình luận, đánh giá...) trước khi xóa phim.'
                );
                constraintError.isConstraintError = true;
                constraintError.originalError = error;
                throw constraintError;
            }
        }
        
        throw error;
    }
};

// Hàm xóa phim (alias)
const deleteMovie = (id) => {
    return deleteById(id);
};

// Hàm lấy chi tiết phim theo ID
const getById = (id) => {
    return request('get', `/${id}`);
};

export default {
    getAll,
    add,
    update,
    delete: deleteMovie,
    deleteById,  // Thêm deleteById vào export
    getById
};
