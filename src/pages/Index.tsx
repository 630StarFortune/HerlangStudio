
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CodeEditor from '@/components/CodeEditor';
import OutputPanel from '@/components/OutputPanel';
import TranslatorPanel from '@/components/TranslatorPanel';
import LanguageSwitch from '@/components/LanguageSwitch';
import { HerlangEngine } from '@/lib/herlangEngine';
import { examples, ExampleKey } from '@/lib/examples';
import { Play, Eraser } from 'lucide-react';
import '../i18n';

interface OutputItem {
  type: 'log' | 'warn' | 'error' | 'dragon';
  content: string;
  art?: string;
  timestamp: number;
}

const Index = () => {
  const { t, i18n } = useTranslation();
  const [code, setCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  const [outputs, setOutputs] = useState<OutputItem[]>([]);
  const [isTranslatorCollapsed, setIsTranslatorCollapsed] = useState(true);
  const [herlangEngine] = useState(() => new HerlangEngine('zh'));
  const [currentLanguage, setCurrentLanguage] = useState<'zh' | 'en'>('zh');

  const addOutput = useCallback((type: OutputItem['type'], content: string, art?: string) => {
    setOutputs(prev => [...prev, {
      type,
      content,
      art,
      timestamp: Date.now()
    }]);
  }, []);

  const clearOutput = useCallback(() => {
    setOutputs([]);
  }, []);

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
          setTimeout(() => {
            addOutput('dragon', result.message, result.art);
          }, 2000);
          
          // Show dragon art immediately
          addOutput('dragon', '', result.art);
        },
        openBlindBox: () => {
          return HerlangEngine.builtins.openBlindBox();
        }
      });
    } catch (error) {
      addOutput('error', `执行错误: ${error}`);
    }
  }, [addOutput]);

  const runCode = useCallback(() => {
    clearOutput();
    
    if (!code.trim()) return;

    try {
      const jsCode = herlangEngine.translateToJS(code);
      setTranslatedCode(jsCode);
      executeCode(jsCode);
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
    }
  }, [code, herlangEngine, clearOutput, executeCode, addOutput]);

  const insertExample = useCallback((exampleKey: string) => {
    if (!exampleKey) return;
    
    const exampleData = examples[currentLanguage][exampleKey as ExampleKey];
    if (exampleData) {
      setCode(exampleData.code);
      // Auto-run the example
      setTimeout(() => runCode(), 100);
    }
  }, [currentLanguage, runCode]);

  const handleLanguageChange = useCallback((lang: 'zh' | 'en') => {
    setCurrentLanguage(lang);
    herlangEngine.setLanguage(lang);
    
    // Load default example for the new language
    const defaultExample = examples[lang].dragon;
    setCode(defaultExample.code);
  }, [herlangEngine]);

  // Load default example on mount
  React.useEffect(() => {
    const defaultExample = examples[currentLanguage].dragon;
    setCode(defaultExample.code);
    setTimeout(() => runCode(), 500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-5">
      <style>{`
        .panel-shadow {
          box-shadow: 0 4px 15px rgba(255, 105, 180, 0.2);
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-pink-600 mb-4 drop-shadow-lg">
            {t('title')}
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex gap-5 mb-5" style={{ height: '70vh' }}>
          {/* Left Panel - Code Editor */}
          <div className="flex-1 bg-white rounded-xl panel-shadow border-2 border-pink-200 flex flex-col">
            <div className="flex items-center justify-between p-4 bg-pink-100 rounded-t-xl border-b-2 border-pink-200">
              <span className="font-bold text-pink-600 text-lg">
                {t('codeEditor')}
              </span>
              <div className="flex items-center gap-3">
                <Select onValueChange={insertExample}>
                  <SelectTrigger className="w-48 bg-pink-500 text-white border-pink-600 hover:bg-pink-600">
                    <SelectValue placeholder={t('examples')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(examples[currentLanguage]).map(([key, example]) => (
                      <SelectItem key={key} value={key}>
                        {example.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <LanguageSwitch onLanguageChange={handleLanguageChange} />
                
                <Button 
                  onClick={runCode}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
                >
                  <Play size={16} className="mr-2" />
                  {t('runCode')}
                </Button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <CodeEditor 
                value={code}
                onChange={setCode}
                language={currentLanguage}
              />
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="flex-1 bg-white rounded-xl panel-shadow border-2 border-pink-200 flex flex-col">
            <div className="flex items-center justify-between p-4 bg-pink-100 rounded-t-xl border-b-2 border-pink-200">
              <span className="font-bold text-pink-600 text-lg">
                {t('outputPanel')}
              </span>
              <Button
                onClick={clearOutput}
                size="sm"
                className="bg-pink-500 hover:bg-pink-600"
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
        <TranslatorPanel
          translatedCode={translatedCode}
          isCollapsed={isTranslatorCollapsed}
          onToggle={() => setIsTranslatorCollapsed(!isTranslatorCollapsed)}
        />
      </div>
    </div>
  );
};

export default Index;
