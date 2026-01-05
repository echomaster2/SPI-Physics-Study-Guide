
import React, { useMemo, useState, useEffect } from 'react';
import { BookOpen, Sun, Loader2, Waves, Activity, ShieldCheck, Compass, ArrowRight, Target, Sparkles, ClipboardList, Bot, Rocket, GraduationCap, CheckCircle2, Anchor, Droplets } from 'lucide-react';
import ProfessorHost from './ProfessorHost';
import { GoogleGenAI } from "@google/genai";

interface HeroProps {
    onOpenCourse?: () => void;
    onPlayBubble?: () => void;
}

const INSIGHT_KEY = 'spi-daily-insight';
const INSIGHT_EXPIRY = 1 * 60 * 60 * 1000; 

const ARDMS_EXAMS = ["SPI Physics", "Abdomen", "OB/GYN", "Vascular", "Breast", "Pediatric", "Fetal Echo"];

const Hero: React.FC<HeroProps> = ({ onOpenCourse, onPlayBubble }) => {
  const [showTip, setShowTip] = useState(false);
  const [tipMessage, setTipMessage] = useState("");
  const [isSummoning, setIsSummoning] = useState(false);
  const [harveyVisible, setHarveyVisible] = useState(false);
  const [summonStage, setSummonStage] = useState<'none' | 'beaming' | 'materializing' | 'active'>('none');

  useEffect(() => {
    const saved = localStorage.getItem(INSIGHT_KEY);
    if (saved) {
      try {
        const { text, timestamp } = JSON.parse(saved);
        if (Date.now() - timestamp < INSIGHT_EXPIRY) {
          setTipMessage(text);
          setShowTip(true);
          setHarveyVisible(true);
          setSummonStage('active');
        }
      } catch (e) {
        localStorage.removeItem(INSIGHT_KEY);
      }
    }
  }, []);

  const summonHarvey = async () => {
      if (isSummoning) return;
      setIsSummoning(true);
      setShowTip(false);
      onPlayBubble?.(); 
      
      setSummonStage('beaming');
      
      setTimeout(() => {
          setSummonStage('materializing');
          setHarveyVisible(true);
      }, 1000);

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: "You are Harvey, a seasoned robotic guardian of the Atlantis Deep-Sea Sanctuary. Provide one deep physics nugget for the SPI exam related to sound waves in liquid or biological tissue. Max 25 words.",
              config: {
                  temperature: 0.9,
                  topP: 0.95,
                  topK: 64
              }
          });

          const wisdom = response.text || "Listen closely, initiate. Water is the ultimate medium. The faster the speed of sound, the stiffer the structure you're mapping.";
          setTipMessage(wisdom);
          localStorage.setItem(INSIGHT_KEY, JSON.stringify({ text: wisdom, timestamp: Date.now() }));
          
          setTimeout(() => {
            setIsSummoning(false);
            setShowTip(true);
            setSummonStage('active');
          }, 1500);

      } catch (e) {
          setTipMessage("The acoustic floor is noisy today. Remember: higher density usually means higher sound velocity in clinical solids.");
          setIsSummoning(false);
          setShowTip(true);
          setSummonStage('active');
      }
  };

  const getOverride = (id: string, fallback: string) => {
    try {
        const saved = localStorage.getItem('spi-admin-overrides');
        if (!saved) return fallback;
        const overrides = JSON.parse(saved);
        return overrides[id]?.value || fallback;
    } catch (e) { return fallback; }
  };

  const customHeroUrl = useMemo(() => getOverride('global-hero', "https://images.unsplash.com/photo-1518112391110-388f8d958611?auto=format&fit=crop&q=80"), []);
  const heroTitle = useMemo(() => getOverride('hero-title', "Elevate Your ARDMS® Mastery Beneath the Waves"), []);
  const heroSubtitle = useMemo(() => getOverride('hero-subtitle', "Clinical physics prep designed in the silence of the deep. Board-mapped precision for sonographers who dive deeper."), []);

  return (
    <div id="home" className="relative min-h-[100dvh] flex items-center pt-20 pb-10 lg:pt-32 lg:pb-32 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 relative z-10 w-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-12">
            <div className="inline-flex items-center gap-2 md:gap-4 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gold-main/10 backdrop-blur-md border border-gold-main/30 shadow-gold-dim animate-fade-in group mx-auto lg:mx-0">
              <div className="flex gap-1">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-gold-main animate-pulse"></div>
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-gold-main/40"></div>
              </div>
              <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-gold-main font-sans">Atlantis Clinical Matrix</span>
            </div>
            
            <div className="space-y-4 md:space-y-8">
              <h1 className="text-3xl sm:text-7xl lg:text-[6.5rem] font-serif font-bold tracking-tighter leading-[0.9] text-white animate-slide-up select-none break-words italic">
                {heroTitle.split(' ').map((word, i) => i > 4 ? <span key={i} className="text-gold-main not-italic">{word} </span> : word + ' ')}
              </h1>
              
              <div className="max-w-2xl mx-auto lg:mx-0">
                <p className="text-base sm:text-2xl text-slate-400 leading-relaxed font-light font-sans opacity-0 animate-slide-up px-1 md:px-0" style={{ animationDelay: '0.2s' }}>
                  {heroSubtitle}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center lg:justify-start pt-4 opacity-0 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <button 
                onClick={onOpenCourse} 
                className="group relative px-8 sm:px-14 py-4.5 md:py-6 bg-gold-main text-slate-950 font-black text-[10px] sm:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-xl md:rounded-2xl shadow-gold hover:translate-y-[-4px] hover:shadow-[0_20px_60px_rgba(181,148,78,0.4)] transition-all duration-500 active:scale-95 flex items-center justify-center gap-3 md:gap-4"
              >
                 <Waves size={18} className="group-hover:scale-110 transition-transform" />
                 <span>Board Immersion</span>
              </button>
              
              <button 
                onClick={onOpenCourse}
                className="group px-8 sm:px-14 py-4.5 md:py-6 bg-white/5 backdrop-blur-xl text-white font-black text-[10px] sm:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-xl md:rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 md:gap-4"
              >
                <Anchor size={18} className="text-gold-main group-hover:rotate-12 transition-transform" />
                <span>Sanctuary Archives</span>
              </button>
            </div>

            <div className="space-y-4 md:space-y-6 pt-8 md:pt-14 opacity-0 animate-slide-up border-t border-white/5" style={{ animationDelay: '0.6s' }}>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-8">
                    {[
                    { icon: ShieldCheck, label: "Pressure Tested" },
                    { icon: Target, label: "Acoustic Mapped" }
                    ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 md:gap-3 text-[8px] md:text-[10px] text-white/40 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] group">
                        <item.icon size={14} className="text-gold-main/40 group-hover:text-gold-main transition-colors" /> {item.label}
                    </div>
                    ))}
                </div>
                
                <div className="flex items-center gap-4 md:gap-6 overflow-hidden">
                    <span className="text-[7px] md:text-[8px] font-black text-gold-main/20 uppercase tracking-[0.3em] md:tracking-[0.4em] whitespace-nowrap shrink-0">Benthic Nodes:</span>
                    <div className="flex gap-4 md:gap-6 animate-[scroll-x_30s_linear_infinite] whitespace-nowrap">
                        {[...ARDMS_EXAMS, ...ARDMS_EXAMS].map((exam, i) => (
                            <span key={i} className="text-[8px] md:text-[9px] font-bold text-white/15 uppercase tracking-widest flex items-center gap-1.5 md:gap-2">
                                <div className="w-1 h-1 rounded-full bg-gold-main/10"></div>
                                {exam}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          <div className="lg:col-span-5 mt-12 md:mt-0 relative flex justify-center items-center opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className={`relative w-full max-w-[260px] sm:max-w-md perspective-1000 group ${harveyVisible ? 'z-[500]' : ''}`}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gold-main/5 blur-[60px] md:blur-[120px] rounded-full pointer-events-none group-hover:bg-gold-main/10 transition-all duration-1000"></div>
                
                <div className={`relative bg-slate-950/80 backdrop-blur-3xl rounded-[2rem] md:rounded-[4.5rem] shadow-3xl transition-all duration-1000 lg:group-hover:rotate-y-12 lg:group-hover:scale-105 aspect-[4/5.5] flex flex-col p-1 ${harveyVisible && showTip ? 'overflow-visible' : 'overflow-hidden'} border border-white/10`}>
                   <div className="w-full h-10 md:h-16 border-b border-white/5 flex items-center px-6 md:px-12 justify-between">
                       <div className="flex gap-1.5 md:gap-3">
                           <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gold-main/30"></div>
                           <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gold-main/30"></div>
                       </div>
                       <span className="text-[7px] md:text-[9px] font-black text-white/20 uppercase tracking-[0.4em] md:tracking-[0.6em]">Deep Logs 2025</span>
                   </div>
                   
                   <div className="flex-1 relative flex items-center justify-center p-6 md:p-16">
                        <img 
                          src={customHeroUrl} 
                          alt="Physics Art" 
                          className="w-full h-full object-cover opacity-10 absolute inset-0 mix-blend-overlay transition-transform duration-3000 group-hover:scale-125"
                        />
                        <div className="relative z-10 text-center space-y-6 md:space-y-12 w-full h-full flex flex-col items-center justify-center">
                            
                            <div className="relative w-16 h-16 sm:w-32 sm:h-32 flex items-center justify-center mx-auto">
                                <div className="absolute inset-[-6px] md:inset-[-10px] border border-gold-main/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                <div className="absolute inset-0 border border-gold-main/20 rounded-2xl md:rounded-[3rem] bg-slate-900/60 backdrop-blur-md transition-all duration-700"></div>
                                
                                {summonStage === 'beaming' && (
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-12 md:w-20 h-[200vh] pointer-events-none z-[600]">
                                        <div className="absolute inset-0 bg-gold-main/30 blur-2xl md:blur-3xl animate-pulse"></div>
                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1 md:w-2 h-full bg-white shadow-[0_0_40px_#B5944E] animate-summon-pillar"></div>
                                    </div>
                                )}

                                <ProfessorHost 
                                    position={{ x: 50, y: 50 }} 
                                    isActive={harveyVisible} 
                                    isThinking={isSummoning}
                                    message={showTip ? tipMessage : undefined}
                                    onClick={summonHarvey}
                                />

                                {!harveyVisible && summonStage !== 'beaming' && (
                                    <Waves className="relative z-0 w-8 h-8 md:w-14 md:h-14 text-gold-main/30 animate-pulse" />
                                )}
                            </div>

                            <div className="space-y-2 md:space-y-4">
                                <h3 className="font-serif font-bold text-white text-2xl md:text-6xl tracking-tighter leading-none italic uppercase">Deep <br/><span className="text-gold-main not-italic">Vault</span></h3>
                                <div className="h-0.5 w-10 md:w-16 bg-gold-main/40 mx-auto rounded-full"></div>
                                <p className="text-[7px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] text-white/30 font-black">Subsurface Protocol</p>
                            </div>
                        </div>
                   </div>
                   
                   <div className="w-full bg-white/5 backdrop-blur-md py-6 md:py-12 border-t border-white/5 px-6 md:px-12 text-center">
                       <p className="text-[7px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.3em] md:tracking-[0.4em] leading-relaxed italic">Your ARDMS journey resonates from the depths.</p>
                   </div>
                </div>

                <div className="absolute -bottom-6 -left-6 md:-bottom-12 md:-left-12 w-16 h-16 md:w-32 md:h-32 bg-slate-900/80 backdrop-blur-3xl shadow-3xl rounded-2xl md:rounded-[3.5rem] border border-white/10 flex items-center justify-center animate-float group-hover:border-gold-main/40 transition-all duration-500">
                    <GraduationCap className="w-8 h-8 md:w-16 md:h-16 text-gold-main/30 group-hover:text-gold-main transition-colors" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
