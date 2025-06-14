
import React, { useEffect, useRef } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'zh' | 'en';
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language }) => {
  const editorRef = useRef<any>(null);

  // 动态导入 CodeMirror 资源
  useEffect(() => {
    const loadCodeMirrorAssets = async () => {
      try {
        // 动态导入 CSS
        await import('codemirror/lib/codemirror.css');
        await import('codemirror/theme/dracula.css');
        // 动态导入 JavaScript 模式
        await import('codemirror/mode/javascript/javascript');
      } catch (error) {
        console.log('CodeMirror assets loaded via dynamic import');
      }
    };

    loadCodeMirrorAssets();
  }, []);

  const applyMagicHighlighting = (editor: any) => {
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

    editor.eachLine((lineHandle: any) => {
      const lineNo = editor.getLineNumber(lineHandle);
      if (lineHandle.markedSpans) {
        lineHandle.markedSpans.forEach((span: any) => span.marker.clear());
      }
      const text = editor.getLine(lineNo);
      
      Object.keys(highlights).forEach(keyword => {
        let cursor = text.indexOf(keyword);
        while (cursor > -1) {
          editor.markText(
            { line: lineNo, ch: cursor }, 
            { line: lineNo, ch: cursor + keyword.length },
            { className: highlights[keyword as keyof typeof highlights] }
          );
          cursor = text.indexOf(keyword, cursor + 1);
        }
      });
    });
  };

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
        .CodeMirror {
          height: 100%;
          font-size: 16px;
          border-radius: 0 0 10px 10px;
        }
      `}</style>
      
      <CodeMirror
        value={value}
        options={{
          lineNumbers: true,
          mode: 'javascript',
          theme: 'dracula',
          lineWrapping: true,
        }}
        onChange={(editor, data, value) => {
          onChange(value);
          applyMagicHighlighting(editor);
        }}
        editorDidMount={(editor) => {
          editorRef.current = editor;
          applyMagicHighlighting(editor);
        }}
      />
    </div>
  );
};

export default CodeEditor;
