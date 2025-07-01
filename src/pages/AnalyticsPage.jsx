import React, { useState, useEffect } from 'react';
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    Film, 
    Eye, 
    DollarSign,
    Calendar,
    Download,
    Filter,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import Layout from '../layouts/layout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import statisticsService from '../api/StatisticsService.js';
import watchHistoryService from '../api/WatchHistoryService.js';

const AnalyticsPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(2025);
    const [availableYears, setAvailableYears] = useState([]);
    
    // State for different data sections
    const [dashboardSummary, setDashboardSummary] = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);
    const [genreStats, setGenreStats] = useState([]);
    const [topMovies, setTopMovies] = useState([]);
    const [realTimeStats, setRealTimeStats] = useState(null);
    const [watchAnalytics, setWatchAnalytics] = useState(null);

    useEffect(() => {
        loadAllAnalyticsData();
    }, [selectedYear]);

    const loadAllAnalyticsData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load data in parallel for better performance
            const [
                summaryResponse,
                monthlyResponse,
                genreResponse,
                topMoviesResponse,
                realTimeResponse,
                yearsResponse,
                watchResponse
            ] = await Promise.allSettled([
                statisticsService.getDashboardSummary(selectedYear),
                statisticsService.getComprehensiveMonthlyStats(selectedYear),
                statisticsService.getStatsByGenre(),
                statisticsService.getTopFavoriteMovies(5),
                statisticsService.getRealTimeStats(),
                statisticsService.getAvailableYears(),
                watchHistoryService.getWatchAnalytics()
            ]);

            // Process results with error handling
            if (summaryResponse.status === 'fulfilled') {
                setDashboardSummary(summaryResponse.value.body || summaryResponse.value);
            }

            if (monthlyResponse.status === 'fulfilled') {
                const monthlyStats = monthlyResponse.value.body || monthlyResponse.value;
                setMonthlyData(statisticsService.formatMonthlyDataForCharts(monthlyStats.users || []));
            }

            if (genreResponse.status === 'fulfilled') {
                const genres = genreResponse.value.body || genreResponse.value;
                setGenreStats(statisticsService.formatGenreDataForCharts(genres || []));
            }

            if (topMoviesResponse.status === 'fulfilled') {
                setTopMovies(topMoviesResponse.value.body || topMoviesResponse.value || []);
            }

            if (realTimeResponse.status === 'fulfilled') {
                setRealTimeStats(realTimeResponse.value.body || realTimeResponse.value);
            }

            if (yearsResponse.status === 'fulfilled') {
                setAvailableYears(yearsResponse.value.body || yearsResponse.value || []);
            }

            if (watchResponse.status === 'fulfilled') {
                setWatchAnalytics(watchResponse.value);
            }

        } catch (err) {
            console.error('Error loading analytics data:', err);
            setError('Không thể tải dữ liệu phân tích. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        loadAllAnalyticsData();
    };

    const handleExportData = async () => {
        try {
            const allData = {
                summary: dashboardSummary,
                monthly: monthlyData,
                genres: genreStats,
                topMovies: topMovies,
                realTime: realTimeStats,
                watchAnalytics: watchAnalytics,
                exportedAt: new Date().toISOString()
            };

            const dataStr = JSON.stringify(allData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `analytics-${selectedYear}-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Không thể xuất dữ liệu');
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-96">
                    <LoadingSpinner />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="📊 Analytics Dashboard"
                    description="Detailed insights and performance metrics"
                    gradient="from-indigo-600 to-purple-600"
                    customActions={
                        <div className="flex items-center gap-3">
                            {/* Year Selector */}
                            <select 
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2 text-sm"
                            >
                                {availableYears.map(year => (
                                    <option key={year} value={year} className="text-gray-900">
                                        {year}
                                    </option>
                                ))}
                            </select>
                            
                            <button 
                                onClick={handleRefresh}
                                className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Refresh
                            </button>
                            
                            <button 
                                onClick={handleExportData}
                                className="px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 font-medium shadow-md"
                            >
                                <Download size={16} />
                                Export Data
                            </button>
                        </div>
                    }
                />

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {dashboardSummary?.totals?.users?.toLocaleString() || '0'}
                                </p>
                                <div className="flex items-center mt-2">
                                    <TrendingUp size={14} className="text-green-500 mr-1" />
                                    <span className="text-green-500 text-sm font-medium">
                                        +{dashboardSummary?.growth?.userGrowthRate || 0}%
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                                <Users size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Movies</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {dashboardSummary?.totals?.movies?.toLocaleString() || '0'}
                                </p>
                                <div className="flex items-center mt-2">
                                    <TrendingUp size={14} className="text-blue-500 mr-1" />
                                    <span className="text-blue-500 text-sm font-medium">
                                        +{dashboardSummary?.growth?.movieGrowthRate || 0}%
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
                                <Film size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Reviews</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {dashboardSummary?.totals?.reviews?.toLocaleString() || '0'}
                                </p>
                                <div className="flex items-center mt-2">
                                    <TrendingUp size={14} className="text-green-500 mr-1" />
                                    <span className="text-green-500 text-sm font-medium">
                                        +{dashboardSummary?.growth?.reviewGrowthRate || 0}%
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                                <Eye size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Favorites</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {dashboardSummary?.totals?.favorites?.toLocaleString() || '0'}
                                </p>
                                <div className="flex items-center mt-2">
                                    <TrendingUp size={14} className="text-red-500 mr-1" />
                                    <span className="text-red-500 text-sm font-medium">
                                        +{dashboardSummary?.growth?.favoriteGrowthRate || 0}%
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-red-50 text-red-600">
                                <DollarSign size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Real-time Statistics */}
                {realTimeStats && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-4">📈 Thống Kê Thời Gian Thực</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="text-sm opacity-90">Hôm nay</div>
                                <div className="text-xl font-bold">
                                    {realTimeStats.today?.newUsers || 0} users mới
                                </div>
                                <div className="text-sm opacity-75">
                                    {realTimeStats.today?.newMovies || 0} phim mới
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="text-sm opacity-90">Tuần này</div>
                                <div className="text-xl font-bold">
                                    {realTimeStats.thisWeek?.newUsers || 0} users mới
                                </div>
                                <div className="text-sm opacity-75">
                                    {realTimeStats.thisWeek?.newReviews || 0} reviews mới
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="text-sm opacity-90">Tháng này</div>
                                <div className="text-xl font-bold">
                                    {realTimeStats.thisMonth?.newFavorites || 0} favorites mới
                                </div>
                                <div className="text-sm opacity-75">
                                    {realTimeStats.thisMonth?.newMovies || 0} phim mới
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Performance Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Monthly User Registration</h3>
                            <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                <BarChart3 size={16} />
                                View Details
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {monthlyData.map((data) => (
                                <div key={data.month} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-700 w-8">{data.month}</span>
                                        <div className="flex-1">
                                            <div className="bg-gray-200 rounded-full h-2 w-32">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full" 
                                                    style={{ 
                                                        width: `${Math.min((data.value / Math.max(...monthlyData.map(d => d.value), 1)) * 100, 100)}%` 
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-gray-900">{data.value.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">{data.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Genres */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Top Genres</h3>
                            <button className="text-blue-600 hover:text-blue-700 text-sm">View All</button>
                        </div>
                        
                        <div className="space-y-4">
                            {genreStats.slice(0, 5).map((genre) => (
                                <div key={genre.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${genre.color}`}></div>
                                        <span className="text-sm font-medium text-gray-700">{genre.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-200 rounded-full h-2 w-20">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full" 
                                                style={{ width: `${genre.percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-8">{genre.percentage}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Watch Analytics Section */}
                {watchAnalytics && watchAnalytics.summary && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">📹 Watch Analytics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {watchAnalytics.summary.totalUniqueViewers.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500">Unique Viewers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {watchAnalytics.summary.totalViews.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500">Total Views</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {watchAnalytics.summary.averageCompletionRate}%
                                </div>
                                <div className="text-sm text-gray-500">Avg Completion Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {watchAnalytics.summary.averageRewatches}×
                                </div>
                                <div className="text-sm text-gray-500">Avg Rewatches</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Movies Table */}
                {topMovies.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Top Favorite Movies</h3>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-500" />
                                    <span className="text-sm text-gray-500">Current data</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left py-3 px-6 font-medium text-gray-500">Movie</th>
                                        <th className="text-left py-3 px-6 font-medium text-gray-500">Favorites</th>
                                        <th className="text-left py-3 px-6 font-medium text-gray-500">Views</th>
                                        <th className="text-left py-3 px-6 font-medium text-gray-500">Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                                                                                              {topMovies.map((movie, movieIndex) => (
                                         <tr key={movie.id || movie.movieId || movieIndex} className="hover:bg-gray-50">
                                             <td className="py-4 px-6 font-medium text-gray-900">
                                                 {movie.title || movie.movieTitle || `Movie ${movieIndex + 1}`}
                                             </td>
                                            <td className="py-4 px-6 text-gray-600">
                                                {movie.favoriteCount || movie.favorites || 0}
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">
                                                {movie.views?.toLocaleString() || 'N/A'}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-yellow-600 font-medium">
                                                    ⭐ {movie.rating || movie.averageRating || 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AnalyticsPage; 