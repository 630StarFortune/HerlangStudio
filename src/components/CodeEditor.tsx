
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

  // 安全的文本转义函数
  const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // 安全地创建高亮元素
  const createHighlightElement = (text: string, className: string): HTMLSpanElement => {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text; // 使用 textContent 而不是 innerHTML
    return span;
  };

  // 应用魔法高亮 - 使用安全的DOM操作
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

    if (!highlightRef.current) return;

    // 清空容器
    highlightRef.current.innerHTML = '';
    
    const lines = text.split('\n');
    
    lines.forEach((line, lineIndex) => {
      const lineDiv = document.createElement('div');
      let remainingText = line;
      let lastIndex = 0;

      // 查找并处理关键词
      Object.entries(highlights).forEach(([keyword, className]) => {
        const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g');
        let match;
        const matches: Array<{index: number, length: number, keyword: string, className: string}> = [];
        
        while ((match = regex.exec(remainingText)) !== null) {
          matches.push({
            index: match.index,
            length: match[0].length,
            keyword: match[0],
            className
          });
        }

        // 按位置排序匹配项
        matches.sort((a, b) => a.index - b.index);
        
        // 重建行内容
        if (matches.length > 0) {
          let newContent = '';
          let currentIndex = 0;
          
          matches.forEach(match => {
            // 添加匹配前的普通文本
            if (match.index > currentIndex) {
              const textNode = document.createTextNode(remainingText.substring(currentIndex, match.index));
              lineDiv.appendChild(textNode);
            }
            
            // 添加高亮的关键词
            const highlightSpan = createHighlightElement(match.keyword, match.className);
            lineDiv.appendChild(highlightSpan);
            
            currentIndex = match.index + match.length;
          });
          
          // 添加剩余的普通文本
          if (currentIndex < remainingText.length) {
            const textNode = document.createTextNode(remainingText.substring(currentIndex));
            lineDiv.appendChild(textNode);
          }
          
          remainingText = lineDiv.textContent || '';
        }
      });

      // 如果没有匹配项，直接添加文本
      if (lineDiv.childNodes.length === 0) {
        lineDiv.textContent = line;
      }

      highlightRef.current?.appendChild(lineDiv);
    });
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
    applyMagicHighlighting(value);
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
