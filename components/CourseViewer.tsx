
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { courseData, Module, Topic, AssessmentQuestion, highYieldFormulas, mockExamBank, artifactVault, flashcards, Flashcard, shopItems, ShopItem, FlashcardProgress } from '../data/courseContent';
import Simulations from './Simulations';
import CinematicIntro from './CinematicIntro';
import SiteRadio, { sharedAudio, RadioTrack } from './SiteRadio';
import PodcastStudio from './PodcastStudio';
import ProfessorHost from './ProfessorHost';
import RecallChamber from './RecallChamber';
import ArtifactVault from './ArtifactVault';
import FormulaHub from './FormulaHub';
import CommissionShop from './CommissionShop';
import SectorSync from './SectorSync';
import SimLaboratory from './SimLaboratory';
import { 
    ChevronRight, BookOpen, X, LayoutGrid, ArrowRight, 
    Sparkles, Heart, Trophy, Brain, Bot, 
    Zap, PenTool, CheckCircle2, Calculator,
    Target, ShieldCheck, Award, Flame, 
    Coins, Navigation, Activity, Monitor, 
    Info, StickyNote, ShoppingBag, ScanLine, 
    ClipboardCheck, UserCircle, User as UserIcon,
    Menu, ShieldAlert, RefreshCw, Database,
    Volume2, VolumeX, RotateCcw, Play, Pause,
    Beaker, Waves, Radio, History, GraduationCap,
    Lightbulb, Rocket, Shield, Star, Book, 
    Check, Timer, FileText, BarChart3, Stethoscope,
    Trash2, AlertTriangle, AlertCircle, ArrowLeft, Gem,
    Search, Gauge, Loader2, ZapOff, Compass, Eye,
    Wind, Clock, Terminal, List, Settings, Filter,
    Cpu, Radar, Crosshair, Binary, Wifi, Headphones,
    Microscope, FlaskConical, Droplet, Layers,
    ChevronDown, BookMarked, Quote, Mic2, Anchor,
    MapPin, Wind as AirIcon, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

interface CourseViewerProps {
    onExit: () => void;
    onPlayCorrect: () => void;
    onPlayIncorrect: () => void;
    onPlayBubble?: () => void;
}

interface GamificationState {
    xp: number;
    coins: number;
    level: number;
    streak: number;
    lastActive: number;
    badges: string[];
    unlockedItems: string[];
    activeBoosters: string[];
    flashcardProgress: Record<string, FlashcardProgress>;
    notes: string;
    userName: string;
    userRole: string;
    avatarId: string;
    voiceId: string;
    elevenLabsKey: string;
    customVoiceId?: string;
    lastExamScore: number;
    journalEntry: string;
}

const SidebarLink: React.FC<{ active: boolean; collapsed: boolean; onClick: () => void; icon: any; label: string; subLabel?: string; progress?: number }> = ({ active, collapsed, onClick, icon: Icon, label, subLabel, progress }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-4 md:px-6 md:py-4 rounded-xl md:rounded-[1.8rem] transition-all duration-500 group relative overflow-hidden ${active ? 'bg-gold-main text-slate-950 shadow-gold' : 'text-white/40 hover:bg-white/[0.04] hover:text-white'} ${collapsed ? 'justify-center md:px-0' : ''}`}
        aria-current={active ? 'page' : undefined}
        title={collapsed ? label : ''}
    >
        <div className={`relative z-10 p-2.5 rounded-xl transition-all duration-300 ${active ? 'bg-slate-950/10' : 'bg-slate-900 border border-white/5 group-hover:border-gold-main/20'} ${collapsed ? 'mx-auto' : ''}`}>
            <Icon size={20} strokeWidth={active ? 2.5 : 2} className={active ? 'scale-110' : 'group-hover:text-gold-main transition-colors'} />
        </div>
        {!collapsed && (
            <div className="flex flex-col text-left relative z-10 min-w-0 flex-1 animate-fade-in">
                <span className={`text-[11px] md:text-[12px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] leading-none ${active ? 'text-slate-950' : ''}`}>{label}</span>
                {subLabel && <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] mt-1 opacity-50 truncate ${active ? 'text-slate-950/60' : ''}`}>{subLabel}</span>}
            </div>
        )}
        {active && !collapsed && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse-slow pointer-events-none"></div>
        )}
    </button>
);

