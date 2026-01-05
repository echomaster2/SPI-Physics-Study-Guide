
import React, { useState, useEffect, useRef } from 'react';
import { SkipForward, Waves, Anchor, Database, Activity, Sparkles, Volume2, Loader2, AlertCircle, Droplets } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

interface AppIntroProps {
    onComplete: () => void;
}

const AppIntro: React.FC<AppIntroProps> = ({ onComplete }) => {
  const [step, setStep] = useState(-1);
  const [isExiting, setIsExiting] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const script = [
      { text: "Listen close, initiate. The human body is a vast, silent ocean.", duration: 4500 },
      { text: "We are currently anchored in the Sanctuary of Atlantis, where sound is our only light.", duration: 4500 },
      { text: "Every echo from your probe is a ripple through the ancient depths of life.", duration: 5000 },
      { text: "In this abyss, precision isn't just a skill... it's your lifeline.", duration: 4500 },
      { text: "Welcome to the EchoMasters Deep-Sea Sanctuary. Let's master the pressure.", duration: 5500 },
  ];

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const playNarration = async (text: string, retryCount = 0): Promise<void> => {
    try {
      setIsNarrating(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Charon' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioData = decodeBase64(base64Audio);
        const audioBuffer = await decodeAudioData(audioData, ctx, 24000);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e: any) {
      console.warn("Gemini Narration Attempt Failed", e);
      const isQuotaError = e?.status === 429 || (e?.message && e.message.includes('429')) || (e?.toString() && e.toString().includes('429'));
      
      if (isQuotaError && retryCount < 2) {
        const backoff = Math.pow(3, retryCount) * 1000 + Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, backoff));
        return playNarration(text, retryCount + 1);
      }
      
      setErrorCount(prev => prev + 1);
    } finally {
      setIsNarrating(false);
    }
  };

  const handleStartIntro = () => {
    setStep(0);
  };

  useEffect(() => {
    if (step === -1) return;
    
    if (step < script.length) {
        playNarration(script[step].text);
        const timeout = window.setTimeout(() => {
          setStep(s => s + 1);
        }, script[step].duration);
        return () => clearTimeout(timeout);
    } else if (step === script.length) {
        setShowLogo(true);
        const timeout = window.setTimeout(() => { 
          setIsExiting(true); 
          setTimeout(onComplete, 1200); 
        }, 4000);
        return () => clearTimeout(timeout);
    }
  }, [step]);

  return (
    <div className={`fixed inset-0 z-[500] bg-[#001b2e] flex flex-col items-center justify-center transition-all duration-1000 p-6 md:p-12 ${isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] border-[0.5px] border-gold-main rounded-full animate-[spin_180s_linear_infinite]"></div>
        </div>

        {step === -1 ? (
            <div className="flex flex-col items-center gap-12 animate-fade-in relative z-10 text-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gold-main/20 blur-[80px] animate-pulse rounded-full"></div>
                <div className="w-48 h-48 bg-slate-950/90 backdrop-blur-3xl rounded-[4rem] flex items-center justify-center border-2 border-gold-main/40 shadow-gold relative z-10">
                  <Waves className="w-24 h-24 text-gold-main animate-pulse" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-white font-serif italic text-4xl md:text-6xl tracking-tight text-shadow-glow">The Atlantis Protocol</h2>
                <p className="text-gold-main/50 text-[11px] uppercase tracking-[0.6em] font-black">EchoMasters Deep Sanctuary</p>
              </div>
              <button 
                onClick={handleStartIntro} 
                className="group px-20 py-8 bg-gold-main text-slate-950 font-black rounded-[2.5rem] shadow-gold hover:shadow-[0_0_80px_rgba(181,148,78,0.5)] transition-all uppercase tracking-[0.5em] text-[13px] flex items-center gap-8 active:scale-95"
              >
                Establish Resonance
              </button>
            </div>
        ) : (
            <>
                <button onClick={onComplete} className="absolute top-10 right-10 z-[550] flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all p-4">
                    Skip Immersion <SkipForward className="w-4 h-4" />
                </button>
                
                {errorCount > 0 && (
                   <div className="absolute top-10 left-10 z-[550] flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gold-main/30">
                      <Volume2 className="w-3 h-3" /> Silent Mode: Signal Interference
                   </div>
                )}

                <div className="relative z-10 max-w-6xl px-12 text-center flex flex-col justify-center min-h-full">
                    {!showLogo && step < script.length && (
                      <div className="space-y-16 animate-slide-up">
                         <div className="flex justify-center items-center gap-6">
                            <div className="h-[1px] w-20 bg-gold-main/30"></div>
                            <Droplets className="text-gold-main animate-pulse" size={18} />
                            <div className="h-[1px] w-20 bg-gold-main/30"></div>
                         </div>
                         <h1 className="text-4xl md:text-8xl font-serif italic text-white leading-[1.15] drop-shadow-2xl select-none animate-fade-in text-shadow-glow">
                            {script[step].text}
                         </h1>
                         {isNarrating && (
                           <div className="flex justify-center gap-1 h-8 items-end opacity-40">
                             {[1,2,3,4,5].map(i => <div key={i} className={`w-1 bg-gold-main rounded-full animate-radio-wave-${(i%3)+1}`}></div>)}
                           </div>
                         )}
                      </div>
                    )}
                    {showLogo && (
                      <div className="flex flex-col items-center animate-fade-in space-y-12">
                        <h1 className="text-7xl md:text-[14rem] font-serif font-bold text-white mb-6 tracking-tighter relative z-10 leading-none drop-shadow-2xl">
                          Echo<span className="text-gold-main">Masters</span>
                        </h1>
                        <p className="text-gold-main uppercase tracking-[1em] font-black opacity-80">Ancient Clinical Sanctuary</p>
                      </div>
                    )}
                </div>
            </>
        )}
        <style>{`
          @keyframes radio-wave-1 { 0%, 100% { height: 8px; } 50% { height: 24px; } }
          @keyframes radio-wave-2 { 0%, 100% { height: 20px; } 50% { height: 8px; } }
          @keyframes radio-wave-3 { 0%, 100% { height: 12px; } 50% { height: 28px; } }
          .animate-radio-wave-1 { animation: radio-wave-1 0.7s ease-in-out infinite; }
          .animate-radio-wave-2 { animation: radio-wave-2 1.0s ease-in-out infinite; }
          .animate-radio-wave-3 { animation: radio-wave-3 0.8s ease-in-out infinite; }
          .text-shadow-glow { text-shadow: 0 0 30px rgba(181, 148, 78, 0.2); }
        `}</style>
    </div>
  );
};
export default AppIntro;
