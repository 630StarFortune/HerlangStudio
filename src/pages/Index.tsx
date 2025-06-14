import React, { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CodeEditor from '@/components/CodeEditor';
import OutputPanel from '@/components/OutputPanel';
import TranslatorPanel from '@/components/TranslatorPanel';
import LanguageSwitch from '@/components/LanguageSwitch';
import ThemeSelector from '@/components/ThemeSelector';
import ParticleSystem from '@/components/effects/ParticleSystem';
import { HerlangEngine } from '@/lib/herlangEngine';
import { examples, ExampleKey } from '@/lib/examples';
import { Play, Eraser, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSounds } from '@/hooks/useSounds';
import '../i18n';

interface OutputItem {
  type: 'log' | 'warn' | 'error' | 'dragon';
  content: string;
  art?: string;
  timestamp: number;
}

const Index = () => {
  const { t, i18n } = useTranslation();
  const { currentTheme } = useTheme();
  const { playSound, playMelody } = useSounds();
  const [code, setCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  const [outputs, setOutputs] = useState<OutputItem[]>([]);
  const [isTranslatorCollapsed, setIsTranslatorCollapsed] = useState(true);
  const [herlangEngine] = useState(() => new HerlangEngine('zh'));
  const [currentLanguage, setCurrentLanguage] = useState<'zh' | 'en'>('zh');
  const [particleTrigger, setParticleTrigger] = useState(false);
  const [particleType, setParticleType] = useState<'success' | 'error' | 'code'>('success');
  const dragonTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addOutput = useCallback((type: OutputItem['type'], content: string, art?: string) => {
    setOutputs(prev => [...prev, {
      type,
      content,
      art,
      timestamp: Date.now()
    }]);
  }, []);

  const clearOutput = useCallback(() => {
    // Clear any pending dragon timeouts
    if (dragonTimeoutRef.current) {
      clearTimeout(dragonTimeoutRef.current);
      dragonTimeoutRef.current = null;
    }
    setOutputs([]);
    playSound('click');
  }, [playSound]);

  const executeCode = useCallback((jsCode: string) => {
    const interceptedConsole = {
      log: (...args: any[]) => {
        addOutput('log', args.join(' '));
      },
      warn: (...args: any[]) => {
        addOutput('warn', args.join(' '));
      }
    };

    try {
      const safeRunner = new Function('console', 'herlang', jsCode);
      safeRunner(interceptedConsole, {
        summonDragon: (wish: string) => {
          const result = HerlangEngine.builtins.summonDragon(wish);
          
          // Clear any existing dragon timeout
          if (dragonTimeoutRef.current) {
            clearTimeout(dragonTimeoutRef.current);
          }
          
          // Show dragon art immediately
          addOutput('dragon', '', result.art);
          playMelody([523, 659, 784, 1047]); // C-E-G-C melody
          
          // Show dragon message after delay
          dragonTimeoutRef.current = setTimeout(() => {
            addOutput('dragon', result.message);
            playSound('dragon');
            setParticleType('success');
            setParticleTrigger(prev => !prev);
            dragonTimeoutRef.current = null;
          }, 2000);
        },
        openBlindBox: () => {
          const result = HerlangEngine.builtins.openBlindBox();
          addOutput('log', `今日盲盒开出了： ${result}`);
          playSound('magic');
          return result;
        }
      });
    } catch (error) {
      addOutput('error', `执行错误: ${error}`);
      playSound('error');
      setParticleType('error');
      setParticleTrigger(prev => !prev);
    }
  }, [addOutput, playSound, playMelody]);

  const runCode = useCallback(() => {
    clearOutput();
    
    if (!code.trim()) return;

    try {
      const jsCode = herlangEngine.translateToJS(code);
      setTranslatedCode(jsCode);
      executeCode(jsCode);
      playSound('success');
      setParticleType('success');
      setParticleTrigger(prev => !prev);
    } catch (error: any) {
      let errorMessage = error.message;
      const match = errorMessage.match(/\((\d+):(\d+)\)/);
      
      if (match) {
        const [, line, char] = match;
        errorMessage = `🧨 小仙女在第 ${line} 行第 ${char} 个字卡住了！\n她好像不认识这个符号哦，是不是写错了呀？\n\nBabel说: ${error.message}`;
      } else {
        errorMessage = `🧨 小仙女炸了！\n${error.message}`;
      }
      
      addOutput('error', errorMessage);
      playSound('error');
      setParticleType('error');
      setParticleTrigger(prev => !prev);
    }
  }, [code, herlangEngine, clearOutput, executeCode, addOutput, playSound]);

  const insertExample = useCallback((exampleKey: string) => {
    if (!exampleKey) return;
    
    // Clear output first when switching examples
    clearOutput();
    
    const exampleData = examples[currentLanguage][exampleKey as ExampleKey];
    if (exampleData) {
      setCode(exampleData.code);
      playSound('click');
      
      // Run the new code after a short delay to ensure state is updated
      setTimeout(() => {
        try {
          const jsCode = herlangEngine.translateToJS(exampleData.code);
          setTranslatedCode(jsCode);
          executeCode(jsCode);
          playSound('success');
          setParticleType('success');
          setParticleTrigger(prev => !prev);
        } catch (error: any) {
          let errorMessage = error.message;
          const match = errorMessage.match(/\((\d+):(\d+)\)/);
          
          if (match) {
            const [, line, char] = match;
            errorMessage = `🧨 小仙女在第 ${line} 行第 ${char} 个字卡住了！\n她好像不认识这个符号哦，是不是写错了呀？\n\nBabel说: ${error.message}`;
          } else {
            errorMessage = `🧨 小仙女炸了！\n${error.message}`;
          }
          
          addOutput('error', errorMessage);
          playSound('error');
          setParticleType('error');
          setParticleTrigger(prev => !prev);
        }
      }, 100);
    }
  }, [currentLanguage, herlangEngine, executeCode, addOutput, playSound, clearOutput]);

  const handleLanguageChange = useCallback((lang: 'zh' | 'en') => {
    clearOutput();
    setCurrentLanguage(lang);
    herlangEngine.setLanguage(lang);
    playSound('magic');
    
    const defaultExample = examples[lang].dragon;
    setCode(defaultExample.code);
    
    // Run the default example after language change
    setTimeout(() => {
      try {
        const jsCode = herlangEngine.translateToJS(defaultExample.code);
        setTranslatedCode(jsCode);
        executeCode(jsCode);
      } catch (error) {
        console.error('Language change execution error:', error);
      }
    }, 100);
  }, [herlangEngine, playSound, clearOutput, executeCode]);

  // Load default example on mount - only once
  React.useEffect(() => {
    const defaultExample = examples[currentLanguage].dragon;
    setCode(defaultExample.code);
    
    const timeoutId = setTimeout(() => {
      try {
        const jsCode = herlangEngine.translateToJS(defaultExample.code);
        setTranslatedCode(jsCode);
        executeCode(jsCode);
      } catch (error) {
        console.error('Initial load execution error:', error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array to run only once

  const backgroundStyle = {
    background: currentTheme.gradients.main,
    minHeight: '100vh'
  };

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
    <div style={backgroundStyle} className="relative">
      <ParticleSystem type="ambient" intensity={0.5} />
      <ParticleSystem 
        trigger={particleTrigger} 
        type={particleType}
        intensity={1.5}
      />
      
      <div className="min-h-screen p-5 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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

          {/* Main Content */}
          <div className="flex gap-5 mb-5" style={{ height: '70vh' }}>
            {/* Left Panel - Code Editor */}
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
                  <Select onValueChange={insertExample}>
                    <SelectTrigger 
                      className="w-48 border-none text-white transition-all hover:scale-105"
                      style={buttonStyle}
                    >
                      <SelectValue placeholder={t('examples')} />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      {Object.entries(examples[currentLanguage]).map(([key, example]) => (
                        <SelectItem 
                          key={key} 
                          value={key}
                          className="text-white hover:bg-white/10"
                        >
                          {example.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <LanguageSwitch onLanguageChange={handleLanguageChange} />
                  
                  <Button 
                    onClick={runCode}
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
                    setCode(value);
                    playSound('type');
                  }}
                  language={currentLanguage}
                />
              </div>
            </div>

            {/* Right Panel - Output */}
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
                  onClick={clearOutput}
                  size="sm"
                  className="border-none transition-all hover:scale-110"
                  style={buttonStyle}
                >
                  <Eraser size={16} className="mr-2" />
                  {t('clearOutput')}
                </Button>
              </div>
              <div className="flex-1 p-4">
                <OutputPanel outputs={outputs} onClear={clearOutput} />
              </div>
            </div>
          </div>

          {/* Bottom Panel - Translator */}
          <div style={cardStyle} className="rounded-xl transition-all duration-300">
            <TranslatorPanel
              translatedCode={translatedCode}
              isCollapsed={isTranslatorCollapsed}
              onToggle={() => {
                setIsTranslatorCollapsed(!isTranslatorCollapsed);
                playSound('click');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
