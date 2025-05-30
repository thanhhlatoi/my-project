import React from 'react';
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    Film, 
    Eye, 
    DollarSign,
    Calendar,
    Download,
    Filter
} from 'lucide-react';
import Layout from '../layouts/layout.jsx';
import PageHeader from '../components/PageHeader.jsx';

const AnalyticsPage = () => {
    const monthlyData = [
        { month: 'Jan', views: 12000, revenue: 8500, users: 350 },
        { month: 'Feb', views: 15000, revenue: 9200, users: 420 },
        { month: 'Mar', views: 18000, revenue: 11000, users: 510 },
        { month: 'Apr', views: 22000, revenue: 13500, users: 680 },
        { month: 'May', views: 25000, revenue: 15800, users: 720 },
        { month: 'Jun', views: 28000, revenue: 18200, users: 850 }
    ];

    const topGenres = [
        { name: 'Action', percentage: 35, views: 45000 },
        { name: 'Comedy', percentage: 25, views: 32000 },
        { name: 'Drama', percentage: 20, views: 26000 },
        { name: 'Horror', percentage: 12, views: 15000 },
        { name: 'Documentary', percentage: 8, views: 10000 }
    ];

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
                            <button className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                                <Filter size={16} />
                                Filter
                            </button>
                            <button className="px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 font-medium shadow-md">
                                <Download size={16} />
                                Export Data
                            </button>
                        </div>
                    }
                />

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">$125,340</p>
                                <div className="flex items-center mt-2">
                                    <TrendingUp size={14} className="text-green-500 mr-1" />
                                    <span className="text-green-500 text-sm font-medium">+15%</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-green-50 text-green-600">
                                <DollarSign size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Views</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">1.2M</p>
                                <div className="flex items-center mt-2">
                                    <TrendingUp size={14} className="text-blue-500 mr-1" />
                                    <span className="text-blue-500 text-sm font-medium">+23%</span>
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
                                <p className="text-gray-500 text-sm font-medium">Active Users</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">8,932</p>
                                <div className="flex items-center mt-2">
                                    <TrendingUp size={14} className="text-purple-500 mr-1" />
                                    <span className="text-purple-500 text-sm font-medium">+8%</span>
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
                                <p className="text-gray-500 text-sm font-medium">Content Library</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">1,248</p>
                                <div className="flex items-center mt-2">
                                    <TrendingUp size={14} className="text-orange-500 mr-1" />
                                    <span className="text-orange-500 text-sm font-medium">+12%</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
                                <Film size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Performance Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
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
                                                    style={{ width: `${(data.views / 30000) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-gray-900">{data.views.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">${data.revenue.toLocaleString()}</div>
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
                            {topGenres.map((genre, index) => (
                                <div key={genre.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${
                                            index === 0 ? 'bg-blue-500' :
                                            index === 1 ? 'bg-green-500' :
                                            index === 2 ? 'bg-purple-500' :
                                            index === 3 ? 'bg-orange-500' : 'bg-gray-400'
                                        }`}></div>
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

                {/* Detailed Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h3>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-500" />
                                <span className="text-sm text-gray-500">Last 6 months</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-3 px-6 font-medium text-gray-500">Month</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-500">Views</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-500">Revenue</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-500">New Users</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-500">Growth</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {monthlyData.map((data, index) => (
                                    <tr key={data.month} className="hover:bg-gray-50">
                                        <td className="py-4 px-6 font-medium text-gray-900">{data.month} 2024</td>
                                        <td className="py-4 px-6 text-gray-600">{data.views.toLocaleString()}</td>
                                        <td className="py-4 px-6 text-gray-600">${data.revenue.toLocaleString()}</td>
                                        <td className="py-4 px-6 text-gray-600">{data.users}</td>
                                        <td className="py-4 px-6">
                                            <span className="text-green-600 font-medium">
                                                +{index > 0 ? Math.round(((data.revenue - monthlyData[index-1].revenue) / monthlyData[index-1].revenue) * 100) : 0}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AnalyticsPage; 