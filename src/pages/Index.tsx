import React, { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/components/AppLayout';
import CodePanel from '@/components/CodePanel';
import OutputPanelWrapper from '@/components/OutputPanelWrapper';
import TranslatorPanel from '@/components/TranslatorPanel';
import ProgrammingStyleSelector from '@/components/ProgrammingStyleSelector';
import CodeCollaboration from '@/components/CodeCollaboration';
import { HerlangEngine } from '@/lib/herlangEngine';
import { MultiLanguageHerlangEngine } from '@/lib/multiLanguageEngine';
import { examples, ExampleKey } from '@/lib/examples';
import { multiLanguageExamples } from '@/lib/multiLanguageExamples';
import { useSounds } from '@/hooks/useSounds';
import { useCodeHistory } from '@/hooks/useCodeHistory';
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
  const [multiEngine] = useState(() => new MultiLanguageHerlangEngine());
  const [currentLanguage, setCurrentLanguage] = useState<'zh' | 'en'>('zh');
  const [programmingStyle, setProgrammingStyle] = useState<'herlang' | 'chinese' | 'english' | 'python' | 'rust'>('herlang');
  const [particleTrigger, setParticleTrigger] = useState(false);
  const [particleType, setParticleType] = useState<'success' | 'error' | 'code'>('success');
  const dragonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const executionRef = useRef<boolean>(false);

  const { history, currentIndex, saveToHistory, undo, redo, canUndo, canRedo } = useCodeHistory();

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
    // 防止重复执行
    if (executionRef.current) return;
    executionRef.current = true;

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
    } finally {
      // 重置执行标志
      setTimeout(() => {
        executionRef.current = false;
      }, 100);
    }
  }, [addOutput, playSound, playMelody]);

  const runCode = useCallback(() => {
    // 防止重复执行
    if (executionRef.current) return;
    
    clearOutput();
    
    if (!code.trim()) return;

    let jsCode = '';
    
    try {
      if (programmingStyle === 'herlang') {
        jsCode = herlangEngine.translateToJS(code);
      } else {
        jsCode = multiEngine.translateToJS(code);
      }
      
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
  }, [code, herlangEngine, multiEngine, programmingStyle, clearOutput, executeCode, addOutput, playSound]);

  const insertExample = useCallback((exampleKey: string) => {
    if (!exampleKey || executionRef.current) return;
    
    clearOutput();
    
    let exampleData;
    if (programmingStyle === 'herlang') {
      exampleData = examples[currentLanguage][exampleKey as ExampleKey];
    } else {
      exampleData = multiLanguageExamples[programmingStyle]?.[exampleKey];
    }
    
    if (exampleData) {
      setCode(exampleData.code);
      saveToHistory(exampleData.code);
      playSound('click');
      
      setTimeout(() => {
        try {
          let jsCode = '';
          if (programmingStyle === 'herlang') {
            jsCode = herlangEngine.translateToJS(exampleData.code);
          } else {
            jsCode = multiEngine.translateToJS(exampleData.code);
          }
          
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
      }, 200);
    }
  }, [currentLanguage, programmingStyle, herlangEngine, multiEngine, executeCode, addOutput, playSound, clearOutput, saveToHistory]);

  const handleLanguageChange = useCallback((lang: 'zh' | 'en') => {
    clearOutput();
    setCurrentLanguage(lang);
    herlangEngine.setLanguage(lang);
    playSound('magic');
    
    if (programmingStyle === 'herlang') {
      const defaultExample = examples[lang].dragon;
      setCode(defaultExample.code);
      saveToHistory(defaultExample.code);
      
      setTimeout(() => {
        try {
          const jsCode = herlangEngine.translateToJS(defaultExample.code);
          setTranslatedCode(jsCode);
          executeCode(jsCode);
        } catch (error) {
          console.error('Language change execution error:', error);
        }
      }, 200);
    }
  }, [herlangEngine, playSound, clearOutput, executeCode, programmingStyle, saveToHistory]);

  const handleProgrammingStyleChange = useCallback((style: 'herlang' | 'chinese' | 'english' | 'python' | 'rust') => {
    clearOutput();
    setProgrammingStyle(style);
    playSound('magic');
    
    let defaultExample;
    if (style === 'herlang') {
      defaultExample = examples[currentLanguage].dragon;
    } else {
      const styleExamples = multiLanguageExamples[style];
      defaultExample = styleExamples ? Object.values(styleExamples)[0] : null;
    }
    
    if (defaultExample) {
      setCode(defaultExample.code);
      saveToHistory(defaultExample.code);
      
      setTimeout(() => {
        try {
          let jsCode = '';
          if (style === 'herlang') {
            jsCode = herlangEngine.translateToJS(defaultExample.code);
          } else {
            jsCode = multiEngine.translateToJS(defaultExample.code);
          }
          
          setTranslatedCode(jsCode);
          executeCode(jsCode);
        } catch (error) {
          console.error('Programming style change execution error:', error);
        }
      }, 200);
    }
  }, [currentLanguage, herlangEngine, multiEngine, playSound, clearOutput, executeCode, saveToHistory]);

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
    saveToHistory(value);
  }, [saveToHistory]);

  const handleUndo = useCallback(() => {
    const previousCode = undo();
    if (previousCode !== undefined) {
      setCode(previousCode);
      playSound('click');
    }
  }, [undo, playSound]);

  const handleRedo = useCallback(() => {
    const nextCode = redo();
    if (nextCode !== undefined) {
      setCode(nextCode);
      playSound('click');
    }
  }, [redo, playSound]);

  const handleShare = useCallback(() => {
    const shareData = {
      code,
      language: currentLanguage,
      style: programmingStyle,
      timestamp: Date.now()
    };
    
    const shareUrl = `${window.location.origin}?shared=${encodeURIComponent(JSON.stringify(shareData))}`;
    navigator.clipboard.writeText(shareUrl);
    playSound('success');
    addOutput('log', '代码分享链接已复制到剪贴板！');
  }, [code, currentLanguage, programmingStyle, playSound, addOutput]);

  const handleImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        setCode(importedData.code || content);
        saveToHistory(importedData.code || content);
        
        if (importedData.language) {
          setCurrentLanguage(importedData.language);
        }
        if (importedData.style) {
          setProgrammingStyle(importedData.style);
        }
        
        playSound('success');
        addOutput('log', '代码导入成功！');
      } catch (error) {
        playSound('error');
        addOutput('error', '导入失败：文件格式不正确');
      }
    };
    reader.readAsText(file);
  }, [saveToHistory, playSound, addOutput]);

  const handleExport = useCallback(() => {
    const exportData = {
      code,
      language: currentLanguage,
      style: programmingStyle,
      timestamp: Date.now()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `herlang_code_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    playSound('success');
    addOutput('log', '代码导出成功！');
  }, [code, currentLanguage, programmingStyle, playSound, addOutput]);

  React.useEffect(() => {
    const defaultExample = examples[currentLanguage].dragon;
    setCode(defaultExample.code);
    saveToHistory(defaultExample.code);
    
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
      {/* Programming Style Selector */}
      <div className="mb-5">
        <ProgrammingStyleSelector 
          currentStyle={programmingStyle}
          onStyleChange={handleProgrammingStyleChange}
        />
      </div>

      {/* Code Collaboration */}
      <div className="mb-5">
        <CodeCollaboration
          onShare={handleShare}
          onImport={handleImport}
          onExport={handleExport}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
      </div>

      {/* Main Content */}
      <div className="flex gap-5 mb-5" style={{ height: '70vh' }}>
        <CodePanel
          code={code}
          onCodeChange={handleCodeChange}
          onRunCode={runCode}
          onExampleSelect={insertExample}
          onLanguageChange={handleLanguageChange}
          onType={() => playSound('type')}
          currentLanguage={currentLanguage}
          programmingStyle={programmingStyle}
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
