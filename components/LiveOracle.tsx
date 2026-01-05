
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Volume2, Loader2, Sparkles, Bot } from 'lucide-react';

interface LiveOracleProps {
    isActive: boolean;
}

const BURT_VOICE_ID = 'Yko7iBn2vnSMvSAsuF8N'; // Eleven Labs Burt ID (for reference, though Live API uses its own prebuilts or different config)

const LiveOracle: React.FC<LiveOracleProps> = ({ isActive }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const sessionPromiseRef = useRef<any>(null);
    const nextStartTimeRef = useRef(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const cleanup = () => {
        setIsConnected(false);
        setIsConnecting(false);
        streamRef.current?.getTracks().forEach(t => t.stop());
        sourcesRef.current.forEach(s => s.stop());
        sourcesRef.current.clear();
    };

    const encode = (bytes: Uint8Array) => {
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const decode = (base64: string) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };

    const startSession = async () => {
        setIsConnecting(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            }
            const inputCtx = audioContextRef.current;
            const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setIsConnected(true);
                        setIsConnecting(false);
                        const source = inputCtx.createMediaStreamSource(stream);
                        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                        processor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
                            const base64 = encode(new Uint8Array(int16.buffer));
                            sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
                        };
                        source.connect(processor);
                        processor.connect(inputCtx.destination);
                    },
                    onmessage: async (msg: LiveServerMessage) => {
                        if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
                            setIsTalking(true);
                            const base64 = msg.serverContent.modelTurn.parts[0].inlineData.data;
                            const bytes = decode(base64);
                            const dataInt16 = new Int16Array(bytes.buffer);
                            const buffer = outputCtx.createBuffer(1, dataInt16.length, 24000);
                            const chan = buffer.getChannelData(0);
                            for (let i = 0; i < dataInt16.length; i++) chan[i] = dataInt16[i] / 32768.0;

                            const source = outputCtx.createBufferSource();
                            source.buffer = buffer;
                            source.connect(outputCtx.destination);
                            
                            const now = outputCtx.currentTime;
                            const start = Math.max(now, nextStartTimeRef.current);
                            source.start(start);
                            nextStartTimeRef.current = start + buffer.duration;
                            sourcesRef.current.add(source);
                            source.onended = () => {
                                sourcesRef.current.delete(source);
                                if (sourcesRef.current.size === 0) setIsTalking(false);
                            };
                        }
                    },
                    onclose: () => cleanup(),
                    onerror: () => cleanup()
                },
                config: {
                    responseModalalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
                    systemInstruction: "You are Burt, a smooth, mature, and paternal ultrasound physics mentor. You speak with a calm charisma. You want your students to pass, and you explain complex sound mechanics with effortless clarity. Listen closely to their questions and provide high-yield clinical wisdom. Keep it conversational and encouraging."
                }
            });
            sessionPromiseRef.current = sessionPromise;
        } catch (e) {
            cleanup();
        }
    };

    return (
        <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[550px] relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-gold-main/10 to-transparent pointer-events-none"></div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-10 relative z-10">
                <div className={`w-36 h-36 rounded-3xl border-2 flex items-center justify-center transition-all duration-1000 ${isConnected ? (isTalking ? 'border-gold-main scale-110 shadow-gold' : 'border-gold-main/40 shadow-xl') : 'border-white/5 opacity-40 hover:opacity-100'}`}>
                    {isConnecting ? (
                        <Loader2 className="w-16 h-16 text-gold-main animate-spin" />
                    ) : isConnected ? (
                        <div className="relative">
                            <Bot className={`w-16 h-16 text-gold-main ${isTalking ? 'animate-pulse' : ''}`} />
                            {isTalking && (
                                <div className="absolute -top-6 -right-6">
                                    <Sparkles className="w-8 h-8 text-gold-main animate-bounce" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <Bot className="w-16 h-16 text-white/10 grayscale" />
                    )}
                </div>

                <div className="space-y-6 max-w-sm">
                    <h3 className="text-3xl font-serif font-bold text-white tracking-tight">
                        {isConnected ? "Faculty is Listening" : "Acoustic Consultancy"}
                    </h3>
                    <p className="text-slate-300 font-light leading-relaxed italic">
                        {isConnected 
                          ? "What's on your mind, kid? Formulas got you down or is it those tricky artifacts?" 
                          : "Establish a direct link with the faculty unit for high-yield physics guidance."}
                    </p>
                </div>

                {!isConnected && !isConnecting && (
                    <button 
                        onClick={startSession}
                        className="px-12 py-5 bg-gold-main text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-gold hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                    >
                        <Bot className="w-4 h-4" /> Initiate Briefing
                    </button>
                )}

                {isConnected && (
                    <button 
                        onClick={cleanup}
                        className="px-12 py-5 bg-white/5 backdrop-blur-xl text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] border border-white/10 hover:bg-white/10 transition-all"
                    >
                        End Link
                    </button>
                )}
            </div>

            <div className="px-10 py-8 bg-white/5 border-t border-white/10 flex justify-center">
                <div className="flex gap-2.5 items-center">
                    <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-gold-main animate-pulse' : 'bg-white/10'}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                        {isConnected ? "Full Duplex Connection Active" : "Signal Offline"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LiveOracle;
