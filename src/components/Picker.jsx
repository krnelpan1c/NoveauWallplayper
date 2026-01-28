import React from 'react';
import { Plus, Trash2, Play, Layout, Video, Settings2, Sparkles } from 'lucide-react';
import { deleteWallpaper } from '../lib/db';
import { motion, AnimatePresence } from 'framer-motion';

const Picker = ({ wallpapers, onSelect, onUpload, onRefresh, activeId }) => {
    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this wallpaper?')) {
            await deleteWallpaper(id);
            onRefresh();
        }
    };

    return (
        <div className="relative pt-12 pb-32 px-6 sm:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Sparkles className="w-6 h-6 text-blue-400" />
                            </div>
                            <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">Premium Gallery</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-thin text-white leading-tight">
                            Wallplayper
                        </h1>
                        <p className="text-gray-400 text-lg font-light max-w-xl leading-relaxed">
                            Elevate your desktop with interactive digital art. Simple, powerful, and purely aesthetic.
                        </p>
                    </div>

                    <button
                        onClick={onUpload}
                        className="glass-button px-8 py-4 rounded-3xl flex items-center gap-3 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                        <span className="font-bold text-lg">Add Content</span>
                    </button>
                </motion.header>

                {/* Wallpapers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence mode="popLayout">
                        {wallpapers.map((wp, index) => (
                            <motion.div
                                key={wp.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                onClick={() => onSelect(wp)}
                                className={`group relative aspect-[16/10] glass-card rounded-[32px] overflow-hidden cursor-pointer p-2 transition-all duration-500 ${activeId === wp.id
                                    ? 'ring-2 ring-blue-500 border-transparent shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] scale-[1.02]'
                                    : 'hover:scale-[1.02] hover:border-white/20'
                                    }`}
                            >
                                {/* Inner Content Wrap */}
                                <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-[#0a0a0a]">
                                    {/* Preview Image */}
                                    <div className="absolute inset-0">
                                        {wp.preview ? (
                                            <img
                                                src={wp.preview}
                                                alt={wp.name}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900">
                                                {wp.type === 'html' ? <Layout className="w-10 h-10 text-zinc-700" /> : <Video className="w-10 h-10 text-zinc-700" />}
                                            </div>
                                        )}
                                    </div>

                                    {/* Glass Overlay Top */}
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                                        <div className={`px-3 py-1 transparent backdrop-blur-md rounded-full border border-white/5 text-[10px] font-black uppercase tracking-tighter ${wp.type === 'html' ? 'text-blue-400 bg-blue-500/10' : 'text-purple-400 bg-purple-500/10'
                                            }`}>
                                            {wp.type}
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, wp.id)}
                                            className="p-2 glass-button rounded-xl text-white/20 hover:text-red-400 hover:bg-red-400/20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Bottom Info Gradient */}
                                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                    <div className="absolute bottom-6 left-6 right-6 space-y-1">
                                        <h3 className="text-xl font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                                            {wp.name}
                                        </h3>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                                            <Settings2 className="w-3.5 h-3.5 text-zinc-500" />
                                            <span className="text-xs text-zinc-500 font-medium">Click to activate</span>
                                        </div>
                                    </div>

                                    {/* Play State Indicator */}
                                    <div className={`absolute inset-0 bg-blue-500/10 opacity-0 transition-opacity duration-300 ${activeId === wp.id ? 'opacity-100' : ''}`} />

                                    <div className={`absolute inset-0 flex items-center justify-center scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ${activeId === wp.id ? 'hidden' : ''}`}>
                                        <div className="w-16 h-16 glass-button rounded-full flex items-center justify-center shadow-2xl">
                                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                                        </div>
                                    </div>

                                    {/* Active Pulse */}
                                    {activeId === wp.id && (
                                        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/40">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Active</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Empty State */}
                    {wallpapers.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-32 flex flex-col items-center text-center glass-card"
                        >
                            <div className="w-24 h-24 glass-button rounded-[32px] flex items-center justify-center mb-8">
                                <Video className="w-10 h-10 text-zinc-500" />
                            </div>
                            <h3 className="text-3xl font-light text-white mb-3">Your gallery is empty</h3>
                            <p className="text-zinc-500 max-w-sm mb-10 leading-relaxed text-lg font-light">
                                Start your journey by uploading your first interactive or video wallpaper.
                            </p>
                            <button
                                onClick={onUpload}
                                className="px-10 py-4 bg-white text-black font-black rounded-full hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 text-lg"
                            >
                                Choose Files
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Picker;
