
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, Zap, Target, Ruler, Activity, 
  ChevronRight, ArrowRight, Info, Brain, Sparkles,
  Search, Filter, List, Database, Sliders, Hash,
  TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import { highYieldFormulas, Formula } from '../data/courseContent';

const FormulaHub: React.FC = () => {
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>(highYieldFormulas[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Local state for calculation variables
  const [variables, setVariables] = useState<Record<string, number>>({});

  const categories = useMemo(() => ['All', ...new Set(highYieldFormulas.map(f => f.category))], []);

  const filteredFormulas = useMemo(() => {
    return highYieldFormulas.filter(f => {
      const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            f.formula.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const selectedFormula = useMemo(() => {
    return highYieldFormulas.find(f => f.id === selectedFormulaId) || highYieldFormulas[0];
  }, [selectedFormulaId]);

  // Sync variables when selected formula changes
  useEffect(() => {
    const defaults: Record<string, number> = {};
    selectedFormula.variables.forEach(v => {
      defaults[v.name] = (v.min + v.max) / 2;
    });
    setVariables(defaults);
  }, [selectedFormulaId]);

  const handleVarChange = (name: string, value: number) => {
    setVariables(prev => ({ ...prev, [name]: value }));
  };

  const calculationResult = useMemo(() => {
    const currentVars = { ...variables };
    selectedFormula.variables.forEach(v => {
      if (currentVars[v.name] === undefined) currentVars[v.name] = (v.min + v.max) / 2;
    });
    return selectedFormula.calculate(currentVars);
  }, [selectedFormula, variables]);

  const ProportionalityBadge = ({ type }: { type: 'direct' | 'inverse' | 'none' }) => {
      if (type === 'direct') return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
              <TrendingUp size={10} />
              <span className="text-[8px] font-black uppercase tracking-widest">Direct</span>
          </div>
      );
      if (type === 'inverse') return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
              <TrendingDown size={10} />
              <span className="text-[8px] font-black uppercase tracking-widest">Inverse</span>
          </div>
      );
      return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40">
              <Minus size={10} />
              <span className="text-[8px] font-black uppercase tracking-widest">Fixed</span>
          </div>
      );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in text-left pb-40 px-4 md:px-10 py-10">
      
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 pb-12">
        <div className="space-y-6 text-white overflow-hidden flex-1">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-main/10 rounded-lg border border-gold-main/20"><Calculator size={14} className="text-gold-main animate-pulse" /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Mathematical Resonance Hub</span>
            </div>
            <div className="space-y-2">
                <h1 className="text-[clamp(2rem,8vw,5.5rem)] font-serif font-bold tracking-tighter leading-[0.8] italic uppercase">Formula <span className="text-gold-main not-italic">Hub</span></h1>
                <p className="text-slate-400 text-sm md:text-xl font-light max-w-2xl italic leading-relaxed border-l-2 border-gold-main/20 pl-6 py-1">
                    Master high-yield constants. Manipulate live variables to visualize mathematical relationships before your next sector assessment.
                </p>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="px-8 py-5 bg-slate-900 border border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-1 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 bg-gold-main/5 blur-xl group-hover:bg-gold-main/10 transition-colors"></div>
                <span className="text-2xl font-serif font-bold text-white italic leading-none">{highYieldFormulas.length}</span>
                <span className="text-[7px] font-black uppercase text-white/20 tracking-widest">Calculators</span>
            </div>
            <div className="px-8 py-5 bg-slate-950 border border-gold-main/20 rounded-[2rem] flex flex-col items-center justify-center gap-1 shadow-gold-dim relative overflow-hidden">
                <Sparkles size={14} className="text-gold-main mb-1" />
                <span className="text-[8px] font-black uppercase text-gold-main/60 tracking-widest text-center">Interactive Mode</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Sidebar Selection */}
        <div className="lg:col-span-4 space-y-8">
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold-main transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search Constants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-xs text-white focus:border-gold-main/40 transition-all outline-none font-sans placeholder:text-white/10"
                />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button 
                  key={cat as string} 
                  onClick={() => setActiveCategory(cat as string)}
                  className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-gold-main text-slate-950 border-gold-main shadow-gold' : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'}`}
                >
                  {cat as string}
                </button>
              ))}
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-3 text-gold-main px-2">
                    <List size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Index Nodes</span>
                </div>
                <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                    {filteredFormulas.map((f) => (
                        <button 
                            key={f.id}
                            onClick={() => { setSelectedFormulaId(f.id); }}
                            className={`p-5 rounded-2xl border text-left transition-all duration-500 group relative overflow-hidden active:scale-95 ${selectedFormulaId === f.id ? 'bg-gold-main border-gold-main shadow-gold' : 'bg-slate-950/40 border-white/5 hover:border-gold-main/40'}`}
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <h4 className={`text-sm font-serif font-bold italic leading-tight ${selectedFormulaId === f.id ? 'text-slate-950' : 'text-white'}`}>{f.name}</h4>
                                    <p className={`text-[9px] font-mono mt-1 ${selectedFormulaId === f.id ? 'text-slate-950/60' : 'text-white/30'}`}>{f.formula}</p>
                                </div>
                                <ChevronRight size={16} className={selectedFormulaId === f.id ? 'text-slate-950' : 'text-white/20'} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-8 bg-gold-main/5 border border-gold-main/20 rounded-[2.5rem] space-y-4">
                <div className="flex items-center gap-3 text-gold-main">
                    <Brain size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Faculty Advice</span>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed border-l-2 border-gold-main/20 pl-4">
                    "Don't memorize numbers, kid. Memorize the relationships. If the frequency is in the denominator, and it goes up, the result MUST go down. Simple acoustic logic."
                </p>
            </div>
        </div>

        {/* Calculator Area */}
        <div className="lg:col-span-8 space-y-10 animate-slide-up">
            
            <div className="p-10 md:p-14 bg-slate-950 border border-white/10 rounded-[3rem] space-y-12 shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Sliders size={150} /></div>
                
                <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-gold-main/10 border border-gold-main/30 text-[8px] font-black text-gold-main uppercase tracking-[0.3em]">{selectedFormula.category}</span>
                        <div className="h-px w-8 bg-white/10"></div>
                        <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Node ID: {selectedFormula.id}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white italic tracking-tight">{selectedFormula.name}</h2>
                    <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl">
                        <p className="text-2xl md:text-4xl font-mono text-gold-main font-bold tracking-tighter text-center">
                            {selectedFormula.formula}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between text-white/40">
                            <div className="flex items-center gap-3">
                                <Sliders size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Variables</span>
                            </div>
                        </div>
                        <div className="space-y-10">
                            {selectedFormula.variables.map(v => {
                                const relType = selectedFormula.relationships.find(r => r.var === v.name)?.type || 'none';
                                return (
                                    <div key={v.name} className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[11px] font-black uppercase text-white/80 tracking-widest">{v.label}</span>
                                                    <ProportionalityBadge type={relType} />
                                                </div>
                                                <p className="text-[9px] text-slate-500 italic max-w-[200px] leading-tight">{v.description}</p>
                                            </div>
                                            <span className="text-gold-main font-mono font-bold bg-gold-main/5 px-3 py-1 rounded-lg border border-gold-main/10 text-sm">{variables[v.name] ?? v.min} {v.unit}</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min={v.min} max={v.max} step={v.step} 
                                            value={variables[v.name] ?? (v.min + v.max) / 2}
                                            onChange={(e) => handleVarChange(v.name, parseFloat(e.target.value))}
                                            className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-gold-main" 
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center text-center p-8 bg-gold-main/5 border border-gold-main/20 rounded-[2.5rem] space-y-6 min-h-[300px]">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-gold-main uppercase tracking-[0.4em]">Calculated Value</p>
                            <div className="flex items-baseline gap-2 justify-center">
                                <span className="text-6xl md:text-[5.5rem] font-serif font-bold italic text-white leading-none tracking-tighter">
                                    {calculationResult.toFixed(2)}
                                </span>
                                <span className="text-xs font-mono text-white/40 uppercase">Result</span>
                            </div>
                        </div>
                        <div className="w-16 h-px bg-gold-main/20"></div>
                        <div className="flex items-center gap-2 text-gold-main/60 animate-pulse">
                            <Activity size={16} />
                            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Real-time Proportionality Sync</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deep Dive Card */}
            <div className="p-10 md:p-14 bg-white/[0.02] border border-white/5 rounded-[3.5rem] space-y-8 relative overflow-hidden group">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gold-main/10 rounded-2xl flex items-center justify-center border border-gold-main/30 text-gold-main shadow-gold transition-transform group-hover:scale-110">
                        <Database size={24} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-serif font-bold text-white italic">Clinical Resonance</h4>
                        <p className="text-[9px] font-black text-gold-main/60 uppercase tracking-[0.4em] mt-1">Mathematical Deep Dive</p>
                    </div>
                </div>
                <div className="space-y-6 text-xl text-slate-400 font-light leading-relaxed italic border-l-2 border-gold-main/20 pl-8 py-2">
                    {selectedFormula.deepDive}
                </div>
                <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-t border-white/5">
                    <div className="flex items-center gap-3"><Hash size={14} className="text-gold-main/40" /> Unit Calibration</div>
                    <div className="flex items-center gap-3"><Target size={14} className="text-gold-main/40" /> Board Accuracy</div>
                    <div className="flex items-center gap-3"><Activity size={14} className="text-gold-main/40" /> Precision Sector</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FormulaHub;
