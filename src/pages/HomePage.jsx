import React from 'react';
import { 
    Film, 
    Users, 
    Eye, 
    DollarSign, 
    TrendingUp, 
    PlayCircle,
    Calendar,
    Star,
    Download,
    BarChart3
} from 'lucide-react';
import Layout from '../layouts/layout.jsx';
import PageHeader from '../components/PageHeader.jsx';

const HomePage = () => {
    const stats = {
        totalMovies: 1248,
        totalUsers: 15632,
        totalViews: 89456,
        revenue: 125340,
        newMoviesThisMonth: 42,
        activeUsers: 8932,
        popularGenre: "Action",
        averageRating: 4.2
    };

    const recentMovies = [
        { id: 1, title: "Avatar: The Way of Water", views: 12450, rating: 4.5, revenue: 8900 },
        { id: 2, title: "Black Panther: Wakanda Forever", views: 9876, rating: 4.3, revenue: 7650 },
        { id: 3, title: "Top Gun: Maverick", views: 8745, rating: 4.7, revenue: 6890 },
        { id: 4, title: "Doctor Strange 2", views: 7654, rating: 4.1, revenue: 5432 },
        { id: 5, title: "Thor: Love and Thunder", views: 6543, rating: 3.9, revenue: 4567 }
    ];

    const StatCard = ({ title, value, icon, trend, trendValue, color = "blue" }) => {
        const colorClasses = {
            blue: "bg-blue-50 text-blue-600 border-blue-200",
            green: "bg-green-50 text-green-600 border-green-200",
            purple: "bg-purple-50 text-purple-600 border-purple-200",
            orange: "bg-orange-50 text-orange-600 border-orange-200"
        };

        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                        {trend && (
                            <div className="flex items-center mt-2">
                                <TrendingUp size={14} className="text-green-500 mr-1" />
                                <span className="text-green-500 text-sm font-medium">+{trendValue}%</span>
                                <span className="text-gray-500 text-sm ml-1">vs last month</span>
                            </div>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                        {icon}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="🎬 FilmDash Dashboard"
                    description="Here's what's happening with your movie platform today."
                    gradient="from-blue-600 to-blue-700"
                    showAddButton={false}
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Movies"
                        value={stats.totalMovies.toLocaleString()}
                        icon={<Film size={24} />}
                        trend={true}
                        trendValue="12"
                        color="blue"
                    />
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers.toLocaleString()}
                        icon={<Users size={24} />}
                        trend={true}
                        trendValue="8"
                        color="green"
                    />
                    <StatCard
                        title="Total Views"
                        value={stats.totalViews.toLocaleString()}
                        icon={<Eye size={24} />}
                        trend={true}
                        trendValue="23"
                        color="purple"
                    />
                    <StatCard
                        title="Revenue"
                        value={`$${stats.revenue.toLocaleString()}`}
                        icon={<DollarSign size={24} />}
                        trend={true}
                        trendValue="15"
                        color="orange"
                    />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">New Movies This Month</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.newMoviesThisMonth}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                                <PlayCircle size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Active Users Today</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeUsers.toLocaleString()}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                                <Users size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Average Rating</p>
                                <div className="flex items-center mt-1">
                                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                                    <Star size={20} className="text-yellow-400 ml-1 fill-current" />
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-yellow-50 text-yellow-600">
                                <Star size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Movies Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Top Performing Movies</h2>
                            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                <BarChart3 size={16} />
                                View Analytics
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-3 px-6 font-medium text-gray-500">Movie Title</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-500">Views</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-500">Rating</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-500">Revenue</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentMovies.map((movie) => (
                                    <tr key={movie.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                                                    <Film size={16} className="text-gray-500" />
                                                </div>
                                                <span className="font-medium text-gray-900">{movie.title}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">{movie.views.toLocaleString()}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center">
                                                <Star size={14} className="text-yellow-400 fill-current mr-1" />
                                                <span className="text-gray-900 font-medium">{movie.rating}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">${movie.revenue.toLocaleString()}</td>
                                        <td className="py-4 px-6">
                                            <button className="text-blue-600 hover:text-blue-700 font-medium">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">Add New Movie</h3>
                                <p className="text-blue-100 mt-1">Upload and manage your content</p>
                            </div>
                            <Film size={32} className="text-blue-200" />
                        </div>
                        <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                            Add Movie
                        </button>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">Manage Users</h3>
                                <p className="text-green-100 mt-1">User accounts and permissions</p>
                            </div>
                            <Users size={32} className="text-green-200" />
                        </div>
                        <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
                            View Users
                        </button>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">Analytics</h3>
                                <p className="text-purple-100 mt-1">Detailed reports and insights</p>
                            </div>
                            <BarChart3 size={32} className="text-purple-200" />
                        </div>
                        <button className="mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                            View Reports
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;