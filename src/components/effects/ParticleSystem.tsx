
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  type: 'star' | 'code' | 'heart' | 'sparkle';
}

interface ParticleSystemProps {
  trigger?: boolean;
  type?: 'success' | 'error' | 'code' | 'ambient';
  intensity?: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  trigger = false, 
  type = 'ambient',
  intensity = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const { currentTheme } = useTheme();

  const createParticle = (x?: number, y?: number): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return {} as Particle;

    const colors = {
      success: [currentTheme.colors.accent, currentTheme.colors.primary],
      error: ['#ff4757', '#ff3742'],
      code: [currentTheme.colors.primary, currentTheme.colors.secondary],
      ambient: [currentTheme.colors.primary, currentTheme.colors.secondary, currentTheme.colors.accent]
    };

    const particleTypes: Array<Particle['type']> = {
      success: ['star', 'sparkle'],
      error: ['sparkle'],
      code: ['code', 'sparkle'],
      ambient: ['star', 'sparkle', 'heart']
    }[type];

    return {
      x: x ?? Math.random() * canvas.width,
      y: y ?? Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 4 * intensity,
      vy: (Math.random() - 0.5) * 4 * intensity,
      size: Math.random() * 6 + 2,
      life: 1,
      maxLife: Math.random() * 60 + 30,
      color: colors[type][Math.floor(Math.random() * colors[type].length)],
      type: particleTypes[Math.floor(Math.random() * particleTypes.length)]
    };
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    const alpha = particle.life / particle.maxLife;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.color;
    ctx.translate(particle.x, particle.y);

    switch (particle.type) {
      case 'star':
        drawStar(ctx, particle.size);
        break;
      case 'heart':
        drawHeart(ctx, particle.size);
        break;
      case 'code':
        drawCodeSymbol(ctx, particle.size);
        break;
      case 'sparkle':
        drawSparkle(ctx, particle.size);
        break;
    }
    ctx.restore();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const x = Math.cos(angle) * size;
      const y = Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);
    ctx.bezierCurveTo(-size * 0.5, -size * 0.2, -size, -size * 0.2, -size * 0.5, size * 0.3);
    ctx.bezierCurveTo(-size * 0.5, size * 0.8, 0, size, 0, size);
    ctx.bezierCurveTo(0, size, size * 0.5, size * 0.8, size * 0.5, size * 0.3);
    ctx.bezierCurveTo(size, -size * 0.2, size * 0.5, -size * 0.2, 0, size * 0.3);
    ctx.fill();
  };

  const drawCodeSymbol = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.font = `${size}px monospace`;
    ctx.textAlign = 'center';
    const symbols = ['<', '>', '{', '}', '(', ')', ';', '='];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    ctx.fillText(symbol, 0, size / 2);
  };

  const drawSparkle = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Add sparkle effect
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-size * 1.5, 0);
    ctx.lineTo(size * 1.5, 0);
    ctx.moveTo(0, -size * 1.5);
    ctx.lineTo(0, size * 1.5);
    ctx.stroke();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 1;
      
      drawParticle(ctx, particle);
      
      return particle.life > 0;
    });

    // Add new ambient particles
    if (type === 'ambient' && Math.random() < 0.02 * intensity) {
      particlesRef.current.push(createParticle());
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (currentTheme.effects.particles) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentTheme.effects.particles, type, intensity]);

  useEffect(() => {
    if (trigger && type !== 'ambient') {
      // Create burst of particles
      const canvas = canvasRef.current;
      if (!canvas) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      for (let i = 0; i < 20 * intensity; i++) {
        particlesRef.current.push(createParticle(centerX, centerY));
      }
    }
  }, [trigger, type, intensity]);

  if (!currentTheme.effects.particles) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default ParticleSystem;
