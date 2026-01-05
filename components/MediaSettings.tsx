import React, { useState, useEffect } from 'react';
import { X, Upload, RotateCcw, Image as ImageIcon, Video, Save, Check, Shield, Search, LayoutGrid } from 'lucide-react';
import { courseData } from '../data/courseContent';

interface MediaSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

export type MediaAsset = {
    url: string;
    type: 'image' | 'video' | 'default';
};

const MediaSettings: React.FC<MediaSettingsProps> = ({ isOpen, onClose }) => {
    const [assets, setAssets] = useState<Record<string, MediaAsset>>(() => {
        const saved = localStorage.getItem('spi-media-overrides');
        return saved ? JSON.parse(saved) : {};
    });
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const handleUpdate = (id: string, url: string, type: 'image' | 'video') => {
        setAssets(prev => ({
            ...prev,
            [id]: { url, type }
        }));
    };

    const handleReset = (id: string) => {
        setAssets(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const saveSettings = () => {
        setSaveStatus('saving');
        localStorage.setItem('spi-media-overrides', JSON.stringify(assets));
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 800);
    };

    const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            handleUpdate(id, result, type);
        };
        reader.readAsDataURL(file);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl animate-fade-in font-sans">
            <div className="w-full max-w-5xl h-[90vh] glass-panel rounded-[3rem] border-white/10 shadow-2xl flex flex-col overflow-hidden relative border-t-gold-main/20">
                
                {/* Studio Header */}
                <div className="px-8 py-8 md:px-12 border-b border-white/5 flex justify-between items-center bg-dark-secondary/50 backdrop-blur-md">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-gold-dim rounded-2xl flex items-center justify-center border border-gold-main/30 shadow-gold">
                            <LayoutGrid className="w-7 h-7 text-gold-main" />
                        </div>
                        <div className="text-left">
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-wide uppercase">Media Studio</h2>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.3em]">Protocol Active: Asset Customization</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-3 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group"
                    >
                        <X className="w-6 h-6 text-text-muted group-hover:text-white group-hover:rotate-90 transition-all duration-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10 space-y-16 custom-scrollbar text-left">
                    
                    {/* Global Assets Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                            <h3 className="text-[11px] font-bold text-gold-accent uppercase tracking-[0.5em] px-4 whitespace-nowrap">Global Identity</h3>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <AssetInput 
                                label="Academic Logo" 
                                description="The primary brand vector (E)"
                                id="global-logo" 
                                current={assets['global-logo']} 
                                onUpdate={handleUpdate} 
                                onReset={handleReset} 
                                onFile={(e) => handleFileUpload('global-logo', e, 'image')}
                            />
                            <AssetInput 
                                label="Hero Illustration" 
                                description="Featured book cover display"
                                id="global-hero" 
                                current={assets['global-hero']} 
                                onUpdate={handleUpdate} 
                                onReset={handleReset} 
                                onFile={(e) => handleFileUpload('global-hero', e, 'image')}
                            />
                        </div>
                    </section>

                    {/* Topic Specific Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                            <h3 className="text-[11px] font-bold text-gold-accent uppercase tracking-[0.5em] px-4 whitespace-nowrap">Topic Vectors</h3>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {courseData.flatMap(m => m.topics).map(topic => (
                                <AssetInput 
                                    key={topic.id}
                                    label={topic.title} 
                                    description={`Instructional visual for ${topic.estTime} lesson`}
                                    id={`topic-${topic.id}`} 
                                    current={assets[`topic-${topic.id}`]} 
                                    onUpdate={handleUpdate} 
                                    onReset={handleReset} 
                                    onFile={(e) => handleFileUpload(`topic-${topic.id}`, e, 'image')}
                                    allowVideo
                                />
                            ))}
                        </div>
                    </section>
                </div>

                {/* Studio Footer */}
                <div className="px-8 py-8 border-t border-white/5 bg-dark-secondary/90 flex flex-col sm:flex-row justify-between items-center gap-6 backdrop-blur-xl">
                    <div className="text-left hidden sm:block">
                        <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold mb-1">Uncommitted Changes</p>
                        <p className="text-xs text-white/40 font-mono italic">Assets will persist in local storage upon syncing.</p>
                    </div>
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                        <button onClick={onClose} className="flex-1 sm:flex-none px-8 py-4 text-xs font-bold text-text-muted hover:text-white transition-colors uppercase tracking-widest">Discard</button>
                        <button 
                            onClick={saveSettings}
                            disabled={saveStatus !== 'idle'}
                            className={`flex-1 sm:flex-none px-12 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500 ${
                                saveStatus === 'saved' ? 'bg-green-600 text-white shadow-lg' : 'bg-gold-main text-dark-primary shadow-gold hover:shadow-gold-strong'
                            }`}
                        >
                            {saveStatus === 'saving' ? <RotateCcw className="w-4 h-4 animate-spin" /> : saveStatus === 'saved' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {saveStatus === 'saving' ? 'Syncing...' : saveStatus === 'saved' ? 'Locked' : 'Sync Vectors'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AssetInput = ({ label, description, id, current, onUpdate, onReset, onFile, allowVideo }: any) => {
    const [url, setUrl] = useState(current?.url || '');
    
    return (
        <div className="glass-card p-6 rounded-2xl border-white/5 space-y-5 bg-white/[0.02] flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div className="text-left">
                    <label className="text-sm font-bold text-text-main font-sans uppercase tracking-widest block mb-1">{label}</label>
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider opacity-60">{description}</span>
                </div>
                {current && (
                    <button 
                        onClick={() => { onReset(id); setUrl(''); }} 
                        className="text-[9px] text-red-400 hover:text-red-300 font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 transition-colors bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20"
                    >
                        <RotateCcw className="w-2.5 h-2.5" /> Reset
                    </button>
                )}
            </div>
            
            <div className="flex gap-5">
                <div className="flex-1 space-y-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted group-focus-within:text-gold-main transition-colors" />
                        <input 
                            type="text" 
                            value={url}
                            onChange={(e) => { setUrl(e.target.value); onUpdate(id, e.target.value, 'image'); }}
                            placeholder="Enter asset URL..."
                            className="w-full bg-dark-primary/40 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-xs text-white focus:outline-none focus:border-gold-main/40 transition-all font-mono placeholder:text-text-muted/30"
                        />
                    </div>
                    <div className="flex gap-3">
                        <label className="flex-1 cursor-pointer bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 px-3 py-2 rounded-xl flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest text-text-main transition-all">
                            <ImageIcon className="w-3.5 h-3.5 text-gold-main" /> Upload Image
                            <input type="file" accept="image/*" className="hidden" onChange={onFile} />
                        </label>
                        {allowVideo && (
                            <label className="flex-1 cursor-pointer bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 px-3 py-2 rounded-xl flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest text-text-main transition-all">
                                <Video className="w-3.5 h-3.5 text-gold-main" /> Upload Video
                                <input type="file" accept="video/*" className="hidden" onChange={onFile} />
                            </label>
                        )}
                    </div>
                </div>
                <div className="w-24 h-24 bg-dark-primary rounded-xl border border-white/10 overflow-hidden flex items-center justify-center relative group shrink-0 shadow-inner">
                    {current ? (
                        current.type === 'video' ? (
                            <video src={current.url} className="w-full h-full object-cover" muted />
                        ) : (
                            <img src={current.url} className="w-full h-full object-cover" alt="Preview" />
                        )
                    ) : (
                        <ImageIcon className="w-6 h-6 text-white/5" />
                    )}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                        <span className="text-[9px] font-bold text-gold-accent uppercase tracking-widest">Preview</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaSettings;