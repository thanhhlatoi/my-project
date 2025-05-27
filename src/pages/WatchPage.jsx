import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, AlertCircle, Loader, ArrowLeft, Info } from 'lucide-react';

// Component chính để xem video - WatchPage
const WatchPage = ({ videoId }) => {
    // Nếu videoId truyền vào là undefined, lấy từ URL
    const params = new URLSearchParams(window.location.search);
    const id = videoId || params.get('id') || "2"; // Mặc định là 2 nếu không có ID

    const navigate = {
        back: () => window.history.back(),
        to: (path) => window.location.href = path
    };

    const videoRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [availableQualities, setAvailableQualities] = useState([]);
    const [currentQuality, setCurrentQuality] = useState('auto');
    const [showQualityMenu, setShowQualityMenu] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        initializeVideo();
    }, [id]);

    const initializeVideo = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log(`🎬 Initializing video player for ID: ${id}`);

            // URL cho master playlist
            const streamUrl = `http://192.168.1.73:8082/api/videofilm/stream/web/${id}`;
            console.log(`Loading HLS stream: ${streamUrl}`);

            // Khởi tạo HLS player
            await setupHLSPlayer(streamUrl);

            // Lấy thông tin master playlist để tạo danh sách chất lượng
            try {
                const response = await fetch(streamUrl);
                if (!response.ok) {
                    throw new Error(`Error fetching master playlist: ${response.status}`);
                }

                const m3u8Content = await response.text();
                console.log('Master playlist content:', m3u8Content);

                // Parse nội dung M3U8 để lấy danh sách qualities
                const manifestInfo = parseM3U8Content(m3u8Content);

                if (manifestInfo.playlists.length > 0) {
                    // Tạo danh sách chất lượng video từ manifest
                    const qualities = manifestInfo.playlists.map(playlist => {
                        // Tạo label phù hợp dựa trên resolution và bandwidth
                        let label = 'Unknown Quality';
                        if (playlist.resolution) {
                            // Lấy chỉ chiều cao từ resolution (ví dụ: 1920x1080 -> 1080p)
                            const heightMatch = playlist.resolution.match(/\d+x(\d+)/);
                            if (heightMatch) {
                                label = `${heightMatch[1]}p`;
                            } else {
                                label = playlist.resolution;
                            }
                        } else if (playlist.bandwidth) {
                            label = `${Math.round(playlist.bandwidth / 1000)}kbps`;
                        }

                        return {
                            label: label,
                            value: playlist.url, // Tên file (ví dụ: index_0.m3u8)
                            bandwidth: playlist.bandwidth,
                            resolution: playlist.resolution,
                            playlistUrl: playlist.fullUrl,
                            index: playlist.index
                        };
                    });

                    // Sắp xếp qualities từ cao đến thấp
                    qualities.sort((a, b) => b.bandwidth - a.bandwidth);

                    // Thêm option Auto ở đầu
                    qualities.unshift({ label: 'Auto', value: 'auto', bandwidth: 0 });

                    setAvailableQualities(qualities);
                    console.log('Available qualities:', qualities);
                }
            } catch (manifestError) {
                console.error('Error parsing manifest:', manifestError);
                // Không cần throw lỗi ở đây, vẫn tiếp tục phát video
            }

        } catch (err) {
            console.error('Error initializing video:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Hàm parse nội dung M3U8
    const parseM3U8Content = (content) => {
        const lines = content.split('\n');
        const info = {
            type: 'unknown',
            version: null,
            playlists: [],
            isVariant: false
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.startsWith('#EXT-X-VERSION:')) {
                info.version = parseInt(line.split(':')[1]);
            } else if (line.startsWith('#EXT-X-STREAM-INF:')) {
                info.isVariant = true;
                info.type = 'variant';

                // Parse BANDWIDTH và RESOLUTION từ STREAM-INF
                const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);
                const resolutionMatch = line.match(/RESOLUTION=([^,]+)/);
                const codecsMatch = line.match(/CODECS="([^"]+)"/);

                // Dòng tiếp theo chứa URL của playlist
                if (i + 1 < lines.length) {
                    const nextLine = lines[i + 1].trim();
                    if (nextLine && !nextLine.startsWith('#')) {
                        // Lấy tên file từ URL đầy đủ
                        const playlistUrl = nextLine;
                        const playlistName = playlistUrl.substring(playlistUrl.lastIndexOf('/') + 1);

                        // Lấy index từ tên file (ví dụ: index_0.m3u8 -> 0)
                        const indexMatch = playlistName.match(/index_(\d+)\.m3u8/);
                        const index = indexMatch ? parseInt(indexMatch[1]) : null;

                        info.playlists.push({
                            url: playlistName, // Tên file (ví dụ: index_0.m3u8)
                            fullUrl: playlistUrl, // URL đầy đủ
                            bandwidth: bandwidthMatch ? parseInt(bandwidthMatch[1]) : null,
                            resolution: resolutionMatch ? resolutionMatch[1] : null,
                            codecs: codecsMatch ? codecsMatch[1] : null,
                            index: index
                        });
                    }
                }
            }
        }

        // Sắp xếp playlists theo index để đảm bảo thứ tự đúng
        info.playlists.sort((a, b) => a.index - b.index);

        return info;
    };

    const setupHLSPlayer = async (streamUrl) => {
        const video = videoRef.current;
        if (!video) return;

        console.log(`🔧 Setting up HLS player with URL: ${streamUrl}`);

        try {
            // Kiểm tra HLS support
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Safari native support
                console.log('🍎 Using Safari native HLS support');
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                // Sử dụng HLS.js cho các browser khác
                console.log('🌐 Using HLS.js for browser support');

                // Khởi tạo HLS.js
                const hls = new window.Hls({
                    debug: false,            // Set true chỉ khi debug
                    enableWorker: true,
                    maxBufferLength: 30,
                    maxMaxBufferLength: 60,
                    lowLatencyMode: false,
                    backBufferLength: 90
                });

                // Lưu hls instance vào window để dễ dàng truy cập
                window.hls = hls;

                // Load source và attach media
                hls.loadSource(streamUrl);
                hls.attachMedia(video);

                // Xử lý sự kiện
                hls.on(window.Hls.Events.MANIFEST_PARSED, ( ) => {
                    console.log('✅ HLS manifest loaded successfully');
                    console.log('📊 HLS Levels:', hls.levels);

                    // Auto-play sau khi manifest được parse (tuỳ chọn)
                    video.play().catch(e => console.warn('Auto-play prevented:', e));
                });

                // Xử lý lỗi
                hls.on(window.Hls.Events.ERROR, (event, data) => {
                    console.error('❌ HLS Error:', { event, data });

                    if (data.fatal) {
                        switch(data.type) {
                            case window.Hls.ErrorTypes.NETWORK_ERROR:
                                // Try to recover network error
                                console.log('Fatal network error, trying to recover...');
                                hls.startLoad();
                                break;
                            case window.Hls.ErrorTypes.MEDIA_ERROR:
                                console.log('Fatal media error, trying to recover...');
                                hls.recoverMediaError();
                                break;
                            default:
                                // Cannot recover
                                hls.destroy();
                                setError(`Lỗi HLS: ${data.details} - ${data.reason || ''}`);
                                break;
                        }
                    }
                });

                // Track quality changes
                hls.on(window.Hls.Events.LEVEL_SWITCHED, (event, data) => {
                    const level = hls.levels[data.level];
                    if (level) {
                        console.log(`📺 Quality switched to level ${data.level}: ${level.width}x${level.height} @ ${level.bitrate/1000}kbps`);

                        // Cập nhật currentQuality để UI hiển thị đúng
                        if (data.level >= 0) {
                            const qualityValue = `index_${data.level}.m3u8`;
                            setCurrentQuality(qualityValue);
                        } else {
                            // Nếu level = -1, đó là auto
                            setCurrentQuality('auto');
                        }
                    }
                });
            } else {
                setError('Trình duyệt không hỗ trợ HLS streaming');
            }
        } catch (err) {
            console.error('Setup HLS player error:', err);
            setError(`Lỗi khởi tạo player: ${err.message}`);
        }
    };

    // Chuyển đổi chất lượng video
    const changeQuality = (qualityValue) => {
        if (!window.hls) return;

        if (qualityValue === 'auto') {
            window.hls.currentLevel = -1; // Auto quality
            console.log('Chuyển sang chế độ tự động chọn chất lượng');
            setCurrentQuality('auto');
        } else {
            // Tìm level index từ tên file
            // Đặc thù cho tên file dạng 'index_0.m3u8', 'index_1.m3u8' v.v.
            const indexMatch = qualityValue.match(/index_(\d+)\.m3u8/);
            if (indexMatch) {
                const levelIndex = parseInt(indexMatch[1]);

                if (!isNaN(levelIndex) && levelIndex >= 0 && levelIndex < window.hls.levels.length) {
                    window.hls.currentLevel = levelIndex;
                    console.log(`Chuyển sang chất lượng cố định: Level ${levelIndex}`);
                    setCurrentQuality(qualityValue);
                } else {
                    console.warn(`Không tìm thấy level phù hợp cho ${qualityValue}`);
                }
            } else {
                console.warn(`Không thể xác định index từ tên file: ${qualityValue}`);
            }
        }

        setShowQualityMenu(false);
    };

    // Các phương thức điều khiển video khác
    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play().catch(console.error);
        }
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const handleSeek = (e) => {
        const video = videoRef.current;
        if (!video) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };



    // Video event handlers
    const handleVideoEvents = {
        onLoadedMetadata: () => {
            setDuration(videoRef.current.duration);
        },
        onTimeUpdate: () => {
            setCurrentTime(videoRef.current.currentTime);
        },
        onPlay: () => setIsPlaying(true),
        onPause: () => setIsPlaying(false),
        onVolumeChange: () => {
            setVolume(videoRef.current.volume);
            setIsMuted(videoRef.current.muted);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center text-white">
                    <Loader className="w-12 h-12 animate-spin mb-4" />
                    <p className="text-lg">Đang tải video...</p>
                    <p className="text-sm text-gray-400 mt-2">Video ID: {id}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center text-red-400 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 mb-4" />
                    <h2 className="text-xl font-bold mb-2">Lỗi phát video</h2>
                    <p className="mb-4">{error}</p>
                    <div className="flex gap-4">
                        <button
                            onClick={initializeVideo}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Thử lại
                        </button>
                        <button
                            onClick={() => navigate.to('/videos')}
                            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate.back()}
                        className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                        <span>Quay lại</span>
                    </button>

                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
                    >
                        <Info className="w-6 h-6" />
                        <span>Thông tin</span>
                    </button>
                </div>
            </div>

            {/* Video Player */}
            <div className="relative w-full h-screen">
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    playsInline
                    {...handleVideoEvents}
                />

                {/* Custom Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                    {/* Progress Bar */}
                    <div
                        className="w-full h-3 bg-gray-600 rounded-full mb-6 cursor-pointer"
                        onClick={handleSeek}
                    >
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-6">
                            <button onClick={togglePlay} className="hover:text-blue-400 transition-colors">
                                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                            </button>

                            <div className="flex items-center space-x-3">
                                <button onClick={toggleMute} className="hover:text-blue-400 transition-colors">
                                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={volume}
                                    onChange={(e) => {
                                        const newVolume = parseFloat(e.target.value);
                                        videoRef.current.volume = newVolume;
                                        setVolume(newVolume);
                                        setIsMuted(newVolume === 0);
                                    }}
                                    className="w-24"
                                />
                            </div>

                            <span className="text-lg">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        {/* Quality Selector */}
                        {availableQualities.length > 0 && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                                    className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                                >
                                    <Settings className="w-6 h-6" />
                                    <span className="text-lg">
                                        {availableQualities.find(q => q.value === currentQuality)?.label || 'Auto'}
                                    </span>
                                </button>

                                {showQualityMenu && (
                                    <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg py-2 min-w-40">
                                        {availableQualities.map((quality) => (
                                            <button
                                                key={quality.value}
                                                onClick={() => changeQuality(quality.value)}
                                                className={`block w-full text-left px-4 py-3 text-lg hover:bg-gray-700 transition-colors ${
                                                    currentQuality === quality.value ? 'text-blue-400 bg-gray-800' : ''
                                                }`}
                                            >
                                                {quality.label}
                                                {quality.bandwidth > 0 && (
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {Math.round(quality.bandwidth / 1000)}kbps
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Video Info Panel */}
                {showInfo && (
                    <div className="absolute top-0 right-0 w-80 h-full bg-black/90 text-white p-6 overflow-y-auto">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">Thông tin video</h3>

                            <div className="space-y-2 text-sm">
                                <div><strong>ID:</strong> {id}</div>
                                <div><strong>URL Stream:</strong></div>
                                <div className="break-all text-gray-400 ml-2 text-xs">
                                    http://192.168.1.73:8082/api/videofilm/stream/web/{id}
                                </div>
                            </div>

                            {availableQualities.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-bold mb-2">Chất lượng video có sẵn:</h4>
                                    <div className="text-xs space-y-1">
                                        {availableQualities.filter(q => q.value !== 'auto').map((quality) => (
                                            <div key={quality.value} className="ml-2">
                                                <div><strong>{quality.label}</strong></div>
                                                <div className="text-gray-400">
                                                    Bandwidth: {Math.round(quality.bandwidth / 1000)}kbps
                                                </div>
                                                <div className="text-gray-400 break-all">
                                                    URL: {quality.playlistUrl}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchPage;
