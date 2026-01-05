
import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Zap, Shield, Star, Target, 
  Brain, Flame, Rocket, Coins, CheckCircle2, 
  Lock, ArrowRight, Info, Sparkles, Filter, 
  LayoutGrid, Activity, ShieldCheck, AlertCircle,
  Package, ChevronRight, Search
} from 'lucide-react';
import { shopItems, ShopItem } from '../data/courseContent';

interface CommissionShopProps {
  coins: number;
  unlockedItems: string[];
  activeBoosters: string[];
  onPurchase: (item: ShopItem) => void;
}

const IconMap = {
  Zap: Zap,
  Shield: Shield,
  Star: Star,
  Target: Target,
  Brain: Brain,
  Flame: Flame,
  Rocket: Rocket
};

const CommissionShop: React.FC<CommissionShopProps> = ({ 
  coins, 
  unlockedItems, 
  activeBoosters, 
  onPurchase 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'booster' | 'cosmetic' | 'access'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return shopItems.filter(item => {
      const matchesTab = activeTab === 'all' || item.type === activeTab;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const handleBuy = (item: ShopItem) => {
    if (coins < item.cost || unlockedItems.includes(item.id)) return;
    onPurchase(item);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in text-left pb-40 px-4 md:px-10 py-10">
      
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 pb-12">
        <div className="space-y-6 text-white overflow-hidden flex-1">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-main/10 rounded-lg border border-gold-main/20"><ShoppingBag size={14} className="text-gold-main animate-pulse" /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Acquisition Node 07</span>
            </div>
            <div className="space-y-2">
                <h1 className="text-[clamp(2rem,8vw,5.5rem)] font-serif font-bold tracking-tighter leading-[0.8] italic uppercase">The <span className="text-gold-main not-italic">Commission</span></h1>
                <p className="text-slate-400 text-sm md:text-xl font-light max-w-2xl italic leading-relaxed border-l-2 border-gold-main/20 pl-6 py-1">
                    Equip tactical study augments. Exchange earned clinical resonance for high-yield boosters and elite chassis upgrades.
                </p>
            </div>
        </div>
        
        <div className="px-12 py-8 bg-slate-900 border border-gold-main/20 rounded-[3rem] flex flex-col items-center justify-center gap-2 shadow-gold-dim relative overflow-hidden group min-w-[200px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold-main/5 blur-3xl transition-opacity group-hover:opacity-100"></div>
            <div className="flex items-center gap-3 text-gold-main mb-1">
                <Coins size={18} className="animate-bounce-slow" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Resonance Credits</span>
            </div>
            <span className="text-5xl font-serif font-bold text-white italic leading-none">{coins}</span>
            <div className="w-12 h-0.5 bg-gold-main/20 rounded-full mt-2"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-3 space-y-10">
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold-main transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search Loadout..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-xs text-white focus:border-gold-main/40 transition-all outline-none font-sans placeholder:text-white/10"
                />
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3 text-gold-main px-2">
                    <Filter size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Inventory Sector</span>
                </div>
                <div className="flex flex-wrap lg:flex-col gap-2">
                    {[
                      { id: 'all', label: 'Complete Catalog', icon: LayoutGrid },
                      { id: 'booster', label: 'Tactical Boosters', icon: Zap },
                      { id: 'cosmetic', label: 'Elite Cosmetics', icon: Sparkles },
                      { id: 'access', label: 'Direct Access', icon: Lock }
                    ].map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-4 rounded-[1.5rem] border text-left transition-all duration-500 group relative overflow-hidden flex items-center gap-4 ${activeTab === tab.id ? 'bg-gold-main border-gold-main text-slate-950 shadow-gold' : 'bg-slate-950/40 border-white/5 hover:bg-white/[0.04] hover:border-gold-main/40 text-white/40 hover:text-white'}`}
                        >
                            <tab.icon size={16} />
                            <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-10 bg-slate-950 border border-white/10 rounded-[3rem] space-y-8 relative overflow-hidden shadow-2xl group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><ShieldCheck size={120} /></div>
                <div className="flex items-center gap-3 text-gold-main">
                    <Package size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Active Augments</span>
                </div>
                <div className="space-y-4">
                    {activeBoosters.length > 0 ? activeBoosters.map(bId => {
                        const item = shopItems.find(i => i.id === bId);
                        return (
                            <div key={bId} className="flex items-center justify-between p-4 bg-gold-main/10 border border-gold-main/20 rounded-2xl group/augment">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-gold-main text-slate-950 flex items-center justify-center"><Zap size={14} fill="currentColor" /></div>
                                    <span className="text-[10px] font-black uppercase text-gold-main tracking-widest">{item?.name.split(' ')[0]}</span>
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-gold-main animate-pulse"></div>
                            </div>
                        );
                    }) : (
                        <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-[2rem]">
                            <p className="text-[9px] font-black uppercase text-white/20 tracking-widest">No Active Loadout</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8 bg-gold-main/5 border border-gold-main/20 rounded-[2.5rem] space-y-4">
                <div className="flex items-center gap-3 text-gold-main">
                    <Brain size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Faculty Protocol</span>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed border-l-2 border-gold-main/20 pl-4">
                    "Don't spend all your credits on paint, kid. That Neural Link Augment will get you to Sector 6 twice as fast. Think ahead."
                </p>
            </div>
        </div>

        {/* Main Shop Grid */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-slide-up">
            {filteredItems.map((item) => {
                const isOwned = unlockedItems.includes(item.id);
                const canAfford = coins >= item.cost;
                const ItemIcon = IconMap[item.icon];
                
                return (
                    <div 
                        key={item.id}
                        className={`p-8 md:p-10 bg-slate-950/40 border rounded-[3rem] flex flex-col justify-between transition-all duration-700 relative overflow-hidden group ${isOwned ? 'border-gold-main/30 bg-gold-main/[0.02]' : 'border-white/5 hover:border-gold-main/40'}`}
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity"><ItemIcon size={160} /></div>
                        
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-start">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-xl ${isOwned ? 'bg-gold-main text-slate-950 border-gold-main shadow-gold scale-110' : 'bg-slate-900 text-gold-main border-white/5 group-hover:border-gold-main/30'}`}>
                                    <ItemIcon size={24} />
                                </div>
                                <div className="text-right">
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] block mb-1">Item Category</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.type === 'booster' ? 'text-blue-400' : item.type === 'access' ? 'text-purple-400' : 'text-gold-main'}`}>{item.type}</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <h3 className="text-2xl font-serif font-bold text-white italic leading-tight">{item.name}</h3>
                                <p className="text-sm text-slate-400 font-light leading-relaxed italic pr-8">{item.description}</p>
                            </div>

                            {item.benefit && (
                                <div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl w-max">
                                    <Activity size={12} className="text-gold-main/60" />
                                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">{item.benefit}</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-10 mt-auto relative z-10 flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                                <span className={`text-3xl font-serif font-bold italic leading-none ${isOwned ? 'text-white/20' : 'text-white'}`}>{item.cost}</span>
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Resonance</span>
                            </div>
                            
                            <button 
                                onClick={() => handleBuy(item)}
                                disabled={isOwned || !canAfford}
                                className={`px-10 py-4.5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all flex items-center gap-3 ${
                                    isOwned 
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/40 cursor-default' 
                                        : !canAfford 
                                            ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                                            : 'bg-gold-main text-slate-950 shadow-gold hover:shadow-[0_20px_50px_rgba(181,148,78,0.4)] hover:translate-y-[-2px] active:scale-[0.98]'
                                }`}
                            >
                                {isOwned ? (
                                    <><CheckCircle2 size={16} /> Acquired</>
                                ) : !canAfford ? (
                                    <><Lock size={14} /> Insufficient</>
                                ) : (
                                    <><Zap size={16} fill="currentColor" /> Purchase</>
                                )}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default CommissionShop;
