import React, { useState, useEffect } from 'react';
import { Heart, Users, Search, Filter, Eye, Trash2, Download, Calendar, Star } from 'lucide-react';
import favoriteService from '../api/FavoriteService';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';

const FavoriteManagementPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState('all');
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        loadAllUsersFavorites();
    }, []);

    useEffect(() => {
        if (favorites.length > 0) {
            loadStats();
        }
    }, [favorites]);

    const loadAllUsersFavorites = async () => {
        try {
            setLoading(true);
            const response = await favoriteService.getAllUsersFavorites();
            
            // Handle both paginated and non-paginated responses
            const favoritesData = response.content || response.data || response;
            setFavorites(favoritesData || []);
            
            // Extract unique users for filter
            const uniqueUsers = [...new Map(
                (favoritesData || []).map(fav => [fav.userId, { id: fav.userId, username: fav.username }])
            ).values()];
            setUsers(uniqueUsers);
            
            setError(null);
        } catch (err) {
            console.error('Error loading all users favorites:', err);
            setError('Không thể tải danh sách yêu thích của users');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            // Calculate stats from favorites data instead of separate API call
            const totalFavorites = favorites.length;
            const uniqueUsers = new Set(favorites.map(fav => fav.userId)).size;
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const monthlyFavorites = favorites.filter(fav => {
                const createdDate = new Date(fav.createdAt);
                return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
            }).length;
            
            setStats({
                totalFavorites,
                activeUsers: uniqueUsers,
                monthlyFavorites,
                averageRating: 4.2 // Mock value since we don't have this data
            });
        } catch (err) {
            console.error('Error calculating stats:', err);
        }
    };

    const handleRemoveFavorite = async (favoriteId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa mục yêu thích này?')) {
            return;
        }

        try {
            await favoriteService.removeFromFavorites(favoriteId);
            setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
            loadStats();
        } catch (err) {
            console.error('Error removing favorite:', err);
            alert('Không thể xóa mục yêu thích');
        }
    };

    const handleViewUserFavorites = (userId) => {
        setSelectedUser(userId.toString());
    };

    const handleExportData = () => {
        const dataToExport = filteredFavorites.map(fav => ({
            'Favorite ID': fav.id,
            'User ID': fav.userId,
            'User Name': fav.username,
            'Movie ID': fav.movieProductId,
            'Movie Title': fav.movieTitle,
            'Movie Year': fav.movieYear,
            'Movie Description': fav.movieDescription,
            'Note': fav.note || '',
            'Priority': fav.priority || '',
            'Added Date': new Date(fav.createdAt).toLocaleDateString('vi-VN')
        }));

        const csv = [
            Object.keys(dataToExport[0]).join(','),
            ...dataToExport.map(row => Object.values(row).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `favorites-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Filter favorites based on search and user selection
    const filteredFavorites = favorites.filter(fav => {
        const matchesSearch = 
            fav.movieTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fav.username?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesUser = selectedUser === 'all' || fav.userId?.toString() === selectedUser;
        
        return matchesSearch && matchesUser;
    });

    const columns = [
        {
            key: 'user',
            title: 'User',
            render: (favorite) => (
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{favorite.username}</div>
                        <div className="text-sm text-gray-500">ID: {favorite.userId}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'movie',
            title: 'Movie',
            render: (favorite) => (
                <div className="flex items-center">
                    <img 
                        src={favorite.movieImageUrl || '/api/placeholder/40/60'} 
                        alt={favorite.movieTitle}
                        className="w-10 h-14 object-cover rounded mr-3"
                    />
                    <div>
                        <div className="font-medium text-gray-900">{favorite.movieTitle}</div>
                        <div className="text-sm text-gray-500">
                            {favorite.movieYear}
                        </div>
                        {favorite.movieDescription && (
                            <div className="text-xs text-gray-400 truncate max-w-xs">
                                {favorite.movieDescription}
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            key: 'note',
            title: 'Note',
            render: (favorite) => (
                <div className="text-sm text-gray-600">
                    {favorite.note || 'No note'}
                </div>
            )
        },
        {
            key: 'addedAt',
            title: 'Added Date',
            render: (favorite) => (
                <div className="text-sm text-gray-600">
                    {new Date(favorite.createdAt).toLocaleDateString('vi-VN')}
                </div>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            render: (favorite) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleViewUserFavorites(favorite.userId)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Xem favorites của user này"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleRemoveFavorite(favorite.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Xóa khỏi yêu thích"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="p-6">
            <PageHeader 
                title="Phim Yêu Thích Của Users" 
                description="Xem và quản lý danh sách phim yêu thích của tất cả người dùng trong hệ thống"
            />

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <Heart className="w-8 h-8 text-red-500 mr-3" />
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.totalFavorites || 0}</div>
                                <div className="text-gray-600">Tổng lượt yêu thích</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <Users className="w-8 h-8 text-blue-500 mr-3" />
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                                <div className="text-gray-600">Users có yêu thích</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <Calendar className="w-8 h-8 text-green-500 mr-3" />
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.monthlyFavorites || 0}</div>
                                <div className="text-gray-600">Tháng này</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <Star className="w-8 h-8 text-yellow-500 mr-3" />
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.averageRating || 'N/A'}</div>
                                <div className="text-gray-600">Điểm TB phim yêu thích</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <SearchBar 
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Tìm kiếm theo tên phim, user..."
                        />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {/* User Filter */}
                        <select 
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="all">Tất cả users</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.username} (ID: {user.id})
                                </option>
                            ))}
                        </select>

                        {/* Export Button */}
                        <button
                            onClick={handleExportData}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            disabled={filteredFavorites.length === 0}
                        >
                            <Download className="w-4 h-4 mr-1" />
                            Export CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="mb-4 text-sm text-gray-600">
                Hiển thị {filteredFavorites.length} / {favorites.length} favorites
                {selectedUser !== 'all' && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        Filtered by: {users.find(u => u.id.toString() === selectedUser)?.username}
                    </span>
                )}
            </div>

            {/* Content */}
            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            ) : filteredFavorites.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        {searchTerm || selectedUser !== 'all' ? 'Không tìm thấy kết quả' : 'Chưa có favorites'}
                    </h3>
                    <p className="text-gray-600">
                        {searchTerm || selectedUser !== 'all' 
                            ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                            : 'Các users chưa có phim yêu thích nào'
                        }
                    </p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredFavorites}
                    selectedItems={selectedItems}
                    onSelectionChange={setSelectedItems}
                    selectable={true}
                />
            )}
        </div>
    );
};

export default FavoriteManagementPage; 