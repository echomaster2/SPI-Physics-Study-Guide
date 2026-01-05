
import React, { useState } from 'react';
import { Shield, Lock, User, X, Loader2, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (success: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulated admin check
    setTimeout(() => {
      if (username === 'admin' && password === 'echo2025') {
        onLogin(true);
        onClose();
      } else {
        setError('Authorization failed. Invalid credentials.');
        setIsLoading(false);
      }
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold-main/20">
          <div className={`h-full bg-gold-main transition-all duration-1000 ${isLoading ? 'w-full' : 'w-0'}`}></div>
        </div>
        
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="p-10 space-y-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-gold-main/10 rounded-2xl flex items-center justify-center border border-gold-main/30 shadow-gold mb-2">
              <Shield className="w-8 h-8 text-gold-main" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Admin Gateway</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-black">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gold-main uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold-main transition-colors" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-gold-main/40 transition-all"
                  placeholder="Personnel ID"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gold-main uppercase tracking-widest ml-1">Access Token</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold-main transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-gold-main/40 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest text-center animate-pulse">{error}</p>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4.5 bg-gold-main text-slate-900 rounded-xl font-black uppercase text-[11px] tracking-[0.2em] shadow-gold hover:shadow-soft transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>Identify Access <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        <div className="px-10 py-6 bg-white/5 border-t border-white/5 flex justify-center">
          <div className="flex gap-2 items-center opacity-40">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-main"></div>
            <span className="text-[8px] font-black uppercase tracking-widest text-white">Quantum Encryption: ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
