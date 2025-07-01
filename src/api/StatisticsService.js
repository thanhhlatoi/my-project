import axios from 'axios';
import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/api/admin/statistics`;

class StatisticsService {
    // Helper method to get auth headers
    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // ===================== DASHBOARD SUMMARY =====================

    // Get comprehensive dashboard summary
    async getDashboardSummary(year = 2024) {
        try {
            const response = await axios.get(`${API_URL}/dashboard/summary?year=${year}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard summary:', error);
            throw error;
        }
    }

    // Get enhanced dashboard summary with more details
    async getEnhancedDashboardSummary(year = 2024) {
        try {
            const response = await axios.get(`${API_URL}/dashboard/enhanced?year=${year}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching enhanced dashboard summary:', error);
            throw error;
        }
    }

    // ===================== REAL-TIME STATISTICS =====================

    // Get real-time statistics
    async getRealTimeStats() {
        try {
            const response = await axios.get(`${API_URL}/realtime`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching real-time stats:', error);
            throw error;
        }
    }

    // ===================== MONTHLY STATISTICS =====================

    // Get user registration statistics by month
    async getUserStatsByMonth(year = 2024, fillMissing = true) {
        try {
            const response = await axios.get(`${API_URL}/users/monthly?year=${year}&fillMissing=${fillMissing}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user stats by month:', error);
            throw error;
        }
    }

    // Get movie statistics by month
    async getMovieStatsByMonth(year = 2024, fillMissing = true) {
        try {
            const response = await axios.get(`${API_URL}/movies/monthly?year=${year}&fillMissing=${fillMissing}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching movie stats by month:', error);
            throw error;
        }
    }

    // Get review statistics by month
    async getReviewStatsByMonth(year = 2024, fillMissing = true) {
        try {
            const response = await axios.get(`${API_URL}/reviews/monthly?year=${year}&fillMissing=${fillMissing}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching review stats by month:', error);
            throw error;
        }
    }

    // Get favorite statistics by month
    async getFavoriteStatsByMonth(year = 2024, fillMissing = true) {
        try {
            const response = await axios.get(`${API_URL}/favorites/monthly?year=${year}&fillMissing=${fillMissing}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching favorite stats by month:', error);
            throw error;
        }
    }

    // Get comprehensive monthly statistics
    async getComprehensiveMonthlyStats(year = 2024, fillMissing = true) {
        try {
            const response = await axios.get(`${API_URL}/comprehensive/monthly?year=${year}&fillMissing=${fillMissing}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching comprehensive monthly stats:', error);
            throw error;
        }
    }

    // ===================== TOP PERFORMERS =====================

    // Get top favorite movies
    async getTopFavoriteMovies(limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/movies/top-favorites?limit=${limit}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching top favorite movies:', error);
            throw error;
        }
    }

    // Get top viewed movies
    async getTopViewedMovies(limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/movies/top-views?limit=${limit}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching top viewed movies:', error);
            throw error;
        }
    }

    // Get top rated movies
    async getTopRatedMovies(limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/movies/top-rated?limit=${limit}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching top rated movies:', error);
            throw error;
        }
    }

    // ===================== ENGAGEMENT & ACTIVITY =====================

    // Get user activity statistics
    async getUserActivityStats() {
        try {
            const response = await axios.get(`${API_URL}/users/activity`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user activity stats:', error);
            throw error;
        }
    }

    // Get engagement statistics
    async getEngagementStats() {
        try {
            const response = await axios.get(`${API_URL}/engagement`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching engagement stats:', error);
            throw error;
        }
    }

    // ===================== CONTENT ANALYSIS =====================

    // Get statistics by genre
    async getStatsByGenre() {
        try {
            const response = await axios.get(`${API_URL}/movies/by-genre`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching stats by genre:', error);
            throw error;
        }
    }

    // Get statistics by category
    async getStatsByCategory() {
        try {
            const response = await axios.get(`${API_URL}/movies/by-category`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching stats by category:', error);
            throw error;
        }
    }

    // Get statistics by author
    async getStatsByAuthor(limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/movies/by-author?limit=${limit}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching stats by author:', error);
            throw error;
        }
    }

    // ===================== RATING & DISTRIBUTION =====================

    // Get rating distribution statistics
    async getRatingDistribution() {
        try {
            const response = await axios.get(`${API_URL}/ratings/distribution`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching rating distribution:', error);
            throw error;
        }
    }

    // ===================== TRENDING & STORAGE =====================

    // Get trending data
    async getTrendingData(days = 7) {
        try {
            const response = await axios.get(`${API_URL}/trending?days=${days}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching trending data:', error);
            throw error;
        }
    }

    // Get video storage statistics
    async getVideoStorageStats() {
        try {
            const response = await axios.get(`${API_URL}/videos/storage`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching video storage stats:', error);
            throw error;
        }
    }

    // ===================== UTILITY METHODS =====================

    // Get available years with data
    async getAvailableYears() {
        try {
            const response = await axios.get(`${API_URL}/available-years`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching available years:', error);
            throw error;
        }
    }

    // Health check for statistics service
    async healthCheck() {
        try {
            const response = await axios.get(`${API_URL}/health`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error checking statistics service health:', error);
            throw error;
        }
    }

    // ===================== DATA FORMATTING HELPERS =====================

    // Format monthly data for charts
    formatMonthlyDataForCharts(monthlyData) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        return monthlyData.map(item => ({
            month: monthNames[parseInt(item.month.split('-')[1]) - 1],
            value: item.count,
            label: item.label || item.month,
            fullMonth: item.month
        }));
    }

    // Format genre data for charts
    formatGenreDataForCharts(genreData) {
        const total = genreData.reduce((sum, item) => sum + item.movieCount, 0);
        
        return genreData.map((item, index) => ({
            name: item.genreName,
            percentage: total > 0 ? Math.round((item.movieCount / total) * 100) : 0,
            count: item.movieCount,
            color: this.getChartColor(index)
        }));
    }

    // Get chart colors
    getChartColor(index) {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
            'bg-orange-500', 'bg-red-500', 'bg-yellow-500',
            'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'
        ];
        return colors[index % colors.length];
    }

    // Format dashboard summary for display
    formatDashboardSummary(summary) {
        return {
            totalUsers: summary.totals?.users || 0,
            totalMovies: summary.totals?.movies || 0,
            totalReviews: summary.totals?.reviews || 0,
            totalFavorites: summary.totals?.favorites || 0,
            yearlyGrowth: summary.growth || {},
            monthlyBreakdown: summary.monthlyBreakdown || {}
        };
    }
}

const statisticsService = new StatisticsService();
export default statisticsService; 