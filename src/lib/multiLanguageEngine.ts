// Multi-language Herlang engine supporting different programming styles
export type ProgrammingStyle = 'herlang' | 'chinese' | 'english' | 'python' | 'rust';

// Python-style Herlang dictionary
export const DICTIONARY_PYTHON = {
  'def 小仙女': 'def',
  'def 想要你一个态度': 'def',
  'import 魔法': 'import',
  'for 每一个': 'for',
  'in 里面的': 'in',
  'while 只要': 'while',
  'if 如果说': 'if',
  'elif 或者说': 'elif',
  'else 不然的话': 'else',
  'try 试试看': 'try',
  'except 如果出错了': 'except',
  'finally 最后不管怎样': 'finally',
  'class 定义一个类型': 'class',
  'self 自己': 'self',
  'return 返回给你': 'return',
  'yield 慢慢给你': 'yield',
  'lambda 快速定义': 'lambda',
  'print 输出': 'print',
  'len 长度是多少': 'len',
  'range 从几到几': 'range',
  'True 那是真的': 'True',
  'False 那是假的': 'False',
  'None 什么都没有': 'None',
};

// Rust-style Herlang dictionary
export const DICTIONARY_RUST = {
  'fn 想要你一个态度': 'fn',
  'let 小仙女': 'let',
  'let mut 善变的小仙女': 'let mut',
  'const 永远的': 'const',
  'if 如果说': 'if',
  'else 不然': 'else',
  'match 看情况': 'match',
  'loop 一直': 'loop',
  'while 当': 'while',
  'for 对于每个': 'for',
  'in 在': 'in',
  'struct 定义结构': 'struct',
  'enum 枚举类型': 'enum',
  'impl 实现': 'impl',
  'trait 特征': 'trait',
  'pub 公开的': 'pub',
  'mod 模块': 'mod',
  'use 使用': 'use',
  'return 返回': 'return',
  'break 打住': 'break',
  'continue 继续': 'continue',
  'true 真': 'true',
  'false 假': 'false',
  'Some(x) 有东西(x)': 'Some(x)',
  'None 空空如也': 'None',
  'Ok(x) 成功了(x)': 'Ok(x)',
  'Err(e) 出错了(e)': 'Err(e)',
  'println! 输出': 'console.log',
  'panic! 崩溃': 'throw new Error',
};

export class MultiLanguageHerlangEngine {
  private currentStyle: ProgrammingStyle;
  private dictionaries: Record<ProgrammingStyle, Record<string, string>>;

  constructor(style: ProgrammingStyle = 'chinese') {
    this.currentStyle = style;
    this.dictionaries = {
      chinese: {
        '小仙女': 'let',
        '设定一个': 'let', 
        '话说有个': 'let',
        '想一个数': 'const',
        '永远是': 'const',
        '铁律是': 'const',
        '我接受': '=',
        '变成': '=',
        '现在是': '=',
        '就定为': '=',
        '让她是': '=',
        '我同意': '==',
        '就是': '==',
        '是不是': '==',
        '恰好是': '==',
        '如果': 'if',
        '万一': 'if',
        '要是说': 'if',
        '那能一样吗': 'else',
        '否则的话': 'else',
        '我接受不等于我同意': 'else if',
        '或者说呢': 'else if',
        '想要你一个态度': 'function',
        '你再说一遍': 'while',
        '下头': 'break',
        '输出': 'console.log',
        '我想说': 'console.log', 
        '反手举报': 'console.warn',
        '哼': 'throw new Error("哼！我不干了！")',
        '那么普通却那么自信': 'true',
        '那可不': 'true',
        '是真的': 'true',
        '必须的': 'true',
        '那咋了': 'false',
        '假的啦': 'false',
        '才不是呢': 'false',
        '不可能': 'false',
        '召唤神龙': 'herlang.summonDragon',
        '开启盲盒': 'herlang.openBlindBox',
        '贴贴': '+',
        '格局打开': 'Math.abs',
      },
      english: {
        'fairy': 'let',
        'set a': 'let',
        'there is a': 'let', 
        'think of number': 'const',
        'always is': 'const',
        'rule is': 'const',
        'I accept': '=',
        'becomes': '=',
        'now is': '=',
        'set to': '=',
        'let her be': '=',
        'I agree': '==',
        'is': '==',
        'is it': '==',
        'exactly is': '==',
        'if': 'if',
        'in case': 'if',
        'suppose': 'if',
        'how could that be same': 'else',
        'otherwise': 'else',
        'I accept not equal I agree': 'else if',
        'or what about': 'else if',
        'want your attitude': 'function',
        'say it again': 'while',
        'give up': 'break',
        'output': 'console.log',
        'I want to say': 'console.log', 
        'report': 'console.warn',
        'hmph': 'throw new Error("Hmph! I quit!")',
        'so ordinary yet so confident': 'true',
        'not really': 'true',
        'is true': 'true',
        'must be': 'true',
        'so what': 'false',
        'fake': 'false',
        'not at all': 'false',
        'impossible': 'false',
        'summon dragon': 'herlang.summonDragon',
        'open blind box': 'herlang.openBlindBox',
        'stick together': '+',
        'open pattern': 'Math.abs',
      },
      python: DICTIONARY_PYTHON,
      rust: DICTIONARY_RUST
    };
  }

