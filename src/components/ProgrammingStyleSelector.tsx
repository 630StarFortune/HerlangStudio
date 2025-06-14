
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProgrammingStyle, MultiLanguageHerlangEngine } from '@/lib/multiLanguageEngine';
import { Code2, Coffee, Zap, Shield } from 'lucide-react';

interface ProgrammingStyleSelectorProps {
  currentStyle: ProgrammingStyle;
  onStyleChange: (style: ProgrammingStyle) => void;
}

const ProgrammingStyleSelector: React.FC<ProgrammingStyleSelectorProps> = ({
  currentStyle,
  onStyleChange
}) => {
  const engine = new MultiLanguageHerlangEngine();
  const styles = engine.getAvailableStyles();

  const getStyleIcon = (style: ProgrammingStyle) => {
    switch (style) {
      case 'chinese': return <Coffee className="w-4 h-4" />;
      case 'english': return <Code2 className="w-4 h-4" />;
      case 'python': return <Zap className="w-4 h-4" />;
      case 'rust': return <Shield className="w-4 h-4" />;
      default: return <Code2 className="w-4 h-4" />;
    }
  };

  const getStyleColor = (style: ProgrammingStyle) => {
    switch (style) {
      case 'chinese': return 'text-pink-400';
      case 'english': return 'text-blue-400';
      case 'python': return 'text-green-400';
      case 'rust': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Select value={currentStyle} onValueChange={onStyleChange}>
      <SelectTrigger className="w-40 bg-black/50 border-white/20 text-white">
        <div className="flex items-center gap-2">
          <span className={getStyleColor(currentStyle)}>
            {getStyleIcon(currentStyle)}
          </span>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-black/90 border-white/20">
        {styles.map((style) => (
          <SelectItem 
            key={style} 
            value={style}
            className="text-white hover:bg-white/10"
          >
            <div className="flex items-center gap-2">
              <span className={getStyleColor(style)}>
                {getStyleIcon(style)}
              </span>
              {engine.getStyleDisplayName(style)}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProgrammingStyleSelector;
