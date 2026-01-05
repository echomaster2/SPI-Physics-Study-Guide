
import React, { useState } from 'react';
import { 
  Beaker, Waves, Activity, Target, Eye, 
  Ruler, Zap, Wind, Compass, ShieldAlert, 
  Cpu, Binary, Radar, Info, ArrowRight,
  Database, Lightbulb, Microscope, Terminal,
  Maximize2, RotateCcw, Filter, Search,
  Box, Layers, Settings, FlaskConical
} from 'lucide-react';
import Simulations from './Simulations';

interface SimModule {
  id: string;
  title: string;
  type: string;
  icon: any;
  category: 'Fundamentals' | 'Beams' | 'Doppler' | 'Artifacts';
  description: string;
  protocol: string;
  facultyTip: string;
}

const SIM_MODULES: SimModule[] = [
  {
    id: 'm-1',
    title: 'Longitudinal Displacement',
    type: 'LongitudinalWaveVisual',
    icon: Waves,
    category: 'Fundamentals',
    description: 'Visualize particle compression and rarefaction in mechanical waves.',
    protocol: 'Observe how molecules move parallel to the direction of energy propagation. High frequency creates shorter zones of compression.',
    facultyTip: "Kid, look closely at the gaps. Rarefaction is just as important as the push. It's the low-pressure valley of the signal."
  },
  {
    id: 'm-2',
    title: 'Attenuation Gradient',
    type: 'AttenuationVisual',
    icon: Activity,
    category: 'Fundamentals',
    description: 'Experiment with frequency-dependent energy loss in biological tissue.',
    protocol: 'Adjust the medium loss and frequency to see how high-frequency signals are "taxed" by depth.',
    facultyTip: "Depth is a filter. Higher frequencies get exhausted faster. That's why we use the 2MHz probe for the adult liver, not the 10MHz."
  },
  {
    id: 'm-3',
    title: 'Axial Resolution Threshold',
    type: 'ResolutionVisual',
    icon: Ruler,
    category: 'Fundamentals',
    description: 'Define the minimum distance required to distinguish two axial structures.',
    protocol: 'Manipulate the Spatial Pulse Length (SPL). When SPL is greater than twice the gap, structures blur into one.',
    facultyTip: "LARRD detail is all about the pulse length. Shorter is always sharper. Remember the math: Resolution = SPL / 2."
  },
  {
    id: 'm-4',
    title: 'Beam Geometry & Divergence',
    type: 'BeamFormingVisual',
    icon: Target,
    category: 'Beams',
    description: 'Map the Fresnel and Fraunhofer zones of an acoustic beam.',
    protocol: 'Study the focal waist. Notice how divergence increases beyond the near-zone length.',
    facultyTip: "The focus is your knife edge. Always place your focal zone at or slightly below your anatomy of interest."
  },
  {
    id: 'm-5',
    title: 'Doppler Vector Analysis',
    type: 'DopplerShiftVisual',
    icon: Compass,
    category: 'Doppler',
    description: 'Calculate frequency shifts based on incident angle and velocity.',
    protocol: 'Rotate the vector. Observe how the cosine of the angle determines the measured frequency shift.',
    facultyTip: "At 90 degrees, you're blind. 0 shift. If you want the truth, you have to get parallel with the flow."
  },
  {
    id: 'm-6',
    title: 'PZT Crystal Resonance',
    type: 'TransducerVisual',
    icon: Cpu,
    category: 'Beams',
    description: 'Study the piezoelectric effect and damping layer mechanics.',
    protocol: 'Vary the damping effect to see how it shortens the pulse duration at the cost of sensitivity.',
    facultyTip: "Backing material is a necessary evil. It stops the ringing so we get detail, but it lowers our efficiency."
  },
  {
    id: 'm-7',
    title: 'Signal Receiver Chain',
    type: 'ReceiverVisual',
    icon: Binary,
    category: 'Fundamentals',
    description: 'Simulate the five receiver functions from amplification to rejection.',
    protocol: 'Observe how gain and compression prepare raw electrical signals for clinical display.',
    facultyTip: "The receiver is the signal's cleaning crew. Don't over-amplify noise; use Rejection to keep the baseline clean."
  },
  {
    id: 'm-8',
    title: 'Thermal Bioeffects (TI)',
    type: 'SafetyVisual',
    icon: ShieldAlert,
    category: 'Artifacts',
    description: 'Monitor heat accumulation and the Thermal Index (TI) limits.',
    protocol: 'Study the relationship between dwell time, output power, and tissue heating.',
    facultyTip: "ALARA isn't just a suggestion. It's your shield. Minimize power, maximize gain."
  }
];

