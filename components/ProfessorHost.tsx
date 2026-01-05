
import React, { useState, useEffect, useMemo } from 'react';
import { Bot, Sun, Loader2, Zap, Cpu, Radio, Sparkles, Target, Compass, AlertCircle, Waves } from 'lucide-react';

interface ProfessorHostProps {
  position?: { x: number; y: number };
  isActive: boolean;
  isThinking?: boolean;
  isSpeaking?: boolean;
  gesturingAt?: 'top' | 'bottom' | 'left' | 'right' | 'none';
  message?: string;
  onClick?: () => void;
}

const ProfessorHost: React.FC<ProfessorHostProps> = ({ 
  position = { x: 50, y: 50 }, 
  isActive, 
  isThinking, 
  isSpeaking, 
  gesturingAt = 'none',
  message, 
  onClick 
}) => {
  const safeX = position?.x ?? 50;
  const safeY = position?.y ?? 50;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Analyze message for dynamic emotive state
  const emotiveState = useMemo(() => {
    if (!message) return 'neutral';
    const text = message.toLowerCase();
    if (text.includes('warning') || text.includes('trap') || text.includes('noise')) return 'alert';
    if (text.includes('resonance') || text.includes('excellent') || text.includes('verified')) return 'pleased';
    if (text.includes('analyzing') || text.includes('math') || text.includes('calculating')) return 'focused';
    return 'neutral';
  }, [message]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isActive]);

  const getGestureTransform = () => {
    let transform = `translate(-50%, -50%) `;
    transform += isActive ? 'scale(1.15) ' : 'scale(0.7) ';
    
    switch(gesturingAt) {
      case 'top': transform += 'translateY(-15px) scale(1.05) '; break;
      case 'bottom': transform += 'translateY(15px) scale(1.05) '; break;
      case 'left': transform += 'translateX(-15px) rotate(-8deg) '; break;
      case 'right': transform += 'translateX(15px) rotate(8deg) '; break;
    }

    // Add subtle look-at effect
    transform += `rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`;
    return transform;
  };

  const stateColors = {
    neutral: 'from-gold-main/40',
    alert: 'from-red-500/40',
    pleased: 'from-green-400/40',
    focused: 'from-blue-400/40'
  };

  return (
    <div 
      className="absolute z-[999] pointer-events-none transition-all duration-700 ease-out"
      style={{ 
        left: `${safeX}%`, 
        top: `${safeY}%`,
        transform: getGestureTransform(),
        perspective: '1000px'
      }}
    >
      <div 
        className={`relative flex flex-col items-center group pointer-events-auto cursor-pointer transition-all duration-1000 ${isActive ? 'opacity-100' : 'opacity-0 scale-50 rotate-12 blur-xl'}`}
        onClick={onClick}
      >
        {/* Holographic Containment Field */}
        {isActive && (
          <div className={`absolute inset-[-40px] border border-white/5 rounded-full animate-pulse opacity-20 pointer-events-none`}></div>
        )}
        
        {isActive && (
          <div className={`absolute inset-0 bg-gold-main/10 animate-hologram-flicker pointer-events-none rounded-full blur-[60px] ${emotiveState === 'alert' ? 'bg-red-500/20' : ''}`}></div>
        )}

        {/* Dynamic Emotive Particles */}
        {isSpeaking && (
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`absolute w-1 h-1 rounded-full animate-particle-float opacity-0`} 
                         style={{ 
                             left: '50%', top: '50%', 
                             backgroundColor: emotiveState === 'alert' ? '#ef4444' : '#B5944E',
                             animationDelay: `${i * 0.5}s`
                         }}></div>
                ))}
            </div>
        )}

        <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none scale-90 group-hover:scale-100">
            <div className="bg-slate-950/95 backdrop-blur-md border border-gold-main/40 px-5 py-2 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(181,148,78,0.3)]">
                <Cpu size={14} className={`${emotiveState === 'alert' ? 'text-red-500' : 'text-gold-main'} animate-pulse`} />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Faculty Unit: Harvey</span>
            </div>
        </div>

        <div className={`absolute -bottom-6 w-24 h-8 blur-3xl rounded-[100%] animate-pulse transition-colors duration-1000 ${emotiveState === 'alert' ? 'bg-red-500/20' : 'bg-gold-main/20'}`}></div>
        
        <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
            {/* Orbital Rings */}
            <div className={`absolute inset-0 border border-dashed border-gold-main/20 rounded-full ${isActive ? 'animate-[spin_20s_linear_infinite]' : ''}`}></div>
            <div className={`absolute inset-2 border border-dotted border-white/10 rounded-full ${isActive ? 'animate-[spin_15s_linear_infinite_reverse]' : ''}`}></div>
            
            <div className={`relative w-14 h-14 md:w-16 md:h-16 bg-slate-950 border-2 rounded-[2.5rem] flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700 
                ${isActive ? 'animate-materialize' : ''} 
                ${isSpeaking ? 'scale-110 shadow-[0_0_50px_rgba(181,148,78,0.3)]' : isThinking ? 'scale-95' : 'animate-float'}
                ${emotiveState === 'alert' ? 'border-red-500/50' : 'border-gold-main/50'}`}>
                
                <div className={`absolute inset-0 bg-gradient-to-tr transition-colors duration-1000 ${isThinking ? 'from-blue-600/40' : stateColors[emotiveState]} to-transparent`}></div>
                
                {isThinking ? (
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin relative z-10" />
                ) : (
                  <div className="relative z-10">
                    {emotiveState === 'alert' ? (
                        <AlertCircle className="w-8 h-8 text-red-400 animate-pulse" />
                    ) : (
                        <Bot className={`w-8 h-8 transition-all duration-700 ${isSpeaking ? 'text-gold-main' : 'text-gold-main/70'}`} />
                    )}
                  </div>
                )}

                {isSpeaking && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5 items-end h-3">
                        <div className={`w-0.5 rounded-full animate-[host-wave_0.4s_infinite] ${emotiveState === 'alert' ? 'bg-red-500' : 'bg-gold-main'}`}></div>
                        <div className={`w-0.5 rounded-full animate-[host-wave_0.5s_infinite_0.1s] ${emotiveState === 'alert' ? 'bg-red-500' : 'bg-gold-main'}`}></div>
                        <div className={`w-0.5 rounded-full animate-[host-wave_0.3s_infinite_0.2s] ${emotiveState === 'alert' ? 'bg-red-500' : 'bg-gold-main'}`}></div>
                    </div>
                )}
                
                {/* Scanning Beam */}
                <div className={`absolute top-0 left-0 w-full h-[2px] animate-scan-robotic ${isThinking ? 'bg-blue-400' : emotiveState === 'alert' ? 'bg-red-500' : 'bg-gold-main'}`}></div>
            </div>
        </div>

        {message && (
            <div className={`absolute bottom-full mb-12 w-[300px] md:w-[380px] bg-slate-950/95 backdrop-blur-3xl border-2 p-8 rounded-[2.5rem] shadow-3xl animate-message-pop z-[1000] transition-colors duration-1000 ${emotiveState === 'alert' ? 'border-red-500/40' : 'border-gold-main/40'}`}>
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-950 border-r-2 border-b-2 rotate-45 transition-colors duration-1000 ${emotiveState === 'alert' ? 'border-red-500/40' : 'border-gold-main/40'}`}></div>
                <div className="flex gap-2 items-center mb-4">
                    <div className={`w-2 h-2 rounded-full animate-pulse shadow-lg ${emotiveState === 'alert' ? 'bg-red-500 shadow-red-500/50' : 'bg-gold-main shadow-gold-main/50'}`}></div>
                    <span className={`text-[9px] uppercase tracking-[0.4em] font-black uppercase tracking-widest ${emotiveState === 'alert' ? 'text-red-400' : 'text-gold-main'}`}>
                        {emotiveState === 'alert' ? 'URGENT PROTOCOL' : 'Board Logic Dispatch'}
                    </span>
                </div>
                <p className={`text-sm md:text-base font-serif font-medium text-white/95 leading-relaxed text-left italic border-l-2 pl-6 py-1 transition-colors duration-1000 ${emotiveState === 'alert' ? 'border-red-500/50' : 'border-gold-main/50'}`}>
                    {message}
                </p>
            </div>
        )}
      </div>

      <style>{`
        @keyframes host-wave { 0%, 100% { height: 3px; } 50% { height: 10px; } }
        @keyframes scan-robotic { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        @keyframes hologram-flicker { 0%, 100% { opacity: 0.3; } 30% { opacity: 0.6; transform: scale(1.02); } 60% { opacity: 0.4; } }
        @keyframes material-fx { 0% { opacity: 0; transform: translateY(20px); filter: blur(10px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes message-pop { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes particle-float {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translate(calc(-50% + (Math.random() - 0.5) * 100px), calc(-50% - 100px)) scale(1.5); opacity: 0; }
        }
        .animate-materialize { animation: material-fx 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-message-pop { animation: message-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-hologram-flicker { animation: hologram-flicker 3s infinite; }
        .animate-scan-robotic { animation: scan-robotic 3s linear infinite; }
        .animate-particle-float { animation: particle-float 2s ease-out infinite; }
      `}</style>
    </div>
  );
};

export default ProfessorHost;
