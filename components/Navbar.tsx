
import React, { useState, useEffect } from 'react';
import { Menu, Search, X, ShoppingCart, BookOpen, Settings, LayoutGrid, Star, Zap, Activity, Heart, Shield, LogOut, Info, Bot } from 'lucide-react';
import AdminStudio from './AdminStudio';
import SiteRadio from './SiteRadio';

interface NavbarProps {
    onOpenCourse?: () => void;
    isAdmin?: boolean;
    onOpenLogin?: () => void;
    onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenCourse, isAdmin, onOpenLogin, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showStudio, setShowStudio] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      setIsOpen(false);
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getOverride = (id: string) => {
    try {
        const saved = localStorage.getItem('spi-admin-overrides');
        if (!saved) return null;
        const overrides = JSON.parse(saved);
        return overrides[id]?.value || null;
    } catch (e) { return null; }
  };

  const logoUrl = getOverride('global-logo');

  return (
    <>
      <header className={`fixed w-full top-0 z-[100] transition-all duration-1000 ${scrolled ? 'bg-slate-950/60 backdrop-blur-2xl border-b border-white/5 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center h-12 sm:h-16">
            
            <div className="flex-shrink-0 flex items-center cursor-pointer group">
              <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 border border-gold-main/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-gold-main bg-slate-950 shadow-soft group-hover:shadow-gold transition-all duration-700 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gold-main/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {logoUrl ? <img src={logoUrl} className="w-full h-full object-cover" alt="Logo" /> : <Bot size={24} className="relative z-10" />}
                  </div>
                  <div className="flex flex-col text-left">
                      <span className="font-serif font-semibold text-lg sm:text-xl tracking-tight text-white group-hover:text-gold-main transition-colors leading-none">EchoMasters</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1 w-1 rounded-full bg-gold-main/40"></div>
                        <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">Educational Studio</span>
                      </div>
                  </div>
              </a>
            </div>

            <nav className="hidden lg:flex items-center gap-10">
              <div className="flex items-center gap-8">
                {['study-guides', 'about-us', 'features', 'pricing'].map((id) => (
                  <a key={id} href={`#${id}`} onClick={(e) => scrollToSection(e, id)} className="group relative text-[10px] font-black text-white/60 hover:text-white transition-all uppercase tracking-widest py-2">
                    {id.replace('-', ' ')}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-gold-main transition-all duration-500 group-hover:w-full opacity-60"></span>
                  </a>
                ))}
              </div>
              <div className="h-6 w-px bg-white/5 mx-2"></div>
              <div className="flex items-center gap-6">
                <SiteRadio />
                {isAdmin ? (
                   <div className="flex items-center gap-4">
                      <button onClick={() => setShowStudio(true)} className="flex items-center gap-2 px-5 py-2 bg-gold-main/10 text-gold-main border border-gold-main/20 rounded-xl hover:bg-gold-main/20 transition-all font-black text-[10px] uppercase tracking-widest">
                        <LayoutGrid size={14}/> Admin
                      </button>
                      <button onClick={onLogout} className="p-2.5 text-white/20 hover:text-red-400 transition-all" title="Logout">
                        <LogOut size={18} />
                      </button>
                   </div>
                ) : (
                  <button onClick={onOpenLogin} className="p-2.5 text-white/20 hover:text-gold-main transition-all group">
                    <Shield size={18} />
                  </button>
                )}
                <button onClick={onOpenCourse} className="group relative flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm transition-all duration-700 hover:bg-white/10">
                    <BookOpen size={14} className="opacity-70" />
                    <span>Classroom</span>
                </button>
              </div>
            </nav>

            <div className="lg:hidden flex items-center gap-3">
              <button onClick={onOpenCourse} className="text-white font-black text-[8px] sm:text-[9px] uppercase tracking-widest border border-white/10 bg-white/5 px-4 py-2 rounded-xl active:scale-95 transition-all">Classroom</button>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white active:bg-white/5 rounded-xl transition-all">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Fullscreen Menu */}
        <div className={`fixed inset-0 z-[1000] lg:hidden bg-slate-950/95 backdrop-blur-3xl flex flex-col transition-all duration-700 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
          <div className="flex justify-between items-center p-6 border-b border-white/5">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-main/20 flex items-center justify-center font-bold text-gold-main">
                  <Bot size={18} />
                </div>
                <span className="font-serif font-bold text-white">Menu</span>
             </div>
             <button onClick={() => setIsOpen(false)} className="p-2 text-white/40 active:text-white"><X size={24} /></button>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-8 px-10">
              {[
                { id: 'study-guides', icon: Star, label: 'Study Guides' },
                { id: 'about-us', icon: Info, label: 'About Us' },
                { id: 'features', icon: Zap, label: 'Features' },
                { id: 'pricing', icon: ShoppingCart, label: 'Pricing' }
              ].map((item) => (
                <a key={item.id} href={`#${item.id}`} onClick={(e) => scrollToSection(e, item.id)} className="flex items-center gap-6 text-2xl font-serif font-bold text-white/60 active:text-gold-main transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><item.icon className="w-5 h-5 text-gold-main" /></div>
                  {item.label}
                </a>
              ))}
              <div className="h-px bg-white/5 my-4"></div>
              <SiteRadio />
          </div>

          <div className="p-10 border-t border-white/5 bg-white/[0.02]">
              {isAdmin ? (
                <button onClick={() => { setIsOpen(false); setShowStudio(true); }} className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-gold-main text-slate-900 font-black uppercase text-[10px] tracking-widest">
                  <LayoutGrid size={18} /> Admin Studio
                </button>
              ) : (
                <button onClick={() => { setIsOpen(false); onOpenLogin?.(); }} className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest">
                  <Shield size={18} className="text-gold-main" /> Staff Entrance
                </button>
              )}
          </div>
        </div>
      </header>
      <AdminStudio isOpen={showStudio} onClose={() => setShowStudio(false)} />
    </>
  );
};

export default Navbar;
