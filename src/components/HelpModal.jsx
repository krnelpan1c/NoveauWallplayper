import React from 'react';
import { X, HelpCircle, Info, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg glass-card rounded-[40px] shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-10 py-8 flex items-center justify-between border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl">
                                <HelpCircle className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-thin text-white tracking-tight">How it works</h2>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 glass-button rounded-2xl text-zinc-400 hover:text-white transition-all transform hover:rotate-90"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-10 space-y-8">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <Info className="w-5 h-5 text-zinc-500" />
                                </div>
                                <p className="text-zinc-300 leading-relaxed font-medium">
                                    This app runs a video or interactive wallpaper which your app windows overlay, simulating a live wallpaper on devices where similar apps are not available (e.g. ChromeOS devices)
                                </p>
                            </div>

                            <div className="flex gap-4 p-6 bg-blue-500/5 rounded-[32px] border border-blue-500/10">
                                <div className="mt-1">
                                    <ExternalLink className="w-5 h-5 text-blue-400" />
                                </div>
                                <p className="text-blue-100 leading-relaxed font-bold">
                                    For the best experience, install the main page as an app instead of using a full browser window.
                                </p>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-4">
                            <button
                                onClick={onClose}
                                className="w-full py-5 rounded-3xl font-black text-lg uppercase tracking-widest transition-all transform active:scale-95 flex items-center justify-center bg-white text-black hover:bg-blue-500 hover:text-white"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default HelpModal;
