
import React from 'react';
import { BookOpen, Target, Brain, Video, Sparkles, Heart } from 'lucide-react';

const Features: React.FC = () => {
  const benefits = [
    {
      icon: <Target className="w-6 h-6 text-gold-main" />,
      title: "Targeted Physics",
      description: "We carefully select the concepts you truly need, distilling the vast syllabus into focused, clinical insights."
    },
    {
      icon: <Brain className="w-6 h-6 text-gold-main" />,
      title: "Cognitive Clarity",
      description: "Master the mechanics of sound with psychological protocols designed to maintain focus during high-pressure exams."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-gold-main" />,
      title: "Interactive Wisdom",
      description: "Explore Doppler and Artifacts through intuitive simulations that make complex physics feel natural and accessible."
    },
    {
      icon: <Video className="w-6 h-6 text-gold-main" />,
      title: "Luminous Visuals",
      description: "Sound waves are made visible through cinema-grade simulations, helping you visualize what you scan."
    }
  ];

  return (
    <div id="features" className="relative py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        <div className="max-w-3xl mb-24 space-y-6">
          <div className="flex">
            <div className="px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-gold-main uppercase tracking-[0.3em] shadow-sm">Educational Excellence</div>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-white">
            Why Choose <span className="italic text-gold-main font-normal">EchoMasters</span>?
          </h2>
          <p className="text-lg text-slate-300 font-light leading-relaxed font-sans max-w-2xl drop-shadow-md">
            The SPI Physics exam is your gateway to a professional career. Our approach transforms study into an elegant clinical journey of discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="glass-card p-10 group rounded-[2.5rem] relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-main/10 blur-3xl group-hover:bg-gold-main/20 transition-colors"></div>
              
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 border border-white/10 shadow-sm group-hover:border-gold-main/40 group-hover:shadow-gold transition-all duration-500 relative">
                <div className="relative z-10 group-hover:scale-110 transition-transform">{benefit.icon}</div>
              </div>
              
              <h3 className="text-xl font-serif font-semibold text-white mb-4 group-hover:text-gold-main transition-colors">{benefit.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm font-sans font-light">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Elegant Letter Section */}
        <div className="mt-32 max-w-5xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-main/10 via-transparent to-gold-main/10 blur-2xl opacity-40"></div>
            <div className="glass-panel p-10 md:p-20 relative overflow-hidden rounded-[3rem] border-white/10 bg-white/5 backdrop-blur-3xl">
                <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-gold-main/10 blur-[100px] rounded-full"></div>
                
                <div className="flex items-center gap-4 mb-10">
                  <Heart className="w-5 h-5 text-gold-main/60" />
                  <h3 className="font-serif font-semibold text-2xl text-gold-main tracking-tight italic">To the Aspiring Clinician,</h3>
                </div>
                
                <div className="prose prose-slate max-w-none text-slate-300 font-sans font-light space-y-8 text-lg">
                    <p className="leading-relaxed">
                        If the mechanical principles of physics feel like noise in your path, <span className="text-white font-medium italic">you have found a place of clarity.</span> Mastery of sound is a peaceful pursuit of precision.
                    </p>
                    <p className="leading-relaxed">
                        We designed EchoMasters to be your <span className="text-gold-main font-semibold">trusted academic sanctuary</span>. We have refined the vast physics syllabus into a medium that is visually serene, scientifically rigorous, and intuitively guided.
                    </p>
                </div>
                
                <div className="mt-16 pt-12 border-t border-white/5 flex items-center gap-6">
                   <div className="w-14 h-14 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center font-serif font-bold text-2xl text-gold-main shadow-soft">E</div>
                   <div>
                       <p className="text-base font-semibold text-white font-serif">EchoMasters Academic Studio</p>
                       <p className="text-[10px] text-gold-main/60 uppercase tracking-[0.3em] font-bold">Board of Sonography Educators</p>
                   </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
