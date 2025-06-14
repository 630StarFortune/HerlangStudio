
import { transform } from '@babel/standalone';

// Herlang词典 - 中文版
export const DICTIONARY_ZH = {
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
};

// Herlang词典 - 英文版
export const DICTIONARY_EN = {
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
};

export class HerlangEngine {
  private dictionary: Record<string, string>;

  constructor(language: 'zh' | 'en' = 'zh') {
    this.dictionary = language === 'zh' ? DICTIONARY_ZH : DICTIONARY_EN;
  }

  setLanguage(language: 'zh' | 'en') {
    this.dictionary = language === 'zh' ? DICTIONARY_ZH : DICTIONARY_EN;
  }

  private preprocessor(herlangCode: string): string {
    let processedCode = herlangCode;
    
    // Sort by length to handle longer keywords first
    Object.keys(this.dictionary)
      .sort((a, b) => b.length - a.length)
      .forEach(key => {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        processedCode = processedCode.replace(
          new RegExp(escapedKey, 'g'), 
          this.dictionary[key]
        );
      });
    
    return processedCode;
  }

  translateToJS(herlangCode: string): string {
    const preprocessedCode = this.preprocessor(herlangCode);
    try {
      const result = transform(preprocessedCode, { 
        presets: [],
        sourceType: "script" 
      });
      return result.code || '';
    } catch (error) {
      throw error;
    }
  }

  // Built-in functions
  static builtins = {
    summonDragon: (wish: string) => {
      const dragonArt = `
    /\\_/\\
   / o o \\
  (  >w<  )
   \\,,,,,/
  //  -  \\\\
 //  -  - \\\\
//  -  -  - \\\\
`;
      return {
        type: 'dragon',
        art: dragonArt,
        message: `🐉 神龙出现：你的愿望"${wish}"我听到了！`
      };
    },
    openBlindBox: () => {
      const items = [
        '一个亲亲😘', '一杯奶茶🥤', '一个bug🐛', 
        '一次水逆🌊', '一根鸡腿🍗', '一朵小红花🌸'
      ];
      return items[Math.floor(Math.random() * items.length)];
    }
  };
}
