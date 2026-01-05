
import React, { useState, useEffect } from 'react';
import { X, Upload, RotateCcw, Image as ImageIcon, Video, Save, Check, Shield, Search, LayoutGrid, Type, FileText, Music, Plus, Trash2, ShoppingBag, DollarSign, Zap, ShieldCheck, Sparkles, TrendingUp, Heart, Trophy, Brain, Mic, Globe, Link as LinkIcon, Bot, Loader2, PlayCircle, Activity, Database } from 'lucide-react';
import { courseData } from '../data/courseContent';
import { GoogleGenAI } from "@google/genai";

interface AdminStudioProps {
    isOpen: boolean;
    onClose: () => void;
}

export type AdminOverride = {
    value: string;
    type: 'image' | 'video' | 'text' | 'audio' | 'shop-item' | 'topic-media';
    label?: string;
    metadata?: any;
};

const CACHE_NAME = 'echomasters-acoustic-vault-v1';

const AdminStudio: React.FC<AdminStudioProps> = ({ isOpen, onClose }) => {
    const [overrides, setOverrides] = useState<Record<string, AdminOverride>>(() => {
        try {
            const saved = localStorage.getItem('spi-admin-overrides');
            return saved ? JSON.parse(saved) : {};
        } catch(e) { return {}; }
    });
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [activeTab, setActiveTab] = useState<'branding' | 'classroom' | 'radio' | 'shop'>('branding');
    
    // Node Pre-generation State
    const [isSyncingAll, setIsSyncingAll] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);
    const [syncLog, setSyncLog] = useState<string[]>([]);

    const handleUpdate = (id: string, value: string, type: any, label?: string, metadata?: any) => {
        setOverrides(prev => ({
            ...prev,
            [id]: { value, type, label, metadata }
        }));
    };

    const handleReset = (id: string) => {
        setOverrides(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>, type: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            handleUpdate(id, result, type);
        };
        reader.readAsDataURL(file);
    };

    const addRadioTrack = () => {
        const id = `radio-track-${Date.now()}`;
        handleUpdate(id, '', 'audio', 'New Node', { artist: 'Faculty Unit', type: 'podcast' });
    };

    const saveSettings = () => {
        setSaveStatus('saving');
        localStorage.setItem('spi-admin-overrides', JSON.stringify(overrides));
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => {
                window.location.reload();
            }, 800);
        }, 800);
    };

    const handleSyncAllNodes = async () => {
        if (isSyncingAll) return;
        
        const elevenKey = overrides['eleven-labs-key']?.value || localStorage.getItem('spi-eleven-labs-key');
        if (!elevenKey) {
            alert("Administrative Access Error: ElevenLabs Key required for Acoustic Node generation.");
            return;
        }

        setIsSyncingAll(true);
        setSyncProgress(0);
        setSyncLog(["Initializing Acoustic Matrix sync..."]);

        const allTopics = courseData.flatMap(m => m.topics);
        const total = allTopics.length;
        const cache = await caches.open(CACHE_NAME);

        for (let i = 0; i < allTopics.length; i++) {
            const topic = allTopics[i];
            const persona = topic.professorPersona || 'Charon';
            const voiceId = 'Yko7iBn2vnSMvSAsuF8N'; // Default Specialist
            const cacheId = `intro-${topic.title.replace(/\s+/g, '-').toLowerCase()}-${persona}-${voiceId}`;
            
            setSyncLog(prev => [`Syncing Node ${i + 1}/${total}: ${topic.title}`, ...prev].slice(0, 5));
            
            const cached = await cache.match(`/api/audio/${cacheId}`);
            if (cached) {
                setSyncLog(prev => [`[SKIP] ${topic.title} already in vault.`, ...prev].slice(0, 5));
                setSyncProgress(Math.round(((i + 1) / total) * 100));
                continue;
            }

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const scriptRes = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: `YOU ARE PROFESSOR ${persona}. SUBJECT: "${topic.title}". CONTEXT: "${topic.contentBody}".
                    
                    WRITE A LECTURE SCRIPT FOLLOWING THIS EXACT STRUCTURE:
                    1. EFFORT: "I [read over 500 pages of clinical papers/watched 40 hours of board logs] for you so here is the cliffnotes version to save you 15 hours."
                    2. STAKES: "It is not enough just to listen to me talk, so at the end, there is an assessment. If you answer it, you are officially educated."
                    3. ROADMAP: Briefly list Part 1: Definitions, Part 2: Concepts, Part 3: Application, Part 4: The Insight.
                    4. NEGATION: Define ${topic.title} by explaining what it is NOT.
                    5. MNEMONIC: Provide a silly mnemonic (e.g., "Red Turtles Paint Murals").
                    6. ANALOGY: Use a character's journey or Naruto to explain the system.
                    7. HOLY SHIT INSIGHT: One mind-blowing piece of advice.
                    8. END: "Synchronizing now."
                    
                    LIMIT: 160 words. TONE: Authoritative but tired of student laziness.`,
                });
                const generatedScript = scriptRes.text || topic.contentBody;

                const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'xi-api-key': elevenKey },
                    body: JSON.stringify({
                        text: generatedScript,
                        model_id: 'eleven_multilingual_v2',
                        voice_settings: { stability: 0.5, similarity_boost: 0.8 }
                    }),
                });

                if (ttsRes.ok) {
                    const blob = await ttsRes.blob();
                    await cache.put(new Request(`/api/audio/${cacheId}`), new Response(blob));
                    localStorage.setItem(`script-${cacheId}`, generatedScript);
                }
            } catch (e) {
                setSyncLog(prev => [`[FAIL] Node ${topic.id} interrupt.`, ...prev]);
            }
            
            setSyncProgress(Math.round(((i + 1) / total) * 100));
            await new Promise(r => setTimeout(r, 600)); // Respect API limits
        }

        setSyncLog(prev => ["MATRIX SYNC COMPLETE.", ...prev]);
        setTimeout(() => setIsSyncingAll(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-2xl animate-fade-in font-sans text-left">
            <div className="w-full max-w-6xl h-[92vh] bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden relative border-t-gold-main/20">
                <div className="px-8 py-8 md:px-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.02]">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-gold-main/10 rounded-2xl flex items-center justify-center border border-gold-main/30 shadow-gold">
                            <Bot className="w-7 h-7 text-gold-main" />
                        </div>
                        <div className="text-left text-white">
                            <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">Admin Master Control</h2>
                            <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.4em]">Sector Sync & Configuration</p>
                        </div>
                    </div>
                    
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                        {['branding', 'classroom', 'radio', 'shop'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-gold-main text-slate-900 shadow-gold' : 'text-white/40 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group">
                        <X className="w-6 h-6 text-white/40 group-hover:text-white transition-all" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10 space-y-16 custom-scrollbar text-left bg-radial-glow">
                    {activeTab === 'branding' && (
                        <div className="space-y-12 animate-fade-in">
                            {/* NEW: PRE-GENERATION PANEL */}
                            <div className="p-10 bg-gold-main/5 border border-gold-main/20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-10 group shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Activity size={140} /></div>
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3 text-gold-main">
                                        <Database size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Vault Pre-generation</span>
                                    </div>
                                    <h3 className="text-3xl font-serif font-bold text-white italic tracking-tight uppercase">Sync Acoustic Matrix</h3>
                                    <p className="text-slate-400 text-sm max-w-xl leading-relaxed italic">
                                        Generates and caches narrations for every node in the curriculum using the pedagogical "Hard Work" architecture. Requires ElevenLabs Key.
                                    </p>
                                    {isSyncingAll && (
                                        <div className="space-y-4 pt-4">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-gold-main tracking-widest">
                                                <span>Acoustic Encoding Status</span>
                                                <span>{syncProgress}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-gold-main shadow-gold transition-all duration-500" style={{ width: `${syncProgress}%` }}></div>
                                            </div>
                                            <div className="space-y-1">
                                                {syncLog.map((log, idx) => (
                                                    <div key={idx} className="text-[9px] font-mono text-white/30 truncate leading-none">{log}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={handleSyncAllNodes}
                                    disabled={isSyncingAll}
                                    className={`px-12 py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] transition-all flex items-center gap-4 ${isSyncingAll ? 'bg-white/5 text-white/20 cursor-wait' : 'bg-gold-main text-slate-950 shadow-gold hover:shadow-[0_0_80px_rgba(181,148,78,0.5)] active:scale-95'}`}
                                >
                                    {isSyncingAll ? <Loader2 className="animate-spin" size={20} /> : <PlayCircle size={20} />}
                                    {isSyncingAll ? 'SYNCING MATRIX...' : 'COMMENCE MASS SYNC'}
                                </button>
                            </div>

                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-gold-main/5 border border-gold-main/20 flex items-center justify-center">
                                        <Type className="text-gold-main" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-white tracking-tight italic">Platform Credentials</h3>
                                    <div className="h-px flex-1 bg-white/5"></div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <AdminInput label="ElevenLabs API Key" id="eleven-labs-key" current={overrides['eleven-labs-key']} onUpdate={handleUpdate} onReset={handleReset} type="text" />
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'classroom' && (
                        <div className="space-y-12 animate-fade-in">
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-gold-main/5 border border-gold-main/20 flex items-center justify-center">
                                        <FileText className="text-gold-main" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-white tracking-tight italic">Lesson Overrides</h3>
                                    <div className="h-px flex-1 bg-white/5"></div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {courseData.flatMap(m => m.topics).map(topic => (
                                        <AdminInput 
                                            key={topic.id}
                                            label={topic.title} 
                                            id={`topic-media-${topic.id}`} 
                                            current={overrides[`topic-media-${topic.id}`]} 
                                            onUpdate={handleUpdate} 
                                            onReset={handleReset} 
                                            type="image"
                                            onFile={(e:any) => handleFileUpload(`topic-media-${topic.id}`, e, 'image')}
                                        />
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}
                </div>

                <div className="px-8 py-8 border-t border-white/5 bg-slate-950/80 flex justify-end items-center gap-6 backdrop-blur-xl">
                    <button onClick={onClose} className="px-8 py-4 text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.2em]">Discard</button>
                    <button 
                        onClick={saveSettings}
                        disabled={saveStatus !== 'idle'}
                        className={`px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500 ${
                            saveStatus === 'saved' ? 'bg-green-600 text-white shadow-lg' : 'bg-gold-main text-slate-950 shadow-gold hover:translate-y-[-2px]'
                        }`}
                    >
                        {saveStatus === 'saving' ? <RotateCcw className="w-5 h-5 animate-spin" /> : saveStatus === 'saved' ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                        {saveStatus === 'saving' ? 'SYNCING...' : saveStatus === 'saved' ? 'SYNCED' : 'SYNC RESONANCE'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminInput = ({ label, id, current, onUpdate, onReset, onFile, type }: any) => {
    const [val, setVal] = useState(current?.value || '');
    
    return (
        <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex flex-col justify-between group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-6">
                <div className="text-left">
                    <label className="text-[11px] font-black text-white uppercase tracking-widest block mb-1">{label}</label>
                    <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">ID: {id}</span>
                </div>
                {current && (
                    <button onClick={() => { onReset(id); setVal(''); }} className="text-[9px] text-red-400 hover:text-red-300 font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/10">
                        <RotateCcw size={10} /> Reset
                    </button>
                )}
            </div>
            
            {type === 'text' || id.includes('key') ? (
                <div className="relative">
                    <textarea 
                        value={val}
                        onChange={(e) => { setVal(e.target.value); onUpdate(id, e.target.value, 'text'); }}
                        className="w-full bg-slate-950/40 border border-white/10 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-gold-main/40 transition-all font-sans min-h-[80px] resize-none italic leading-relaxed"
                        placeholder="Enter configuration value..."
                    />
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                        <div className="relative group">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold-main transition-colors" />
                            <input 
                                type="text" 
                                value={val?.startsWith?.('data:') ? 'Local File Uploaded' : (val || '')}
                                onChange={(e) => { setVal(e.target.value); onUpdate(id, e.target.value, 'image'); }}
                                readOnly={val?.startsWith?.('data:')}
                                placeholder="External Asset URL..."
                                className={`w-full bg-slate-950/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-xs text-white/80 focus:outline-none focus:border-gold-main/40 transition-all font-mono ${val?.startsWith?.('data:') ? 'opacity-50' : ''}`}
                            />
                        </div>
                        <div className="flex gap-3">
                            <label className="flex-1 cursor-pointer bg-white/5 border border-white/5 hover:bg-white/10 px-4 py-3 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 transition-all">
                                <ImageIcon size={14} className="text-gold-main" /> {val?.startsWith?.('data:') ? 'Swap Image' : 'Upload Image'}
                                <input type="file" accept="image/*" className="hidden" onChange={onFile} />
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStudio;
