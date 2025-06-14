
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  effects: {
    particles: boolean;
    sounds: boolean;
    animations: boolean;
  };
  gradients: {
    main: string;
    card: string;
    button: string;
  };
}

export const themes: Record<string, Theme> = {
  starlight: {
    name: '✨ 星光幻境',
    colors: {
      primary: '#ff69b4',
      secondary: '#9d4edd',
      accent: '#ffd700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: 'rgba(255, 255, 255, 0.1)',
      text: '#ffffff',
      textSecondary: '#e0e7ff'
    },
    effects: {
      particles: true,
      sounds: true,
      animations: true
    },
    gradients: {
      main: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      card: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      button: 'linear-gradient(45deg, #ff69b4 0%, #9d4edd 100%)'
    }
  },
  cyberpunk: {
    name: '🌃 赛博朋克',
    colors: {
      primary: '#00ffff',
      secondary: '#ff0080',
      accent: '#ffff00',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a0033 100%)',
      surface: 'rgba(0, 255, 255, 0.1)',
      text: '#00ffff',
      textSecondary: '#ff0080'
    },
    effects: {
      particles: true,
      sounds: true,
      animations: true
    },
    gradients: {
      main: 'linear-gradient(135deg, #0f0f23 0%, #1a0033 100%)',
      card: 'linear-gradient(145deg, rgba(0,255,255,0.1) 0%, rgba(255,0,128,0.05) 100%)',
      button: 'linear-gradient(45deg, #00ffff 0%, #ff0080 100%)'
    }
  },
  sunset: {
    name: '🌅 日落余晖',
    colors: {
      primary: '#ff6b6b',
      secondary: '#feca57',
      accent: '#ff9ff3',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      surface: 'rgba(255, 255, 255, 0.2)',
      text: '#2d3436',
      textSecondary: '#636e72'
    },
    effects: {
      particles: true,
      sounds: true,
      animations: true
    },
    gradients: {
      main: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      card: 'linear-gradient(145deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
      button: 'linear-gradient(45deg, #ff6b6b 0%, #feca57 100%)'
    }
  }
};

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentThemeName, setCurrentThemeName] = useState('starlight');
  const currentTheme = themes[currentThemeName];

  const setTheme = (themeName: string) => {
    if (themes[themeName]) {
      setCurrentThemeName(themeName);
      localStorage.setItem('herlang-theme', themeName);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('herlang-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentThemeName(savedTheme);
    }
  }, []);

  // Apply CSS variables to document
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme,
      availableThemes: Object.keys(themes)
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
