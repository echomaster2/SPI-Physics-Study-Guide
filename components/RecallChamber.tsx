
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Rotate3d, Brain, CheckCircle2, RefreshCw, ChevronLeft, 
  ChevronRight, Bookmark, Filter, Search, Zap, 
  Target, GraduationCap, History, Star, X, Info
} from 'lucide-react';
import { flashcards, Flashcard, FlashcardProgress } from '../data/courseContent';

interface RecallChamberProps {
  progress: Record<string, FlashcardProgress>;
  onUpdateProgress: (id: string, status: 'learning' | 'mastered') => void;
  onPlayCorrect?: () => void;
}

const RecallChamber: React.FC<RecallChamberProps> = ({ progress, onUpdateProgress, onPlayCorrect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStats, setShowStats] = useState(false);

  const categories = useMemo(() => ['All', ...new Set(flashcards.map(f => f.category))], []);

  const filteredCards = useMemo(() => {
    return flashcards.filter(card => {
      const matchesCategory = activeCategory === 'All' || card.category === activeCategory;
      const matchesSearch = card.front.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            card.back.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];
  const currentProgress = currentCard ? progress[currentCard.id] : null;

  const stats = useMemo(() => {
    const total = flashcards.length;
    // Fix: Explicitly cast values to FlashcardProgress[] to resolve type errors for .status access
    const values = Object.values(progress) as FlashcardProgress[];
    const mastered = values.filter(v => v.status === 'mastered').length;
    const learning = values.filter(v => v.status === 'learning').length;
    return { mastered, learning, new: total - mastered - learning, total };
  }, [progress]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  const handleMark = (status: 'learning' | 'mastered') => {
    if (!currentCard) return;
    onUpdateProgress(currentCard.id, status);
    if (status === 'mastered') onPlayCorrect?.();
    handleNext();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in text-left pb-40 px-4 md:px-10 py-10">
      
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 pb-12">
        <div className="space-y-6 text-white overflow-hidden flex-1">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-main/10 rounded-lg border border-gold-main/20"><Brain size={14} className="text-gold-main animate-pulse" /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Neural Anchoring Protocol</span>
            </div>
            <div className="space-y-2">
                <h1 className="text-[clamp(2rem,8vw,5.5rem)] font-serif font-bold tracking-tighter leading-[0.8] italic uppercase">Recall <span className="text-gold-main not-italic">Chamber</span></h1>
                <p className="text-slate-400 text-sm md:text-xl font-light max-w-2xl italic leading-relaxed border-l-2 border-gold-main/20 pl-6 py-1">
                    Strengthen synaptic pathways through active repetition. Master the high-yield acoustic constants required for board clearance.
                </p>
            </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
            {[
              { label: 'Mastered', value: stats.mastered, icon: CheckCircle2, color: 'text-green-500' },
              { label: 'Learning', value: stats.learning, icon: RefreshCw, color: 'text-blue-400' },
              { label: 'Untouched', value: stats.new, icon: Zap, color: 'text-gold-main' },
              { label: 'Total Sync', value: stats.total, icon: Target, color: 'text-white/40' }
            ].map((stat, i) => (
              <div key={i} className="px-6 py-4 bg-slate-900 border border-white/5 rounded-2xl flex flex-col items-center gap-1 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all">
                  <stat.icon size={12} className={`${stat.color} mb-1 opacity-60 group-hover:opacity-100 transition-opacity`} />
                  <span className="text-xl font-serif font-bold text-white italic leading-none">{stat.value}</span>
                  <span className="text-[7px] font-black uppercase text-white/20 tracking-widest">{stat.label}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-gold-main px-2">
              <Filter size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sector Filter</span>
            </div>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {categories.map((cat) => (
                <button 
                  key={cat as string}
                  onClick={() => { setActiveCategory(cat as string); setCurrentIndex(0); setIsFlipped(false); }}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left border ${activeCategory === cat ? 'bg-gold-main text-slate-950 border-gold-main shadow-gold' : 'bg-slate-950/40 text-white/40 border-white/5 hover:bg-white/5 hover:text-white'}`}
                >
                  {cat as string}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-gold-main transition-colors" />
            <input 
              type="text" 
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentIndex(0); setIsFlipped(false); }}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-xs text-white focus:border-gold-main/40 transition-all outline-none italic font-serif"
            />
          </div>

          <div className="p-8 bg-gold-main/5 border border-gold-main/20 rounded-[2.5rem] space-y-4">
            <div className="flex items-center gap-3 text-gold-main">
              <Zap size={16} />
              <span className="text-[9px] font-black uppercase tracking-widest">Faculty Protocol</span>
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed border-l-2 border-gold-main/20 pl-4">
              "Focus on the 'Untouched' nodes first, kid. Once they transition to 'Learning', the resonance will hold much longer. Don't rush the flip."
            </p>
          </div>
        </div>

        {/* Main Card Viewport */}
        <div className="lg:col-span-9 space-y-12 order-1 lg:order-2">
          {filteredCards.length > 0 ? (
            <>
              <div className="perspective-1000 w-full h-[350px] md:h-[500px]">
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`relative w-full h-full transition-all duration-700 preserve-3d cursor-pointer group ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                  {/* Front Face */}
                  <div className="absolute inset-0 backface-hidden bg-slate-900 border-2 border-white/10 rounded-[3rem] p-10 md:p-20 flex flex-col items-center justify-center text-center space-y-8 shadow-3xl overflow-hidden group-hover:border-gold-main/30 transition-colors">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gold-main/10">
                      <div className="h-full bg-gold-main/40 transition-all duration-1000" style={{ width: `${((currentIndex + 1) / filteredCards.length) * 100}%` }}></div>
                    </div>
                    <div className="absolute top-8 right-10 flex items-center gap-3 opacity-30">
                        <span className="text-[10px] font-mono text-gold-main font-bold">{currentIndex + 1} / {filteredCards.length}</span>
                        <Info size={14} />
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-gold-main/10 border border-gold-main/20 text-[9px] font-black text-gold-main uppercase tracking-[0.4em]">{currentCard.category}</span>
                    <h2 className="text-2xl md:text-5xl font-serif font-bold text-white italic leading-tight tracking-tight drop-shadow-2xl px-4">
                      {currentCard.front}
                    </h2>
                    <div className="flex items-center gap-3 text-white/20 group-hover:text-gold-main/60 transition-all">
                       <Rotate3d size={18} className="animate-spin-slow" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Reveal Resonance</span>
                    </div>
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-950 border-2 border-gold-main/40 rounded-[3rem] p-10 md:p-20 flex flex-col items-center justify-center text-center space-y-8 shadow-[0_0_80px_rgba(181,148,78,0.1)] overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(181,148,78,0.05)_0%,transparent_70%)]"></div>
                    <div className="absolute top-8 left-10 flex items-center gap-2 opacity-30">
                        <Bookmark size={14} className="text-gold-main" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">Definition Validated</span>
                    </div>
                    <div className="relative z-10 space-y-6">
                      <p className="text-lg md:text-3xl text-slate-200 font-light leading-relaxed italic">
                        {currentCard.back}
                      </p>
                      {currentProgress?.status === 'mastered' && (
                        <div className="flex items-center justify-center gap-3 text-green-400">
                          <CheckCircle2 size={16} />
                          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Mastery Locked</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-gold-main/40">
                       <Zap size={16} fill="currentColor" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Synchronized</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6">
                <div className="flex items-center gap-4 order-2 md:order-1">
                  <button onClick={handlePrev} className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={handleNext} className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95">
                    <ChevronRight size={24} />
                  </button>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto order-1 md:order-2">
                  <button 
                    onClick={() => handleMark('learning')}
                    className="flex-1 md:flex-none px-10 py-5 bg-white/5 border border-white/10 text-white/60 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500/10 hover:border-blue-500/40 hover:text-blue-400 transition-all flex items-center justify-center gap-3"
                  >
                    <RefreshCw size={16} /> Still Learning
                  </button>
                  <button 
                    onClick={() => handleMark('mastered')}
                    className="flex-1 md:flex-none px-10 py-5 bg-gold-main text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-gold hover:shadow-[0_20px_50px_rgba(181,148,78,0.4)] transition-all flex items-center justify-center gap-3 active:translate-y-1"
                  >
                    <CheckCircle2 size={16} /> Mark Mastered
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-6 bg-slate-950/20 border border-dashed border-white/10 rounded-[3rem]">
              <X size={48} className="text-white/10" />
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-white/40">No Signal Detected</h3>
                <p className="text-sm text-white/20 uppercase tracking-[0.3em]">Adjust your filters to locate acoustic nodes</p>
              </div>
              <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="px-8 py-3 bg-white/5 border border-white/10 text-white/40 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Clear Protocol</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .backface-hidden { backface-visibility: hidden; }
        .preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  );
};

export default RecallChamber;
