
import React, { useEffect, useRef } from 'react';

interface OutputItem {
  type: 'log' | 'warn' | 'error' | 'dragon';
  content: string;
  art?: string;
  timestamp: number;
}

interface OutputPanelProps {
  outputs: OutputItem[];
  onClear: () => void;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ outputs, onClear }) => {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputs]);

  const renderOutput = (output: OutputItem) => {
    switch (output.type) {
      case 'log':
        return (
          <div key={output.timestamp} className="magic-output text-green-400 animate-fade-in">
            🪄 {output.content}
          </div>
        );
      case 'warn':
        return (
          <div key={output.timestamp} className="magic-output text-orange-400 animate-fade-in">
            ⚠️ {output.content}
          </div>
        );
      case 'error':
        return (
          <div key={output.timestamp} className="error-message border-l-4 border-red-500 bg-red-50 p-3 rounded animate-fade-in">
            🧨 {output.content}
          </div>
        );
      case 'dragon':
        return (
          <div key={output.timestamp} className="animate-fade-in">
            {output.art && (
              <pre className="dragon-ascii text-green-400 text-xs font-mono text-center mb-2 animate-pulse">
                {output.art}
              </pre>
            )}
            <div className="magic-output text-purple-400">
              {output.content}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <style>{`
        .magic-output {
          animation: fadeIn 0.5s;
          margin-bottom: 8px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dragon-ascii {
          line-height: 1;
        }
      `}</style>
      
      <div 
        ref={outputRef}
        className="flex-1 overflow-y-auto font-mono text-sm whitespace-pre-wrap break-words bg-gray-900 text-gray-100 p-4 rounded"
      >
        {outputs.length === 0 ? (
          <div className="text-gray-500 italic">运行代码后，结果会在这里显示...</div>
        ) : (
          outputs.map(renderOutput)
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
