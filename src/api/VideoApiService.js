// // VideoApiService.js - Service hoàn chỉnh cho Video Film API với HLS streaming
// const BASE_URL = 'http://192.168.100.193:8082/api/videofilm'; // Thay đổi URL theo server của bạn
//
// class VideoApiService {
//     constructor() {
//         this.baseURL = BASE_URL;
//     }
//
//     // Helper method để xử lý response
//     async handleResponse(response) {
//         if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
//         }
//
//         // Kiểm tra content type để xử lý đúng
//         const contentType = response.headers.get('content-type');
//         if (contentType && contentType.includes('application/json')) {
//             return await response.json();
//         } else if (contentType && (contentType.includes('application/x-mpegURL') || contentType.includes('text'))) {
//             return await response.text();
//         } else {
//             return await response.blob();
//         }
//     }
//
//     // Helper method để tạo URL với query params
//     buildUrlWithParams(endpoint, params = {}) {
//         const url = new URL(`${this.baseURL}${endpoint}`);
//         Object.keys(params).forEach(key => {
//             if (params[key] !== null && params[key] !== undefined) {
//                 url.searchParams.append(key, params[key]);
//             }
//         });
//         return url.toString();
//     }
//
//     // 1. Lấy video theo tên file
//     async getVideoByFileName(fileName) {
//         try {
//             const url = this.buildUrlWithParams('/by-filename', { fileName });
//             const response = await fetch(url);
//             return await this.handleResponse(response);
//         } catch (error) {
//             console.error('Error fetching video by filename:', error);
//             throw error;
//         }
//     }
//
//     // 2. Lấy videos theo trạng thái
//     async getVideosByStatus(status) {
//         try {
//             const url = this.buildUrlWithParams('/by-status', { status });
//             const response = await fetch(url);
//             return await this.handleResponse(response);
//         } catch (error) {
//             console.error('Error fetching videos by status:', error);
//             throw error;
//         }
//     }
//
//     // 3. Đếm số lượng videos theo trạng thái
//     async countVideosByStatus(status) {
//         try {
//             const url = this.buildUrlWithParams('/count-by-status', { status });
//             const response = await fetch(url);
//             return await this.handleResponse(response);
//         } catch (error) {
//             console.error('Error counting videos by status:', error);
//             throw error;
//         }
//     }
//
//     // 4. Lấy videos theo định dạng file
//     async getVideosByFileFormat(fileFormat) {
//         try {
//             const url = this.buildUrlWithParams('/by-format', { fileFormat });
//             const response = await fetch(url);
//             return await this.handleResponse(response);
//         } catch (error) {
//             console.error('Error fetching videos by format:', error);
//             throw error;
//         }
//     }
//
//     // 5. Lấy videos gần đây
//     async getRecentVideos() {
//         try {
//             const response = await fetch(`${this.baseURL}/recent`);
//             return await this.handleResponse(response);
//         } catch (error) {
//             console.error('Error fetching recent videos:', error);
//             throw error;
//         }
//     }
//
//     // 6. Lấy video theo ID
//     async getVideoById(id) {
//         try {
//             const response = await fetch(`${this.baseURL}/${id}`);
//             return await this.handleResponse(response);
//         } catch (error) {
//             console.error('Error fetching video by ID:', error);
//             throw error;
//         }
//     }
//
//     // 7. Lấy thông tin streaming cho video
//     async getVideoStreamingInfo(videoId) {
//         try {
//             const response = await fetch(`${this.baseURL}/streaming-info/${videoId}`);
//             return await this.handleResponse(response);
//         } catch (error) {
//             console.error('Error fetching streaming info:', error);
//             throw error;
//         }
//     }
//
//     // 8. Kiểm tra trạng thái video
//     async getVideoStatus(videoId) {
//         try {
//             const response = await fetch(`${this.baseURL}/status/${videoId}`);
//             return await this.handleResponse(response);
//         } catch (error) {
//             console.error('Error fetching video status:', error);
//             throw error;
//         }
//     }
//
//     // 9. Lấy M3U8 cho web streaming
//     async getWebStreamM3U8(videoId) {
//         try {
//             const response = await fetch(`${this.baseURL}/stream/web/${videoId}`);
//             return await this.handleResponse(response);
//         } catch (error) {
//             console.error('Error fetching web M3U8:', error);
//             throw error;
//         }
//     }
//
//     // 10. Lấy M3U8 cho mobile streaming
//     async getMobileStreamM3U8(videoId) {
//         try {
//             const response = await fetch(`${this.baseURL}/stream/mobile/${videoId}`);
//             return await this.handleResponse(response);
//         } catch (error) {
//             console.error('Error fetching mobile M3U8:', error);
//             throw error;
//         }
//     }
//
//     // 11. Lấy sub-playlist cho web
//     async getWebSubPlaylist(videoId, playlistName) {
//         try {
//             const response = await fetch(`${this.baseURL}/playlist/web/${videoId}/${playlistName}`);
//             return await this.handleResponse(response);
//         } catch (error) {
//             console.error('Error fetching web sub-playlist:', error);
//             throw error;
//         }
//     }
//
//     // 12. Lấy video segment (cho cả web và mobile)
//     async getVideoSegment(videoId, segmentName, platform = 'web') {
//         try {
//             const response = await fetch(`${this.baseURL}/segment/${platform}/${videoId}/${segmentName}`);
//             return await response.arrayBuffer(); // Trả về binary data
//         } catch (error) {
//             console.error('Error fetching video segment:', error);
//             throw error;
//         }
//     }
//
//     // 13. Lấy debug M3U8 content
//     async getDebugM3U8(videoId) {
//         try {
//             const response = await fetch(`${this.baseURL}/debug/m3u8/${videoId}`);
//             return await this.handleResponse(response);
//         } catch (error) {
//             console.error('Error fetching debug M3U8:', error);
//             throw error;
//         }
//     }
//
//     // URL Generators
//     // 14. Lấy URL streaming cho web
//     getWebStreamUrl(videoId) {
//         return `${this.baseURL}/stream/web/${videoId}`;
//     }
//
//     // 15. Lấy URL streaming cho mobile
//     getMobileStreamUrl(videoId) {
//         return `${this.baseURL}/stream/mobile/${videoId}`;
//     }
//
//     // 16. Lấy URL cho sub-playlist web
//     getWebSubPlaylistUrl(videoId, playlistName) {
//         return `${this.baseURL}/playlist/web/${videoId}/${playlistName}`;
//     }
//
//     // 17. Lấy URL cho segment
//     getSegmentUrl(videoId, segmentName, platform = 'web') {
//         return `${this.baseURL}/segment/${platform}/${videoId}/${segmentName}`;
//     }
//
//     // 18. Lấy URL debug M3U8
//     getDebugM3U8Url(videoId) {
//         return `${this.baseURL}/debug/m3u8/${videoId}`;
//     }
//
//     // HLS Streaming Methods
//     // 19. Kiểm tra video có sẵn sàng streaming không
//     async isVideoReadyForStreaming(videoId) {
//         try {
//             const statusInfo = await this.getVideoStatus(videoId);
//             return statusInfo.status === 'COMPLETED' && statusInfo.hasHlsPath;
//         } catch (error) {
//             console.error('Error checking video streaming status:', error);
//             return false;
//         }
//     }
//
//     // 20. Lấy thông tin video hoàn chỉnh cho player
//     async getVideoForPlayer(videoId) {
//         try {
//             const [video, statusInfo] = await Promise.all([
//                 this.getVideoById(videoId),
//                 this.getVideoStatus(videoId)
//             ]);
//
//             let streamingInfo = null;
//             try {
//                 streamingInfo = await this.getVideoStreamingInfo(videoId);
//             } catch (e) {
//                 console.warn('Streaming info not available:', e.message);
//             }
//
//             return {
//                 ...video,
//                 statusInfo,
//                 streamingInfo,
//                 urls: {
//                     webStream: this.getWebStreamUrl(videoId),
//                     mobileStream: this.getMobileStreamUrl(videoId),
//                     debugM3U8: this.getDebugM3U8Url(videoId)
//                 },
//                 isReadyForStreaming: statusInfo.status === 'COMPLETED' && statusInfo.hasHlsPath
//             };
//         } catch (error) {
//             console.error('Error getting video for player:', error);
//             throw error;
//         }
//     }
//
//
//
//     // 22. Get HLS manifest info và parse để lấy sub-playlists
//     // Sửa lại hàm getHLSManifestInfo trong VideoApiService.js
//     async getHLSManifestInfo(videoId, platform = 'web') {
//         try {
//             const m3u8Content = platform === 'web'
//                 ? await this.getWebStreamM3U8(videoId)
//                 : await this.getMobileStreamM3U8(videoId);
//
//             // Parse M3U8 để lấy thông tin
//             const lines = m3u8Content.split('\n');
//             const info = {
//                 type: 'unknown',
//                 version: null,
//                 targetDuration: null,
//                 sequences: [],
//                 playlists: [],
//                 isVariant: false
//             };
//
//             for (let i = 0; i < lines.length; i++) {
//                 const line = lines[i].trim();
//
//                 if (line.startsWith('#EXT-X-VERSION:')) {
//                     info.version = parseInt(line.split(':')[1]);
//                 } else if (line.startsWith('#EXT-X-TARGETDURATION:')) {
//                     info.targetDuration = parseInt(line.split(':')[1]);
//                 } else if (line.startsWith('#EXT-X-STREAM-INF:')) {
//                     info.isVariant = true;
//                     info.type = 'variant';
//
//                     // Parse attributes từ dòng STREAM-INF
//                     const attributes = {};
//                     const attrParts = line.substring(line.indexOf(':') + 1).split(',');
//
//                     attrParts.forEach(part => {
//                         const [key, value] = part.split('=');
//                         if (key && value) {
//                             attributes[key.trim()] = value.trim();
//                         }
//                     });
//
//                     // Next line should be playlist URL
//                     if (i + 1 < lines.length) {
//                         const nextLine = lines[i + 1].trim();
//                         if (nextLine && !nextLine.startsWith('#')) {
//                             // Trích xuất tên file playlist từ URL đầy đủ
//                             const playlistUrl = nextLine;
//                             const playlistName = playlistUrl.substring(playlistUrl.lastIndexOf('/') + 1);
//
//                             info.playlists.push({
//                                 url: playlistName, // Sử dụng tên file thay vì URL đầy đủ
//                                 fullUrl: playlistUrl,
//                                 bandwidth: parseInt(attributes.BANDWIDTH || 0),
//                                 resolution: attributes.RESOLUTION || null,
//                                 codecs: attributes.CODECS ? attributes.CODECS.replace(/"/g, '') : null,
//                                 streamInfo: line
//                             });
//                         }
//                     }
//                 }
//             }
//
//             console.log('Parsed HLS Manifest:', info);
//             return info;
//         } catch (error) {
//             console.error('Error parsing HLS manifest:', error);
//             throw error;
//         }
//     }
//
//     // Status Helper Methods
//     // 23. Lấy videos theo trạng thái cụ thể
//     async getCompletedVideos() {
//         return await this.getVideosByStatus('COMPLETED');
//     }
//
//     async getProcessingVideos() {
//         return await this.getVideosByStatus('PROCESSING');
//     }
//
//     async getFailedVideos() {
//         return await this.getVideosByStatus('FAILED');
//     }
//
//     async getUploadingVideos() {
//         return await this.getVideosByStatus('UPLOADING');
//     }
//
//     // Status Check Methods
//     isVideoCompleted(video) {
//         return video.status === 'COMPLETED';
//     }
//
//     isVideoProcessing(video) {
//         return video.status === 'PROCESSING';
//     }
//
//     isVideoFailed(video) {
//         return video.status === 'FAILED';
//     }
//
//     isVideoUploading(video) {
//         return video.status === 'UPLOADING';
//     }
//
//     // UI Helper Methods
//     // 24. Lấy status name với tiếng Việt
//     getStatusDisplayName(status) {
//         const statusMap = {
//             'UPLOADING': 'Đang tải lên',
//             'PROCESSING': 'Đang xử lý',
//             'COMPLETED': 'Hoàn thành',
//             'FAILED': 'Thất bại'
//         };
//         return statusMap[status] || status;
//     }
//
//     // 25. Lấy status color cho UI
//     getStatusColor(status) {
//         const colorMap = {
//             'UPLOADING': 'bg-blue-600',
//             'PROCESSING': 'bg-yellow-600',
//             'COMPLETED': 'bg-green-600',
//             'FAILED': 'bg-red-600'
//         };
//         return colorMap[status] || 'bg-gray-600';
//     }
//
//     // Utility Methods
//     // 26. Validate video file
//     validateVideoFile(file) {
//         const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'];
//         const maxSize = 500 * 1024 * 1024; // 500MB
//
//         if (!allowedTypes.includes(file.type)) {
//             throw new Error('Định dạng file không được hỗ trợ');
//         }
//
//         if (file.size > maxSize) {
//             throw new Error('File quá lớn. Kích thước tối đa là 500MB');
//         }
//
//         return true;
//     }
//
//     // 27. Format file size
//     formatFileSize(bytes) {
//         if (bytes === 0) return '0 Bytes';
//         const k = 1024;
//         const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//     }
//
//     // 28. Format duration
//     formatDuration(seconds) {
//         const hours = Math.floor(seconds / 3600);
//         const minutes = Math.floor((seconds % 3600) / 60);
//         const secs = Math.floor(seconds % 60);
//
//         if (hours > 0) {
//             return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//         } else {
//             return `${minutes}:${secs.toString().padStart(2, '0')}`;
//         }
//     }
//
//     // Auth Methods (nếu cần)
//     getAuthHeader() {
//         const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
//         return token ? `Bearer ${token}` : '';
//     }
//
//     setAuthToken(token) {
//         localStorage.setItem('authToken', token);
//     }
//
//     // 29. Lấy danh sách sub-playlists từ master playlist
//     async getAvailableSubPlaylists(videoId, platform = 'web') {
//         try {
//             const manifestInfo = await this.getHLSManifestInfo(videoId, platform);
//
//             if (manifestInfo.isVariant && manifestInfo.playlists.length > 0) {
//                 return manifestInfo.playlists.map(playlist => ({
//                     name: playlist.url, // Đây chính là playlistName
//                     bandwidth: playlist.bandwidth,
//                     resolution: playlist.resolution,
//                     url: this.getWebSubPlaylistUrl(videoId, playlist.url)
//                 }));
//             }
//
//             return [];
//         } catch (error) {
//             console.error('Error getting sub-playlists:', error);
//             throw error;
//         }
//     }
//
//     // 30. Test một sub-playlist cụ thể
//     async testSubPlaylist(videoId, playlistName) {
//         try {
//             const subPlaylistContent = await this.getWebSubPlaylist(videoId, playlistName);
//             const lines = subPlaylistContent.split('\n');
//
//             let segmentCount = 0;
//             const segments = [];
//
//             for (let i = 0; i < lines.length; i++) {
//                 const line = lines[i].trim();
//                 if (line.startsWith('#EXTINF:')) {
//                     if (i + 1 < lines.length) {
//                         const segmentUrl = lines[i + 1].trim();
//                         segments.push(segmentUrl);
//                         segmentCount++;
//                     }
//                 }
//             }
//
//             return {
//                 playlistName,
//                 segmentCount,
//                 segments: segments.slice(0, 5), // Chỉ lấy 5 segment đầu làm sample
//                 isValid: segmentCount > 0
//             };
//         } catch (error) {
//             console.error(`Error testing sub-playlist ${playlistName}:`, error);
//             return {
//                 playlistName,
//                 segmentCount: 0,
//                 segments: [],
//                 isValid: false,
//                 error: error.message
//             };
//         }
//     }
//
//     // 31. Helper để validate HLS structure
//     async validateHLSStructure(videoId) {
//         try {
//             console.log(`🔍 Validating HLS structure for video ${videoId}...`);
//
//             // 1. Kiểm tra master playlist
//             const manifestInfo = await this.getHLSManifestInfo(videoId, 'web');
//             console.log('📋 Master playlist info:', manifestInfo);
//
//             if (!manifestInfo.isVariant) {
//                 return {
//                     valid: false,
//                     error: 'Not a variant playlist - missing multiple quality levels'
//                 };
//             }
//
//             // 2. Test từng sub-playlist
//             const subPlaylistTests = await Promise.all(
//                 manifestInfo.playlists.map(playlist =>
//                     this.testSubPlaylist(videoId, playlist.url)
//                 )
//             );
//
//             console.log('🎬 Sub-playlist tests:', subPlaylistTests);
//
//             const validSubPlaylists = subPlaylistTests.filter(test => test.isValid);
//
//             return {
//                 valid: validSubPlaylists.length > 0,
//                 masterPlaylist: manifestInfo,
//                 subPlaylists: subPlaylistTests,
//                 validCount: validSubPlaylists.length,
//                 totalCount: subPlaylistTests.length
//             };
//         } catch (error) {
//             console.error('Error validating HLS structure:', error);
//             return {
//                 valid: false,
//                 error: error.message
//             };
//         }
//     }
// }
//
// // Export singleton instance
// const videoApiService = new VideoApiService();
// export default videoApiService;
// VideoApiService.js
class VideoApiService {
    constructor() {
        this.baseURL = 'http://192.168.100.193:8082/api/videofilm';
    }

