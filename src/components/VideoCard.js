// VideoCard.js
import React from 'react';
import { Film, Calendar, Play } from 'lucide-react';
import VideoApiService from './VideoApiService';

const videoApiService = new VideoApiService();

const VideoCard = ({ video, onPlay, viewMode = 'grid' }) => {
    const handlePlay = () => {
        onPlay(video.id);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (viewMode === 'list') {
        return (
            <div className="bg-gray-800 rounded-lg p-4 flex gap-4 hover:bg-gray-700 transition-colors">
                <div className="relative flex-shrink-0 w-32 h-20 bg-gray-900 rounded-lg overflow-hidden">
                    {video.thumbnailPath && (
                        <img
                            src={video.thumbnailPath}
                            alt={video.originalFileName}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Film className="w-6 h-6 text-white" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{video.originalFileName}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                        {video.movieProduct?.title || 'Chưa có tiêu đề'}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(video.uploadedAt)}
                        </span>
                        <span>{videoApiService.formatFileSize(video.fileSize)}</span>
                        <span className={`px-2 py-1 rounded text-white ${videoApiService.getStatusColor(video.status)}`}>
                            {videoApiService.getStatusDisplayName(video.status)}
                        </span>
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <button
                        onClick={handlePlay}
                        disabled={video.status !== 'COMPLETED'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Play className="w-4 h-4" />
                        Phát
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
            <div className="relative aspect-video bg-gray-900">
                {video.thumbnailPath && (
                    <img
                        src={video.thumbnailPath}
                        alt={video.originalFileName}
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Film className="w-12 h-12 text-white" />
                </div>

                <button
                    onClick={handlePlay}
                    disabled={video.status !== 'COMPLETED'}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity group"
                >
                    <div className="bg-white/20 rounded-full p-4 group-hover:bg-white/30 transition-colors">
                        <Play className="w-8 h-8 text-white" />
                    </div>
                </button>

                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-xs text-white ${videoApiService.getStatusColor(video.status)}`}>
                        {videoApiService.getStatusDisplayName(video.status)}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-white font-medium truncate">{video.originalFileName}</h3>
                <p className="text-gray-400 text-sm mt-1 truncate">
                    {video.movieProduct?.title || 'Chưa có tiêu đề'}
                </p>

                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(video.uploadedAt)}
                    </span>
                    <span>{videoApiService.formatFileSize(video.fileSize)}</span>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
