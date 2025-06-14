
import React, { useRef, useEffect, useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'zh' | 'en';
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);

  // 更新行号
  useEffect(() => {
    const lines = value.split('\n');
    setLineNumbers(Array.from({ length: lines.length }, (_, i) => i + 1));
  }, [value]);

  // 应用魔法高亮
  const applyMagicHighlighting = (text: string) => {
    const highlights = language === 'zh' ? {
      '那么普通却那么自信': 'herlang-rainbow',
      '小仙女': 'herlang-shining', 
      '哼': 'herlang-shake',
      '下头': 'herlang-shake',
    } : {
      'so ordinary yet so confident': 'herlang-rainbow',
      'fairy': 'herlang-shining',
      'hmph': 'herlang-shake', 
      'give up': 'herlang-shake',
    };

    let highlightedText = text;
    
    // 转义HTML字符
    highlightedText = highlightedText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    // 应用关键词高亮
    Object.entries(highlights).forEach(([keyword, className]) => {
      const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g');
      highlightedText = highlightedText.replace(
        regex, 
        `<span class="${className}">$1</span>`
      );
    });

    // 保留换行符
    highlightedText = highlightedText.replace(/\n/g, '<br>');

    return highlightedText;
  };

  // 同步滚动
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // 更新高亮显示
  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.innerHTML = applyMagicHighlighting(value);
    }
  }, [value, language]);

  return (
    <div className="h-full relative">
      <style>{`
        .herlang-rainbow {
          background: linear-gradient(to right, #ffadad, #ffd6a5, #fdffb6, #caffbf, #9bf6ff, #a0c4ff, #bdb2ff, #ffc6ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: bold;
        }
        .herlang-shining {
          text-shadow: 0 0 5px #ff69b4, 0 0 10px #ff69b4;
          color: #fff;
        }
        .herlang-shake {
          display: inline-block;
          animation: shake 0.5s infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        .code-editor-container {
          position: relative;
          height: 100%;
          background: #282a36;
          border-radius: 0 0 10px 10px;
          overflow: hidden;
        }
        .line-numbers {
          position: absolute;
          left: 0;
          top: 0;
          width: 50px;
          height: 100%;
          background: #44475a;
          color: #6272a4;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 16px;
          line-height: 24px;
          padding: 16px 8px;
          border-right: 1px solid #6272a4;
          user-select: none;
          overflow: hidden;
        }
        .code-textarea {
          position: absolute;
          left: 50px;
          top: 0;
          right: 0;
          bottom: 0;
          background: transparent;
          color: #f8f8f2;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 16px;
          line-height: 24px;
          padding: 16px;
          border: none;
          outline: none;
          resize: none;
          z-index: 2;
          white-space: pre;
          overflow-wrap: normal;
          overflow-x: auto;
        }
        .code-highlight {
          position: absolute;
          left: 50px;
          top: 0;
          right: 0;
          bottom: 0;
          color: #f8f8f2;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 16px;
          line-height: 24px;
          padding: 16px;
          pointer-events: none;
          z-index: 1;
          white-space: pre;
          overflow-wrap: normal;
          overflow: auto;
        }
      `}</style>
      
      <div className="code-editor-container">
        <div className="line-numbers">
          {lineNumbers.map(num => (
            <div key={num}>{num}</div>
          ))}
        </div>
        
        <div 
          ref={highlightRef}
          className="code-highlight"
        />
        
        <textarea
          ref={textareaRef}
          className="code-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          data-gramm="false"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
