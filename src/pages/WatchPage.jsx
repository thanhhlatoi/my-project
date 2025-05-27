import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Hls from 'hls.js';
import VideoApiService from '../api/VideoApiService'; // Import VideoApiService

const WatchPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const videoApiService = useRef(new VideoApiService()).current; // Initialize service

    // State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [videoInfo, setVideoInfo] = useState(null);
    const [availableQualities, setAvailableQualities] = useState([]);

    // Hàm lấy thông tin video sử dụng VideoApiService
    const fetchVideoInfo = async () => {
        try {
            const data = await videoApiService.getVideoById(id);
            setVideoInfo(data);
            return data;
        } catch (err) {
            console.error('Error fetching video info:', err);
            setError('Không thể tải thông tin video');
            throw err;
        }
    };

    // Hàm test HLS structure trước khi setup player
    const testHLSStructure = async () => {
        try {
            console.log('🔧 Testing HLS structure...');
            const testResult = await videoApiService.testHLSStructure(id);

            if (!testResult.valid) {
                throw new Error(`HLS structure invalid: ${testResult.error || 'Unknown error'}`);
            }

            console.log('✅ HLS structure is valid');
            setAvailableQualities(testResult.qualities);
            return testResult;
        } catch (err) {
            console.error('❌ HLS structure test failed:', err);
            throw err;
        }
    };

    // Setup HLS player sử dụng VideoApiService URLs
    const setupHlsPlayer = async () => {
        if (!videoRef.current) return;

        try {
            // Lấy master playlist URL từ VideoApiService
            const masterPlaylistUrl = videoApiService.getMasterPlaylistUrl(id);
            console.log('Loading HLS from URL:', masterPlaylistUrl);

            // Hủy instance HLS cũ nếu có
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }

            // Kiểm tra xem trình duyệt có hỗ trợ HLS.js không
            if (Hls.isSupported()) {
                const hls = new Hls({
                    debug: true,
                    enableWorker: true,
                    // Thêm custom loader để handle errors tốt hơn
                    xhrSetup: function(xhr, url) {
                        console.log(`🌐 Loading: ${url}`);
                    }
                });

                // Gắn với video element
                hls.attachMedia(videoRef.current);

                // Bắt sự kiện
                hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                    console.log('HLS.js: Media attached');
                    hls.loadSource(masterPlaylistUrl);
                });

                hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                    console.log('HLS.js: Manifest parsed, found levels:', data.levels);
                    setLoading(false);

                    // Auto-play với error handling
                    videoRef.current.play().catch(e => {
                        console.warn('Auto-play was prevented:', e);
                    });
                });

                // Enhanced error handling
                hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('HLS.js error:', data);

                    // Log chi tiết error để debug
                    if (data.response && data.response.url) {
                        console.error('Failed URL:', data.response.url);
                        console.error('Response status:', data.response.code);
                    }

                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.log('🔄 Fatal network error, trying to recover...');

                                // Retry with backoff
                                setTimeout(() => {
                                    hls.startLoad();
                                }, 1000);
                                break;

                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log('🔄 Fatal media error, trying to recover...');
                                hls.recoverMediaError();
                                break;

                            default:
                                console.error('💥 Fatal error, cannot recover');
                                setError(`Không thể phát video: ${data.details || 'Unknown error'}`);
                                hls.destroy();
                                hlsRef.current = null;
                                break;
                        }
                    } else {
                        // Non-fatal errors - just log them
                        console.warn('⚠️ Non-fatal HLS error:', data.details);
                    }
                });

                // Additional events for debugging
                hls.on(Hls.Events.FRAG_LOADING, (event, data) => {
                    console.log('🔄 Loading fragment:', data.frag.url);
                });

                hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
                    console.log('✅ Fragment loaded:', data.frag.url);
                });

                hls.on(Hls.Events.FRAG_LOAD_ERROR, (event, data) => {
                    console.error('❌ Fragment load error:', data.frag.url, data.response);
                });

                // Lưu reference
                hlsRef.current = hls;
            }
            // Safari hỗ trợ HLS natively
            else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                videoRef.current.src = masterPlaylistUrl;
                videoRef.current.addEventListener('loadedmetadata', () => {
                    setLoading(false);
                    videoRef.current.play().catch(e => {
                        console.warn('Auto-play was prevented:', e);
                    });
                });
            }
            // Trình duyệt không hỗ trợ HLS
            else {
                setError('Trình duyệt của bạn không hỗ trợ phát video HLS');
                setLoading(false);
            }
        } catch (err) {
            console.error('Error setting up HLS player:', err);
            setError(`Lỗi khởi tạo player: ${err.message}`);
            setLoading(false);
        }
    };

    // Xử lý khi component mount
    useEffect(() => {
        const initPlayer = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log(`🎬 Initializing player for video ${id}`);

                // 1. Lấy thông tin video
                await fetchVideoInfo();

                // 2. Test HLS structure trước
                await testHLSStructure();

                // 3. Setup HLS player
                await setupHlsPlayer();

            } catch (err) {
                console.error('Error initializing player:', err);
                setError(err.message || 'Không thể khởi tạo video player');
                setLoading(false);
            }
        };

        if (id) {
            initPlayer();
        }

        // Cleanup khi component unmount
        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [id]);

    // Hàm thử lại
    const handleRetry = () => {
        setError(null);
        setLoading(true);

        // Cleanup và restart
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        // Restart initialization
        setTimeout(() => {
            const initPlayer = async () => {
                try {
                    await fetchVideoInfo();
                    await testHLSStructure();
                    await setupHlsPlayer();
                } catch (err) {
                    console.error('Retry failed:', err);
                    setError(err.message || 'Không thể khởi tạo video player');
                    setLoading(false);
                }
            };
            initPlayer();
        }, 500);
    };

    // Hàm quay lại
    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="bg-black min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-gray-900 p-4">
                <button
                    onClick={handleGoBack}
                    className="text-white hover:text-blue-400 transition flex items-center gap-2"
                >
                    <ArrowLeft size={20} />
                    <span>Quay lại</span>
                </button>
            </div>

            {/* Video Player */}
            <div className="relative w-full bg-black flex-grow flex items-center justify-center">
                {/* Loading */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
                        <div className="text-center">
                            <div className="inline-block w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-white font-medium">Đang tải video...</p>
                            <p className="text-gray-400 text-sm mt-2">Đang kiểm tra HLS structure...</p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-10">
                        <div className="text-center max-w-md p-6 bg-gray-900 rounded-lg">
                            <div className="text-red-500 text-5xl mb-4">⚠️</div>
                            <h3 className="text-xl text-white font-bold mb-2">Lỗi phát video</h3>
                            <p className="text-gray-300 mb-4">{error}</p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={handleGoBack}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Quay lại
                                </button>
                                <button
                                    onClick={handleRetry}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Thử lại
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Video Element */}
                <video
                    ref={videoRef}
                    className="w-full h-full max-h-screen object-contain bg-black"
                    controls
                    autoPlay
                    playsInline
                ></video>
            </div>

            {/* Debug Info */}
            <div className="bg-gray-900 p-4 text-xs text-gray-400">
                <div className="max-w-6xl mx-auto">
                    <h3 className="font-bold mb-2">Debug Info:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p><strong>Video ID:</strong> {id}</p>
                            <p><strong>Master Playlist:</strong> {videoApiService.getMasterPlaylistUrl(id)}</p>
                            {videoInfo && videoInfo.movieProduct && (
                                <p><strong>Title:</strong> {videoInfo.movieProduct.title || 'N/A'}</p>
                            )}
                        </div>
                        <div>
                            <p><strong>Available Qualities:</strong> {availableQualities.length}</p>
                            {availableQualities.length > 0 && (
                                <div className="mt-1">
                                    {availableQualities.map((quality, index) => (
                                        <div key={index} className="text-xs">
                                            • {quality.label} ({quality.bandwidth} bps)
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchPage;
