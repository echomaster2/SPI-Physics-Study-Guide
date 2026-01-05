
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ExamSections from './components/ExamSections';
import AboutUs from './components/AboutUs';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Guarantee from './components/Guarantee';
import CourseViewer from './components/CourseViewer';
import AppIntro from './components/AppIntro';
import LegalPages from './components/LegalPages';
import OceanBackground from './components/OceanBackground';
import AdminLogin from './components/AdminLogin';

const App: React.FC = () => {
  const [showCourse, setShowCourse] = useState(false);
  const [legalPage, setLegalPage] = useState<'terms' | 'privacy' | null>(null);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('spi-is-admin') === 'true');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);
  const [introFinished, setIntroFinished] = useState(() => {
    return localStorage.getItem('spi-intro-seen') === 'true';
  });

  useEffect(() => {
    if (introFinished) {
      localStorage.setItem('spi-intro-seen', 'true');
    }
  }, [introFinished]);

  // -- Global Acoustic Ripples --
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
        const id = Date.now();
        setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
        }, 1000);
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdmin(true);
      localStorage.setItem('spi-is-admin', 'true');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('spi-is-admin');
    window.location.reload();
  };

  const playBubbleSound = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    const bubbleCount = 6 + Math.floor(Math.random() * 3);
    for(let i = 0; i < bubbleCount; i++) {
        const t = now + i * 0.04;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        const freq = 800 + Math.random() * 400;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq + 1000, t + 0.05);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.04, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
    }
  };

  const playNavigationSound = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.08);
    g.gain.setValueAtTime(0.05, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  };

  const playCorrectSound = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99]; 
    freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const delay = idx * 0.04;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + delay);
        g.gain.setValueAtTime(0, t + delay);
        g.gain.linearRampToValueAtTime(0.08, t + delay + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.8);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 1);
    });
  };

  const playIncorrectSound = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.linearRampToValueAtTime(40, t + 0.3);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    osc.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  };

  const handleOpenCourse = () => {
    playNavigationSound();
    setShowCourse(true);
  };

  return (
    <div className="min-h-screen text-text-main selection:bg-gold-main/30 selection:text-gold-accent animate-fade-in relative overflow-hidden bg-[#001b2e]">
      {/* Background stays active across all phases */}
      <OceanBackground />
      
      {/* Click Ripple Layers */}
      {ripples.map(r => (
        <div 
            key={r.id} 
            className="fixed pointer-events-none z-[9999] border-2 border-gold-main/40 rounded-full animate-acoustic-ripple"
            style={{ left: r.x, top: r.y, transform: 'translate(-50%, -50%)' }}
        />
      ))}

      {!introFinished ? (
          <AppIntro onComplete={() => setIntroFinished(true)} />
      ) : showCourse ? (
        <CourseViewer 
            onExit={() => setShowCourse(false)} 
            onPlayCorrect={playCorrectSound}
            onPlayIncorrect={playIncorrectSound}
            onPlayBubble={playBubbleSound}
        />
      ) : (
        <>
          <Navbar 
            onOpenCourse={handleOpenCourse} 
            isAdmin={isAdmin} 
            onOpenLogin={() => setShowAdminLogin(true)}
            onLogout={handleAdminLogout}
          />
          <Hero onOpenCourse={handleOpenCourse} onPlayBubble={playBubbleSound} />
          <Features />
          <ExamSections />
          <AboutUs />
          <Testimonials />
          <Guarantee />
          <Pricing onEnroll={handleOpenCourse} />
          <Footer onOpenLegal={(type) => setLegalPage(type)} />
        </>
      )}

      {legalPage && (
        <LegalPages type={legalPage} onClose={() => setLegalPage(null)} />
      )}

      <AdminLogin 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)} 
        onLogin={handleAdminLogin} 
      />

      <style>{`
        @keyframes acoustic-ripple {
            from { width: 0; height: 0; opacity: 0.6; transform: translate(-50%, -50%) scale(0.1); }
            to { width: 300px; height: 300px; opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
        }
        .animate-acoustic-ripple {
            animation: acoustic-ripple 0.8s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
