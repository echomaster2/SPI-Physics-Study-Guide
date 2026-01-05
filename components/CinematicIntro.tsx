
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ArrowRight, Sparkles, Loader2, Bot, Activity, X, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import ProfessorHost from './ProfessorHost';

interface CinematicIntroProps {
  title: string;
  seedText: string;
  type: 'module' | 'lesson';
  onContinue: () => void;
  persona?: 'Charon' | 'Puck' | 'Kore' | 'Zephyr';
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({ title, seedText, onContinue, persona = 'Charon' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState(seedText);
  const [progress, setProgress] = useState(0);
  const [currentGesture, setCurrentGesture] = useState<'top' | 'bottom' | 'left' | 'right' | 'none'>('none');

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const bufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      setCurrentGesture('none');
      return;
    }
    const interval = setInterval(() => {
      const gestures: ('top' | 'bottom' | 'left' | 'right')[] = ['top', 'bottom', 'left', 'right'];
      setCurrentGesture(gestures[Math.floor(Math.random() * gestures.length)]);
      setTimeout(() => setCurrentGesture('none'), 1500);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

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

  const callGeminiWithRetry = async (fn: () => Promise<any>, retryCount = 0): Promise<any> => {
    try {
      return await fn();
    } catch (e: any) {
      const isQuotaError = e?.status === 429 || (e?.message && e.message.includes('429')) || (e?.toString() && e.toString().includes('429'));
      if (isQuotaError && retryCount < 2) {
        const delay = Math.pow(3, retryCount) * 1000 + Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
        return callGeminiWithRetry(fn, retryCount + 1);
      }
      throw e;
    }
  };

  const generateBriefing = async () => {
    if (isGenerating) return;
    setError(null);
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 1. Generate Script
      let generatedScript = script;
      try {
          const scriptRes = await callGeminiWithRetry(() => ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: `ACT AS PROFESSOR ${persona}. SUBJECT: "${title}". Use the 'Hard Work' framework. Highlight keywords in brackets like [Board Trap]. Max 120 words.`,
          }));
          generatedScript = scriptRes.text || seedText;
          setScript(generatedScript);
      } catch (scriptErr) {
          console.error("Script generation failed, using seed", scriptErr);
      }

      // 2. Generate Audio via Gemini TTS
      const response = await callGeminiWithRetry(() => ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: generatedScript }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Charon' },
            },
          },
        },
      }));

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioData = decodeBase64(base64Audio);
        const audioBuffer = await decodeAudioData(audioData, ctx, 24000);
        bufferRef.current = audioBuffer;
        startPlayback();
      }
    } catch (e) {
      console.warn("Acoustic uplink failed", e);
      setError("Acoustic uplink saturated (Quota 429). Proceed with textual analysis.");
    } finally {
      setIsGenerating(false);
    }
  };

  const startPlayback = (offset = 0) => {
    if (!audioContextRef.current || !bufferRef.current) return;
    const ctx = audioContextRef.current;
    
    if (sourceRef.current) sourceRef.current.stop();
    
    const source = ctx.createBufferSource();
    source.buffer = bufferRef.current;
    source.connect(ctx.destination);
    
    source.onended = () => {
        if (ctx.currentTime - startTimeRef.current >= bufferRef.current!.duration) {
            setIsPlaying(false);
            setProgress(100);
        }
    };

    startTimeRef.current = ctx.currentTime - offset;
    source.start(0, offset);
    sourceRef.current = source;
    setIsPlaying(true);
  };

  const togglePlayback = () => {
      if (isPlaying) {
          pauseTimeRef.current = audioContextRef.current!.currentTime - startTimeRef.current;
          sourceRef.current?.stop();
          setIsPlaying(false);
      } else {
          startPlayback(pauseTimeRef.current);
      }
  }

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-slate-900/50 backdrop-blur-xl rounded-[3rem] border border-white/5 space-y-8 text-center animate-fade-in">
      <ProfessorHost isActive={true} isThinking={isGenerating} gesturingAt={currentGesture} />
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white italic uppercase tracking-tighter leading-none">{title}</h2>
        <div className="p-6 md:p-10 bg-slate-950/80 rounded-2xl border border-white/5 text-slate-300 italic font-light leading-relaxed min-h-[140px] flex items-center justify-center relative group">
           <div className="absolute top-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={24} className="text-gold-main" />
           </div>
           <p className="relative z-10 text-sm md:text-lg">
             {script}
           </p>
        </div>
      </div>
      
      {error && (
        <div className="text-gold-main/60 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-gold-main/5 px-4 py-2 rounded-full border border-gold-main/10 animate-pulse">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        {!bufferRef.current ? (
          <button 
            onClick={generateBriefing} 
            disabled={isGenerating}
            className="px-10 py-5 bg-gold-main text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-gold flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-wait"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Bot size={16} />}
            {isGenerating ? 'Analyzing...' : 'Generate Acoustic Briefing'}
          </button>
        ) : (
          <button 
             onClick={togglePlayback}
             className="px-10 py-5 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 border border-white/10 active:scale-95 transition-all shadow-xl"
          >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            {isPlaying ? 'Pause Feed' : 'Resume Feed'}
          </button>
        )}
        <button onClick={onContinue} className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl">
          Begin Module <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default CinematicIntro;
