import axios from 'axios';
import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/api/favorites`;

class FavoriteService {
    // Helper method to get current user ID from token or storage
    getCurrentUserId() {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                const parsed = JSON.parse(userInfo);
                return parsed.id || parsed.userId;
            } catch (error) {
                console.error('Error parsing user info:', error);
            }
        }
        return null;
    }

    // Helper method to get auth headers
    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // ===================== USER-SPECIFIC OPERATIONS =====================

    // Get all favorite movies for current user
    async getUserFavorites() {
        try {
            const userId = this.getCurrentUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }
            
            const response = await axios.get(`${API_URL}/user/${userId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user favorites:', error);
            throw error;
        }
    }

    // Get all favorite movies for a specific user (admin only)
    async getFavoritesByUserId(userId) {
        try {
            const response = await axios.get(`${API_URL}/user/${userId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching favorites by user ID:', error);
            throw error;
        }
    }

    // Get paginated favorites for a specific user
    async getFavoritesByUserIdPaginated(userId, page = 0, size = 10, sortBy = ['id'], sortDir = 'desc') {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                sortBy: Array.isArray(sortBy) ? sortBy : [sortBy],
                sortDir: sortDir
            });

            const response = await axios.get(`${API_URL}/user/${userId}/paginated?${params}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching paginated favorites by user ID:', error);
            throw error;
        }
    }

    // Get all favorites with pagination (admin only)
    async getAllUsersFavorites(page = 0, size = 10, sortBy = ['id'], sortDir = 'desc') {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                sortBy: Array.isArray(sortBy) ? sortBy : [sortBy],
                sortDir: sortDir
            });

            const response = await axios.get(`${API_URL}?${params}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching all users favorites:', error);
            throw error;
        }
    }

    // ===================== CRUD OPERATIONS =====================

    // Add movie to favorites
    async addToFavorites(movieProductId, userId = null) {
        try {
            const targetUserId = userId || this.getCurrentUserId();
            if (!targetUserId) {
                throw new Error('User not authenticated');
            }

            const requestBody = {
                userId: targetUserId,
                movieProductId: movieProductId
            };

            const response = await axios.post(API_URL, requestBody, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error adding to favorites:', error);
            throw error;
        }
    }

    // Remove movie from favorites by favorite ID
    async removeFromFavorites(favoriteId) {
        try {
            const response = await axios.delete(`${API_URL}/${favoriteId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error removing from favorites:', error);
            throw error;
        }
    }

    // Remove favorite by user ID and movie ID
    async removeFavoriteByUserAndMovie(userId, movieId) {
        try {
            const response = await axios.delete(`${API_URL}/user/${userId}/movie/${movieId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error removing favorite by user and movie:', error);
            throw error;
        }
    }

    // Remove all favorites for a user
    async removeAllUserFavorites(userId) {
        try {
            const response = await axios.delete(`${API_URL}/user/${userId}/all`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error removing all user favorites:', error);
            throw error;
        }
    }

    // ===================== TOGGLE & CHECK OPERATIONS =====================

    // Check if movie is in user's favorites
    async checkIsFavorite(userId, movieId) {
        try {
            const response = await axios.get(`${API_URL}/check/${userId}/${movieId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error checking favorite status:', error);
            throw error;
        }
    }

    // Toggle favorite status (add if not favorited, remove if favorited)
    async toggleFavorite(movieProductId, userId = null) {
        try {
            const targetUserId = userId || this.getCurrentUserId();
            if (!targetUserId) {
                throw new Error('User not authenticated');
            }

            const requestBody = {
                userId: targetUserId,
                movieProductId: movieProductId
            };

            const response = await axios.post(`${API_URL}/toggle`, requestBody, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error toggling favorite:', error);
            throw error;
        }
    }

    // ===================== STATISTICS & ANALYTICS =====================

    // Get favorite statistics for a movie
    async getMovieFavoriteStats(movieId) {
        try {
            const response = await axios.get(`${API_URL}/stats/movie/${movieId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching movie favorite stats:', error);
            throw error;
        }
    }

    // Get favorite statistics for a user
    async getUserFavoriteStats(userId) {
        try {
            const response = await axios.get(`${API_URL}/stats/user/${userId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user favorite stats:', error);
            throw error;
        }
    }

    // Get most favorited movies (trending)
    async getMostFavoritedMovies(limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/trending?limit=${limit}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching most favorited movies:', error);
            throw error;
        }
    }

    // ===================== BATCH OPERATIONS =====================

    // Batch operations - add multiple movies to favorites
    async addBatchToFavorites(movieIds, userId = null) {
        try {
            const targetUserId = userId || this.getCurrentUserId();
            if (!targetUserId) {
                throw new Error('User not authenticated');
            }

            const params = new URLSearchParams({
                userId: targetUserId.toString()
            });

            const response = await axios.post(`${API_URL}/batch/add?${params}`, movieIds, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error adding batch to favorites:', error);
            throw error;
        }
    }

    // Remove movie from all users' favorites (admin only)
    async removeMovieFromAllFavorites(movieId) {
        try {
            const response = await axios.delete(`${API_URL}/movie/${movieId}/all`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error removing movie from all favorites:', error);
            throw error;
        }
    }

    // ===================== SEARCH & FILTER OPERATIONS =====================

    // Search favorites with filters
    async searchFavorites(filters = {}) {
        try {
            const params = new URLSearchParams();
            
            // Add filters to params
            Object.keys(filters).forEach(key => {
                if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
                    params.append(key, filters[key]);
                }
            });

            const response = await axios.get(`${API_URL}/search?${params}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error searching favorites:', error);
            throw error;
        }
    }

    // ===================== RECOMMENDATION ENDPOINTS =====================

    // Get recommendations for a user based on their favorites
    async getRecommendations(userId, limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/recommendations/${userId}?limit=${limit}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            throw error;
        }
    }

    // ===================== EXPORT OPERATIONS =====================

    // Export user's favorites
    async exportUserFavorites(userId, format = 'json') {
        try {
            const response = await axios.get(`${API_URL}/export/user/${userId}?format=${format}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error exporting user favorites:', error);
            throw error;
        }
    }

    // ===================== HEALTH & UTILITIES =====================

    // Health check for favorites service
    async healthCheck() {
        try {
            const response = await axios.get(`${API_URL}/health`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error checking favorites service health:', error);
            throw error;
        }
    }
}

const favoriteService = new FavoriteService();
export default favoriteService; 