
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CodeEditor from './CodeEditor';
import LanguageSwitch from './LanguageSwitch';
import { Play } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { examples, ExampleKey } from '@/lib/examples';
import { multiLanguageExamples } from '@/lib/multiLanguageExamples';

interface CodePanelProps {
  code: string;
  onCodeChange: (value: string) => void;
  onRunCode: () => void;
  onExampleSelect: (exampleKey: string) => void;
  onLanguageChange: (lang: 'zh' | 'en') => void;
  onType: () => void;
  currentLanguage: 'zh' | 'en';
  programmingStyle: 'herlang' | 'chinese' | 'english' | 'python' | 'rust';
}

const CodePanel: React.FC<CodePanelProps> = ({
  code,
  onCodeChange,
  onRunCode,
  onExampleSelect,
  onLanguageChange,
  onType,
  currentLanguage,
  programmingStyle
}) => {
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

  // 根据编程样式获取示例
  const getExamples = () => {
    if (programmingStyle === 'herlang') {
      return examples[currentLanguage];
    } else {
      return multiLanguageExamples[programmingStyle] || {};
    }
  };

  const currentExamples = getExamples();

  return (
    <div 
      className="flex-1 rounded-xl flex flex-col transition-all duration-300 hover:scale-[1.02]"
      style={cardStyle}
    >
      <div 
        className="flex items-center justify-between p-4 rounded-t-xl border-b"
        style={{ 
          background: `linear-gradient(90deg, ${currentTheme.colors.primary}20, ${currentTheme.colors.secondary}20)`,
          borderColor: `${currentTheme.colors.primary}30`
        }}
      >
        <span 
          className="font-bold text-lg"
          style={{ color: currentTheme.colors.text }}
        >
          {t('codeEditor')}
        </span>
        <div className="flex items-center gap-3">
          <Select onValueChange={onExampleSelect}>
            <SelectTrigger 
              className="w-48 border-none text-white transition-all hover:scale-105"
              style={buttonStyle}
            >
              <SelectValue placeholder={t('examples')} />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/20">
              {Object.entries(currentExamples).map(([key, example]) => (
                <SelectItem 
                  key={key} 
                  value={key}
                  className="text-white hover:bg-white/10"
                >
                  {(example as { name: string }).name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {programmingStyle === 'herlang' && (
            <LanguageSwitch onLanguageChange={onLanguageChange} />
          )}
          
          <Button 
            onClick={onRunCode}
            className="text-white font-bold px-4 py-2 rounded-full transition-all hover:scale-110 hover:rotate-3 border-none"
            style={buttonStyle}
          >
            <Play size={16} className="mr-2 animate-pulse" />
            {t('runCode')}
          </Button>
        </div>
      </div>
      <div className="flex-1 p-4">
        <CodeEditor 
          value={code}
          onChange={(value) => {
            onCodeChange(value);
            onType();
          }}
          language={currentLanguage}
        />
      </div>
    </div>
  );
};

export default CodePanel;
