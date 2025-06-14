
import React, { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/components/AppLayout';
import CodePanel from '@/components/CodePanel';
import OutputPanelWrapper from '@/components/OutputPanelWrapper';
import TranslatorPanel from '@/components/TranslatorPanel';
import { HerlangEngine } from '@/lib/herlangEngine';
import { examples, ExampleKey } from '@/lib/examples';
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
          
          if (dragonTimeoutRef.current) {
            clearTimeout(dragonTimeoutRef.current);
          }
          
          addOutput('dragon', '', result.art);
          playMelody([523, 659, 784, 1047]);
          
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
    
    clearOutput();
    
    const exampleData = examples[currentLanguage][exampleKey as ExampleKey];
    if (exampleData) {
      setCode(exampleData.code);
      playSound('click');
      
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
  }, []);

  return (
    <AppLayout particleTrigger={particleTrigger} particleType={particleType}>
      {/* Main Content */}
      <div className="flex gap-5 mb-5" style={{ height: '70vh' }}>
        <CodePanel
          code={code}
          onCodeChange={setCode}
          onRunCode={runCode}
          onExampleSelect={insertExample}
          onLanguageChange={handleLanguageChange}
          onType={() => playSound('type')}
          currentLanguage={currentLanguage}
        />
        
        <OutputPanelWrapper outputs={outputs} onClear={clearOutput} />
      </div>

      {/* Bottom Panel - Translator */}
      <div className="rounded-xl transition-all duration-300" style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <TranslatorPanel
          translatedCode={translatedCode}
          isCollapsed={isTranslatorCollapsed}
          onToggle={() => {
            setIsTranslatorCollapsed(!isTranslatorCollapsed);
            playSound('click');
          }}
        />
      </div>
    </AppLayout>
  );
};

export default Index;
