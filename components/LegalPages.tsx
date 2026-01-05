
import React from 'react';
import { X, Shield, Scale, ArrowLeft } from 'lucide-react';

interface LegalPagesProps {
  type: 'terms' | 'privacy';
  onClose: () => void;
}

const LegalPages: React.FC<LegalPagesProps> = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-transparent backdrop-blur-3xl overflow-y-auto animate-fade-in">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-gold-main/10 to-transparent pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gold-main hover:text-gold-accent transition-colors mb-12 group font-sans font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Navigation
        </button>

        <div className="glass-panel p-8 md:p-16 rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden mb-12 bg-white/10">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
            {type === 'terms' ? <Scale className="w-64 h-64 text-gold-main" /> : <Shield className="w-64 h-64 text-gold-main" />}
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 mb-8 bg-gold-main/10 border border-gold-main/20 px-4 py-2 rounded-full">
              {type === 'terms' ? <Scale className="w-4 h-4 text-gold-main" /> : <Shield className="w-4 h-4 text-gold-main" />}
              <span className="text-[10px] font-bold text-gold-main uppercase tracking-[0.3em]">EchoMasters Protocols</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 tracking-tight">
              {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
            </h1>
            
            <p className="text-white/60 font-light mb-12 font-sans italic border-l-2 border-gold-main/30 pl-6">
              Last updated: October 2023. These protocols govern your traversal of the EchoMasters academic medium.
            </p>

            <div className="space-y-10 font-sans text-white/90 leading-relaxed">
              {type === 'terms' ? (
                <>
                  <section className="space-y-4">
                    <h3 className="text-xl font-serif font-bold text-gold-main">1. Acceptance of Terms</h3>
                    <p>By accessing or using the EchoMasters platform, you agree to be bound by these Terms of Service. If you do not agree, you are prohibited from navigating our instructional vectors.</p>
                  </section>
                  
                  <section className="space-y-4">
                    <h3 className="text-xl font-serif font-bold text-gold-main">2. Use of License</h3>
                    <p>License is granted for personal, non-commercial viewing only. This is the grant of a license, not a transfer of title. You may not:</p>
                    <ul className="list-disc pl-6 space-y-2 opacity-80">
                      <li>Modify or copy the educational scripts or simulations.</li>
                      <li>Use the materials for any commercial purpose.</li>
                      <li>Attempt to decompile or reverse engineer any software on the site.</li>
                      <li>Remove any copyright or other proprietary notations.</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-serif font-bold text-gold-main">3. Disclaimer</h3>
                    <p>The materials on EchoMasters are provided for educational purposes only. We do not provide medical advice. EchoMasters makes no warranties, expressed or implied, regarding the accuracy or reliability of passing results, though we provide our 100% guarantee as specified in the Guarantee section.</p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-serif font-bold text-gold-main">4. Academic Integrity</h3>
                    <p>Users must maintain high standards of academic integrity. Sharing of course materials, assessment answers, or simulation solutions is strictly prohibited and will result in immediate termination of the license without refund.</p>
                  </section>
                </>
              ) : (
                <>
                  <section className="space-y-4">
                    <h3 className="text-xl font-serif font-bold text-gold-main">1. Data Collection</h3>
                    <p>We collect minimal information required to ensure a precise learning experience. This includes your local study progress, notes, and assessment scores, which are stored within your browser's local storage to ensure persistence across sessions.</p>
                  </section>
                  
                  <section className="space-y-4">
                    <h3 className="text-xl font-serif font-bold text-gold-main">2. AI Interactions</h3>
                    <p>Professor Charon is powered by the Google Gemini API. While your specific identity is not transmitted, your queries are processed by Google's infrastructure to provide intelligent academic responses. We do not store transcripts of these interactions on our permanent servers.</p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-serif font-bold text-gold-main">3. Audio Data</h3>
                    <p>Cinematic narration and TTS (Text-to-Speech) generation are performed in real-time. No audio data of your physical voice is recorded or stored by EchoMasters.</p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-serif font-bold text-gold-main">4. Security Protocols</h3>
                    <p>We implement industry-standard encryption and security measures to protect the integrity of the instructional medium. However, as with any digital echo, we cannot guarantee absolute security against all potential interference.</p>
                  </section>
                </>
              )}
            </div>

            <div className="mt-16 pt-12 border-t border-white/5 flex flex-col items-center">
              <div className="w-12 h-12 bg-gold-main/10 rounded-xl border border-gold-main/20 flex items-center justify-center font-serif font-bold text-gold-main mb-4">E</div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">EchoMasters Media LLC</p>
            </div>
          </div>
        </div>

        <div className="text-center">
           <button 
             onClick={onClose}
             className="px-12 py-5 bg-gold-main text-slate-900 font-bold rounded-2xl shadow-gold hover:scale-105 transition-all uppercase tracking-widest text-sm"
           >
             Acknowledge & Return
           </button>
        </div>
      </div>
    </div>
  );
};

export default LegalPages;
