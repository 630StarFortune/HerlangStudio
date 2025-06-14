
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import ParticleSystem from './effects/ParticleSystem';
import AppHeader from './AppHeader';

interface AppLayoutProps {
  children: React.ReactNode;
  particleTrigger: boolean;
  particleType: 'success' | 'error' | 'code';
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, particleTrigger, particleType }) => {
  const { currentTheme } = useTheme();

  const backgroundStyle = {
    background: currentTheme.gradients.main,
    minHeight: '100vh'
  };

  return (
    <div style={backgroundStyle} className="relative">
      <ParticleSystem type="ambient" intensity={0.5} />
      <ParticleSystem 
        trigger={particleTrigger} 
        type={particleType}
        intensity={1.5}
      />
      
      <div className="min-h-screen p-5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <AppHeader />
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