const CourseViewer: React.FC<CourseViewerProps> = ({ onExit, onPlayCorrect, onPlayIncorrect, onPlayBubble }) => {
    const mainScrollRef = useRef<HTMLDivElement>(null);
    const [isHydrated, setIsHydrated] = useState(false);
    const [isDiving, setIsDiving] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false); 
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('spi-sidebar-collapsed');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('spi-sidebar-collapsed', String(sidebarCollapsed));
    }, [sidebarCollapsed]);

    const [audioData, setAudioData] = useState<{
        isPlaying: boolean;
        track: RadioTrack | null;
        progress: number;
        volume: number;
        isMuted: boolean;
    }>({
        isPlaying: !sharedAudio.paused,
        track: null,
        progress: 0,
        volume: sharedAudio.volume,
        isMuted: false
    });

    const [harveyMessage, setHarveyMessage] = useState<string | undefined>("Systems nominal. Acoustic pathways established.");

    const getSavedState = (key: string, fallback: any) => {
        try {
            const saved = localStorage.getItem('spi-viewer-state-' + key);
            if (!saved) return fallback;
            return JSON.parse(saved);
        } catch(e) { return fallback; }
    };

    const [viewMode, setViewMode] = useState<string>(() => getSavedState('view-mode', 'dashboard'));
    const [currentModuleIdx, setCurrentModuleIdx] = useState<number>(() => getSavedState('module-idx', 0));
    const [currentTopicIdx, setCurrentTopicIdx] = useState<number>(() => getSavedState('topic-idx', 0));
    const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(() => new Set(getSavedState('completed-ids', [])));

    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [timerActive, setTimerActive] = useState(false);

    const [game, setGame] = useState<GamificationState>(() => getSavedState('gamification', {
        xp: 0, coins: 250, level: 1, streak: 1, lastActive: Date.now(), badges: ['pioneer_badge'],
        unlockedItems: [], activeBoosters: [], flashcardProgress: {}, notes: "", userName: "Acoustic Seeker",
        userRole: "Sonography Student", avatarId: "av-1", voiceId: 'Yko7iBn2vnSMvSAsuF8N', elevenLabsKey: '',
        customVoiceId: '', lastExamScore: 0, journalEntry: ""
    }));

    const currentModule = useMemo(() => courseData[currentModuleIdx] || courseData[0], [currentModuleIdx]);
    const currentTopic = useMemo(() => {
        const safeTopics = currentModule?.topics || courseData[0].topics;
        return safeTopics[currentTopicIdx] || safeTopics[0];
    }, [currentModule, currentTopicIdx]);
    
    useEffect(() => {
        if (!isHydrated) return;
        localStorage.setItem('spi-viewer-state-view-mode', JSON.stringify(viewMode));
        localStorage.setItem('spi-viewer-state-module-idx', JSON.stringify(currentModuleIdx));
        localStorage.setItem('spi-viewer-state-topic-idx', JSON.stringify(currentTopicIdx));
        localStorage.setItem('spi-viewer-state-completed-ids', JSON.stringify(Array.from(completedTopicIds)));
        localStorage.setItem('spi-viewer-state-gamification', JSON.stringify(game));
        
        const readiness = (completedTopicIds.size / Math.max(1, courseData.reduce((a,b) => a + b.topics.length, 0))) * 100;
        window.dispatchEvent(new CustomEvent('echomasters-readiness-update', { detail: { score: Math.round(readiness) } }));
    }, [viewMode, currentModuleIdx, currentTopicIdx, completedTopicIds, game, isHydrated]);

    useEffect(() => {
        setIsHydrated(true);
        const handleAudioState = (e: any) => {
            const { isPlaying, track, currentTime, duration, volume, isMuted } = e.detail;
            setAudioData({ isPlaying, track, progress: duration ? (currentTime / duration) * 100 : 0, volume, isMuted });
        };
        window.addEventListener('echomasters-audio-state', handleAudioState);
        return () => window.removeEventListener('echomasters-audio-state', handleAudioState);
    }, []);

    const totalTopicsInCourse = useMemo(() => courseData.reduce((acc, mod) => acc + (mod?.topics?.length || 0), 0), []);
    
    const isModuleUnlocked = (mIdx: number) => {
        if (mIdx === 0) return true;
        const prevModule = courseData[mIdx - 1];
        if (!prevModule) return true;
        return prevModule.topics.every(t => completedTopicIds.has(t.id));
    };

    const nextUncompletedTopic = useMemo(() => {
        for (let mIdx = 0; mIdx < courseData.length; mIdx++) {
            const module = courseData[mIdx];
            for (let tIdx = 0; tIdx < module.topics.length; tIdx++) {
                const topic = module.topics[tIdx];
                if (!completedTopicIds.has(topic.id)) {
                    return { mIdx, tIdx, topic };
                }
            }
        }
        return null;
    }, [completedTopicIds]);

    const boardReadiness = useMemo(() => {
        const topicWeight = (completedTopicIds.size / Math.max(1, totalTopicsInCourse)) * 70;
        const progressValues = Object.values(game?.flashcardProgress || {}) as FlashcardProgress[];
        const masteredCards = progressValues.filter(p => p?.status === 'mastered').length;
        const flashcardWeight = Math.min(30, (masteredCards / Math.max(1, flashcards.length)) * 30);
        return Math.min(100, Math.round(topicWeight + flashcardWeight));
    }, [completedTopicIds, totalTopicsInCourse, game?.flashcardProgress]);

    const navigateToView = (mode: string) => {
        setIsDiving(true);
        onPlayBubble?.();
        setTimeout(() => {
            setViewMode(mode);
            setIsDiving(false);
            setSidebarOpen(false);
        }, 500);
    };

    const markTopicComplete = () => {
        if (!completedTopicIds.has(currentTopic.id)) {
            const newCompleted = new Set(completedTopicIds);
            newCompleted.add(currentTopic.id);
            setCompletedTopicIds(newCompleted);
            setGame(prev => ({ ...prev, xp: prev.xp + (currentTopic.xpReward || 100), coins: prev.coins + (currentTopic.coinReward || 10) }));
            setHarveyMessage(`Acoustic resonance confirmed for ${currentTopic.title}. Sector XP and Credits distributed.`);
        }
        
        const nextTopicInModule = currentModule.topics[currentTopicIdx + 1];
        if (nextTopicInModule) {
            setCurrentTopicIdx(currentTopicIdx + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
            mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigateToView('skill-tree');
        }
    };

    const handlePurchase = (item: ShopItem) => {
        if (game.coins >= item.cost) {
            setGame(prev => {
                const isBooster = item.type === 'booster';
                return {
                    ...prev,
                    coins: prev.coins - item.cost,
                    unlockedItems: [...prev.unlockedItems, item.id],
                    activeBoosters: isBooster ? [...prev.activeBoosters, item.id] : prev.activeBoosters
                };
            });
            onPlayCorrect();
            setHarveyMessage(`Acquisition successful: ${item.name}. Resource exchange complete.`);
        }
    };

    const handleExamComplete = (score: number, total: number) => {
        const xpGain = Math.round((score / total) * 200);
        const coinGain = score * 5;
        setGame(prev => ({
            ...prev,
            xp: prev.xp + xpGain,
            coins: prev.coins + coinGain,
            lastExamScore: Math.round((score / total) * 100)
        }));
        setHarveyMessage(`Sector synchronization complete. Score: ${score}/${total}. Efficiency rewards distributed.`);
    };

    const handleAnswerSelection = (idx: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(idx);
        setShowExplanation(true);
        if (idx === currentTopic.assessment[0].correctAnswer) {
            onPlayCorrect();
            setHarveyMessage("Target verified. Your acoustic logic is sharpening.");
        } else {
            onPlayIncorrect();
            setHarveyMessage("Signal noise detected. Re-evaluating core wave theory.");
        }
    };

    const formattedTime = useMemo(() => {
        const m = Math.floor((secondsElapsed % 3600) / 60);
        const s = secondsElapsed % 60;
        return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    }, [secondsElapsed]);

    useEffect(() => {
        if (timerActive) {
            const interval = setInterval(() => setSecondsElapsed(s => s + 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timerActive]);

    useEffect(() => {
        if (!isHydrated) return;
        mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        setTimerActive(['study', 'mock-exam', 'flashcards', 'shop'].includes(viewMode));
    }, [viewMode, currentTopicIdx, currentModuleIdx, isHydrated]);

    if (!isHydrated) return null;

    return (
        <div className={`fixed inset-0 z-[60] flex flex-col md:flex-row overflow-hidden text-slate-100 font-sans bg-transparent h-full transition-all duration-700 ${isDiving ? 'blur-2xl grayscale brightness-50 scale-95' : ''}`}>
            
            {sidebarOpen && <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[140] md:hidden" onClick={() => setSidebarOpen(false)}></div>}

            <aside 
                className={`fixed inset-y-0 left-0 bg-slate-950/80 backdrop-blur-3xl border-r border-white/5 flex flex-col transition-all duration-500 z-[150] md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shrink-0 h-full ${sidebarCollapsed ? 'w-[80px]' : 'w-[280px] md:w-[320px]'}`}
            >
                <div className={`p-6 flex flex-col gap-6 shrink-0 transition-all ${sidebarCollapsed ? 'items-center' : ''}`}>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-gold-main/10 flex items-center justify-center border border-gold-main/30 shadow-gold shrink-0"><Bot size={20} className="text-gold-main" /></div>
                            {!sidebarCollapsed && (
                                <div className="text-left text-white min-w-0 animate-fade-in">
                                    <h2 className="font-serif font-bold text-lg leading-none italic tracking-tight truncate">EchoMasters</h2>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-gold-main/40 mt-1 block">Sector Hub</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center">
                            <button 
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
                                className="hidden md:flex p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                            >
                                {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                            </button>
                            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/40 p-3 hover:bg-white/5 rounded-xl"><X size={24} /></button>
                        </div>
                    </div>
                </div>
                
                <nav className={`px-4 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar pb-10 ${sidebarCollapsed ? 'px-2' : ''}`}>
                    <SidebarLink collapsed={sidebarCollapsed} active={viewMode === 'dashboard'} onClick={() => navigateToView('dashboard')} icon={LayoutGrid} label="Command Hub" />
                    <SidebarLink collapsed={sidebarCollapsed} active={viewMode === 'skill-tree'} onClick={() => navigateToView('skill-tree')} icon={Navigation} label="Sector Grid" />
                    <SidebarLink collapsed={sidebarCollapsed} active={viewMode === 'flashcards'} onClick={() => navigateToView('flashcards')} icon={StickyNote} label="Recall Chamber" />
                    <SidebarLink collapsed={sidebarCollapsed} active={viewMode === 'artifact-vault'} onClick={() => navigateToView('artifact-vault')} icon={ScanLine} label="Artifact Vault" />
                    <SidebarLink collapsed={sidebarCollapsed} active={viewMode === 'cheat-sheet'} onClick={() => navigateToView('cheat-sheet')} icon={Calculator} label="Formula Hub" />
                    <SidebarLink collapsed={sidebarCollapsed} active={viewMode === 'mock-exam'} onClick={() => navigateToView('mock-exam')} icon={ClipboardCheck} label="Sector Sync" />
                    <SidebarLink collapsed={sidebarCollapsed} active={viewMode === 'sandbox-lab'} onClick={() => navigateToView('sandbox-lab')} icon={Beaker} label="Sim Laboratory" />
                    <SidebarLink collapsed={sidebarCollapsed} active={viewMode === 'podcast-studio'} onClick={() => navigateToView('podcast-studio')} icon={Radio} label="Echo Chamber" />
                    <SidebarLink collapsed={sidebarCollapsed} active={viewMode === 'shop'} onClick={() => navigateToView('shop')} icon={ShoppingBag} label="Commission" />
                </nav>

                <div className={`p-6 mt-auto border-t border-white/5 bg-slate-950/40 transition-all ${sidebarCollapsed ? 'p-3' : ''}`}>
                    <div className={`bg-slate-950 rounded-[1.5rem] p-4 border border-white/5 ${sidebarCollapsed ? 'p-2 flex flex-col items-center' : 'space-y-3'}`}>
                        {sidebarCollapsed ? (
                            <div className="flex flex-col items-center gap-1">
                                <Coins size={12} className="text-gold-main" />
                                <span className="text-[10px] font-mono font-bold text-white">{game.coins}</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center text-[9px] font-black uppercase text-gold-main tracking-widest">
                                    <div className="flex items-center gap-2"><Coins size={12} /><span>{game.coins} Credits</span></div>
                                    <span className="text-white/30">Lvl {game.level}</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gold-main shadow-gold transition-all duration-1000" style={{ width: `${(game.xp % 1000) / 10}%` }}></div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-h-0 relative bg-slate-950/20">
                <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-10 shrink-0 bg-slate-950/40 backdrop-blur-2xl z-[130]">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 text-white bg-white/5 rounded-xl border border-white/10 active:scale-95 transition-all"><Menu size={20} /></button>
                        {!sidebarCollapsed && <div className="hidden sm:block"><SiteRadio /></div>}
                        {sidebarCollapsed && (
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setSidebarCollapsed(false)} 
                                    className="p-2 text-white/40 hover:text-white transition-all bg-white/5 rounded-xl"
                                    title="Expand Sidebar"
                                >
                                    <PanelLeftOpen size={18} />
                                </button>
                                <div className="hidden sm:block"><SiteRadio /></div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 md:gap-8">
                        {timerActive && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gold-main/10 border border-gold-main/20 rounded-xl">
                                <Timer size={14} className="text-gold-main animate-pulse" />
                                <span className="text-[10px] md:text-xs font-mono font-bold text-gold-main">{formattedTime}</span>
                            </div>
                        )}
                        <button onClick={onExit} className="p-2.5 text-white/30 hover:text-white hover:bg-red-500/10 rounded-xl transition-all"><X size={20} /></button>
                    </div>
                </header>

                <div ref={mainScrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-10 lg:p-16 min-h-0 relative pb-40 md:pb-60">
                    
                    {viewMode === 'dashboard' && (
                        <div className="max-w-7xl mx-auto space-y-8 md:space-y-16 animate-fade-in pb-20">
                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-2">
                                        <Terminal size={14} className="text-gold-main" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Command Node 01</span>
                                    </div>
                                    <h1 className="text-3xl md:text-7xl font-serif font-bold tracking-tighter italic uppercase text-white">Dashboard</h1>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <div className="flex-1 px-8 py-6 bg-slate-900 border border-white/5 rounded-2xl flex flex-col items-center gap-1 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 blur-2xl"></div>
                                        <Flame size={20} className="text-orange-500 animate-pulse" />
                                        <span className="text-2xl font-serif font-bold italic text-white leading-none">{game.streak}</span>
                                        <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">Streak</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
                                <div className="lg:col-span-8 space-y-8 md:space-y-16">
                                    <button onClick={() => { if (nextUncompletedTopic) { setCurrentModuleIdx(nextUncompletedTopic.mIdx); setCurrentTopicIdx(nextUncompletedTopic.tIdx); navigateToView('topic-intro'); } else { navigateToView('skill-tree'); } }} 
                                        className="w-full p-8 bg-gold-main text-slate-950 rounded-[2.5rem] text-left space-y-6 group hover:translate-y-[-4px] transition-all shadow-gold relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><Rocket size={100} /></div>
                                        <div className="w-12 h-12 rounded-xl bg-slate-950/10 flex items-center justify-center border border-slate-950/5"><Navigation size={22} /></div>
                                        <div className="space-y-1">
                                            <h3 className="text-2xl md:text-3xl font-serif font-bold italic leading-tight uppercase tracking-tighter">Resume Traversal</h3>
                                            <p className="text-xs font-light opacity-80 italic truncate pr-12">Next: {nextUncompletedTopic?.topic.title || 'Curriculum Overview'}</p>
                                        </div>
                                        <div className="pt-6 border-t border-slate-950/10 flex justify-between items-center"><span className="text-[9px] font-black uppercase tracking-widest">Acoustic Sync</span><ChevronRight size={18} /></div>
                                    </button>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="p-6 md:p-8 bg-slate-950/40 border border-white/5 rounded-2xl md:rounded-[2.5rem] space-y-4 shadow-xl">
                                            <div className="flex items-center gap-3 text-gold-main"><Target size={14} /><span className="text-[9px] font-black uppercase tracking-widest">Readiness</span></div>
                                            <div className="flex items-baseline gap-2"><span className="text-3xl md:text-4xl font-serif font-bold italic text-white">{boardReadiness}</span><span className="text-[10px] text-white/20 font-mono">%</span></div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gold-main/40" style={{ width: `${boardReadiness}%` }}></div></div>
                                        </div>
                                        <div className="p-6 md:p-8 bg-slate-950/40 border border-white/5 rounded-2xl md:rounded-[2.5rem] space-y-4 shadow-xl">
                                            <div className="flex items-center gap-3 text-blue-400"><Gauge size={14} /><span className="text-[9px] font-black uppercase tracking-widest">Velocity</span></div>
                                            <div className="flex items-baseline gap-2"><span className="text-3xl md:text-4xl font-serif font-bold italic text-white">4.2</span><span className="text-[10px] text-white/20 font-mono">Sect/Hr</span></div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-400/40" style={{ width: `60%` }}></div></div>
                                        </div>
                                        <div className="p-6 md:p-8 bg-slate-950/40 border border-white/5 rounded-2xl md:rounded-[2.5rem] space-y-4 shadow-xl">
                                            <div className="flex items-center gap-3 text-green-400"><ShieldCheck size={14} /><span className="text-[9px] font-black uppercase tracking-widest">Integrity</span></div>
                                            <div className="flex items-baseline gap-2"><span className="text-3xl md:text-4xl font-serif font-bold italic text-white">98</span><span className="text-[10px] text-white/20 font-mono">MS</span></div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-green-400/40" style={{ width: `98%` }}></div></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-4 space-y-8">
                                    <div className="p-8 md:p-10 bg-slate-900 border border-gold-main/20 rounded-[2.5rem] space-y-8 relative group overflow-hidden shadow-gold-dim min-h-[300px]">
                                        <ProfessorHost isActive={true} message={harveyMessage} position={{ x: 50, y: 40 }} />
                                        <div className="pt-32 space-y-4 text-center">
                                            <p className="text-[11px] text-slate-400 italic">Faculty Advisor: Unit-01</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {viewMode === 'skill-tree' && (
                        <div className="max-w-7xl mx-auto space-y-16 animate-fade-in pb-40 relative">
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-main/20 to-transparent hidden lg:block"></div>

                             <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-12">
                                <div className="space-y-4 text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gold-main/10 rounded-lg border border-gold-main/20 shadow-gold"><Navigation size={14} className="text-gold-main animate-pulse" /></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Expedition Mapping Protocol</span>
                                    </div>
                                    <h1 className="text-4xl md:text-[6rem] font-serif font-bold tracking-tighter italic uppercase leading-none">Sector <span className="text-gold-main not-italic">Grid</span></h1>
                                    <p className="text-slate-400 text-sm md:text-xl font-light max-w-2xl leading-relaxed italic border-l-2 border-gold-main/20 pl-6">Progressing into the depths of clinical wave theory.</p>
                                </div>
                                <div className="flex flex-col gap-4 w-full md:w-auto">
                                    <div className="px-8 py-5 bg-slate-950 border border-white/10 rounded-[2.5rem] shadow-3xl flex items-center gap-6">
                                        <div className="flex flex-col"><span className="text-[7px] font-black text-white/30 uppercase tracking-widest mb-1">Max Depth Reach</span><span className="text-2xl font-serif font-bold text-white italic leading-none">6,000m</span></div>
                                        <div className="h-10 w-px bg-white/5"></div>
                                        <div className="flex flex-col"><span className="text-[7px] font-black text-white/30 uppercase tracking-widest mb-1">Pressure Index</span><span className="text-2xl font-serif font-bold text-gold-main italic leading-none">Extreme</span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative pl-0 lg:pl-16 space-y-12">
                                {courseData.map((module, mIdx) => {
                                    const unlocked = isModuleUnlocked(mIdx);
                                    const completedInModule = module.topics.filter(t => completedTopicIds.has(t.id)).length;
                                    const progress = (completedInModule / module.topics.length) * 100;
                                    const isCurrent = unlocked && progress < 100;
                                    
                                    const offsetClass = mIdx % 2 === 0 ? 'lg:translate-x-4' : 'lg:-translate-x-4';
                                    
                                    return (
                                        <div key={module.id} className={`transition-all duration-1000 relative ${offsetClass} ${unlocked ? 'opacity-100' : 'opacity-20 grayscale scale-95 pointer-events-none'}`}>
                                            <div className="absolute -left-20 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 opacity-40">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gold-main shadow-gold animate-pulse"></div>
                                                <span className="text-[9px] font-mono font-bold text-gold-main rotate-90 whitespace-nowrap">{module.depth}M</span>
                                                <div className="h-20 w-px bg-gradient-to-b from-gold-main/40 to-transparent"></div>
                                            </div>

                                            <div className={`p-8 md:p-14 rounded-[3.5rem] border transition-all duration-700 shadow-3xl overflow-hidden group ${isCurrent ? 'bg-slate-900 border-gold-main/40 ring-4 ring-gold-main/5' : 'bg-slate-950/40 border-white/5 hover:border-white/10'}`}>
                                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 group-hover:opacity-[0.04] transition-all pointer-events-none"><Radar size={240} /></div>
                                                
                                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-12 relative z-10">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-xl ${isCurrent ? 'bg-gold-main text-slate-950 border-gold-main shadow-gold' : 'bg-slate-950 text-white/30 border-white/10'}`}>
                                                                {mIdx < 3 ? <AirIcon size={24} /> : mIdx < 7 ? <Waves size={24} /> : mIdx < 10 ? <Droplet size={24} /> : <Anchor size={24} />}
                                                            </div>
                                                            <div>
                                                                <span className="text-[10px] md:text-[11px] font-black text-gold-main/60 uppercase tracking-[0.4em]">Sector {mIdx + 1} • {module.pressure} Pressure</span>
                                                                <h3 className="text-2xl md:text-5xl font-serif font-bold italic text-white uppercase tracking-tighter">{module.title.split('. ')[1] || module.title}</h3>
                                                            </div>
                                                        </div>
                                                        <p className="text-slate-400 text-sm md:text-lg font-light italic max-w-xl border-l-2 border-white/5 pl-6">{module.description}</p>
                                                    </div>
                                                    
                                                    <div className="w-full lg:w-64 space-y-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md">
                                                        <div className="flex justify-between items-end">
                                                            <div className="space-y-0.5"><span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] block">Sync Index</span><span className="text-xl font-serif font-bold text-white italic">{Math.round(progress)}%</span></div>
                                                            <div className="text-right space-y-0.5"><span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] block">Completed</span><span className="text-xl font-serif font-bold text-gold-main italic">{completedInModule} / {module.topics.length}</span></div>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                                                            <div className={`h-full transition-all duration-2000 ${isCurrent ? 'bg-gold-main shadow-gold' : 'bg-white/20'}`} style={{ width: `${progress}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 relative z-10">
                                                    {module.topics.map((topic, tIdx) => {
                                                        const done = completedTopicIds.has(topic.id);
                                                        const isNext = !done && isModuleUnlocked(mIdx) && (tIdx === 0 || completedTopicIds.has(module.topics[tIdx - 1].id));
                                                        
                                                        return (
                                                            <button 
                                                                key={topic.id} 
                                                                onClick={() => { setCurrentModuleIdx(mIdx); setCurrentTopicIdx(tIdx); navigateToView('topic-intro'); }} 
                                                                className={`group/topic p-6 md:p-8 rounded-[2.5rem] border text-left transition-all duration-700 flex flex-col gap-10 relative overflow-hidden active:scale-95 ${
                                                                    done 
                                                                        ? 'bg-gold-main/10 border-gold-main/30' 
                                                                        : isNext 
                                                                            ? 'bg-slate-900 border-gold-main shadow-gold animate-pulse-soft' 
                                                                            : 'bg-slate-950/40 border-white/5 hover:border-gold-main/20'
                                                                }`}
                                                            >
                                                                <div className="flex justify-between items-start relative z-10">
                                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${done ? 'bg-gold-main text-slate-950' : isNext ? 'bg-gold-main text-slate-950 shadow-gold' : 'bg-slate-950 text-white/20 border border-white/5'}`}>
                                                                        {topic.isSecret ? <Gem size={20} className="animate-bounce" /> : <Activity size={20} />}
                                                                    </div>
                                                                    {done ? <CheckCircle2 size={16} className="text-gold-main" /> : isNext ? <div className="w-2 h-2 rounded-full bg-gold-main animate-ping shadow-gold"></div> : null}
                                                                </div>
                                                                
                                                                <div className="space-y-2 relative z-10">
                                                                    <h5 className={`text-base md:text-xl font-serif font-bold italic tracking-tight leading-tight transition-colors ${done ? 'text-white' : isNext ? 'text-gold-main' : 'text-white/40 group-hover/topic:text-white'}`}>{topic.title}</h5>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{topic.estTime}</span>
                                                                        {topic.isSecret && <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 text-[7px] text-purple-400 font-black uppercase tracking-widest rounded-full">Secret Node</span>}
                                                                    </div>
                                                                </div>

                                                                {isNext && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/topic:translate-x-full transition-transform duration-1000"></div>}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="max-w-4xl mx-auto p-12 bg-white/[0.03] border border-white/5 rounded-[4rem] text-center space-y-10 mt-20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-transform"><Trophy size={160} /></div>
                                <div className="space-y-6 relative z-10">
                                    <div className="w-20 h-20 rounded-[2rem] bg-gold-main/10 flex items-center justify-center border border-gold-main/30 shadow-gold mx-auto"><MapPin size={32} className="text-gold-main" /></div>
                                    <h2 className="text-3xl md:text-6xl font-serif font-bold text-white italic uppercase tracking-tighter">Expedition Status</h2>
                                    <p className="text-slate-400 text-lg md:text-2xl font-light max-w-2xl mx-auto italic leading-relaxed">
                                        "You've traversed {completedTopicIds.size} acoustic nodes across 12 clinical sectors. The ocean is deep, but your vision is clearing, kid."
                                    </p>
                                </div>
                                <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-[11px] font-black uppercase tracking-[0.4em] text-white/20 border-t border-white/5">
                                    <div className="flex flex-col gap-2"><span>Total XP</span><span className="text-2xl font-serif font-bold text-white italic leading-none">{game.xp}</span></div>
                                    <div className="flex flex-col gap-2"><span>Nodes Sync'd</span><span className="text-2xl font-serif font-bold text-white italic leading-none">{completedTopicIds.size} / {totalTopicsInCourse}</span></div>
                                    <div className="flex flex-col gap-2"><span>Board Ready</span><span className="text-2xl font-serif font-bold text-gold-main italic leading-none">{boardReadiness}%</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {viewMode === 'topic-intro' && (
                        <div className="max-w-7xl mx-auto animate-fade-in">
                            <CinematicIntro title={currentTopic.title} seedText={currentTopic.narrativeHook || currentTopic.timeSaverHook} type="lesson" persona={currentTopic.professorPersona || 'Charon'} topicData={currentTopic} voiceId={game.voiceId} elevenLabsKey={game.elevenLabsKey} onContinue={() => navigateToView('study')} />
                        </div>
                    )}

                    {viewMode === 'study' && (
                        <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-40">
                             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/5 pb-10">
                                <div className="space-y-4 md:space-y-6">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-3 py-1 rounded-full bg-gold-main/10 border border-gold-main/20 text-[9px] font-black text-gold-main uppercase tracking-[0.3em]">Node_{currentTopic.id}</span>
                                        <div className="flex items-center gap-2 text-white/20 text-[9px] font-mono"><Clock size={12} /> {currentTopic.estTime} Deployment</div>
                                    </div>
                                    <h1 className="text-[clamp(2.2rem,8vw,5.5rem)] font-serif font-bold text-white tracking-tighter leading-[0.85] italic uppercase break-words">
                                        {currentTopic.title.split(' ').map((w,i) => i === currentTopic.title.split(' ').length - 1 ? <span key={i} className="text-gold-main not-italic">{w}</span> : w + ' ')}
                                    </h1>
                                </div>
                                <div className="px-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-4 group w-full lg:w-auto">
                                    <Sparkles size={16} className="text-gold-main shrink-0" />
                                    <p className="text-xs md:text-sm font-serif italic text-slate-300 max-w-xs">{currentTopic.activeLearningPromise}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                                <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 text-gold-main px-1"><Navigation size={14} /><span className="text-[10px] font-black uppercase tracking-[0.3em]">Roadmap</span></div>
                                        <div className="space-y-3">
                                            {currentTopic.roadmap.split(';').map((step, i) => (
                                                <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl group transition-all hover:border-gold-main/20">
                                                    <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center text-[9px] font-mono font-bold text-white/30 shrink-0">{i+1}</div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 leading-tight">{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-6 bg-slate-950 border border-white/10 rounded-2xl space-y-4 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><AlertTriangle size={60} /></div>
                                        <div className="flex items-center gap-3 text-red-400"><ZapOff size={14} /><span className="text-[9px] font-black uppercase tracking-widest">Logic Negation</span></div>
                                        <p className="text-xs text-slate-400 italic leading-relaxed border-l-2 border-red-500/40 pl-4">{currentTopic.negation}</p>
                                    </div>
                                    <div className="p-6 bg-gold-main/5 border border-gold-main/20 rounded-2xl space-y-4">
                                        <div className="flex items-center gap-3 text-gold-main"><Brain size={14} /><span className="text-[9px] font-black uppercase tracking-widest">Mnemonic Hook</span></div>
                                        <p className="text-[11px] font-bold text-white uppercase tracking-wider bg-gold-main/10 p-3 rounded-lg border border-gold-main/20">{currentTopic.mnemonic}</p>
                                    </div>
                                </div>

                                <div className="lg:col-span-9 space-y-10 order-1 lg:order-2">
                                    <div className="relative group overflow-hidden rounded-2xl md:rounded-[3.5rem] min-h-[300px] shadow-2xl">
                                        <Simulations type={currentTopic.visualType} />
                                    </div>
                                    <div className="prose prose-invert max-w-none space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 relative overflow-hidden group">
                                                <div className="flex items-center gap-3 text-gold-main"><Quote size={18} /><h4 className="text-sm font-black uppercase tracking-widest m-0">The Analogy</h4></div>
                                                <p className="text-base text-slate-300 italic font-light leading-relaxed m-0">{currentTopic.analogy}</p>
                                            </div>
                                            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 relative overflow-hidden group">
                                                <div className="flex items-center gap-3 text-blue-400"><Stethoscope size={18} /><h4 className="text-sm font-black uppercase tracking-widest m-0">Practical Use</h4></div>
                                                <p className="text-base text-slate-300 italic font-light leading-relaxed m-0">{currentTopic.practicalApplication}</p>
                                            </div>
                                        </div>

                                        <div className="p-6 md:p-16 bg-slate-900/40 border border-white/10 rounded-2xl md:rounded-[3.5rem] relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 md:p-24 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform"><BookOpen size={160} /></div>
                                            <div className="relative z-10 space-y-8">
                                                <div className="flex items-center gap-3 text-gold-main"><Layers size={20} /><h3 className="text-lg md:text-2xl font-serif font-bold italic uppercase m-0 tracking-tight">Core Instructional Theory</h3></div>
                                                <div className="text-lg md:text-3xl text-slate-200 font-serif font-light leading-relaxed italic border-l-2 border-gold-main/30 pl-8 py-2">{currentTopic.contentBody}</div>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl space-y-4">
                                            <div className="flex items-center gap-3 text-indigo-400"><RefreshCw size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Mindset Shift</span></div>
                                            <p className="text-sm text-slate-300 italic font-light leading-relaxed m-0">"{currentTopic.mindsetShift}"</p>
                                        </div>

                                        <div className="p-8 md:p-20 bg-slate-900 border border-white/10 rounded-2xl md:rounded-[4rem] text-center space-y-12 relative overflow-hidden shadow-2xl">
                                            <div className="space-y-6 relative z-10">
                                                <ClipboardCheck size={48} className="text-gold-main mx-auto" />
                                                <h2 className="text-2xl md:text-6xl font-serif font-bold text-white italic uppercase tracking-tighter leading-none">Sector Checksum</h2>
                                                <p className="text-slate-400 text-sm md:text-lg max-w-xl mx-auto italic font-light leading-relaxed">{currentTopic.assessmentCTA}</p>
                                            </div>
                                            <div className="max-w-2xl mx-auto p-6 md:p-10 bg-slate-950 border border-white/5 rounded-2xl md:rounded-[3rem] space-y-8 text-left relative z-10 shadow-3xl">
                                                <div className="space-y-8">
                                                    <p className="text-lg md:text-2xl text-white font-serif font-bold italic leading-relaxed">{currentTopic.assessment[0].question}</p>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {currentTopic.assessment[0].options.map((opt, idx) => (
                                                            <button key={idx} disabled={selectedAnswer !== null} onClick={() => handleAnswerSelection(idx)} className={`w-full p-6 rounded-2xl text-left text-sm font-medium transition-all border relative overflow-hidden ${selectedAnswer === idx ? (idx === currentTopic.assessment[0].correctAnswer ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400') : 'bg-white/5 border-white/10 hover:border-gold-main/40 text-white/60'}`}>
                                                                <div className="flex items-center justify-between relative z-10"><span>{opt}</span>{selectedAnswer === idx && (idx === currentTopic.assessment[0].correctAnswer ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />)}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {showExplanation && (
                                                        <div className="p-8 bg-gold-main/10 rounded-2xl border border-gold-main/20 animate-slide-up space-y-6">
                                                            <div className="flex items-center gap-3 text-gold-main"><Info size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Faculty Debrief</span></div>
                                                            <p className="text-base md:text-lg text-slate-200 italic leading-relaxed font-serif m-0">{currentTopic.assessment[0].explanation}</p>
                                                            <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gold-main/20">
                                                                <div className="flex gap-2 items-center text-[10px] font-black text-gold-main/60 uppercase tracking-widest"><Trophy size={14} /> +{currentTopic.xpReward} XP</div>
                                                                <button onClick={markTopicComplete} className="w-full sm:w-auto px-12 py-5 bg-gold-main text-slate-950 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-gold flex items-center justify-center gap-4 active:scale-95 transition-all">Next Sector <ArrowRight size={16} /></button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {['flashcards', 'artifact-vault', 'cheat-sheet', 'shop', 'mock-exam', 'podcast-studio', 'sandbox-lab'].includes(viewMode) && (
                        <div className="max-w-7xl mx-auto pb-40">
                            {viewMode === 'flashcards' && <RecallChamber progress={game.flashcardProgress} onUpdateProgress={(id, st) => setGame(p => ({...p, flashcardProgress: {...p.flashcardProgress, [id]: {id, status: st, reviewCount: 1, lastReviewed: Date.now()}}}))} onPlayCorrect={onPlayCorrect} />}
                            {viewMode === 'artifact-vault' && <ArtifactVault />}
                            {viewMode === 'cheat-sheet' && <FormulaHub />}
                            {viewMode === 'shop' && <CommissionShop coins={game.coins} unlockedItems={game.unlockedItems} activeBoosters={game.activeBoosters} onPurchase={handlePurchase} />}
                            {viewMode === 'mock-exam' && <SectorSync onComplete={handleExamComplete} onExit={() => navigateToView('dashboard')} onPlayCorrect={onPlayCorrect} onPlayIncorrect={onPlayIncorrect} />}
                            {viewMode === 'podcast-studio' && <PodcastStudio voiceId={game.voiceId} elevenLabsKey={game.elevenLabsKey} />}
                            {viewMode === 'sandbox-lab' && <SimLaboratory />}
                        </div>
                    )}
                </div>

                <div className={`fixed bottom-4 md:bottom-[110px] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-full max-w-4xl z-[145] transition-all duration-700 ${audioData.track || audioData.isPlaying ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                    <div className="bg-slate-950/90 backdrop-blur-3xl border border-gold-main/20 rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-4 flex items-center gap-4 md:gap-6 shadow-3xl">
                        <button onClick={() => audioData.isPlaying ? sharedAudio.pause() : sharedAudio.play()} className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gold-main text-slate-950 flex items-center justify-center shadow-gold shrink-0">
                            {audioData.isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                        </button>
                        <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex justify-between items-end">
                                <div className="min-w-0"><p className="text-[7px] md:text-[8px] font-black text-gold-main uppercase tracking-widest mb-0.5">Acoustic Feed</p><p className="text-[10px] md:text-[11px] text-white font-bold italic truncate leading-none">{audioData.track?.title || 'System Audio'}</p></div>
                                <div className="flex items-end gap-0.5 h-3 px-1">{[1,2,3].map(i => (<div key={i} className={`w-0.5 bg-gold-main/40 rounded-full ${audioData.isPlaying ? `animate-resonance-pulse-${i}` : 'h-1'}`}></div>))}</div>
                            </div>
                            <div className="relative"><input type="range" min="0" max="100" step="0.1" value={audioData.progress} readOnly className="w-full h-1 bg-white/5 rounded-full appearance-none accent-gold-main" /><div className="absolute inset-y-0 left-0 bg-gold-main/40 h-1 rounded-full pointer-events-none transition-all" style={{ width: `${audioData.progress}%` }}></div></div>
                        </div>
                        <button onClick={() => setAudioData(prev => ({ ...prev, track: null, isPlaying: false }))} className="p-2 text-white/20 hover:text-red-400 transition-colors"><X size={14} /></button>
                    </div>
                </div>

                {viewMode !== 'dashboard' && viewMode !== 'profile' && (
                    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-full max-w-lg z-[120] pointer-events-auto">
                        <div className={`bg-slate-950/80 backdrop-blur-2xl border-2 rounded-2xl p-3 md:p-4 shadow-3xl flex items-center gap-4 md:gap-6 group transition-all duration-700 ${showExplanation ? 'border-gold-main/40 scale-105' : 'border-white/10'}`}>
                            <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0">
                                <svg className="w-full h-full -rotate-90"><circle cx="50%" cy="50%" r="40%" stroke="rgba(255,255,255,0.05)" strokeWidth="3" fill="transparent" /><circle cx="50%" cy="50%" r="40%" stroke="#B5944E" strokeWidth="3" fill="transparent" strokeDasharray="100" strokeDashoffset={100 - boardReadiness} className="transition-all duration-1000" strokeLinecap="round" /></svg>
                                <div className="absolute inset-0 flex items-center justify-center font-mono text-[8px] md:text-[9px] font-bold text-gold-main">{boardReadiness}%</div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[7px] md:text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-0.5">Readiness Vector</p>
                                <p className="text-[9px] md:text-[10px] text-white font-bold italic tracking-tight truncate">{currentModule.title.split('. ')[1]} Node Sync...</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => navigateToView('dashboard')} className="p-2 md:p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-95"><LayoutGrid size={16} /></button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CourseViewer;
