
import React, { useEffect, useRef, useState } from 'react';

// Bioluminescent Atlantis Fish
class AtlantisFish {
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  phase: number;
  tailPhase: number;
  depth: number;
  color: string;
  glow: string;
  isReacting: number = 0;

  constructor(w: number, h: number, index: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (0.2 + Math.random() * 0.4) * (index % 2 === 0 ? 1 : -1);
    this.vy = (Math.random() - 0.5) * 0.15;
    this.scale = 0.3 + Math.random() * 0.4;
    this.phase = Math.random() * Math.PI * 2;
    this.tailPhase = Math.random() * Math.PI * 2;
    this.depth = 0.1 + (Math.random() * 0.9);
    
    const palettes = [
      { body: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.4)' },
      { body: '#7dd3fc', glow: 'rgba(125, 211, 252, 0.4)' },
      { body: '#B5944E', glow: 'rgba(181, 148, 78, 0.4)' }
    ];
    const p = palettes[index % palettes.length];
    this.color = p.body;
    this.glow = p.glow;
  }

  update(w: number, h: number, time: number, pulses: {x: number, y: number, r: number}[]) {
    this.isReacting *= 0.96;
    
    // React to sonar pulses (Acoustic Startle Response)
    pulses.forEach(p => {
      const dx = p.x - this.x;
      const dy = p.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 300 && Math.abs(dist - p.r) < 50) {
        this.isReacting = 1.0;
        const force = (1 - dist / 300) * 2;
        this.vx -= (dx / dist) * force;
        this.vy -= (dy / dist) * force;
      }
    });

    this.x += this.vx * (1 + this.isReacting * 2);
    this.y += this.vy;

    // Gentle vertical drift
    this.y += Math.sin(time * 0.01 + this.phase) * 0.1;

    if (this.x > w + 200) this.x = -200;
    if (this.x < -200) this.x = w + 200;
    if (this.y > h + 200) this.y = -200;
    if (this.y < -200) this.y = h + 200;
  }

  draw(ctx: CanvasRenderingContext2D, time: number) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.vx > 0 ? this.scale : -this.scale, this.scale);
    ctx.globalAlpha = this.depth * 0.7;

    // Bioluminescent Bloom
    const bloom = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
    bloom.addColorStop(0, this.glow);
    bloom.addColorStop(1, 'transparent');
    ctx.fillStyle = bloom;
    ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.fill();

    // Fish Body (Procedural Path)
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail Fin (Animated)
    const tailSway = Math.sin(time * 0.1 + this.tailPhase) * 10;
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(-28, tailSway - 12);
    ctx.lineTo(-24, tailSway);
    ctx.lineTo(-28, tailSway + 12);
    ctx.closePath();
    ctx.fill();

    // Dorsal Fin
    ctx.beginPath();
    ctx.moveTo(-5, -6);
    ctx.quadraticCurveTo(5, -15, 10, -4);
    ctx.fill();

    ctx.restore();
  }
}

// Physically-based Bubble / Particle
class DeepMarineParticle {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  speed: number;
  wobble: number;
  type: 'bubble' | 'flake';

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.z = Math.random(); // Depth layer
    this.type = Math.random() > 0.8 ? 'bubble' : 'flake';
    this.size = (this.type === 'bubble' ? 2 + Math.random() * 4 : 1 + Math.random() * 2) * (0.5 + this.z);
    this.opacity = (0.1 + Math.random() * 0.3) * this.z;
    this.speed = (0.1 + Math.random() * 0.4) * (0.5 + this.z);
    this.wobble = Math.random() * Math.PI * 2;
  }

  update(w: number, h: number, time: number) {
    this.y -= this.speed;
    this.x += Math.sin(time * 0.01 + this.wobble) * 0.2;
    if (this.y < -this.size) {
      this.y = h + this.size;
      this.x = Math.random() * w;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.type === 'bubble' ? 'rgba(255, 255, 255, 0.4)' : '#7dd3fc';
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    if (this.type === 'bubble') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
    ctx.restore();
  }
}

const OceanBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sonarPulses = useRef<{x: number, y: number, r: number, o: number}[]>([]);
  const particles = useRef<DeepMarineParticle[]>([]);
  const marineLife = useRef<AtlantisFish[]>([]);
  
  const isDaytime = () => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    if (particles.current.length === 0) {
      particles.current = Array.from({ length: 80 }, () => new DeepMarineParticle(width, height))
                            .sort((a, b) => a.z - b.z);
      marineLife.current = Array.from({ length: 15 }, (_, i) => new AtlantisFish(width, height, i))
                            .sort((a, b) => a.depth - b.depth);
    }

    const lightBeams = Array.from({ length: 6 }, () => ({
      x: Math.random() * width,
      width: 200 + Math.random() * 400,
      opacity: isDaytime() ? 0.1 : 0.03,
      speed: 0.0003 + Math.random() * 0.0004,
      phase: Math.random() * Math.PI * 2
    }));

    let time = 0;

    const render = () => {
      time++;
      
      // 1. Atlantis Ocean Depth Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isDaytime()) {
        bgGrad.addColorStop(0, '#001b2e');   // Deepest Surface
        bgGrad.addColorStop(0.4, '#0ea5e9'); // Mid-Water Azure
        bgGrad.addColorStop(0.8, '#004e64'); // Abyssal Turquoise
        bgGrad.addColorStop(1, '#020617');   // Deepest Abyssal Floor
      } else {
        bgGrad.addColorStop(0, '#020617');
        bgGrad.addColorStop(1, '#000c14');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Ancient Caustics
      ctx.save();
      ctx.globalAlpha = isDaytime() ? 0.05 : 0.02;
      ctx.globalCompositeOperation = 'overlay';
      for(let i = 0; i < 3; i++) {
          const shift = Math.sin(time * 0.005 + i) * 50;
          ctx.fillStyle = '#fff';
          for(let x = -200; x < width + 200; x += 150) {
              ctx.beginPath();
              ctx.ellipse(x + shift, height - 150, 100, 30, 0, 0, Math.PI * 2);
              ctx.fill();
          }
      }
      ctx.restore();

      // 3. Cinematic God Rays
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      lightBeams.forEach(b => {
        const sway = Math.sin(time * b.speed + b.phase) * 120;
        const beamGrad = ctx.createLinearGradient(b.x + sway, 0, b.x + sway - 200, height);
        beamGrad.addColorStop(0, isDaytime() ? `rgba(255, 255, 255, ${b.opacity})` : `rgba(181, 148, 78, ${b.opacity})`);
        beamGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(b.x + sway, 0);
        ctx.lineTo(b.x + sway + b.width, 0);
        ctx.lineTo(b.x + sway + b.width - 400, height);
        ctx.lineTo(b.x + sway - 400, height);
        ctx.fill();
      });
      ctx.restore();

      // 4. Underwater Particles (Bubbles & Marine Snow)
      particles.current.forEach(p => {
        p.update(width, height, time);
        p.draw(ctx);
      });

      // 5. Marine Life (Fish)
      marineLife.current.forEach(fish => {
        fish.update(width, height, time, sonarPulses.current);
        fish.draw(ctx, time);
      });

      // 6. Sonic Echo Ripples
      for (let i = sonarPulses.current.length - 1; i >= 0; i--) {
        const p = sonarPulses.current[i];
        p.r += 4; p.o -= 0.015;
        if (p.o <= 0) { sonarPulses.current.splice(i, 1); continue; }
        
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.o * 0.4})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([10, 20]);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
        
        ctx.strokeStyle = `rgba(181, 148, 78, ${p.o * 0.3})`;
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.8, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }

      // 7. Deep Sea Fog Layer
      const fog = ctx.createLinearGradient(0, 0, 0, height);
      fog.addColorStop(0, 'rgba(0, 27, 46, 0.1)');
      fog.addColorStop(1, 'rgba(2, 6, 23, 0.4)');
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, width, height);

      animationFrame = requestAnimationFrame(render);
    };

    let animationFrame = requestAnimationFrame(render);
    
    const handleMouseDown = (e: MouseEvent) => { 
      sonarPulses.current.push({ x: e.clientX, y: e.clientY, r: 0, o: 1.0 }); 
    };

    const handleResize = () => { 
      width = window.innerWidth; height = window.innerHeight; 
      canvas.width = width; canvas.height = height; 
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('resize', handleResize);
    return () => { 
      cancelAnimationFrame(animationFrame); 
      window.removeEventListener('mousedown', handleMouseDown); 
      window.removeEventListener('resize', handleResize); 
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#001b2e]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)] pointer-events-none"></div>
    </div>
  );
};

export default OceanBackground;
