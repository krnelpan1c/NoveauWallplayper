import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWallpaperFiles } from '../lib/db';

const Renderer = ({ wallpaper }) => {
    if (!wallpaper) return <div className="w-full h-full bg-[#0a0a0a]" />;

    if (wallpaper.type === 'video') {
        return <VideoRenderer wallpaper={wallpaper} />;
    }

    if (wallpaper.type === 'html') {
        return <HTMLRenderer wallpaper={wallpaper} />;
    }

    return null;
};

const VideoRenderer = ({ wallpaper }) => {
    const [videoUrl, setVideoUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') navigate('/');
        };
        window.addEventListener('keydown', handleKeyDown);

        let url = '';
        const loadVideo = async () => {
            const files = await getWallpaperFiles(wallpaper.id);
            const videoFile = files.find(f => f.path === wallpaper.entryPoint);
            if (videoFile) {
                url = URL.createObjectURL(videoFile.blob);
                setVideoUrl(url);
            }
        };
        loadVideo();
        return () => {
            if (url) URL.revokeObjectURL(url);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [wallpaper, navigate]);

    if (!videoUrl) return <div className="w-full h-full bg-[#0a0a0a]" />;

    return (
        <video
            className="w-full h-full object-cover block m-0 p-0 border-0"
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{
                width: '100vw',
                height: '100vh',
                objectFit: 'cover',
                display: 'block'
            }}
        />
    );
};

const HTMLRenderer = ({ wallpaper }) => {
    const [iframeUrl, setIframeUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') navigate('/');
        };
        window.addEventListener('keydown', handleKeyDown);

        const loadHtml = async () => {
            if ('serviceWorker' in navigator) {
                await navigator.serviceWorker.ready;
                if (!navigator.serviceWorker.controller) {
                    await new Promise(resolve => {
                        navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true });
                        setTimeout(resolve, 1000);
                    });
                }
            }
            setIframeUrl(`${import.meta.env.BASE_URL}wallplayper-content/${wallpaper.id}/${wallpaper.entryPoint}`);
        };
        loadHtml();

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [wallpaper, navigate]);

    if (!iframeUrl) return <div className="w-full h-full bg-[#0a0a0a]" />;

    return (
        <iframe
            className="w-full h-full border-0 m-0 p-0 block"
            src={iframeUrl}
            title="Wallpaper"
            sandbox="allow-scripts allow-same-origin"
            style={{
                border: 'none',
                width: '100vw',
                height: '100vh',
                minWidth: '100vw',
                minHeight: '100vh',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0
            }}
            width="100%"
            height="100%"
        />
    );
};

export default Renderer;
