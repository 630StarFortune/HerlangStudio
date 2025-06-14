
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSounds } from '@/hooks/useSounds';
import { Palette } from 'lucide-react';

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const { playSound } = useSounds();

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
    playSound('magic');
  };

  return (
    <div className="flex items-center gap-2">
      <Palette size={16} className="text-current" />
      <Select value={currentTheme.name} onValueChange={handleThemeChange}>
        <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-black/90 border-white/20">
          {availableThemes.map((themeName) => {
            const theme = require('@/contexts/ThemeContext').themes[themeName];
            return (
              <SelectItem 
                key={themeName} 
                value={themeName}
                className="text-white hover:bg-white/10"
              >
                {theme.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ThemeSelector;
