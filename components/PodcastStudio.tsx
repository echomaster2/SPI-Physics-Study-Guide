
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Music, Mic, 
  Disc3, Radio, Headphones, Volume2, Search, 
  Sparkles, Clock, ArrowRight, Share2, Heart,
  VolumeX, ListMusic, Bot, Wifi, Download, 
  Loader2, Zap, Save, Trash2, Mic2, AlertCircle,
  Database, Plus, Globe, Upload, FileAudio, X,
  Activity, BarChart3, Binary, Link as LinkIcon, ChevronRight, ZapOff
} from 'lucide-react';
import { podcastTracks, PodcastTrack, courseData } from '../data/courseContent';
import { GoogleGenAI } from "@google/genai";

interface PodcastStudioProps {
  onOpenConsultancy?: () => void;
  elevenLabsKey?: string;
  voiceId?: string;
}

const BURT_VOICE_ID = 'Yko7iBn2vnSMvSAsuF8N'; // Default
const CACHE_NAME = 'echomasters-acoustic-vault-v1';

const PodcastStudio: React.FC<PodcastStudioProps> = ({ onOpenConsultancy, elevenLabsKey, voiceId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'lectures' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTrackId, setCurrentTrackId] = useState<string>('');
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  const [showManualUplink, setShowManualUplink] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualArtist, setManualArtist] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  const [customTracks, setCustomTracks] = useState<PodcastTrack[]>([]);
  const visualizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCachedTracks();

    // Track global playback state
    const handleAudioState = (e: any) => {
        setIsPlaying(e.detail.isPlaying);
        if (e.detail.track) setCurrentTrackId(e.detail.track.id);
    };
    window.addEventListener('echomasters-audio-state', handleAudioState);
    return () => window.removeEventListener('echomasters-audio-state', handleAudioState);
  }, []);

  const loadCachedTracks = async () => {
    try {
      const metadata = localStorage.getItem('echomasters-custom-tracks');
      if (metadata) {
        setCustomTracks(JSON.parse(metadata));
      }
    } catch (e) {
      console.error("Cache load failed", e);
    }
  };

  const filteredTracks = [...podcastTracks, ...customTracks].filter(track => {
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'songs' && track.type === 'song') || 
                      (activeTab === 'lectures' && track.type === 'lecture') ||
                      (activeTab === 'custom' && (track.id.startsWith('custom-') || track.id.startsWith('manual-')));
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const playTrack = async (track: PodcastTrack) => {
    setCurrentTrackId(track.id);
    setIsPlaying(true);

    let finalUrl = track.url;
    if (track.id.startsWith('custom-') && track.url.startsWith('/api/audio/')) {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(track.url);
        if (cachedResponse) {
            const blob = await cachedResponse.blob();
            finalUrl = URL.createObjectURL(blob);
        }
    }

    window.dispatchEvent(new CustomEvent('echomasters-play-track', { 
        detail: { track: { ...track, url: finalUrl } } 
    }));
  };

  const activeTrack = filteredTracks.find(t => t.id === currentTrackId) || filteredTracks[0] || podcastTracks[0];

  const generateNewLecture = async (topicTitle: string) => {
    if (isRecording) return;
    setIsRecording(true);
    setRecordingProgress(10);
    
    let script = "";
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Write a high-yield ultrasound physics podcast script for: "${topicTitle}". Narrator: Faculty Unit. Tone: Cool, mature, paternal. Max 55 words. Start with "Listen close." Raw text only.`;
      const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      script = res.text || `Focus on ${topicTitle}. Let's secure this concept.`;
    } catch (e) {
      script = `Attention student. Focus on ${topicTitle} mechanics. Let's secure this concept.`;
    }
      
    setRecordingProgress(40);

    try {
      const elRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId || BURT_VOICE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': elevenLabsKey || '' },
        body: JSON.stringify({
          text: script, model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.8 }
        })
      });
      if (!elRes.ok) throw new Error("TTS Failed");
      const audioBlob = await elRes.blob();
      setRecordingProgress(80);
      const cache = await caches.open(CACHE_NAME);
      const customId = `custom-lecture-${Date.now()}`;
      const apiUrl = `/api/audio/${customId}`;
      await cache.put(new Request(apiUrl), new Response(audioBlob));
      const newTrack: PodcastTrack = {
        id: customId, title: `${topicTitle} (Lecture)`, artist: 'Faculty Node 01',
        url: apiUrl, duration: '1:00', type: 'lecture',
        description: `Custom deep dive into ${topicTitle}.`, tags: ['AI Generated']
      };
      const updatedCustom = [newTrack, ...customTracks];
      setCustomTracks(updatedCustom);
      localStorage.setItem('echomasters-custom-tracks', JSON.stringify(updatedCustom));
      setRecordingProgress(100);
      setTimeout(() => { setIsRecording(false); setRecordingProgress(0); setActiveTab('custom'); playTrack(newTrack); }, 1000);
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleManualDeployment = async () => {
    if (!manualTitle || (!manualUrl && !manualArtist)) return;
    setIsDeploying(true);
    const customId = `manual-${Date.now()}`;
    const newTrack: PodcastTrack = {
      id: customId, title: manualTitle, artist: manualArtist || 'Specialist ID',
      url: manualUrl, duration: 'LIVE', type: 'song',
      description: 'Manually deployed node.', tags: ['Manual']
    };
    const updatedCustom = [newTrack, ...customTracks];
    setCustomTracks(updatedCustom);
    localStorage.setItem('echomasters-custom-tracks', JSON.stringify(updatedCustom));
    setTimeout(() => {
      setIsDeploying(false); setManualTitle(''); setManualArtist(''); setManualUrl('');
      setShowManualUplink(false); setActiveTab('custom'); playTrack(newTrack);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 md:py-16 space-y-12 md:space-y-16 animate-fade-in text-left font-sans pb-40">
      
      {/* Studio Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 pb-12">
        <div className="space-y-6 text-white overflow-hidden flex-1">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-main/10 rounded-lg border border-gold-main/20"><Radio size={14} className="text-gold-main animate-pulse" /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Sector Resonance Chamber</span>
            </div>
            <div className="space-y-2">
                <h1 className="text-[clamp(2rem,8vw,5.5rem)] font-serif font-bold tracking-tighter leading-[0.8] italic uppercase">Echo <span className="text-gold-main not-italic">Chamber</span></h1>
                <p className="text-slate-400 text-sm md:text-xl font-light max-w-2xl italic leading-relaxed border-l-2 border-gold-main/20 pl-6 py-1">
                    Synchronizing acoustic physics through high-yield auditory nodes. Establish resonance with the faculty library.
                </p>
            </div>
        </div>
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <button onClick={() => setShowManualUplink(!showManualUplink)} className={`px-8 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3 border ${showManualUplink ? 'bg-white text-slate-950 border-white shadow-xl' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}>
                {showManualUplink ? <X size={16} /> : <Plus size={16} />}
                <span>{showManualUplink ? 'Abort Uplink' : 'Manual Uplink'}</span>
            </button>
            <div className="px-10 py-5 bg-slate-900 border border-white/5 rounded-[2rem] flex items-center gap-3 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold-main/5 blur-xl"></div>
                <Database size={18} className="text-gold-main" />
                <span className="text-2xl font-serif font-bold italic text-white leading-none">{(podcastTracks.length + customTracks.length)}</span>
                <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">Active Nodes</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left Column: Player & Deployment */}
        <div className="lg:col-span-8 space-y-12">
            
            {/* Deployment UI for Manual Signal */}
            {showManualUplink && (
                <div className="p-8 md:p-14 bg-gold-main/5 border-2 border-gold-main/20 rounded-[3rem] animate-slide-up space-y-10 relative overflow-hidden shadow-3xl">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03]"><Wifi size={160} /></div>
                    <div className="flex items-center gap-6 border-b border-gold-main/10 pb-8">
                        <div className="w-16 h-16 bg-gold-main text-slate-950 rounded-2xl flex items-center justify-center shadow-gold transition-transform hover:scale-110"><Globe size={28} /></div>
                        <div>
                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white italic uppercase tracking-tight leading-none">External Node Uplink</h3>
                            <p className="text-[9px] text-gold-main/60 font-black uppercase tracking-[0.3em] mt-2">Remote Signal Deployment Protocol</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Node Identification</label>
                            <input type="text" value={manualTitle} onChange={(e) => setManualTitle(e.target.value)} className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-6 py-4 text-white font-serif italic text-lg focus:border-gold-main/40 transition-all outline-none" placeholder="Target Lesson Title" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Transmitting Specialist</label>
                            <input type="text" value={manualArtist} onChange={(e) => setManualArtist(e.target.value)} className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-6 py-4 text-white font-serif italic text-lg focus:border-gold-main/40 transition-all outline-none" placeholder="Identity Code" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Acoustic Signal Source (.mp3)</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                            <input type="text" value={manualUrl} onChange={(e) => setManualUrl(e.target.value)} className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-gold-main font-mono text-xs focus:border-gold-main transition-all outline-none" placeholder="https://external-resource.mp3" />
                        </div>
                    </div>
                    <button onClick={handleManualDeployment} disabled={!manualTitle || (!manualUrl && !manualArtist) || isDeploying} className={`w-full py-6 rounded-2xl font-black uppercase text-[12px] tracking-[0.4em] transition-all flex items-center justify-center gap-4 ${isDeploying ? 'bg-white/5 text-white/20' : 'bg-gold-main text-slate-950 shadow-gold hover:shadow-[0_0_60px_rgba(181,148,78,0.5)] active:scale-[0.98]'}`}>
                        {isDeploying ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={20} fill="currentColor" /> Initialize Resonance</>}
                    </button>
                </div>
            )}

            {/* Master Acoustic Deck */}
            <div className="bg-slate-950/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 shadow-3xl relative overflow-hidden group">
                {/* Immersive Waveform Visualization */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(181,148,78,0.02)_50%,transparent_100%)] w-full h-full animate-radar-sweep pointer-events-none opacity-40"></div>
                <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none overflow-hidden opacity-20 flex items-end justify-between px-10 gap-1">
                    {[...Array(60)].map((_, i) => (
                        <div key={i} className={`w-1 bg-gold-main rounded-t-full transition-all duration-300 ${isPlaying ? `animate-resonance-pulse-${(i % 3) + 1}` : 'h-1'}`} style={{ height: isPlaying ? `${Math.random() * 80 + 20}%` : '4px' }}></div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 relative z-10">
                    {/* Visual Disk / Artwork */}
                    <div className="w-48 h-48 md:w-80 md:h-80 relative shrink-0">
                        <div className="absolute inset-[-10px] border border-gold-main/10 rounded-full animate-[spin_15s_linear_infinite] opacity-30"></div>
                        <div className="absolute inset-[-25px] border border-gold-main/5 rounded-full animate-[spin_25s_linear_infinite_reverse] opacity-20"></div>
                        
                        <div className={`relative w-full h-full rounded-full border-[12px] border-slate-950 shadow-[0_0_100px_rgba(181,148,78,0.2)] overflow-hidden transition-all duration-1000 ${isPlaying ? 'scale-105' : 'scale-95 grayscale'}`}>
                            <div className={`absolute inset-0 bg-gold-gradient transition-transform duration-1000 ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}></div>
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-[2px]">
                                {/* FIX: Removed mdSize which is not a valid Lucide prop */}
                                {activeTrack.type === 'song' ? <Headphones size={80} className="text-white/90 drop-shadow-3xl" /> : <Mic2 size={80} className="text-white/90 drop-shadow-3xl" />}
                            </div>
                        </div>
                    </div>

                    {/* Metadata & Controls */}
                    <div className="flex-1 text-center md:text-left space-y-8 md:space-y-12">
                        <div className="space-y-3">
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <span className={`px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] ${activeTrack.type === 'song' ? 'bg-gold-main/10 text-gold-main' : 'bg-blue-500/10 text-blue-400'}`}>{activeTrack.type === 'song' ? 'Acoustic Node' : 'Clinical Briefing'}</span>
                                <div className={`flex items-center gap-2 text-[9px] font-mono ${isPlaying ? 'text-green-500' : 'text-white/20'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-white/10'}`}></div>
                                    {isPlaying ? 'LINK ACTIVE' : 'STANDBY'}
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-6xl font-serif font-bold text-white tracking-tighter italic uppercase leading-none">{activeTrack.title}</h2>
                            <p className="text-lg md:text-2xl text-slate-400 font-light italic opacity-70">Facilitated by: {activeTrack.artist}</p>
                        </div>

                        <div className="flex flex-col gap-6 md:gap-10">
                            <div className="flex items-center justify-center md:justify-start gap-8 md:gap-14">
                                {/* FIX: Removed mdSize which is not a valid Lucide prop */}
                                <button className="p-3 text-white/20 hover:text-white transition-all transform hover:scale-125 active:scale-95"><SkipBack size={40} /></button>
                                <button onClick={() => playTrack(activeTrack)} className="w-20 h-20 md:w-28 md:h-28 rounded-[2rem] md:rounded-[3rem] bg-gold-main text-slate-950 flex items-center justify-center shadow-gold hover:shadow-[0_0_100px_rgba(181,148,78,0.4)] hover:scale-110 active:scale-95 transition-all group">
                                    {/* FIX: Removed mdSize which is not a valid Lucide prop */}
                                    {isPlaying && activeTrack.id === currentTrackId ? <Pause size={44} fill="currentColor" /> : <Play size={44} fill="currentColor" className="ml-2" />}
                                </button>
                                {/* FIX: Removed mdSize which is not a valid Lucide prop */}
                                <button className="p-3 text-white/20 hover:text-white transition-all transform hover:scale-125 active:scale-95"><SkipForward size={40} /></button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative group/seek">
                                    <div className={`h-full bg-gold-main shadow-gold transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`} style={{ width: isPlaying ? '100%' : '0%' }}></div>
                                </div>
                                <div className="flex justify-between items-center text-[10px] md:text-[12px] font-mono text-white/30 uppercase tracking-[0.3em]">
                                    <div className="flex items-center gap-4">
                                        <span>DEEP_SCAN</span>
                                        <div className="w-1 h-1 rounded-full bg-gold-main/20"></div>
                                        <span>44.1 KHZ</span>
                                    </div>
                                    <span className="text-gold-main font-bold">{activeTrack.duration || 'LIVE'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instant AI Architect Section */}
            {!showManualUplink && (
                <div className="p-8 md:p-14 bg-slate-900 border border-white/5 rounded-[3rem] space-y-10 relative group overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"><Zap size={140} /></div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gold-main/10 rounded-2xl flex items-center justify-center border border-gold-main/30 shadow-gold transition-transform group-hover:rotate-12">
                                <Bot className="text-gold-main" size={32} />
                            </div>
                            <div className="text-left space-y-1">
                                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white italic tracking-tight">Sonic Architect</h3>
                                <p className="text-[10px] font-black text-gold-main/60 uppercase tracking-[0.4em]">Synthetic Lecture Deployment</p>
                            </div>
                        </div>
                        <div className="flex-1 w-full max-w-lg">
                            {!elevenLabsKey ? (
                                <div className="flex items-center justify-center gap-4 px-8 py-5 bg-red-500/5 border border-red-500/20 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-[0.3em] animate-pulse">
                                    <AlertCircle size={18} /> ElevenLabs Auth Required
                                </div>
                            ) : isRecording ? (
                                <div className="h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center px-6 gap-5 overflow-hidden relative">
                                    <div className="h-full bg-gold-main/10 absolute left-0 transition-all duration-[2000ms] ease-linear" style={{ width: `${recordingProgress}%` }}></div>
                                    <Loader2 className="w-6 h-6 text-gold-main animate-spin relative z-10" />
                                    <div className="flex-1 relative z-10 flex justify-between items-center">
                                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Node Construction...</span>
                                        <span className="font-mono text-xs text-gold-main">{recordingProgress}%</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <select 
                                        className="flex-1 bg-slate-950/60 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white font-serif font-bold italic focus:border-gold-main/50 transition-all outline-none appearance-none cursor-pointer"
                                        onChange={(e) => generateNewLecture(e.target.value)}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Deploy New Node...</option>
                                        {courseData.map(m => (
                                            <optgroup key={m.id} label={m.title} className="bg-slate-950 text-white/40 uppercase text-[10px] tracking-widest font-black">
                                                {m.topics.map(t => <option key={t.id} value={t.title} className="bg-slate-900 text-white font-serif italic">{t.title}</option>)}
                                            </optgroup>
                                        ))}
                                    </select>
                                    <div className="w-14 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 text-white/20">
                                        <ChevronRight size={24} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                        <div className="flex items-center gap-3"><Binary size={14} className="text-gold-main/40" /> 256KBps Render</div>
                        <div className="flex items-center gap-3"><Activity size={14} className="text-gold-main/40" /> Neural Mapping</div>
                        <div className="flex items-center gap-3"><BarChart3 size={14} className="text-gold-main/40" /> Board Accuracy</div>
                    </div>
                </div>
            )}
        </div>

        {/* Right Column: Library & Sidebar */}
        <div className="lg:col-span-4 space-y-12">
            
            {/* Library Interface */}
            <div className="bg-slate-950/40 p-8 md:p-12 rounded-[3.5rem] border border-white/10 flex flex-col h-[700px] shadow-3xl relative overflow-hidden group/lib">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover/lib:opacity-10 transition-opacity"><ListMusic size={120} /></div>
                
                <div className="space-y-8 mb-10 relative z-10">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight uppercase italic">Acoustic Vault</h3>
                        <Headphones className="text-gold-main/30" size={20} />
                    </div>
                    
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold-main transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Filter Sector Codes..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-xs text-white focus:outline-none focus:border-gold-main/40 transition-all font-mono placeholder:text-white/10" 
                        />
                    </div>

                    <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/5">
                        {['all', 'songs', 'lectures', 'custom'].map((tab) => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab as any)} 
                                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-gold-main text-slate-900 shadow-gold' : 'text-white/30 hover:text-white/50'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 relative z-10">
                    {filteredTracks.length > 0 ? filteredTracks.map((track, i) => (
                        <div key={track.id + i} className={`w-full p-4 rounded-2xl border transition-all duration-700 flex items-center gap-5 group/item ${currentTrackId === track.id ? 'bg-gold-main text-slate-950 border-gold-main shadow-gold' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-gold-main/20 text-white/70'}`}>
                            <button onClick={() => playTrack(track)} className="flex-1 flex items-center gap-5 min-w-0">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${currentTrackId === track.id ? 'bg-slate-950/10' : 'bg-slate-900 border border-white/5 group-hover/item:border-gold-main/40 shadow-inner'}`}>
                                    {currentTrackId === track.id && isPlaying ? (
                                        <div className="flex gap-1 items-end h-4">
                                            <div className="w-1 bg-current rounded-full animate-resonance-pulse-1"></div>
                                            <div className="w-1 bg-current rounded-full animate-resonance-pulse-2"></div>
                                            <div className="w-1 bg-current rounded-full animate-resonance-pulse-3"></div>
                                        </div>
                                    ) : track.type === 'song' ? <Music size={20} /> : <Mic2 size={20} />}
                                </div>
                                <div className="flex-1 min-w-0 text-left space-y-0.5">
                                    <p className={`text-sm md:text-base font-serif font-bold truncate leading-tight ${currentTrackId === track.id ? 'text-slate-950' : 'text-white'}`}>{track.title}</p>
                                    <p className={`text-[8px] font-black uppercase tracking-widest truncate ${currentTrackId === track.id ? 'text-slate-950/40' : 'text-white/20'}`}>{track.artist}</p>
                                </div>
                            </button>
                            <div className="flex items-center gap-3">
                                <span className={`text-[9px] font-mono font-bold ${currentTrackId === track.id ? 'text-slate-950/60' : 'text-white/10'}`}>{track.duration}</span>
                                {(track.id.startsWith('custom-') || track.id.startsWith('manual-')) && (
                                    <button 
                                        onClick={async (e) => { 
                                            e.stopPropagation();
                                            const cache = await caches.open(CACHE_NAME); 
                                            await cache.delete(track.url); 
                                            const updated = customTracks.filter(t => t.id !== track.id); 
                                            setCustomTracks(updated); 
                                            localStorage.setItem('echomasters-custom-tracks', JSON.stringify(updated)); 
                                        }} 
                                        className={`p-2.5 rounded-xl transition-all ${currentTrackId === track.id ? 'text-slate-950 hover:bg-slate-950/10' : 'text-white/10 hover:text-red-400 hover:bg-red-400/10'}`}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 opacity-20">
                            <ZapOff size={48} />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">No Resonance Found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Faculty Advice Sidebar */}
            <div className="p-8 bg-gold-main/5 border border-gold-main/20 rounded-[3rem] space-y-6 group hover:bg-gold-main/10 transition-all duration-1000">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gold-main text-slate-950 flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-500"><Sparkles size={24} /></div>
                    <div>
                        <h4 className="text-sm font-serif font-bold text-white italic">Acoustic Memory</h4>
                        <p className="text-[8px] text-gold-main font-black uppercase tracking-[0.4em]">Synaptic Optimization</p>
                    </div>
                </div>
                <p className="text-base font-serif italic text-slate-300 leading-relaxed border-l-2 border-gold-main/20 pl-6">
                    "Listen to the lectures while you scan, kid. Let the physics become a second language. Your brain retains more resonance when paired with tactile feedback."
                </p>
            </div>
        </div>
      </div>

      <style>{`
        @keyframes resonance-1 { 0%, 100% { height: 6px; opacity: 0.5; } 50% { height: 24px; opacity: 1; } }
        @keyframes resonance-2 { 0%, 100% { height: 18px; opacity: 0.8; } 50% { height: 8px; opacity: 0.5; } }
        @keyframes resonance-3 { 0%, 100% { height: 10px; opacity: 0.6; } 50% { height: 20px; opacity: 1; } }
        .animate-resonance-pulse-1 { animation: resonance-1 0.8s ease-in-out infinite; }
        .animate-resonance-pulse-2 { animation: resonance-2 1.2s ease-in-out infinite; }
        .animate-resonance-pulse-3 { animation: resonance-3 1.0s ease-in-out infinite; }
        @keyframes radar-sweep {
            from { transform: translateX(-100%); }
            to { transform: translateX(100%); }
        }
        .animate-radar-sweep {
            animation: radar-sweep 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PodcastStudio;
