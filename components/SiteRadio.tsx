
import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Radio, ListMusic, ChevronDown, Disc3, Sparkles, Mic, Headphones, Loader2, AlertCircle } from 'lucide-react';

export interface RadioTrack {
    id: string;
    title: string;
    artist: string;
    url: string;
    duration?: string;
    type?: 'music' | 'podcast' | 'study';
}

const DEFAULT_TRACKS: RadioTrack[] = [
    { id: 'study-1', title: 'Focus Resonance', artist: 'Echo Study Lo-Fi', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_18087374a9.mp3', duration: '2:45', type: 'study' },
    { id: 'study-2', title: 'Neural Pathways', artist: 'Deep Alpha Waves', url: 'https://cdn.pixabay.com/audio/2023/10/24/audio_99616e4564.mp3', duration: '5:20', type: 'study' },
    { id: 'track-1', title: 'Deep Resonance', artist: 'Echo Ambience', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a7315b.mp3', duration: '3:42', type: 'music' },
];

// Global audio singleton exported for sync
export const sharedAudio = new Audio();
let isAudioInitialized = false;
let globalTrackIdx = 0;
let globalVolume = 0.3;
let globalIsMuted = false;
let currentPlaylist: RadioTrack[] = [...DEFAULT_TRACKS];

const isValidUrl = (url: string) => {
  return url && url.startsWith('http') && url !== window.location.href;
};

(window as any).duckRadio = (duck: boolean) => {
    sharedAudio.volume = duck ? globalVolume * 0.2 : globalVolume;
};

const SiteRadio: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(!sharedAudio.paused && isAudioInitialized);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentTrackIdx, setCurrentTrackIdx] = useState(globalTrackIdx);
    const [volume, setVolume] = useState(globalVolume);
    const [isMuted, setIsMuted] = useState(globalIsMuted);
    const [showFullPlayer, setShowFullPlayer] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);

    const syncTracks = () => {
        try {
            const saved = localStorage.getItem('spi-admin-overrides');
            const customTracks: RadioTrack[] = [];
            if (saved) {
                const overrides = JSON.parse(saved);
                Object.keys(overrides).forEach(key => {
                    if (key.startsWith('radio-track-')) {
                        const data = overrides[key];
                        if (isValidUrl(data.value)) {
                            customTracks.push({
                                id: key,
                                title: data.label || `Custom Node`,
                                artist: data.metadata?.artist || 'Academy Broadcast',
                                url: data.value,
                                type: data.metadata?.type || 'podcast'
                            });
                        }
                    }
                });
            }
            currentPlaylist = customTracks.length > 0 ? [...DEFAULT_TRACKS, ...customTracks] : [...DEFAULT_TRACKS];
        } catch (e) {
            currentPlaylist = [...DEFAULT_TRACKS];
        }
    };

    useEffect(() => {
        syncTracks();
        
        const initTrack = currentPlaylist[globalTrackIdx];
        if (!isAudioInitialized && isValidUrl(initTrack?.url)) {
            sharedAudio.src = initTrack.url;
            sharedAudio.volume = globalVolume;
            isAudioInitialized = true;
        }

        const handlePlay = () => { 
            setIsPlaying(true); 
            setIsLoading(false); 
            setError(null);
            broadcastState();
        };
        const handlePause = () => { 
            setIsPlaying(false);
            broadcastState();
        };
        const handleWaiting = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);
        
        const handleError = (e: any) => {
            if (sharedAudio.src && sharedAudio.src !== window.location.href) {
                setError("Signal Lost");
            }
            setIsPlaying(false);
            setIsLoading(false);
        };

        const handleEnded = () => {
            const nextIdx = (globalTrackIdx + 1) % currentPlaylist.length;
            selectTrack(nextIdx);
        };

        const broadcastState = () => {
            window.dispatchEvent(new CustomEvent('echomasters-audio-state', {
                detail: {
                    isPlaying: !sharedAudio.paused,
                    track: currentPlaylist[globalTrackIdx],
                    currentTime: sharedAudio.currentTime,
                    duration: sharedAudio.duration,
                    volume: sharedAudio.volume,
                    isMuted: globalIsMuted
                }
            }));
        };

        sharedAudio.addEventListener('play', handlePlay);
        sharedAudio.addEventListener('pause', handlePause);
        sharedAudio.addEventListener('waiting', handleWaiting);
        sharedAudio.addEventListener('canplay', handleCanPlay);
        sharedAudio.addEventListener('error', handleError);
        sharedAudio.addEventListener('ended', handleEnded);
        sharedAudio.addEventListener('timeupdate', broadcastState);

        const handleExternalPlay = (e: any) => {
            const { track } = e.detail;
            if (!isValidUrl(track?.url)) return;
            let idx = currentPlaylist.findIndex(t => t.url === track.url);
            if (idx === -1) {
                currentPlaylist = [track, ...currentPlaylist];
                idx = 0;
            }
            selectTrack(idx);
        };

        window.addEventListener('echomasters-play-track', handleExternalPlay);

        return () => {
            sharedAudio.removeEventListener('play', handlePlay);
            sharedAudio.removeEventListener('pause', handlePause);
            sharedAudio.removeEventListener('waiting', handleWaiting);
            sharedAudio.removeEventListener('canplay', handleCanPlay);
            sharedAudio.removeEventListener('error', handleError);
            sharedAudio.removeEventListener('ended', handleEnded);
            sharedAudio.removeEventListener('timeupdate', broadcastState);
            window.removeEventListener('echomasters-play-track', handleExternalPlay);
        };
    }, []);

    useEffect(() => {
        sharedAudio.volume = isMuted ? 0 : volume;
        globalVolume = volume;
        globalIsMuted = isMuted;
    }, [volume, isMuted]);

    const togglePlay = () => {
        if (!isValidUrl(sharedAudio.src)) {
            selectTrack(currentTrackIdx);
            return;
        }
        if (isPlaying) sharedAudio.pause();
        else sharedAudio.play().catch(() => setError("Source Error"));
    };

    const nextTrack = () => selectTrack((currentTrackIdx + 1) % currentPlaylist.length);
    const prevTrack = () => selectTrack((currentTrackIdx - 1 + currentPlaylist.length) % currentPlaylist.length);

    const selectTrack = (idx: number) => {
        const track = currentPlaylist[idx];
        if (!isValidUrl(track?.url)) {
            setError("No Source");
            return;
        }
        
        globalTrackIdx = idx;
        setCurrentTrackIdx(idx);
        setError(null);
        setIsLoading(true);
        
        sharedAudio.src = track.url;
        sharedAudio.load();
        sharedAudio.play().catch(e => {
            setIsLoading(false);
            setError("Node Offline");
        });
    };

    const currentTrack = currentPlaylist[currentTrackIdx];

    return (
        <div className="relative font-sans flex items-center h-full">
            {showPlaylist && (
                <div className="absolute top-full right-0 mt-4 w-80 bg-slate-950/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden animate-slide-up shadow-2xl z-[200]">
                    <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-2"><Headphones size={14} className="text-gold-main" /><h4 className="text-[9px] font-black text-gold-main uppercase tracking-[0.4em]">Acoustic Vault</h4></div>
                        <button onClick={() => setShowPlaylist(false)} className="text-white/40 hover:text-white transition-colors"><ChevronDown size={14} /></button>
                    </div>
                    <div className="max-h-72 overflow-y-auto custom-scrollbar p-2">
                        {currentPlaylist.map((track, idx) => (
                            <button key={track.id + idx} onClick={() => selectTrack(idx)} className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all group ${currentTrackIdx === idx ? 'bg-gold-main/10 border border-gold-main/20' : 'hover:bg-white/5 border border-transparent'}`}>
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${currentTrackIdx === idx ? 'bg-gold-main text-slate-900 border-gold-main shadow-gold' : 'bg-white/5 text-white/20 border-white/5'}`}>{currentTrackIdx === idx && isLoading ? <Loader2 size={14} className="animate-spin" /> : currentTrackIdx === idx && isPlaying ? <Disc3 size={18} className="animate-spin" /> : track.type === 'study' ? <Sparkles size={14} /> : <Music size={14} />}</div>
                                <div className="text-left flex-1 min-w-0"><div className="flex items-center justify-between"><p className={`text-[11px] font-serif font-bold truncate ${currentTrackIdx === idx ? 'text-gold-main' : 'text-white'}`}>{track.title}</p><span className="text-[8px] text-white/20 font-mono">{track.duration || 'LIVE'}</span></div><p className="text-[8px] text-white/40 uppercase tracking-widest truncate">{track.artist}</p></div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className={`flex items-center gap-3 bg-slate-950/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl transition-all duration-500 hover:border-gold-main/30 group ${showFullPlayer ? 'pr-2' : ''}`}>
                <button onClick={() => setShowFullPlayer(!showFullPlayer)} className="flex items-center gap-3 group/icon">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-500 ${isPlaying ? 'bg-gold-main/20 border-gold-main/40 shadow-gold' : error ? 'border-red-500/50 bg-red-500/10' : 'bg-white/5 border-white/10'}`}>{isLoading ? <Loader2 size={14} className="text-gold-main animate-spin" /> : isPlaying ? <div className="flex gap-0.5 items-end h-3"><div className="w-0.5 rounded-full bg-gold-main animate-radio-wave-1"></div><div className="w-0.5 rounded-full bg-gold-main animate-radio-wave-2"></div><div className="w-0.5 rounded-full bg-gold-main animate-radio-wave-3"></div></div> : error ? <AlertCircle size={14} className="text-red-500" /> : <Radio size={14} className="text-white/30 group-hover/icon:text-gold-main transition-colors" />}</div>
                    {!showFullPlayer && <div className="text-left hidden sm:block"><p className="text-[8px] font-black text-gold-main/60 uppercase tracking-widest leading-none mb-1">{error ? 'SIGNAL ERROR' : 'Acoustic Feed'}</p><p className="text-[10px] text-white/80 font-serif font-bold truncate max-w-[80px] leading-none">{error || currentTrack?.title || 'Offline'}</p></div>}
                </button>
                {showFullPlayer && <div className="flex items-center gap-3 animate-fade-in pl-1 border-l border-white/5"><div className="flex items-center gap-2"><button onClick={prevTrack} className="p-1.5 text-white/30 hover:text-white transition-all"><SkipBack size={14} /></button><button onClick={togglePlay} className="w-8 h-8 rounded-xl bg-gold-main text-slate-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-gold">{isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}</button><button onClick={nextTrack} className="p-1.5 text-white/30 hover:text-white transition-all"><SkipForward size={14} /></button></div><div className="h-4 w-px bg-white/10"></div><div className="flex items-center gap-2"><button onClick={() => setShowPlaylist(!showPlaylist)} className={`p-1.5 rounded-lg transition-all ${showPlaylist ? 'bg-gold-main/20 text-gold-main shadow-inner' : 'text-white/20 hover:text-white'}`}><ListMusic size={14} /></button><div className="group/vol flex items-center"><button onClick={() => setIsMuted(!isMuted)} className="p-1.5 text-white/20 hover:text-gold-main transition-colors">{isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}</button><div className="w-0 overflow-hidden transition-all duration-500 group-hover/vol:w-16"><input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full h-0.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-gold-main" /></div></div></div></div>}
            </div>
            <style>{`
                @keyframes radio-wave-1 { 0%, 100% { height: 4px; } 50% { height: 12px; } }
                @keyframes radio-wave-2 { 0%, 100% { height: 10px; } 50% { height: 4px; } }
                @keyframes radio-wave-3 { 0%, 100% { height: 6px; } 50% { height: 14px; } }
                .animate-radio-wave-1 { animation: radio-wave-1 0.7s ease-in-out infinite; }
                .animate-radio-wave-2 { animation: radio-wave-2 1.0s ease-in-out infinite; }
                .animate-radio-wave-3 { animation: radio-wave-3 0.8s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default SiteRadio;
