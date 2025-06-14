
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeSelector from './ThemeSelector';

const AppHeader: React.FC = () => {
  const { t } = useTranslation();
  const { currentTheme } = useTheme();

  return (
    <div className="text-center mb-6">
      <h1 
        className="text-5xl font-bold mb-4 drop-shadow-lg animate-pulse"
        style={{ 
          color: currentTheme.colors.text,
          textShadow: `0 0 20px ${currentTheme.colors.primary}80`
        }}
      >
        <Sparkles className="inline-block mr-2 animate-spin" />
        {t('title')}
        <Sparkles className="inline-block ml-2 animate-spin" />
      </h1>
      <div className="flex justify-center gap-4 mb-4">
        <ThemeSelector />
      </div>
    </div>
  );
};

export default AppHeader;
