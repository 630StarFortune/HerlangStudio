
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TranslatorPanelProps {
  translatedCode: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

const TranslatorPanel: React.FC<TranslatorPanelProps> = ({
  translatedCode,
  isCollapsed,
  onToggle
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translatedCode);
      toast({
        title: t('copiedToClipboard'),
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 border-pink-200 transition-all duration-300 ${
      isCollapsed ? 'h-12' : 'h-48'
    }`}>
      <div className="flex items-center justify-between p-3 bg-pink-100 rounded-t-xl border-b-2 border-pink-200">
        <span 
          className="font-bold text-pink-600 cursor-pointer select-none text-lg"
          onClick={onToggle}
        >
          {t('translatorPanel')} {t('toggleTranslator')}
        </span>
        <Button
          onClick={copyToClipboard}
          size="sm"
          className="bg-pink-500 hover:bg-pink-600"
          disabled={!translatedCode}
        >
          <Copy size={16} className="mr-1" />
          {t('copyJS')}
        </Button>
      </div>
      
      {!isCollapsed && (
        <div className="h-40 p-3">
          <textarea
            value={translatedCode}
            readOnly
            placeholder={t('translatedPlaceholder')}
            className="w-full h-full resize-none border-none bg-gray-900 text-gray-100 font-mono text-sm p-3 rounded outline-none"
          />
        </div>
      )}
    </div>
  );
};

export default TranslatorPanel;