  setStyle(style: ProgrammingStyle) {
    this.currentStyle = style;
  }

  getCurrentStyle() {
    return this.currentStyle;
  }

  private preprocessor(herlangCode: string): string {
    let processedCode = herlangCode;
    const dictionary = this.dictionaries[this.currentStyle];
    
    // Sort by length to handle longer keywords first
    Object.keys(dictionary)
      .sort((a, b) => b.length - a.length)
      .forEach(key => {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        processedCode = processedCode.replace(
          new RegExp(escapedKey, 'g'), 
          dictionary[key]
        );
      });
    
    return processedCode;
  }

  translateToJS(herlangCode: string): string {
    const preprocessedCode = this.preprocessor(herlangCode);
    
    // For Python and Rust styles, we need additional processing
    if (this.currentStyle === 'python') {
      return this.processPythonStyle(preprocessedCode);
    } else if (this.currentStyle === 'rust') {
      return this.processRustStyle(preprocessedCode);
    }
    
    // For Chinese and English styles, use the original Babel transformation
    try {
      const { transform } = require('@babel/standalone');
      const result = transform(preprocessedCode, { 
        presets: [],
        sourceType: "script" 
      });
      return result.code || '';
    } catch (error) {
      throw error;
    }
  }

  private processPythonStyle(code: string): string {
    // Convert Python-like syntax to JavaScript
    let jsCode = code;
    
    // Handle def function definitions
    jsCode = jsCode.replace(/def\s+(\w+)\s*\((.*?)\):/g, 'function $1($2) {');
    
    // Handle if/elif/else
    jsCode = jsCode.replace(/elif\s+/g, 'else if ');
    jsCode = jsCode.replace(/:\s*$/gm, ' {');
    
    // Handle print statements
    jsCode = jsCode.replace(/print\s*\((.*?)\)/g, 'console.log($1)');
    
    // Add closing braces (simplified)
    const lines = jsCode.split('\n');
    const processedLines: string[] = [];
    let indentLevel = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.endsWith('{')) {
        processedLines.push(line);
        indentLevel++;
      } else if (trimmed && !trimmed.startsWith('//')) {
        processedLines.push(line);
      }
    }
    
    // Add closing braces
    for (let i = 0; i < indentLevel; i++) {
      processedLines.push('}');
    }
    
    return processedLines.join('\n');
  }

  private processRustStyle(code: string): string {
    // Convert Rust-like syntax to JavaScript
    let jsCode = code;
    
    // Handle fn function definitions
    jsCode = jsCode.replace(/fn\s+(\w+)\s*\((.*?)\)/g, 'function $1($2)');
    
    // Handle let and let mut
    jsCode = jsCode.replace(/let\s+mut\s+/g, 'let ');
    
    // Handle println! macro
    jsCode = jsCode.replace(/println!\s*\((.*?)\)/g, 'console.log($1)');
    
    // Handle panic! macro
    jsCode = jsCode.replace(/panic!\s*\((.*?)\)/g, 'throw new Error($1)');
    
    // Handle match expressions (simplified)
    jsCode = jsCode.replace(/match\s+(\w+)\s*\{/g, 'switch($1) {');
    
    // Handle Some/None/Ok/Err (simplified conversion)
    jsCode = jsCode.replace(/Some\s*\((.*?)\)/g, '$1');
    jsCode = jsCode.replace(/None/g, 'null');
    jsCode = jsCode.replace(/Ok\s*\((.*?)\)/g, '$1');
    jsCode = jsCode.replace(/Err\s*\((.*?)\)/g, 'throw new Error($1)');
    
    return jsCode;
  }

  getAvailableStyles(): ProgrammingStyle[] {
    return ['herlang', 'chinese', 'english', 'python', 'rust'];
  }

  getStyleDisplayName(style: ProgrammingStyle): string {
    const names = {
      chinese: '中式浪漫',
      english: 'English Style',
      python: 'Python风格',
      rust: 'Rust风格'
    };
    return names[style];
  }
}

// Keep the old export for backward compatibility
export const MultiLanguageEngine = MultiLanguageHerlangEngine;
