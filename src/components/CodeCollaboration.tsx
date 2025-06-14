
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share, Download, Upload, Undo, Redo } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface CodeCollaborationProps {
  onShare: () => void;
  onImport: (file: File) => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

const CodeCollaboration: React.FC<CodeCollaborationProps> = ({
  onShare,
  onImport,
  onExport,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) => {
  const { currentTheme } = useTheme();

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      event.target.value = '';
    }
  };

  const buttonStyle = {
    background: currentTheme.gradients.button,
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    boxShadow: `0 4px 15px ${currentTheme.colors.primary}40`
  };

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl" style={{
      background: currentTheme.gradients.card,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${currentTheme.colors.primary}20`,
      boxShadow: `0 8px 32px ${currentTheme.colors.primary}20`
    }}>
      <Button
        onClick={onUndo}
        disabled={!canUndo}
        className="text-white font-bold px-3 py-2 rounded-full transition-all hover:scale-110 border-none disabled:opacity-50"
        style={buttonStyle}
      >
        <Undo size={16} />
      </Button>
      
      <Button
        onClick={onRedo}
        disabled={!canRedo}
        className="text-white font-bold px-3 py-2 rounded-full transition-all hover:scale-110 border-none disabled:opacity-50"
        style={buttonStyle}
      >
        <Redo size={16} />
      </Button>
      
      <Button
        onClick={onShare}
        className="text-white font-bold px-4 py-2 rounded-full transition-all hover:scale-110 border-none"
        style={buttonStyle}
      >
        <Share size={16} className="mr-2" />
        分享
      </Button>
      
      <Button
        onClick={onExport}
        className="text-white font-bold px-4 py-2 rounded-full transition-all hover:scale-110 border-none"
        style={buttonStyle}
      >
        <Download size={16} className="mr-2" />
        导出
      </Button>
      
      <div className="relative">
        <input
          type="file"
          accept=".json"
          onChange={handleFileImport}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <Button
          className="text-white font-bold px-4 py-2 rounded-full transition-all hover:scale-110 border-none"
          style={buttonStyle}
        >
          <Upload size={16} className="mr-2" />
          导入
        </Button>
      </div>
    </div>
  );
};

export default CodeCollaboration;