    async handleResponse(response) {
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else if (contentType && (contentType.includes('application/x-mpegURL') || contentType.includes('text'))) {
            return await response.text();
        } else {
            return await response.blob();
        }
    }

    buildUrlWithParams(endpoint, params = {}) {
        const url = new URL(`${this.baseURL}${endpoint}`);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });
        return url.toString();
    }

    async getVideoById(id) {
        try {
            const response = await fetch(`${this.baseURL}/${id}`);
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching video by ID:', error);
            throw error;
        }
    }

    async getRecentVideos() {
        try {
            const response = await fetch(`${this.baseURL}/recent`);
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching recent videos:', error);
            throw error;
        }
    }

    async getVideosByStatus(status) {
        try {
            const url = this.buildUrlWithParams('/by-status', { status });
            const response = await fetch(url);
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching videos by status:', error);
            throw error;
        }
    }

    async getWebStreamM3U8(videoId) {
        try {
            const response = await fetch(`${this.baseURL}/stream/web/${videoId}`);
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching web M3U8:', error);
            throw error;
        }
    }

    getWebStreamUrl(videoId) {
        return `${this.baseURL}/stream/web/${videoId}`;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }

    getStatusDisplayName(status) {
        const statusMap = {
            'UPLOADING': 'Đang tải lên',
            'PROCESSING': 'Đang xử lý',
            'COMPLETED': 'Hoàn thành',
            'FAILED': 'Thất bại'
        };
        return statusMap[status] || status;
    }

    getStatusColor(status) {
        const colorMap = {
            'UPLOADING': 'bg-blue-600',
            'PROCESSING': 'bg-yellow-600',
            'COMPLETED': 'bg-green-600',
            'FAILED': 'bg-red-600'
        };
        return colorMap[status] || 'bg-gray-600';
    }
}

export default VideoApiService;
