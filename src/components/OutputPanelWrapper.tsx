
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import OutputPanel from './OutputPanel';
import { Eraser } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface OutputItem {
  type: 'log' | 'warn' | 'error' | 'dragon';
  content: string;
  art?: string;
  timestamp: number;
}

interface OutputPanelWrapperProps {
  outputs: OutputItem[];
  onClear: () => void;
}

const OutputPanelWrapper: React.FC<OutputPanelWrapperProps> = ({ outputs, onClear }) => {
  const { t } = useTranslation();
  const { currentTheme } = useTheme();

  const cardStyle = {
    background: currentTheme.gradients.card,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${currentTheme.colors.primary}20`,
    boxShadow: `0 8px 32px ${currentTheme.colors.primary}20`
  };

  const buttonStyle = {
    background: currentTheme.gradients.button,
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    boxShadow: `0 4px 15px ${currentTheme.colors.primary}40`
  };

  return (
    <div 
      className="flex-1 rounded-xl flex flex-col transition-all duration-300 hover:scale-[1.02]"
      style={cardStyle}
    >
      <div 
        className="flex items-center justify-between p-4 rounded-t-xl border-b"
        style={{ 
          background: `linear-gradient(90deg, ${currentTheme.colors.secondary}20, ${currentTheme.colors.accent}20)`,
          borderColor: `${currentTheme.colors.secondary}30`
        }}
      >
        <span 
          className="font-bold text-lg"
          style={{ color: currentTheme.colors.text }}
        >
          {t('outputPanel')}
        </span>
        <Button
          onClick={onClear}
          size="sm"
          className="border-none transition-all hover:scale-110"
          style={buttonStyle}
        >
          <Eraser size={16} className="mr-2" />
          {t('clearOutput')}
        </Button>
      </div>
      <div className="flex-1 p-4">
        <OutputPanel outputs={outputs} onClear={onClear} />
      </div>
    </div>
  );
};

export default OutputPanelWrapper;