const SimLaboratory: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<SimModule>(SIM_MODULES[0]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Fundamentals', 'Beams', 'Doppler', 'Artifacts'];

  const filteredModules = SIM_MODULES.filter(m => 
    activeCategory === 'All' || m.category === activeCategory
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in text-left pb-40">
      
      {/* Lab Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4 md:space-y-6 flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold-main/10 rounded-lg border border-gold-main/20">
              <FlaskConical size={14} className="text-gold-main animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Advanced Physics Laboratory</span>
          </div>
          <h1 className="text-[clamp(2.2rem,8vw,5.5rem)] font-serif font-bold text-white tracking-tighter leading-[0.85] italic uppercase">
            Sim <span className="text-gold-main not-italic">Laboratory</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-xl font-light max-w-2xl leading-relaxed italic border-l-2 border-gold-main/20 pl-6">
            Establish hands-on resonance with acoustic principles. Manipulate variables in real-time to observe the behavior of sound in matter.
          </p>
        </div>

        <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-gold-main text-slate-900 shadow-gold' : 'text-white/30 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        
        {/* Module Selection Grid */}
        <div className="lg:col-span-4 space-y-6 max-h-[800px] overflow-y-auto custom-scrollbar pr-2">
          <div className="flex items-center gap-3 text-gold-main px-2 mb-4">
            <Layers size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Experiment Nodes</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {filteredModules.map((mod) => (
              <button 
                key={mod.id}
                onClick={() => setSelectedModule(mod)}
                className={`p-6 rounded-[2rem] border text-left transition-all duration-500 group relative overflow-hidden active:scale-95 ${selectedModule.id === mod.id ? 'bg-gold-main border-gold-main shadow-gold' : 'bg-slate-950/40 border-white/5 hover:border-gold-main/30'}`}
              >
                <div className="flex items-center gap-5 relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selectedModule.id === mod.id ? 'bg-slate-950/10 text-slate-900' : 'bg-slate-900 text-white/30 border border-white/5'}`}>
                    <mod.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm md:text-base font-serif font-bold italic truncate ${selectedModule.id === mod.id ? 'text-slate-950' : 'text-white'}`}>{mod.title}</h4>
                    <p className={`text-[8px] font-black uppercase tracking-widest ${selectedModule.id === mod.id ? 'text-slate-950/40' : 'text-white/20'}`}>{mod.category} Sector</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Viewport & Console */}
        <div className="lg:col-span-8 space-y-10 animate-slide-up">
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-gold-main/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="relative">
              <Simulations type={selectedModule.type} isSandbox={true} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Technical Protocol Card */}
            <div className="p-8 md:p-12 bg-slate-950 border border-white/10 rounded-[3rem] space-y-8 shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Terminal size={120} /></div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3 text-gold-main">
                  <Microscope size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Technical Protocol</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white italic tracking-tight">{selectedModule.title}</h3>
                <p className="text-lg text-slate-300 font-light italic leading-relaxed border-l-2 border-gold-main/30 pl-6">
                  {selectedModule.protocol}
                </p>
              </div>
              <div className="pt-8 border-t border-white/5 grid grid-cols-3 gap-4 text-[9px] font-black uppercase tracking-widest text-white/20">
                <div className="flex flex-col gap-1"><span>Precision</span><span className="text-gold-main">High</span></div>
                <div className="flex flex-col gap-1"><span>Latency</span><span className="text-gold-main">0.4ms</span></div>
                <div className="flex flex-col gap-1"><span>Sync</span><span className="text-gold-main">Active</span></div>
              </div>
            </div>

            {/* Faculty Commentary Card */}
            <div className="p-8 md:p-12 bg-gold-main/5 border border-gold-main/20 rounded-[3rem] space-y-8 relative overflow-hidden shadow-2xl group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"><Database size={140} /></div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3 text-gold-main">
                  <Lightbulb size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Faculty Observation</span>
                </div>
                <p className="text-xl md:text-2xl font-serif font-medium text-slate-200 italic leading-relaxed">
                  "{selectedModule.facultyTip}"
                </p>
              </div>
              <div className="pt-8 border-t border-gold-main/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-main/20 border border-gold-main/30 flex items-center justify-center">
                    <Settings className="w-4 h-4 text-gold-main animate-spin-slow" />
                  </div>
                  <span className="text-[9px] font-black text-gold-main/60 uppercase tracking-widest">Real-time Tuning</span>
                </div>
                <div className="flex items-center gap-2 text-white/10">
                  <Binary size={14} />
                  <span className="text-[9px] font-mono">NODE_SYNC_COMPLETE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimLaboratory;
