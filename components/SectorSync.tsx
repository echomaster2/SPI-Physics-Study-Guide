
import React, { useState, useEffect, useMemo } from 'react';
/* Added missing imports: ZapOff, Terminal, ChevronLeft */
import { 
  ClipboardCheck, Timer, ShieldAlert, Target, 
  ArrowRight, CheckCircle2, AlertTriangle, 
  RotateCcw, Trophy, Brain, BarChart3, 
  Zap, Compass, LayoutGrid, Info, Activity,
  Database, ShieldCheck, ChevronRight,
  ZapOff, Terminal, ChevronLeft
} from 'lucide-react';
import { mockExamBank, AssessmentQuestion } from '../data/courseContent';

interface SectorSyncProps {
  onComplete: (score: number, total: number) => void;
  onExit: () => void;
  onPlayCorrect: () => void;
  onPlayIncorrect: () => void;
}

const SectorSync: React.FC<SectorSyncProps> = ({ onComplete, onExit, onPlayCorrect, onPlayIncorrect }) => {
  const [examStarted, setExamStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [examFinished, setExamFinished] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  // Shuffle questions on start
  const shuffledQuestions = useMemo(() => {
    return [...mockExamBank].sort(() => Math.random() - 0.5);
  }, [examStarted]);

  useEffect(() => {
    let timer: number;
    if (examStarted && !examFinished && timeRemaining > 0) {
      timer = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, examFinished, timeRemaining]);

  const handleStart = () => {
    setExamStarted(true);
  };

  const handleAnswerSelect = (optionIdx: number) => {
    if (examFinished && !isReviewing) return;
    setAnswers(prev => ({ ...prev, [currentIndex]: optionIdx }));
  };

  const handleNext = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinishExam();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinishExam = () => {
    setExamFinished(true);
    const score = Object.entries(answers).reduce((acc, [idx, ans]) => {
      return acc + (shuffledQuestions[parseInt(idx)].correctAnswer === ans ? 1 : 0);
    }, 0);
    onComplete(score, shuffledQuestions.length);
  };

  const formattedTime = useMemo(() => {
    const m = Math.floor(timeRemaining / 60);
    const s = timeRemaining % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  }, [timeRemaining]);

  const score = useMemo(() => {
    return Object.entries(answers).reduce((acc, [idx, ans]) => {
      return acc + (shuffledQuestions[parseInt(idx)].correctAnswer === ans ? 1 : 0);
    }, 0);
  }, [answers, shuffledQuestions]);

  const readinessPercent = Math.round((score / shuffledQuestions.length) * 100);

  if (!examStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in text-left py-10 md:py-20">
        <div className="flex flex-col items-center text-center space-y-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gold-main/20 blur-[100px] animate-pulse"></div>
            <div className="w-32 h-32 md:w-48 md:h-48 bg-slate-950 border-2 border-gold-main/40 rounded-[3rem] md:rounded-[4rem] flex items-center justify-center relative z-10 shadow-gold">
              {/* FIX: Removed mdSize which is not a valid Lucide prop */}
              <Target size={80} className="text-gold-main" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-serif font-bold text-white italic tracking-tighter uppercase">Board <span className="text-gold-main not-italic">Rig_v2</span></h1>
            <p className="text-slate-400 text-lg md:text-2xl font-light italic max-w-2xl leading-relaxed">
              Initiating high-pressure mock assessment. Validate your cognitive resonance across all 5 core physics domains.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3">
              <Timer className="text-gold-main/60" size={24} />
              <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Temporal Limit</p>
              <p className="text-xl font-serif font-bold text-white">10:00 Minutes</p>
            </div>
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3">
              <Database className="text-gold-main/60" size={24} />
              <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Question Payload</p>
              <p className="text-xl font-serif font-bold text-white">{shuffledQuestions.length} High-Yield Nodes</p>
            </div>
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3">
              <ShieldCheck className="text-gold-main/60" size={24} />
              <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Sync Requirement</p>
              <p className="text-xl font-serif font-bold text-white">70% Accuracy</p>
            </div>
          </div>
          <button 
            onClick={handleStart}
            className="group px-16 py-7 bg-gold-main text-slate-950 font-black rounded-2xl md:rounded-[2.5rem] uppercase tracking-[0.4em] text-[11px] md:text-[13px] shadow-gold hover:shadow-[0_20px_80px_rgba(181,148,78,0.5)] transition-all flex items-center gap-6"
          >
            Commence Synchronization <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (examFinished && !isReviewing) {
    return (
      <div className="max-w-5xl mx-auto py-10 md:py-20 animate-fade-in text-left pb-40">
        <div className="bg-slate-950/40 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-8 md:p-20 space-y-12 relative overflow-hidden shadow-3xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(181,148,78,0.05)_0%,transparent_60%)]"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 border-b border-white/5 pb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gold-main">
                <ShieldCheck size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Debriefing Protocol</span>
              </div>
              <h2 className="text-3xl md:text-7xl font-serif font-bold text-white italic tracking-tighter uppercase">Rig Results: <span className="text-gold-main not-italic">v2.0</span></h2>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">Sync Accuracy</div>
              <div className="text-5xl md:text-8xl font-serif font-bold text-gold-main italic leading-none">{readinessPercent}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl space-y-6">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/30 tracking-widest">
                  <span>Logic Alignment</span>
                  <span className="text-gold-main">{score} / {shuffledQuestions.length}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-2000 ${readinessPercent >= 70 ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`} style={{ width: `${readinessPercent}%` }}></div>
                </div>
                <p className="text-sm text-slate-400 font-light italic leading-relaxed">
                  {readinessPercent >= 70 
                    ? "Resonance achieved. Your acoustic logic is mirroring board expectations. Proceed with specialty node acquisition." 
                    : "Signal instability detected. Multiple logic errors present. Repetition of core physics modules recommended."}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => { setExamStarted(false); setExamFinished(false); setCurrentIndex(0); setAnswers({}); setTimeRemaining(600); }} className="flex-1 px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                  <RotateCcw size={16} /> Re-Sync Rig
                </button>
                <button onClick={() => setIsReviewing(true)} className="flex-1 px-8 py-5 bg-gold-main text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-gold transition-all flex items-center justify-center gap-3">
                  <Brain size={16} /> Review Errors
                </button>
              </div>
            </div>

            <div className="p-10 bg-slate-900 border border-gold-main/20 rounded-[3rem] space-y-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Trophy size={160} /></div>
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gold-main/10 rounded-2xl flex items-center justify-center border border-gold-main/30 text-gold-main shadow-gold"><Trophy size={28} /></div>
                  <div>
                    <h4 className="text-xl font-serif font-bold text-white italic">Node Rewards</h4>
                    <p className="text-[9px] font-black text-gold-main/60 uppercase tracking-[0.4em]">Board readiness persistence</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3"><Zap size={14} className="text-gold-main" /><span className="text-[10px] font-black uppercase text-white/60 tracking-widest">Experience Gain</span></div>
                    <span className="text-sm font-mono font-bold text-gold-main">+{readinessPercent * 2} XP</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3"><Database size={14} className="text-gold-main" /><span className="text-[10px] font-black uppercase text-white/60 tracking-widest">Credit Harvest</span></div>
                    <span className="text-sm font-mono font-bold text-gold-main">+{Math.floor(score * 5)} RC</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentIndex];
  const userSelection = answers[currentIndex];
  const isCorrectReview = isReviewing && userSelection === currentQuestion.correctAnswer;

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-12 animate-fade-in text-left pb-40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Progress & Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-8 bg-slate-950 border border-white/10 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Timer size={80} /></div>
            <div className="space-y-1">
              <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Signal Expiry</div>
              <div className={`text-4xl font-mono font-bold italic tracking-tighter ${timeRemaining < 60 ? 'text-red-500 animate-pulse' : 'text-gold-main'}`}>{formattedTime}</div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                <span className="text-white/40">Traversed Nodes</span>
                <span className="text-gold-main">{currentIndex + 1} / {shuffledQuestions.length}</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gold-main shadow-gold transition-all duration-500" style={{ width: `${((currentIndex + 1) / shuffledQuestions.length) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-3xl overflow-y-auto max-h-[300px] custom-scrollbar">
            {shuffledQuestions.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-mono font-bold transition-all border ${
                  currentIndex === i ? 'bg-gold-main text-slate-950 border-gold-main shadow-gold' : 
                  answers[i] !== undefined ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/20 hover:border-gold-main/20'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {!isReviewing && (
            <button 
              onClick={handleFinishExam}
              className="w-full py-5 bg-white/5 border border-white/10 hover:border-red-500/40 text-white/40 hover:text-red-500 transition-all rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-3 group"
            >
              <ZapOff size={14} className="group-hover:animate-pulse" /> Terminate Sync
            </button>
          )}
        </div>

        {/* Question Terminal */}
        <div className="lg:col-span-9 space-y-8">
          <div className="p-8 md:p-14 bg-slate-950 border border-white/10 rounded-[3rem] space-y-12 shadow-3xl relative overflow-hidden group/term min-h-[500px] flex flex-col">
            <div className="absolute top-0 right-0 p-8 border-b border-l border-white/5 bg-white/[0.02] rounded-bl-3xl text-white/20 text-[9px] font-mono uppercase tracking-[0.2em]">
              DOMAIN: {currentQuestion.domain.toUpperCase()}
            </div>
            
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-gold-main/40">
                  <Terminal size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Input Node Query</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-serif font-bold text-white italic leading-tight tracking-tight">
                  {currentQuestion.question}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = userSelection === idx;
                  const isActuallyCorrect = idx === currentQuestion.correctAnswer;
                  
                  let stateStyle = "bg-white/5 border-white/10 text-white/60 hover:border-gold-main/40 hover:text-white";
                  if (isSelected) {
                    if (isReviewing) {
                      stateStyle = isActuallyCorrect ? "bg-green-500/20 border-green-500 text-green-400" : "bg-red-500/20 border-red-500 text-red-400";
                    } else {
                      stateStyle = "bg-gold-main/10 border-gold-main text-gold-main shadow-gold-dim";
                    }
                  } else if (isReviewing && isActuallyCorrect) {
                    stateStyle = "bg-green-500/10 border-green-500/40 text-green-400 opacity-60";
                  }

                  return (
                    <button 
                      key={idx}
                      disabled={isReviewing}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`w-full p-6 rounded-2xl text-left text-sm font-medium transition-all border relative overflow-hidden group/btn ${stateStyle}`}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span>{opt}</span>
                        {isSelected && !isReviewing && <div className="w-2 h-2 rounded-full bg-gold-main animate-pulse shadow-gold"></div>}
                        {isReviewing && isActuallyCorrect && <CheckCircle2 size={16} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {isReviewing && (
              <div className="p-8 bg-gold-main/10 border border-gold-main/20 rounded-[2rem] animate-slide-up space-y-4 mt-8">
                <div className="flex items-center gap-4 text-gold-main">
                  <Info size={18} />
                  <span className="text-[11px] font-black uppercase tracking-widest">Acoustic Logic Feedback</span>
                </div>
                <p className="text-lg text-slate-200 italic leading-relaxed font-serif">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            <div className="pt-10 flex justify-between items-center border-t border-white/5">
              <button 
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-white hover:border-gold-main/20 disabled:opacity-0 transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              {isReviewing && currentIndex === shuffledQuestions.length - 1 ? (
                <button 
                  onClick={() => setIsReviewing(false)}
                  className="px-12 py-5 bg-gold-main text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-gold flex items-center gap-3 transition-all"
                >
                  <LayoutGrid size={16} /> Exit Review
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  disabled={!isReviewing && answers[currentIndex] === undefined}
                  className={`px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-4 transition-all ${
                    answers[currentIndex] !== undefined ? 'bg-gold-main text-slate-950 shadow-gold' : 'bg-white/5 text-white/10 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  {currentIndex === shuffledQuestions.length - 1 ? 'Terminate Sync' : 'Next Node'} <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorSync;
