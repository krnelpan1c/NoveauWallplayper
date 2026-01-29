import React, { useState, useEffect } from 'react';

const FullscreenPrompt = ({ onDismiss }) => {
    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        setShouldRender(true);
        // Subtle entrance delay
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!shouldRender) return null;

    const handleDismiss = () => {
        setIsVisible(false);
        if (dontShowAgain) {
            localStorage.setItem('hideFullscreenPrompt', 'true');
        }
        // Wait for exit animation
        setTimeout(onDismiss, 500);
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-start justify-center pt-24 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Blurred Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={handleDismiss}
            />

            <div
                className={`relative glass-card px-8 py-6 rounded-2xl flex flex-col items-center gap-4 shadow-2xl border border-white/10 max-w-md text-center transition-all duration-500 ease-out transform ${isVisible ? 'translate-y-0 scale-100' : '-translate-y-12 scale-95'
                    }`}
            >
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-1">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Immersive Mode</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                        Press <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 text-white font-mono text-xs">Fullscreen</kbd> or <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 text-white font-mono text-xs">F11</kbd> and then switch to another app to put the wallpaper in the background.
                    </p>
                </div>

                <div className="flex flex-col w-full gap-3 mt-2">
                    <button
                        onClick={handleDismiss}
                        className="glass-button w-full py-2.5 rounded-xl font-medium text-white hover:bg-white/10 transition-colors"
                    >
                        Got it
                    </button>

                    <label className="flex items-center justify-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-blue-500 transition-colors cursor-pointer"
                        />
                        <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">Don't show this again</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default FullscreenPrompt;
