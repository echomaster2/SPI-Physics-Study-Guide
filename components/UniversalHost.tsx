import React from 'react';
import { Bot, Sparkles, Zap, Loader2 } from 'lucide-react';

/**
 * UniversalHost Component
 * 
 * A portable, animated AI assistant component.
 * Requires: Tailwind CSS and Lucide-React.
 * 
 * Props:
 * - position: { x, y } coordinates for the center of the host.
 * - status: 'idle' | 'thinking' | 'speaking'
 * - message: Optional string to display in a speech bubble.
 * - accentColor: CSS color string for the glow and primary icons (default: #D9B65C).
 * - baseColor: Background color of the bot's core (default: #161225).
 * - onClick: Event handler for interaction.
 */

export interface UniversalHostProps {
  position: { x: number; y: number };
  status?: 'idle' | 'thinking' | 'speaking';
  message?: string;
  accentColor?: string;
  baseColor?: string;
  onClick?: () => void;
  className?: string;
}

const UniversalHost: React.FC<UniversalHostProps> = ({ 
  position, 
  status = 'idle', 
  message, 
  accentColor = '#D9B65C', 
  baseColor = '#161225',
  onClick,
  className = ''
}) => {
  const isThinking = status === 'thinking';
  const isSpeaking = status === 'speaking';

  // Dynamic styles to allow color customization via props
  const hostVars = {
    '--accent': accentColor,
    '--accent-dim': `${accentColor}33`, // 20% opacity
    '--base': baseColor,
  } as React.CSSProperties;

  return (
    <div 
      className={`fixed z-[999] pointer-events-none transition-all duration-1000 ease-in-out transform ${className}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: `translate(-50%, -50%)`,
        ...hostVars
      }}
    >
      <div 
        className="relative flex flex-col items-center group pointer-events-auto cursor-pointer"
        onClick={onClick}
      >
        {/* Holographic Base Glow */}
        <div className="absolute -bottom-2 w-16 h-5 bg-[var(--accent-dim)] blur-md rounded-[100%] animate-pulse"></div>
        <div className="absolute -bottom-1 w-10 h-3 bg-[var(--accent-dim)] blur-sm rounded-[100%]"></div>

        {/* Floating Body */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
            
            {/* Spinning Energy Rings */}
            <div className={`absolute inset-0 border border-[var(--accent-dim)] rounded-full ${isThinking ? 'animate-[spin_1s_linear_infinite]' : 'animate-[spin_10s_linear_infinite]'}`}></div>
            <div className={`absolute inset-2 border border-[var(--accent-dim)] rounded-full ${isThinking ? 'animate-[spin_2s_linear_infinite_reverse]' : 'animate-[spin_15s_linear_infinite_reverse]'}`}></div>
            
            {/* Main Processor Core */}
            <div className={`relative w-12 h-12 md:w-14 md:h-14 bg-[var(--base)] backdrop-blur-xl border border-[var(--accent-dim)] rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden transition-all duration-500 hover:border-[var(--accent)] ${isSpeaking ? 'scale-110 border-[var(--accent)]' : 'animate-[float_6s_ease-in-out_infinite]'}`}>
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-dim)] to-transparent opacity-50"></div>
                
                {isThinking ? (
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-[var(--accent)] animate-spin relative z-10" />
                ) : (
                  <Bot className={`w-6 h-6 md:w-8 md:h-8 relative z-10 transition-colors ${isSpeaking ? 'text-[var(--accent)]' : 'text-white/80'}`} />
                )}
                
                {/* Visual Audio Spectrum (Visible when speaking) */}
                {isSpeaking && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5 items-end h-3">
                    <div className="w-1 bg-[var(--accent)] rounded-full animate-[host-wave_0.5s_ease-in-out_infinite]"></div>
                    <div className="w-1 bg-[var(--accent)] rounded-full animate-[host-wave_0.7s_ease-in-out_infinite_0.1s]"></div>
                    <div className="w-1 bg-[var(--accent)] rounded-full animate-[host-wave_0.4s_ease-in-out_infinite_0.2s]"></div>
                    <div className="w-1 bg-[var(--accent)] rounded-full animate-[host-wave_0.6s_ease-in-out_infinite_0.3s]"></div>
                  </div>
                )}

                {/* Vertical Scanning Beam */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] animate-[host-scan_3s_ease-in-out_infinite]"></div>
            </div>

            {/* Orbiting Decor Icons */}
            <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-[var(--accent)] animate-pulse opacity-60" />
            <Zap className="absolute -bottom-2 -left-2 w-4 h-4 text-[var(--accent)] animate-bounce opacity-40" />
        </div>

        {/* Speech Bubble */}
        {message && (
            <div className="absolute bottom-full mb-6 w-56 bg-[var(--base)]/90 backdrop-blur-xl border border-[var(--accent-dim)] p-4 rounded-2xl shadow-2xl animate-[host-fade-in_0.3s_ease-out] ring-1 ring-white/5">
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--base)] border-r border-b border-[var(--accent-dim)] rotate-45"></div>
                <p className="text-xs font-medium text-white/90 leading-relaxed text-center">
                    {message}
                </p>
            </div>
        )}
      </div>

      {/* Internal Animation Definitions */}
      <style>{`
        @keyframes host-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes host-scan {
          0%, 100% { top: 0; opacity: 0; }
          50% { top: 100%; opacity: 1; }
        }
        @keyframes host-wave {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
        @keyframes host-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default UniversalHost;
