import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { BASE_URL } from "../api/config.js";
import Layout from '../layouts/layout.jsx';

const FilmWatch = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const hls = new Hls();
        const video = videoRef.current;
        const hlsUrl = `${BASE_URL}/api/videos/hls-stream?bucketName=thanh&path=cc/output.m3u8`; // Dùng backtick ở đây

        if (Hls.isSupported() && video) {
            hls.loadSource(hlsUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Nếu trình duyệt hỗ trợ HLS natively (Safari)
            video.src = hlsUrl;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
        }

        return () => {
            hls.destroy(); // cleanup khi component unmount
        };
    }, []);

    return (
        <Layout>
            <div className="max-w-3xl mx-auto mt-6 bg-white rounded-2xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-blue-700 mb-4">Xem phim</h1>
                <video
                    ref={videoRef}
                    controls
                    width="100%"
                    height="auto"
                    className="mb-4 rounded-lg shadow"
                >
                    Trình duyệt của bạn không hỗ trợ video tag.
                </video>
            </div>
        </Layout>
    );
};

export default FilmWatch;
