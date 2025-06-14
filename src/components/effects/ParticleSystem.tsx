
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

type ParticleType = 'code' | 'star' | 'heart' | 'sparkle';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  type: ParticleType;
  size: number;
  color: string;
}

interface ParticleSystemProps {
  trigger?: boolean;
  type?: 'success' | 'error' | 'code' | 'ambient';
  intensity?: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  trigger, 
  type = 'ambient', 
  intensity = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();
  const { currentTheme } = useTheme();

  const particleTypes: ParticleType[] = ['code', 'star', 'heart', 'sparkle'];

  const createParticle = (x?: number, y?: number): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return {} as Particle;

    const colors = [
      currentTheme.colors.primary,
      currentTheme.colors.secondary,
      currentTheme.colors.accent
    ];

    return {
      id: Math.random(),
      x: x ?? Math.random() * canvas.width,
      y: y ?? Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 0,
      maxLife: 60 + Math.random() * 120,
      type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  };

  const updateParticles = () => {
    setParticles(prev => {
      const updated = prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life + 1,
        vy: particle.vy + 0.02 // gravity
      })).filter(particle => particle.life < particle.maxLife);

      // Add new particles for ambient effect
      if (type === 'ambient' && Math.random() < 0.02 * intensity) {
        updated.push(createParticle());
      }

      return updated;
    });
  };

  const drawParticles = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      const alpha = 1 - (particle.life / particle.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      
      // Draw different shapes based on type
      switch (particle.type) {
        case 'star':
          drawStar(ctx, particle.x, particle.y, particle.size);
          break;
        case 'heart':
          drawHeart(ctx, particle.x, particle.y, particle.size);
          break;
        case 'sparkle':
          drawSparkle(ctx, particle.x, particle.y, particle.size);
          break;
        default:
          ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      }
      
      ctx.restore();
    });
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const x1 = x + Math.cos(angle) * size;
      const y1 = y + Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.arc(x - size/2, y - size/2, size/2, 0, Math.PI * 2);
    ctx.arc(x + size/2, y - size/2, size/2, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.stroke();
  };

  const animate = () => {
    updateParticles();
    drawParticles();
    animationRef.current = requestAnimationFrame(animate);
  };

  // Handle trigger effect
  useEffect(() => {
    if (trigger && type !== 'ambient') {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const particleCount = Math.floor(20 * intensity);
      const newParticles = Array.from({ length: particleCount }, () => 
        createParticle(
          canvas.width / 2 + (Math.random() - 0.5) * 100,
          canvas.height / 2 + (Math.random() - 0.5) * 100
        )
      );
      
      setParticles(prev => [...prev, ...newParticles]);
    }
  }, [trigger, type, intensity]);

  // Setup canvas and animation
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
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentTheme.effects.particles]);

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
