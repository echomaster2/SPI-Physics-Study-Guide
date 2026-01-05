
import React, { useState } from 'react';
import { 
  ScanLine, Eye, ShieldAlert, CheckCircle2, Info, 
  Search, Filter, Zap, ArrowRight, Activity,
  Maximize2, Database, AlertTriangle, Compass,
  Layers, Camera, ChevronRight, X
} from 'lucide-react';
import { artifactVault, Artifact } from '../data/courseContent';
import Simulations from './Simulations';

const ArtifactVault: React.FC = () => {
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>(artifactVault[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedArtifact = artifactVault.find(a => a.id === selectedArtifactId) || artifactVault[0];

  const filteredArtifacts = artifactVault.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in text-left pb-40 px-4 md:px-10 py-10">
      
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 pb-12">
        <div className="space-y-6 text-white overflow-hidden flex-1">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-main/10 rounded-lg border border-gold-main/20"><ScanLine size={14} className="text-gold-main animate-pulse" /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Imaging Interference Protocol</span>
            </div>
            <div className="space-y-2">
                <h1 className="text-[clamp(2rem,8vw,5.5rem)] font-serif font-bold tracking-tighter leading-[0.8] italic uppercase">Artifact <span className="text-gold-main not-italic">Vault</span></h1>
                <p className="text-slate-400 text-sm md:text-xl font-light max-w-2xl italic leading-relaxed border-l-2 border-gold-main/20 pl-6 py-1">
                    Master the diagnostic lies of sound. Recognize when physics creates phantom structures and use acoustic shadowing to confirm pathology.
                </p>
            </div>
        </div>
        
        <div className="flex gap-4 w-full lg:w-auto">
            <div className="px-10 py-6 bg-slate-900 border border-white/5 rounded-[2rem] flex flex-col items-center gap-1 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold-main/5 blur-xl group-hover:bg-gold-main/10 transition-colors"></div>
                <Database size={14} className="text-gold-main/60 mb-1" />
                <span className="text-2xl font-serif font-bold text-white italic leading-none">{artifactVault.length}</span>
                <span className="text-[8px] font-black uppercase text-white/20 tracking-widest">Logged Phantoms</span>
            </div>
            <div className="px-10 py-6 bg-slate-950 border border-gold-main/20 rounded-[2rem] flex flex-col items-center gap-1 shadow-gold-dim relative overflow-hidden group">
                <Eye size={14} className="text-gold-main mb-1" />
                <span className="text-2xl font-serif font-bold text-gold-main italic leading-none">HIGH</span>
                <span className="text-[8px] font-black uppercase text-gold-main/40 tracking-widest">Diagnostic Yield</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Sidebar: Artifact Selection */}
        <div className="lg:col-span-4 space-y-8">
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold-main transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search Artifact Database..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-xs text-white focus:border-gold-main/40 transition-all outline-none italic font-serif placeholder:text-white/10"
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold-main px-2">
                    <Layers size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Stored Indices</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {filteredArtifacts.map((artifact) => (
                        <button 
                            key={artifact.id}
                            onClick={() => setSelectedArtifactId(artifact.id)}
                            className={`p-6 rounded-[2rem] border text-left transition-all duration-500 group relative overflow-hidden active:scale-95 ${selectedArtifactId === artifact.id ? 'bg-gold-main border-gold-main shadow-gold' : 'bg-slate-950/40 border-white/5 hover:bg-white/[0.04] hover:border-gold-main/40'}`}
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-1">
                                    <h4 className={`text-base font-serif font-bold italic leading-tight ${selectedArtifactId === artifact.id ? 'text-slate-950' : 'text-white group-hover:text-gold-main'}`}>{artifact.name}</h4>
                                    <p className={`text-[10px] font-light max-w-[200px] truncate ${selectedArtifactId === artifact.id ? 'text-slate-950/60' : 'text-slate-500'}`}>{artifact.description}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedArtifactId === artifact.id ? 'bg-slate-950/20 text-slate-950' : 'bg-white/5 text-white/20'}`}>
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </button>
                    ))}
                    {filteredArtifacts.length === 0 && (
                        <div className="text-center py-12 border border-dashed border-white/10 rounded-[2rem]">
                            <X className="w-8 h-8 text-white/10 mx-auto mb-3" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Null Vector</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8 bg-gold-main/5 border border-gold-main/20 rounded-[2.5rem] space-y-4">
                <div className="flex items-center gap-3 text-gold-main">
                    <Zap size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Faculty Advisory</span>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed border-l-2 border-gold-main/20 pl-4">
                    "An artifact isn't just an error, kid. It's the system following its own rules blindly. Learn those rules, and you'll never be fooled by a mirror image or a phantom pulse."
                </p>
            </div>
        </div>

        {/* Main Content: Artifact Details */}
        <div className="lg:col-span-8 space-y-10 animate-slide-up">
            
            {/* Visual Viewport */}
            <div className="relative group">
                <div className="absolute -inset-4 bg-gold-main/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-full min-h-[450px]">
                    <Simulations type={selectedArtifact.visualType || 'ArtifactsVisual'} isSandbox={true} />
                </div>
            </div>

            {/* Technical Briefing Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-slate-950 border border-white/10 rounded-[3rem] space-y-8 shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><ShieldAlert size={120} /></div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-red-400">
                            <AlertTriangle size={18} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">The Board Trap</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white italic tracking-tight">Clinical Misstep</h3>
                    </div>
                    <p className="text-lg text-slate-300 font-light italic leading-relaxed border-l border-red-500/40 pl-6">
                        {selectedArtifact.boardTrap}
                    </p>
                    <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 text-white/20">
                            <CheckCircle2 size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Hazard Identified</span>
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-gold-main text-slate-950 rounded-[3rem] space-y-8 shadow-gold relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><CheckCircle2 size={120} /></div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 opacity-60">
                            <CheckCircle2 size={18} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Correction Protocol</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold italic tracking-tight">Clinical Optimization</h3>
                    </div>
                    <p className="text-lg font-bold italic leading-relaxed border-l border-slate-950/20 pl-6">
                        {selectedArtifact.fix}
                    </p>
                    <div className="pt-6 border-t border-slate-950/10 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">System Neutralized</span>
                        <Zap size={16} fill="currentColor" />
                    </div>
                </div>
            </div>

            {/* Comprehensive Insight Section */}
            <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[3.5rem] space-y-8 relative overflow-hidden group">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gold-main/10 rounded-2xl flex items-center justify-center border border-gold-main/30 text-gold-main shadow-gold transition-transform group-hover:scale-110">
                        <Camera size={24} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-serif font-bold text-white italic">Acoustic Logic Briefing</h4>
                        <p className="text-[9px] font-black text-gold-main/60 uppercase tracking-[0.4em] mt-1">Deep Dive Integration</p>
                    </div>
                </div>
                <div className="space-y-6 text-xl text-slate-400 font-light leading-relaxed italic">
                    <p>
                        Artifacts occur when the ultrasound machine fails to verify its core assumptions. 
                        For <span className="text-white font-bold">{selectedArtifact.name}</span>, the machine assumes that sound travels directly to a reflector and back in a straight line at a constant speed. 
                    </p>
                    <p>
                        By identifying the specific assumption being violated—be it straight-line travel, attenuation rate, or constant velocity—the sonographer can distinguish phantom noise from true diagnostic information.
                    </p>
                </div>
                <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                    <div className="flex items-center gap-3"><Activity size={14} className="text-gold-main/40" /> Wave Geometry</div>
                    <div className="flex items-center gap-3"><Compass size={14} className="text-gold-main/40" /> Vector Analysis</div>
                    <div className="flex items-center gap-3"><Maximize2 size={14} className="text-gold-main/40" /> Field Distortion</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArtifactVault;
