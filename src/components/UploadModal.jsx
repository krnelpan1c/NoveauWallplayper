import React, { useState } from 'react';
import { X, Upload, Check, FileText, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { processZip, processVideo, generatePreview } from '../lib/wallpaper';
import { saveWallpaper } from '../lib/db';

const UploadModal = ({ isOpen, onClose, onRefresh }) => {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [customPreview, setCustomPreview] = useState(null);
    const [processedData, setProcessedData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = async (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setFile(selected);
        setProcessedData(null);

        if (selected.name.endsWith('.zip')) {
            setIsProcessing(true);
            try {
                const processed = await processZip(selected);
                setProcessedData(processed);
                if (processed.name) setName(processed.name);
                if (processed.preview) setCustomPreview(processed.preview);
            } catch (error) {
                console.error('Failed to pre-process ZIP:', error);
                if (!name) setName(selected.name.replace(/\.[^/.]+$/, ""));
            } finally {
                setIsProcessing(false);
            }
        } else {
            if (!name) setName(selected.name.replace(/\.[^/.]+$/, ""));
        }
    };

    const handlePreviewChange = async (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        const previewUrl = await generatePreview(selected);
        setCustomPreview(previewUrl);
    };

    const handleUpload = async () => {
        if (!file || !name) return;

        setIsProcessing(true);
        try {
            let processed = processedData;
            if (!processed) {
                if (file.name.endsWith('.zip')) {
                    processed = await processZip(file);
                } else {
                    processed = await processVideo(file);
                }
            }

            await saveWallpaper({
                ...processed,
                name: name || processed.name,
                preview: customPreview || processed.preview
            });

            onRefresh();
            onClose();
            // Reset state
            setName('');
            setFile(null);
            setCustomPreview(null);
            setProcessedData(null);
        } catch (error) {
            console.error('Upload failed:', error);
            alert(`Failed to process wallpaper: ${error.message || 'Unknown error'}. Ensure it is a valid ZIP or video file.`);
        } finally {
            setIsProcessing(false);
        }
    };

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
                    className="relative w-full max-w-2xl glass-card rounded-[40px] shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-10 py-8 flex items-center justify-between border-b border-white/5 bg-white/5">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-thin text-white tracking-tight">Upload Content</h2>
                            <p className="text-zinc-500 text-sm font-medium">Add a wallpaper to your gallery.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 glass-button rounded-2xl text-zinc-400 hover:text-white transition-all transform hover:rotate-90"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-10 space-y-8">
                        {/* Name Input */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Wallpaper Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Set a display name..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-lg"
                            />
                        </div>

                        {/* File Inputs Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Wallpaper File */}
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Package (.zip or video)</label>
                                <label className={`relative flex flex-col items-center justify-center aspect-square rounded-[32px] border-2 border-dashed transition-all cursor-pointer group ${file ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-blue-500/50 bg-white/5 hover:bg-blue-500/5'
                                    }`}>
                                    <input type="file" className="hidden" accept=".zip,video/*" onChange={handleFileChange} />
                                    {file ? (
                                        <div className="flex flex-col items-center text-center p-6 space-y-3">
                                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                                                <Check className="w-8 h-8 text-green-400" />
                                            </div>
                                            <span className="text-green-400 font-bold truncate max-w-[150px]">{file.name}</span>
                                            <span className="text-zinc-600 text-xs font-medium italic">Click to change</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center p-6 space-y-4 text-zinc-500 group-hover:text-blue-400 transition-colors">
                                            <Upload className="w-12 h-12" />
                                            <div className="text-center">
                                                <span className="block text-sm font-bold uppercase tracking-wider mb-1">Select File</span>
                                                <span className="text-[10px] italic">Lively ZIP or Video file</span>
                                            </div>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Preview File */}
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Custom Preview (Optional)</label>
                                <label className={`relative flex flex-col items-center justify-center aspect-square rounded-[32px] border-2 border-dashed transition-all cursor-pointer group ${customPreview ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-purple-500/50 bg-white/5 hover:bg-purple-500/5'
                                    }`}>
                                    <input type="file" className="hidden" accept="image/*" onChange={handlePreviewChange} />
                                    {customPreview ? (
                                        <div className="relative w-full h-full rounded-[28px] overflow-hidden p-2">
                                            <img src={customPreview} className="w-full h-full object-cover rounded-[20px]" alt="Preview" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center p-6 space-y-4 text-zinc-500 group-hover:text-purple-400 transition-colors">
                                            <ImageIcon className="w-12 h-12" />
                                            <div className="text-center">
                                                <span className="block text-sm font-bold uppercase tracking-wider mb-1">Upload Art</span>
                                                <span className="text-[10px] italic">JPG, PNG or GIF</span>
                                            </div>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-4">
                            <button
                                disabled={!file || !name || isProcessing}
                                onClick={handleUpload}
                                className={`w-full py-6 rounded-3xl font-black text-xl uppercase tracking-[0.2em] transition-all transform active:scale-95 flex items-center justify-center gap-4 ${!file || !name || isProcessing
                                    ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed border border-white/5'
                                    : 'bg-white text-black hover:bg-blue-500 hover:text-white shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)]'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-6 h-6" />
                                        <span>Deploy Wallpaper</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UploadModal;
