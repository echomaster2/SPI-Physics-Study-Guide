
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { 
  Play, Pause, Activity, Waves, Target, Eye, 
  Ruler, BarChart3, Binary, Radar, Wind, 
  Compass, HelpCircle, ArrowRight, Zap, ShieldAlert
} from 'lucide-react';

interface SimulationProps {
  type: string;
  topicId?: string;
  isSandbox?: boolean;
}

const Simulations: React.FC<SimulationProps> = ({ type, isSandbox }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(!!isSandbox);
  const [showHelp, setShowHelp] = useState(false);
  const [param1, setParam1] = useState(50); 
  const [param2, setParam2] = useState(50); 
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [size, setSize] = useState({ width: 0, height: 320 });

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
        if (containerRef.current) {
            const isMobile = window.innerWidth < 768;
            setSize({ 
              width: containerRef.current.clientWidth, 
              height: isMobile ? 280 : (isSandbox ? 500 : 380)
            });
        }
    };
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [isSandbox]);

  const getLabels = () => {
    const safeType = type || 'Default';
    switch(safeType) {
      case 'LongitudinalWaveVisual':
        return { p1: "Frequency", p2: "Amplitude", icon1: Activity, icon2: Waves, help: "Observe particles compressing and rarefying. Parallel motion defines longitudinal sound." };
      case 'WaveParametersVisual':
        return { p1: "Amplitude", p2: "Wavelength", icon1: Zap, icon2: Ruler, help: "Adjust the 'bigness' and the physical distance of a single cycle." };
      case 'AttenuationVisual':
        return { p1: "Frequency", p2: "Medium Loss", icon1: Activity, icon2: Target, help: "High frequency sound loses energy faster as it travels deeper into tissue." };
      case 'DopplerShiftVisual':
        return { p1: "Velocity", p2: "Incident Angle", icon1: Wind, icon2: Compass, help: "At 90°, the frequency shift disappears. Parallel alignment is key." };
      case 'ResolutionVisual':
        return { p1: "Pulse Duration", p2: "Target Gap", icon1: Ruler, icon2: Target, help: "Can the system distinguish two points? Resolution requires shorter pulses." };
      case 'BeamFormingVisual':
        return { p1: "Focus Depth", p2: "Divergence", icon1: Target, icon2: Eye, help: "Visualize the Fresnel and Fraunhofer zones. Detail is highest at the waist." };
      case 'ReceiverVisual':
        return { p1: "Amplification", p2: "Compression", icon1: Zap, icon2: Activity, help: "Signals are amplified then compressed to fit the human eye's dynamic range." };
      case 'TransducerVisual':
        return { p1: "Crystal Vibration", p2: "Damping Effect", icon1: Activity, icon2: Ruler, help: "Backing material shortens the pulse for detail but reduces sensitivity." };
      case 'ArtifactsVisual':
        return { p1: "Reflection Path", p2: "Sound Speed", icon1: Waves, icon2: Wind, help: "When assumptions are broken (like path speed), objects appear in the wrong place." };
      case 'SafetyVisual':
        return { p1: "Output Power", p2: "Dwell Time", icon1: Zap, icon2: ShieldAlert, help: "Observe thermal effects and cavitation probability as acoustic output increases." };
      default:
        return { p1: "Intensity", p2: "Sensitivity", icon1: Zap, icon2: Activity, help: "Adjust vectors to observe acoustic interactions." };
    }
  };

  const labels = getLabels();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.width * dpr; canvas.height = size.height * dpr;
    canvas.style.width = `${size.width}px`; canvas.style.height = `${size.height}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    let frame = 0;
    const particles: {x: number, y: number, ox: number}[] = [];
    if (type === 'LongitudinalWaveVisual') {
      for(let i=0; i<400; i++) particles.push({ x: Math.random() * size.width, y: Math.random() * size.height, ox: 0 });
    }

    const render = () => {
      if (isPlaying) frame++;
      ctx.clearRect(0, 0, size.width, size.height);
      const cy = size.height / 2;

      // Draw Grid
      ctx.save();
      ctx.globalAlpha = 0.05;
      ctx.strokeStyle = "#B5944E";
      for(let i=0; i<size.height; i+=40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size.width, i); ctx.stroke(); }
      for(let i=0; i<size.width; i+=40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size.height); ctx.stroke(); }
      ctx.restore();

      const p1Val = param1 / 100;
      const p2Val = param2 / 100;

      if (type === 'LongitudinalWaveVisual') {
        const freq = p1Val * 0.1 + 0.02;
        const amp = p2Val * 30 + 5;
        ctx.fillStyle = "#B5944E";
        particles.forEach(p => {
          const shift = Math.sin(p.x * freq + frame * 0.1) * amp;
          ctx.beginPath();
          ctx.arc(p.x + shift, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (type === 'WaveParametersVisual') {
        const amp = p1Val * (size.height * 0.4);
        const wavelength = (1.1 - p2Val) * 150 + 50;
        ctx.beginPath();
        ctx.strokeStyle = "#B5944E";
        ctx.lineWidth = 3;
        for(let x=0; x<size.width; x++) {
          const y = cy + Math.sin((x / wavelength) * Math.PI * 2 + frame * 0.05) * amp;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (type === 'AttenuationVisual') {
        const freq = p1Val * 5 + 2;
        const loss = p2Val * 0.01 + 0.002;
        ctx.beginPath();
        ctx.strokeStyle = "#B5944E";
        ctx.lineWidth = 2;
        for(let x=0; x<size.width; x++) {
          const decay = Math.exp(-x * loss * freq);
          const y = cy + Math.sin(x * 0.2 + frame * 0.1) * (size.height * 0.3) * decay;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (type === 'DopplerShiftVisual') {
        const velocity = p1Val * 10;
        const angle = (p2Val * Math.PI) / 2;
        const cos = Math.cos(angle);
        const shiftFreq = 0.1 + (velocity * cos * 0.05);
        ctx.strokeStyle = "#B5944E";
        ctx.beginPath();
        for(let x=0; x<size.width; x++) {
          const y = cy + Math.sin(x * shiftFreq + frame * 0.1) * 40;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.save();
        ctx.translate(size.width/2, size.height/2);
        ctx.rotate(-angle);
        ctx.strokeStyle = "rgba(181,148,78,0.3)";
        ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(100, 0); ctx.stroke();
        ctx.restore();
      } else if (type === 'ResolutionVisual') {
        const spl = p1Val * 50 + 5;
        const gap = p2Val * 100 + 10;
        const pulseX = (frame * 5) % size.width;
        ctx.fillStyle = "rgba(181, 148, 78, 0.2)";
        ctx.fillRect(pulseX - spl, cy - 20, spl, 40);
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(size.width/2, cy, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(size.width/2 + gap, cy, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = spl > gap ? "rgba(239, 68, 68, 0.4)" : "rgba(34, 197, 94, 0.4)";
        ctx.fillText(spl > gap ? "UNRESOLVED" : "RESOLVED", size.width/2, cy - 30);
      } else if (type === 'BeamFormingVisual') {
        const focalDepth = p1Val * size.width * 0.8 + 50;
        const divergence = p2Val * 0.1;
        ctx.fillStyle = "rgba(181, 148, 78, 0.1)";
        ctx.beginPath();
        ctx.moveTo(0, cy - 40);
        ctx.quadraticCurveTo(focalDepth, cy, size.width, cy - 40 - (size.width - focalDepth) * divergence * 10);
        ctx.lineTo(size.width, cy + 40 + (size.width - focalDepth) * divergence * 10);
        ctx.quadraticCurveTo(focalDepth, cy, 0, cy + 40);
        ctx.fill();
        ctx.strokeStyle = "#B5944E";
        ctx.stroke();
      } else if (type === 'ReceiverVisual') {
        const gain = p1Val * 5 + 1;
        const compression = p2Val * 50 + 10;
        ctx.beginPath();
        ctx.strokeStyle = "#B5944E";
        for(let x=0; x<size.width; x++) {
          let noise = (Math.random() - 0.5) * 5;
          let sig = Math.sin(x * 0.1 + frame * 0.1) * gain * 10;
          let final = Math.max(-compression, Math.min(compression, sig + noise));
          const y = cy + final;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (type === 'TransducerVisual') {
        const vibration = p1Val * 40;
        const damping = (1.1 - p2Val);
        ctx.strokeStyle = "#B5944E";
        ctx.beginPath();
        for(let x=0; x<size.width; x++) {
          const decay = Math.exp(-x * (1 - damping) * 0.1);
          const y = cy + Math.sin(x * 0.5 + frame * 0.5) * vibration * decay;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.fillStyle = "rgba(181, 148, 78, 0.2)";
        ctx.fillRect(0, cy-50, 40, 100);
        ctx.fillStyle = "#fff";
        ctx.fillText("PZT", 5, cy-60);
      } else if (type === 'ArtifactsVisual') {
        const count = Math.floor(p1Val * 10) + 1;
        const speed = p2Val * 5;
        ctx.strokeStyle = "rgba(181, 148, 78, 0.4)";
        for(let i=0; i<count; i++) {
          const yPos = cy - 80 + (i * 20);
          ctx.beginPath();
          ctx.moveTo(size.width * 0.2, yPos);
          ctx.lineTo(size.width * 0.8, yPos);
          ctx.stroke();
        }
        ctx.fillStyle = "#B5944E";
        ctx.fillText("REVERBERATION", size.width/2 - 40, cy + 100);
      } else if (type === 'SafetyVisual') {
        const power = p1Val * 50;
        const heat = Math.min(100, (frame * p1Val * p2Val * 0.05) % 100);
        ctx.fillStyle = `rgba(239, 68, 68, ${heat/100})`;
        ctx.beginPath(); ctx.ellipse(size.width/2, cy, 100, 60, 0, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#B5944E";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.fillText(`TI: ${(p1Val * 4.5).toFixed(1)}`, size.width/2 - 20, cy);
      } else {
        ctx.beginPath();
        ctx.strokeStyle = "#B5944E";
        ctx.lineWidth = 2;
        for(let x=0; x<size.width; x++) {
          const y = cy + Math.sin(x * (p1Val * 0.1 + 0.01) + frame * 0.1) * (p2Val * 50 + 10);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      if (showAnalysis) {
        ctx.fillStyle = "rgba(181, 148, 78, 0.5)";
        ctx.font = "bold 9px monospace";
        ctx.fillText(`MODE: ${type.replace('Visual','')}`, 20, 30);
        ctx.fillText(`VECTOR_P1: ${Math.round(param1)}%`, 20, 45);
        ctx.fillText(`VECTOR_P2: ${Math.round(param2)}%`, 20, 60);
      }

      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [type, isPlaying, param1, param2, size, showAnalysis]);

  return (
    <div className={`bg-slate-950/60 backdrop-blur-3xl rounded-2xl md:rounded-[3.5rem] shadow-3xl border border-white/5 overflow-hidden text-left relative group ${isSandbox ? 'h-full flex flex-col' : ''}`}>
      {showHelp && (
        <div className="absolute inset-0 z-[100] bg-slate-950/95 backdrop-blur-md animate-fade-in flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gold-main/10 border border-gold-main/30 flex items-center justify-center text-gold-main shadow-gold"><HelpCircle size={32} /></div>
            <div className="space-y-2">
                <h4 className="text-xl font-serif font-bold italic text-white">Visual Logic Unit</h4>
                <p className="text-sm text-slate-400 font-light max-w-sm leading-relaxed">{labels.help}</p>
            </div>
            <button onClick={() => setShowHelp(false)} className="px-10 py-3 bg-gold-main text-slate-950 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-gold transition-all active:scale-95">Resume Sync</button>
        </div>
      )}

      <div className="px-4 py-3 md:px-10 md:py-6 bg-white/[0.03] border-b border-white/5 flex justify-between items-center z-20 relative">
        <div className="flex items-center gap-3 md:gap-5">
            <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-2xl bg-gold-main/10 flex items-center justify-center border border-gold-main/20 shadow-inner">
              <Activity size={20} className="text-gold-main" />
            </div>
            <div>
              <h4 className="text-[7px] md:text-[10px] font-black text-gold-main/60 uppercase tracking-[0.2em] md:tracking-[0.5em] font-sans leading-tight">Acoustic Vector Simulation</h4>
              <p className="text-[10px] md:text-sm font-serif font-bold text-white tracking-tight mt-1">{(type || 'DEFAULT').replace('Visual', '').toUpperCase()}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setShowHelp(true)} className="p-2 text-white/30 hover:text-white transition-colors"><HelpCircle size={18} /></button>
            <button onClick={() => setShowAnalysis(!showAnalysis)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${showAnalysis ? 'bg-gold-main/20 border-gold-main text-gold-main' : 'bg-white/5 border-white/5 text-white/40'}`}>
                <BarChart3 size={10} /><span className="text-[8px] font-black uppercase tracking-widest">Telemetry</span>
            </button>
            <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 md:p-3 bg-slate-900 text-gold-main/60 hover:bg-gold-main hover:text-slate-950 rounded-xl transition-all border border-white/5 active:scale-90 shadow-xl">
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 bg-transparent relative overflow-hidden flex items-center justify-center min-h-[220px] md:min-h-[340px]">
          <canvas ref={canvasRef} className="block" />
          <div className="absolute top-4 right-4 pointer-events-none hidden sm:block">
             <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/5 backdrop-blur-xl flex items-center gap-3 shadow-2xl transition-all group-hover:border-gold-main/20">
                <Radar size={12} className="text-gold-main animate-[spin_10s_linear_infinite]" />
                <div><p className="text-[7px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">Status</p><p className="text-[8px] text-white font-bold uppercase tracking-widest leading-none">REALTIME_SYNC</p></div>
             </div>
          </div>
      </div>

      <div className="px-4 py-5 md:px-12 md:py-10 bg-slate-950/40 border-t border-white/5 space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <div className="space-y-3 md:space-y-5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <labels.icon1 size={14} className="text-gold-main" />
                        <label className="text-[9px] md:text-[11px] font-black text-white/80 uppercase tracking-widest">{labels.p1}</label>
                    </div>
                    <span className="text-[9px] font-mono text-gold-main font-bold bg-gold-main/10 px-2 py-0.5 rounded-md">{param1}%</span>
                </div>
                <input type="range" min="0" max="100" value={param1} onChange={e => setParam1(parseInt(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-gold-main" />
            </div>
            <div className="space-y-3 md:space-y-5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <labels.icon2 size={14} className="text-gold-main" />
                        <label className="text-[9px] md:text-[11px] font-black text-white/80 uppercase tracking-widest">{labels.p2}</label>
                    </div>
                    <span className="text-[9px] font-mono text-gold-main font-bold bg-gold-main/10 px-2 py-0.5 rounded-md">{param2}%</span>
                </div>
                <input type="range" min="0" max="100" value={param2} onChange={e => setParam2(parseInt(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-gold-main" />
            </div>
          </div>
      </div>
    </div>
  );
};

export default Simulations;
