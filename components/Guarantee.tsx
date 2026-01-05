
import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

const Guarantee: React.FC = () => {
  return (
    <div id="guarantee" className="py-24 bg-transparent border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 backdrop-blur-xl rounded-full mb-4 border border-white/10 shadow-soft relative">
            <ShieldCheck className="w-10 h-10 text-gold-main/60" />
            <div className="absolute inset-0 bg-gold-main/10 blur-xl rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-serif font-semibold text-white">
            Your Success, <span className="italic text-gold-main font-normal">Our Commitment</span>
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed font-light max-w-2xl mx-auto font-sans drop-shadow-md">
            We believe in the clarity and depth of our curriculum. If your journey with the <span className="text-white font-medium">SPI Sanctuary Guide</span> does not meet your expectations, we offer a thoughtful refund within one year of your pursuit.
          </p>
        </div>
        <div className="w-24 h-px bg-gold-main/20 mx-auto"></div>
        <p className="text-[10px] text-gold-main/40 uppercase tracking-[0.4em] font-bold">
            Guided by Integrity. Dedicated to your growth.
        </p>
      </div>
    </div>
  );
};

export default Guarantee;
