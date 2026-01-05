
import React from 'react';
import { Star, Quote, Heart } from 'lucide-react';

const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: "Sarah J.",
      role: "RDMS Certified",
      content: "The way Doppler equations are explained finally brought me clarity. I approached the exam with such peace and passed with ease.",
      rating: 5
    },
    {
      name: "Michael R.",
      role: "Sonography Student",
      content: "Physics was my greatest challenge. This guide distilled the essentials, helping me focus on what truly matters for clinical practice.",
      rating: 5
    },
    {
      name: "Jessica T.",
      role: "Professional Sonographer",
      content: "The visual simulations for artifacts were enlightening. As someone who learns through sight, it made the concepts feel very natural.",
      rating: 5
    }
  ];

  return (
    <div className="py-32 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="space-y-6 mb-20">
          <div className="flex justify-center">
             <Heart className="w-5 h-5 text-gold-main/60 animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-white">
            Pathways to <span className="italic text-gold-main font-normal">Success</span>
          </h2>
          <p className="text-gold-main/60 font-medium uppercase tracking-[0.2em] text-[10px]">Gentle testimonials from our alumni</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-soft hover:border-gold-main/40 transition-all duration-700 relative group text-left">
              <Quote className="absolute top-8 right-10 w-10 h-10 text-white/5 group-hover:text-gold-main/10 transition-colors" />
              
              <div className="flex mb-8 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < review.rating ? 'text-gold-main/60 fill-gold-main/10' : 'text-white/10'}`} 
                  />
                ))}
              </div>
              
              <p className="text-slate-200 mb-10 italic relative z-10 font-light leading-relaxed font-serif text-lg">"{review.content}"</p>
              
              <div className="flex flex-col items-start pt-8 border-t border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center font-serif font-bold text-gold-main shadow-sm mb-4">
                    {review.name.charAt(0)}
                </div>
                <div>
                    <p className="font-semibold text-white text-sm font-sans">{review.name}</p>
                    <p className="text-[10px] text-gold-main/60 uppercase tracking-widest font-bold mt-1">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
