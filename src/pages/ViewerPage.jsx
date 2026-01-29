import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWallpapers } from '../lib/db';
import Renderer from '../components/Renderer';
import FullscreenPrompt from '../components/FullscreenPrompt';

const ViewerPage = () => {
    const { id } = useParams();
    const [wallpaper, setWallpaper] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadWallpaper = async () => {
            const wallpapers = await getWallpapers();
            const current = wallpapers.find(w => w.id === Number(id));
            if (current) {
                setWallpaper(current);
            }
        };
        loadWallpaper();

        // Check if user has dismissed the prompt before
        const isDismissed = localStorage.getItem('hideFullscreenPrompt') === 'true';
        if (!isDismissed) {
            setShowPrompt(true);
        }

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') navigate('/');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [id, navigate]);

    return (
        <div className="fixed top-0 left-0 w-[100vw] h-[100vh] overflow-hidden bg-black z-0">
            <Renderer wallpaper={wallpaper} />
            {showPrompt && <FullscreenPrompt onDismiss={() => setShowPrompt(false)} />}
        </div>
    );
};

export default ViewerPage;
