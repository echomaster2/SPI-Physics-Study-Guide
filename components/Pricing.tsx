
import React from 'react';
import { Check, ShieldCheck, Sun, Sparkles, Zap, Infinity, Star } from 'lucide-react';

interface PricingProps {
  onEnroll?: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onEnroll }) => {
  return (
    <div id="pricing" className="py-32 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
        <div className="mb-24 space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-gold-main/10 border border-gold-main/20 text-[10px] font-black text-gold-main uppercase tracking-[0.4em] mx-auto">
            <ShieldCheck size={12} /> Enrollment Protocol
          </div>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tighter italic">Secure Your <span className="text-gold-main not-italic">Sanctuary Access</span></h2>
          <p className="text-lg text-slate-400 font-light font-sans max-w-2xl mx-auto tracking-tight leading-relaxed opacity-80 italic">Select the acoustic vector that aligns with your clinical timeline. Every plan includes full simulation engine access and faculty mentorship.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Monthly Plan */}
          <div className="group relative">
            <div className="relative h-full bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-10 flex flex-col rounded-[3rem] transition-all duration-700 hover:border-white/20 hover:bg-slate-900/60 shadow-2xl group-hover:-translate-y-2">
                <div className="mb-10 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 text-white/40 group-hover:text-gold-main transition-colors">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Monthly Pulse</h3>
                    <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] font-black">Flexible Clinical Access</p>
                </div>
                
                <div className="flex items-baseline mb-10 text-left">
                    <span className="text-5xl font-serif font-bold text-white tracking-tighter">$26</span>
                    <span className="ml-2 text-white/30 font-sans text-lg">/ month</span>
                </div>
                
                <ul className="space-y-5 mb-12 flex-1 font-sans text-sm text-slate-400 text-left">
                    <li className="flex items-start gap-4">
                        <Check className="w-4 h-4 mt-0.5 text-gold-main/60" />
                        <span>All 6 physics modules unlocked</span>
                    </li>
                    <li className="flex items-start gap-4">
                        <Check className="w-4 h-4 mt-0.5 text-gold-main/60" />
                        <span>Full simulation lab access</span>
                    </li>
                    <li className="flex items-start gap-4">
                        <Check className="w-4 h-4 mt-0.5 text-gold-main/60" />
                        <span>Basic AI faculty briefings</span>
                    </li>
                </ul>
                
                <button 
                    onClick={onEnroll}
                    className="w-full py-5 bg-white/5 text-white font-black rounded-2xl uppercase tracking-[0.3em] text-[10px] border border-white/10 hover:bg-white/10 hover:border-gold-main/40 transition-all duration-500 shadow-xl"
                >
                    Initiate Monthly Link
                </button>
            </div>
          </div>

          {/* Annual Plan - Featured */}
          <div className="relative group transform lg:-translate-y-8">
             <div className="absolute -inset-1 bg-gold-main/20 rounded-[3.5rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-1000"></div>
             
             <div className="relative h-full bg-slate-900/80 backdrop-blur-3xl border-2 border-gold-main/50 p-12 flex flex-col rounded-[3.2rem] shadow-[0_0_80px_rgba(181,148,78,0.2)] hover:border-gold-main transition-all duration-700 text-left">
                <div className="absolute top-8 right-10 flex items-center gap-3">
                    <Star className="w-4 h-4 text-gold-main fill-gold-main animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-gold-main tracking-[0.4em]">SPECIALIST CHOICE</span>
                </div>
                
                <div className="mb-10 pt-4">
                    <div className="w-14 h-14 rounded-2xl bg-gold-main/10 flex items-center justify-center mb-6 border border-gold-main/30 shadow-gold group-hover:scale-110 transition-transform">
                        <Sun className="w-7 h-7 text-gold-main animate-spin-slow" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-white mb-2">Annual Resonance</h3>
                    <p className="text-gold-main/60 text-[10px] uppercase tracking-[0.4em] font-black">Full Sector Optimization</p>
                </div>
                
                <div className="flex items-baseline mb-10">
                    <span className="text-7xl font-serif font-bold text-white tracking-tighter">$143</span>
                    <span className="ml-2 text-white/40 font-sans text-xl">/ year</span>
                </div>
                
                <ul className="space-y-5 mb-12 flex-1 font-sans text-base text-slate-300">
                    <li className="flex items-start gap-4">
                        <Sparkles className="w-5 h-5 text-gold-main mt-0.5" />
                        <span className="text-white font-medium">Immediate access to mock exam vault</span>
                    </li>
                    <li className="flex items-start gap-4">
                        <Check className="w-5 h-5 text-gold-main mt-0.5" />
                        <span>Interactive physics artifact catalog</span>
                    </li>
                    <li className="flex items-start gap-4">
                        <Check className="w-5 h-5 text-gold-main mt-0.5" />
                        <span>Offline PDF Companion guides</span>
                    </li>
                    <li className="flex items-start gap-4">
                        <Check className="w-5 h-5 text-gold-main mt-0.5" />
                        <span>Priority support line</span>
                    </li>
                </ul>
                
                <button 
                    onClick={onEnroll}
                    className="w-full py-6 bg-gold-main text-slate-900 font-black rounded-3xl transition-all duration-700 uppercase tracking-[0.4em] text-[12px] shadow-gold hover:shadow-[0_0_60px_rgba(181,148,78,0.5)] hover:translate-y-[-4px] active:translate-y-0"
                >
                    Enroll For One Year
                </button>
             </div>
          </div>

          {/* Lifetime Plan */}
          <div className="group relative">
            <div className="relative h-full bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-10 flex flex-col rounded-[3rem] transition-all duration-700 hover:border-white/20 hover:bg-slate-900/60 shadow-2xl group-hover:-translate-y-2">
                <div className="mb-10 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 text-white/40 group-hover:text-gold-main transition-colors">
                        <Infinity size={24} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Eternal Matrix</h3>
                    <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] font-black">Infinite Clinical Persistence</p>
                </div>
                
                <div className="flex items-baseline mb-10 text-left">
                    <span className="text-5xl font-serif font-bold text-white tracking-tighter">$280</span>
                    <span className="ml-2 text-white/30 font-sans text-lg">lifetime</span>
                </div>
                
                <ul className="space-y-5 mb-12 flex-1 font-sans text-sm text-slate-400 text-left">
                    <li className="flex items-start gap-4">
                        <Check className="w-4 h-4 mt-0.5 text-gold-main/60" />
                        <span>Lifetime updates for all modules</span>
                    </li>
                    <li className="flex items-start gap-4">
                        <Check className="w-4 h-4 mt-0.5 text-gold-main/60" />
                        <span>All future clinical sims included</span>
                    </li>
                    <li className="flex items-start gap-4">
                        <Check className="w-4 h-4 mt-0.5 text-gold-main/60" />
                        <span>Unlimited podcast node archive</span>
                    </li>
                </ul>
                
                <button 
                    onClick={onEnroll}
                    className="w-full py-5 bg-white/5 text-white font-black rounded-2xl uppercase tracking-[0.3em] text-[10px] border border-white/10 hover:bg-gold-main/10 hover:border-gold-main/40 transition-all duration-500 shadow-xl group/btn"
                >
                    Secure Eternal Link
                </button>
            </div>
          </div>
        </div>
        
        <div className="mt-32 text-center space-y-10">
             <div className="flex items-center justify-center gap-6">
                <div className="h-px w-16 bg-white/5"></div>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black">Authorized Payment Vectors</p>
                <div className="h-px w-16 bg-white/5"></div>
             </div>
            <div className="flex justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000 group">
                <span className="font-serif font-bold text-white text-2xl tracking-tighter group-hover:text-blue-500 transition-colors">VISA</span>
                <span className="font-serif font-bold text-white text-2xl tracking-tighter group-hover:text-red-500 transition-colors">MASTERCARD</span>
                <span className="font-serif font-bold text-white text-2xl tracking-tighter group-hover:text-blue-400 transition-colors">PAYPAL</span>
                <span className="font-serif font-bold text-white text-2xl tracking-tighter group-hover:text-gold-main transition-colors">AMEX</span>
            </div>
        </div>
      </div>
      <style>{`
        .animate-spin-slow { animation: spin 12s linear infinite; }
      `}</style>
    </div>
  );
};

export default Pricing;
