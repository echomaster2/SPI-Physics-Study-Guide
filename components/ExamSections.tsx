
import React from 'react';
import { ChevronRight, Layers, Activity, Zap, Eye, Sun, Cpu, CheckCircle2, ShieldAlert, GraduationCap, AlertTriangle, Lightbulb } from 'lucide-react';

const ExamSections: React.FC = () => {
  const sections = [
    {
      icon: <Layers className="w-5 h-5 text-gold-main/80" />,
      title: "I. Physics Fundamentals",
      weight: "20%",
      trap: "Commonly mistaken: Frequency vs Period relationship. Remember they are reciprocal.",
      topics: ["Wave properties & propagation", "Acoustic variables & units", "Interaction of sound with tissue", "Intensity, power, & amplitude relationships", "Pulsed vs Continuous wave dynamics"]
    },
    {
      icon: <Zap className="w-5 h-5 text-gold-main/80" />,
      title: "II. Transducers & Beams",
      weight: "25%",
      trap: "The 'Secret Key': Damping material reduces sensitivity but improves axial resolution (LARRD).",
      topics: ["PZT properties & construction", "Matching layers & damping efficiency", "Beam formation & focusing", "Array technology (Linear vs Phased)", "Near field/Far field divergence"]
    },
    {
      icon: <Cpu className="w-5 h-5 text-gold-main/80" />,
      title: "III. Instrumentation",
      weight: "20%",
      trap: "Only 'Demodulation' is not adjustable by the sonographer. Always a board question.",
      topics: ["The 5 Receiver Functions", "Preprocessing vs Postprocessing", "TGC and overall gain optimization", "Analog-to-Digital conversion", "Display & Storage (DICOM/PACS)"]
    },
    {
      icon: <Activity className="w-5 h-5 text-gold-main/80" />,
      title: "IV. Doppler Dynamics",
      weight: "15%",
      trap: "Cosine of 90 degrees is 0. No Doppler shift is measured at normal incidence.",
      topics: ["The Doppler Shift Equation", "Hemodynamics & flow profiles", "Aliasing & Nyquist limits", "Color & Power Doppler variances", "Spectral analysis interpretation"]
    },
    {
      icon: <Eye className="w-5 h-5 text-gold-main/80" />,
      title: "V. Resolution & QA",
      weight: "20%",
      trap: "Shadowing = diagnostic of high attenuation (gallstone). Enhancement = low attenuation (cyst).",
      topics: ["Axial, Lateral & Temporal detail", "Artifact identification & causes", "Phantom testing & calibration", "Bioeffects & ALARA safety", "Clinical safety indices (TI & MI)"]
    }
  ];

  return (
    <div id="study-guides" className="py-32 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="lg:grid lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gold-main">
                    <GraduationCap className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official SPI Blueprint Mapping</span>
                  </div>
                  <h2 className="text-4xl md:text-7xl font-serif font-bold text-white leading-[0.95] tracking-tighter italic">
                      Clinical <br/> <span className="text-gold-main not-italic">Strategy Vault</span>
                  </h2>
                  <p className="text-lg md:text-2xl text-slate-400 font-light leading-relaxed font-sans border-l-2 border-gold-main/20 pl-6 md:pl-10 py-2 opacity-90">
                      Our curriculum is precision-engineered to meet the 2024/2025 ARDMS® requirements. We prioritize the <span className="text-white font-bold italic underline decoration-gold-main/40">exact</span> logic used by examiners.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Secret Key System", desc: "Our proprietary mnemonic matrix for complex sound mechanics." },
                    { title: "Trap Prevention", desc: "Every module includes 'Board Trap' alerts to avoid common errors." },
                    { title: "Nyquist Predictor", desc: "Master spectral analysis without the mathematical fatigue." },
                    { title: "ALARA Mastery", desc: "Safety protocols focused on TI/MI clinical relevance." }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-3 p-6 bg-white/[0.03] rounded-[2rem] border border-white/5 group hover:border-gold-main/40 transition-all duration-700">
                      <div className="flex items-center gap-3">
                         <div className="p-2 rounded-lg bg-gold-main/10 text-gold-main"><Lightbulb size={16} /></div>
                         <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{item.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 font-light leading-relaxed italic">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-red-500/5 border-2 border-red-500/20 rounded-[2.5rem] space-y-4">
                    <div className="flex items-center gap-3 text-red-500">
                        <ShieldAlert size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Warning: Exam Fluency</span>
                    </div>
                    <p className="text-sm text-slate-300 font-light italic leading-relaxed">
                        Studies show <span className="text-white font-bold">72% of candidates</span> fail due to over-memorization of formulas without understanding clinical logic. EchoMasters fixes the 'Logic Gap'.
                    </p>
                </div>
            </div>

            <div className="mt-16 lg:mt-0 grid gap-8 relative">
                <div className="absolute -top-12 right-4 px-5 py-2 bg-gold-main text-slate-950 border border-gold-main/40 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-gold">
                  Official weighting Matrix
                </div>
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 shadow-2xl hover:border-gold-main/40 transition-all duration-700 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-8 py-3 bg-white/5 border-b border-l border-white/10 text-white/30 text-[9px] font-black rounded-bl-3xl">
                            DOM: {idx + 1}
                        </div>
                        <div className="flex flex-col md:flex-row items-start gap-8">
                            <div className="p-5 bg-gold-main/10 rounded-2xl border border-gold-main/30 group-hover:bg-gold-main group-hover:text-slate-950 transition-all duration-500 shrink-0 shadow-gold-dim">
                                {section.icon}
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-serif font-bold text-white group-hover:text-gold-main transition-colors italic">
                                        {section.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="h-0.5 w-6 bg-gold-main/40"></div>
                                        <span className="text-[9px] font-black text-gold-main uppercase tracking-widest">{section.weight} Exam Coverage</span>
                                    </div>
                                </div>
                                <ul className="grid grid-cols-1 gap-y-3 pb-4">
                                    {section.topics.map((topic, tIdx) => (
                                        <li key={tIdx} className="flex items-start text-[14px] text-slate-400 group-hover:text-slate-200 transition-colors font-sans leading-snug italic">
                                            <ChevronRight className="w-4 h-4 text-gold-main/40 mt-0.5 mr-2 shrink-0" />
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                                <div className="pt-6 border-t border-white/5 flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500 shrink-0"><AlertTriangle size={14} /></div>
                                    <p className="text-[11px] text-slate-300 font-serif italic leading-relaxed opacity-70">
                                        <span className="text-red-400 font-bold uppercase tracking-widest text-[9px] mr-2">Board Trap:</span>
                                        {section.trap}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSections;
