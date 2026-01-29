import React, { useState, useEffect, useCallback } from 'react';
import { getWallpapers } from '../lib/db';
import Picker from '../components/Picker';
import UploadModal from '../components/UploadModal';
import HelpModal from '../components/HelpModal';
import { useNavigate } from 'react-router-dom';
import { Monitor, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PickerPage = () => {
    const [wallpapers, setWallpapers] = useState([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const navigate = useNavigate();

    const fetchWallpapers = useCallback(async () => {
        try {
            const data = await getWallpapers();
            setWallpapers(data);
            const savedId = localStorage.getItem('activeWallpaperId');
            if (savedId) setActiveId(Number(savedId));
        } catch (error) {
            console.error('Failed to fetch wallpapers:', error);
        }
    }, []);

    useEffect(() => {
        fetchWallpapers();
    }, [fetchWallpapers]);

    const handleSelect = (wp) => {
        setActiveId(wp.id);
        localStorage.setItem('activeWallpaperId', wp.id);
    };

    const handleLaunch = () => {
        if (activeId) {
            navigate(`/view/${activeId}`);
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Dynamic Background */}
            <div className="mesh-gradient" />

            {/* Main Content */}
            <div className="relative z-10">
                <Picker
                    wallpapers={wallpapers}
                    onSelect={handleSelect}
                    onUpload={() => setIsUploadOpen(true)}
                    onRefresh={fetchWallpapers}
                    activeId={activeId}
                />
            </div>

            {/* Help Button */}
            <div className="fixed bottom-6 right-6 z-[60]">
                <button
                    onClick={() => setIsHelpOpen(true)}
                    className="p-4 glass-button rounded-2xl text-zinc-400 hover:text-white transition-all shadow-xl hover:shadow-blue-500/20 active:scale-90 group"
                    title="How it works"
                >
                    <HelpCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {/* Persistent Launch Control */}
            <AnimatePresence>
                {activeId && (
                    <motion.div
                        initial={{ y: 100, x: '-50%', opacity: 0 }}
                        animate={{ y: 0, x: '-50%', opacity: 1 }}
                        exit={{ y: 100, x: '-50%', opacity: 0 }}
                        className="fixed bottom-12 left-1/2 z-50 w-full max-w-sm px-6"
                    >
                        <button
                            onClick={handleLaunch}
                            className="w-full flex items-center justify-center gap-4 px-8 py-5 bg-white text-black rounded-[28px] shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)] hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-2 active:scale-95 group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative flex items-center gap-4">
                                <Monitor className="w-6 h-6 group-hover:animate-bounce" />
                                <span className="font-black text-xl uppercase tracking-tighter">Play Wallpaper</span>
                            </div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <UploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onRefresh={fetchWallpapers}
            />

            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
            />
        </div>
    );
};

export default PickerPage;
