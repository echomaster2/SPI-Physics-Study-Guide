
import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Waves, Zap, ChevronRight, Play, Pause, 
  Settings, Database, BookOpen, GraduationCap,
  X, Menu, Activity, Cpu, Sparkles, LayoutGrid,
  ChevronDown, BookMarked, Quote, Mic2, Anchor,
  MapPin, Clock, ShieldCheck, Terminal
} from 'lucide-react';
import OceanBackground from './components/OceanBackground';
import ProfessorHost from './ProfessorHost';
import { courseData, Topic } from './data/courseContent';

const CourseTemplate: React.FC = () => {
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeTopicIdx, setActiveTopicIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [botGesture, setBotGesture] = useState<'none' | 'top' | 'bottom' | 'left' | 'right'>('none');
  const [botMessage, setBotMessage] = useState<string | undefined>("Course Matrix Loaded.");

  const currentModule = courseData[activeModuleIdx];
  const activeLesson = currentModule.topics[activeTopicIdx];

  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        const gestures: any[] = ['top', 'bottom', 'left', 'right'];
        setBotGesture(gestures[Math.floor(Math.random() * gestures.length)]);
      }, 3000);
      return () => {
        clearInterval(interval);
        setBotGesture('none');
      };
    }
  }, [isSpeaking]);

  const toggleLecture = () => {
    setIsSpeaking(!isSpeaking);
    if (!isSpeaking) {
      setBotMessage(`Analyzing: ${activeLesson.title}. Establish focus on the core variables.`);
    } else {
      setBotMessage("Acoustic link suspended. Standing by.");
    }
  };

  const selectLesson = (mIdx: number, tIdx: number) => {
    setActiveModuleIdx(mIdx);
    setActiveTopicIdx(tIdx);
    setSidebarOpen(false);
    setIsSpeaking(false);
    setBotMessage(`Syncing Node ${courseData[mIdx].topics[tIdx].id}`);
  };

  return (
    <div className="fixed inset-0 bg-[#010409] text-white font-sans overflow-hidden">
      {/* 1. THE LIVE BACKGROUND ENGINE */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <OceanBackground />
      </div>

      {/* 2. LAYOUT WRAPPER */}
      <div className="relative z-10 flex h-full flex-col md:flex-row">
        
        {/* MOBILE HEADER */}
        <div className="md:hidden flex items-center justify-between p-6 bg-slate-950/60 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gold-main/10 flex items-center justify-center border border-gold-main/20">
                <Bot size={20} className="text-gold-main" />
             </div>
             <span className="font-serif font-bold italic">EchoMasters SPI</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-white/60">
            <Menu size={24} />
          </button>
        </div>

        {/* SIDEBAR NAVIGATION */}
        <aside className={`fixed inset-y-0 left-0 w-80 bg-slate-950/80 backdrop-blur-3xl border-r border-white/5 flex flex-col transition-transform duration-500 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-50`}>
          <div className="p-10 border-b border-white/5">
            <h2 className="text-2xl font-serif font-bold italic tracking-tight">EchoMasters</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mt-2">SPI PHYSICS MATRIX</p>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {courseData.map((mod, mIdx) => (
              <div key={mod.id} className="space-y-4">
                <div className="flex items-center gap-2 px-4">
                  <div className="w-1 h-1 rounded-full bg-gold-main"></div>
                  <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{mod.title}</span>
                </div>
                <div className="space-y-1">
                  {mod.topics.map((lesson, tIdx) => (
                    <button 
                      key={lesson.id} 
                      onClick={() => selectLesson(mIdx, tIdx)}
                      className={`w-full text-left p-4 rounded-2xl transition-all border flex items-center justify-between group ${activeModuleIdx === mIdx && activeTopicIdx === tIdx ? 'bg-gold-main border-gold-main text-slate-950 shadow-gold' : 'border-transparent hover:bg-white/5 text-white/60 hover:text-white'}`}
                    >
                      <span className="text-sm font-serif font-bold italic truncate">{lesson.title}</span>
                      <ChevronRight size={14} className={activeModuleIdx === mIdx && activeTopicIdx === tIdx ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-8 border-t border-white/5 bg-slate-950/40">
             <div className="flex items-center gap-4 text-white/30">
               <Cpu size={14} />
               <span className="text-[9px] font-mono tracking-widest">FACULTY_LINK_OK</span>
             </div>
          </div>
        </aside>

        {/* MAIN CONTENT WORKSPACE */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative p-6 md:p-12 lg:p-20 space-y-12">
          
          {/* BOT POSITIONING (Fixed to workspace) */}
          <div className="absolute top-20 right-20 pointer-events-none">
            <ProfessorHost 
              isActive={true} 
              isSpeaking={isSpeaking} 
              gesturingAt={botGesture} 
              message={botMessage} 
            />
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* LESSON HEADER */}
            <header className="space-y-6">
               <div className="flex items-center gap-3">
                 <span className="px-3 py-1 rounded-full bg-gold-main/10 border border-gold-main/30 text-[9px] font-black text-gold-main uppercase tracking-widest">Node_{activeLesson.id}</span>
                 <div className="h-px w-8 bg-white/10"></div>
                 <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Acoustic Vector Simulation Active</span>
               </div>
               <h1 className="text-4xl md:text-8xl font-serif font-bold italic tracking-tighter leading-[0.9] text-white">
                 {activeLesson.title}
               </h1>
            </header>

            {/* INTERACTIVE SIMULATION DISPLAY AREA */}
            <div className="p-4 bg-slate-900/60 rounded-[3rem] border border-white/5 shadow-3xl relative overflow-hidden group min-h-[400px]">
               <div className="absolute inset-0 bg-radial-glow opacity-50"></div>
               {/* This would ideally render the component based on activeLesson.visualType */}
               <div className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-8 p-12">
                  <div className="w-24 h-24 bg-gold-main/10 border-2 border-gold-main/30 rounded-[2rem] flex items-center justify-center shadow-gold animate-pulse">
                    <Activity className="text-gold-main w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-bold italic text-white uppercase">{activeLesson.visualType}</h3>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Establishing Hands-on Resonance</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center gap-1">
                      <Terminal size={14} className="text-gold-main/40" />
                      <span className="text-[8px] font-black uppercase text-white/20">Vector Data</span>
                      <span className="text-lg font-serif font-bold italic">44.1 kHz</span>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center gap-1">
                      <ShieldCheck size={14} className="text-gold-main/40" />
                      <span className="text-[8px] font-black uppercase text-white/20">Protocol</span>
                      <span className="text-lg font-serif font-bold italic">Active</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* CONTENT BODY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
               <div className="lg:col-span-8 space-y-8">
                  <article className="p-8 md:p-14 bg-white/[0.02] border border-white/5 rounded-[3.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform"><BookOpen size={160} /></div>
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-4 text-gold-main">
                          <Sparkles size={18} />
                          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Core Narrative</span>
                        </div>
                        <div className="text-xl md:text-3xl font-serif italic text-slate-200 leading-relaxed font-light border-l-2 border-gold-main/20 pl-8">
                          {activeLesson.contentBody}
                        </div>
                    </div>
                  </article>

                  <div className="p-10 bg-gold-main text-slate-950 rounded-[3rem] space-y-6 shadow-gold relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={100} /></div>
                    <div className="flex items-center gap-3">
                      <Terminal size={18} />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em]">Faculty Mnemonics</span>
                    </div>
                    <p className="text-2xl md:text-4xl font-serif font-bold italic tracking-tight leading-tight">
                      "{activeLesson.mnemonic}"
                    </p>
                    <div className="pt-6 border-t border-slate-950/10">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-60">Logic Anchor Verified</p>
                    </div>
                  </div>
               </div>

               <div className="lg:col-span-4 space-y-6">
                  <div className="p-8 bg-slate-900/80 border border-white/10 rounded-[2.5rem] space-y-6 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-3 text-gold-main">
                      <Clock size={16} />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em]">Briefing Roadmap</span>
                    </div>
                    <div className="space-y-3">
                      {activeLesson.roadmap.split(';').map((step, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="w-6 h-6 rounded-lg bg-gold-main/10 flex items-center justify-center text-[10px] font-black text-gold-main">{i+1}</div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{step.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-4 italic opacity-60">
                    <div className="flex items-center gap-3">
                      <Quote size={16} className="text-gold-main" />
                      <span className="text-[10px] font-black uppercase tracking-widest">The Analogy</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      "{activeLesson.analogy}"
                    </p>
                  </div>
               </div>
            </div>

            {/* CONTROLS BAR */}
            <div className="sticky bottom-10 left-0 right-0 max-w-2xl mx-auto z-[60]">
               <div className="p-4 bg-slate-950/90 backdrop-blur-3xl border border-gold-main/20 rounded-[2.5rem] shadow-3xl flex items-center gap-6">
                  <button 
                    onClick={toggleLecture}
                    className="w-16 h-16 rounded-3xl bg-gold-main text-slate-950 flex items-center justify-center shadow-gold hover:scale-105 active:scale-95 transition-all"
                  >
                    {isSpeaking ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                  </button>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-end">
                       <span className="text-[8px] font-black text-gold-main uppercase tracking-widest leading-none">Establishing Resonance</span>
                       <div className="flex gap-0.5 items-end h-3 px-2">
                         {[1,2,3].map(i => <div key={i} className={`w-0.5 bg-gold-main/40 rounded-full ${isSpeaking ? `animate-resonance-pulse-${i}` : 'h-1'}`}></div>)}
                       </div>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full bg-gold-main transition-all duration-300 ${isSpeaking ? 'w-full animate-[progress_10s_linear_infinite]' : 'w-0'}`}></div>
                    </div>
                  </div>
               </div>
            </div>

          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(181, 148, 78, 0.2); border-radius: 10px; }
        @keyframes resonance-pulse-1 { 0%, 100% { height: 4px; opacity: 0.5; } 50% { height: 12px; opacity: 1; } }
        @keyframes resonance-pulse-2 { 0%, 100% { height: 10px; opacity: 0.8; } 50% { height: 4px; opacity: 0.5; } }
        @keyframes resonance-pulse-3 { 0%, 100% { height: 6px; opacity: 0.6; } 50% { height: 10px; opacity: 1; } }
        .animate-resonance-pulse-1 { animation: resonance-pulse-1 0.7s ease-in-out infinite; }
        .animate-resonance-pulse-2 { animation: resonance-pulse-2 0.9s ease-in-out infinite; }
        .animate-resonance-pulse-3 { animation: resonance-pulse-3 0.8s ease-in-out infinite; }
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </div>
  );
};

export default CourseTemplate;
