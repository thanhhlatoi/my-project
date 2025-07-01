import axios from 'axios';
import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/api/watch-history`;

class WatchHistoryService {
    // Helper method to get auth headers
    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // ===================== WATCH TRACKING =====================

    // Track when a user watches a movie
    async trackWatch(userId, movieId) {
        try {
            const response = await axios.post(`${API_URL}/track/${userId}/${movieId}`, {}, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error tracking watch:', error);
            throw error;
        }
    }

    // Check if user has watched a movie
    async checkWatchStatus(userId, movieId) {
        try {
            const response = await axios.get(`${API_URL}/check/${userId}/${movieId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error checking watch status:', error);
            throw error;
        }
    }

    // Mark movie as completed for user
    async markAsCompleted(userId, movieId, watchDurationSeconds = null) {
        try {
            const url = `${API_URL}/complete/${userId}/${movieId}`;
            const params = watchDurationSeconds ? { watchDurationSeconds } : {};
            
            const response = await axios.put(url, {}, {
                headers: this.getAuthHeaders(),
                params
            });
            return response.data;
        } catch (error) {
            console.error('Error marking as completed:', error);
            throw error;
        }
    }

    // ===================== USER ANALYTICS =====================

    // Get user's watch history
    async getUserWatchHistory(userId) {
        try {
            const response = await axios.get(`${API_URL}/user/${userId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user watch history:', error);
            throw error;
        }
    }

    // ===================== MOVIE ANALYTICS =====================

    // Get movie view statistics
    async getMovieStats(movieId) {
        try {
            const response = await axios.get(`${API_URL}/stats/${movieId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching movie stats:', error);
            throw error;
        }
    }

    // Get most popular movies by unique viewers
    async getMostPopularMovies(limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/popular?limit=${limit}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching most popular movies:', error);
            throw error;
        }
    }

    // ===================== ANALYTICS AGGREGATION =====================

    // Get comprehensive watch analytics for dashboard
    async getWatchAnalytics() {
        try {
            // Get popular movies and their detailed stats
            const popularMovies = await this.getMostPopularMovies(10);
            
            // Get detailed stats for each popular movie
            const movieStatsPromises = popularMovies.popularMovies?.slice(0, 5).map(movieId => 
                this.getMovieStats(movieId)
            ) || [];
            
            const movieStats = await Promise.allSettled(movieStatsPromises);
            
            // Format results
            const successfulStats = movieStats
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value);

            return {
                popularMovies: popularMovies.popularMovies || [],
                movieStats: successfulStats,
                summary: this.calculateWatchSummary(successfulStats)
            };
        } catch (error) {
            console.error('Error fetching watch analytics:', error);
            throw error;
        }
    }

    // Calculate summary statistics from movie stats
    calculateWatchSummary(movieStats) {
        if (!movieStats.length) {
            return {
                totalUniqueViewers: 0,
                totalViews: 0,
                averageCompletionRate: 0,
                averageRewatches: 0
            };
        }

        const totalUniqueViewers = movieStats.reduce((sum, stat) => sum + (stat.uniqueViewers || 0), 0);
        const totalViews = movieStats.reduce((sum, stat) => sum + (stat.totalViews || 0), 0);
        const avgCompletionRate = movieStats.reduce((sum, stat) => sum + (stat.completionRate || 0), 0) / movieStats.length;
        const avgRewatches = movieStats.reduce((sum, stat) => sum + (stat.averageRewatches || 0), 0) / movieStats.length;

        return {
            totalUniqueViewers,
            totalViews,
            averageCompletionRate: Math.round(avgCompletionRate * 100) / 100,
            averageRewatches: Math.round(avgRewatches * 100) / 100
        };
    }

    // ===================== DATA FORMATTING =====================

    // Format watch history for display
    formatWatchHistory(watchHistory) {
        return watchHistory.map(item => ({
            movieId: item.movieProduct?.id || item.movieId,
            movieTitle: item.movieProduct?.title || 'Unknown Movie',
            watchCount: item.watchCount || 1,
            firstWatchedAt: item.firstWatchedAt ? new Date(item.firstWatchedAt).toLocaleDateString() : 'Unknown',
            lastWatchedAt: item.lastWatchedAt ? new Date(item.lastWatchedAt).toLocaleDateString() : 'Unknown',
            completed: item.completed || false,
            watchDuration: item.watchDurationSeconds ? this.formatDuration(item.watchDurationSeconds) : 'N/A'
        }));
    }

    // Format duration in seconds to human readable format
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    // Format movie stats for charts
    formatMovieStatsForChart(movieStats) {
        return movieStats.map(stat => ({
            movieId: stat.movieId,
            uniqueViewers: stat.uniqueViewers || 0,
            totalViews: stat.totalViews || 0,
            completionRate: Math.round((stat.completionRate || 0) * 100),
            averageRewatches: Math.round((stat.averageRewatches || 0) * 100) / 100
        }));
    }

    // Get engagement metrics
    getEngagementMetrics(movieStats) {
        if (!movieStats.length) return null;

        const highEngagement = movieStats.filter(stat => (stat.completionRate || 0) > 0.7).length;
        const mediumEngagement = movieStats.filter(stat => (stat.completionRate || 0) >= 0.4 && (stat.completionRate || 0) <= 0.7).length;
        const lowEngagement = movieStats.filter(stat => (stat.completionRate || 0) < 0.4).length;

        return {
            high: { count: highEngagement, percentage: Math.round((highEngagement / movieStats.length) * 100) },
            medium: { count: mediumEngagement, percentage: Math.round((mediumEngagement / movieStats.length) * 100) },
            low: { count: lowEngagement, percentage: Math.round((lowEngagement / movieStats.length) * 100) }
        };
    }

    // ===================== HEALTH CHECK =====================

    // Health check for watch history service
    async healthCheck() {
        try {
            // Simple check by getting popular movies with limit 1
            const response = await this.getMostPopularMovies(1);
            return { status: 'healthy', data: response };
        } catch (error) {
            console.error('Watch history service health check failed:', error);
            return { status: 'unhealthy', error: error.message };
        }
    }
}

const watchHistoryService = new WatchHistoryService();
export default watchHistoryService; 