
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  zh: {
    translation: {
      title: "✨ Herlang v6.1 - 星彩版 ✨",
      codeEditor: "📝 代码编辑区",
      outputPanel: "🎬 结果展示区", 
      translatorPanel: "🤖 转译查看区",
      runCode: "▶️ 运行代码",
      clearOutput: "🧹 清屏",
      copyJS: "📋 复制JS",
      toggleTranslator: "(点击展开/收起)",
      examples: "✨ 全新魔法示例 ✨",
      summonDragon: "召唤神龙",
      blindBox: "开启盲盒", 
      loveCalculator: "恋爱计算器",
      translatedPlaceholder: "这里会显示翻译后的原生 JavaScript 代码...",
      copiedToClipboard: "已复制到剪贴板！",
      languageSwitch: "🌍 语言"
    }
  },
  en: {
    translation: {
      title: "✨ Herlang v6.1 - Stellar Edition ✨",
      codeEditor: "📝 Code Editor",
      outputPanel: "🎬 Output Panel",
      translatorPanel: "🤖 Translator Panel", 
      runCode: "▶️ Run Code",
      clearOutput: "🧹 Clear",
      copyJS: "📋 Copy JS",
      toggleTranslator: "(Click to expand/collapse)",
      examples: "✨ Magic Examples ✨",
      summonDragon: "Summon Dragon",
      blindBox: "Open Blind Box",
      loveCalculator: "Love Calculator", 
      translatedPlaceholder: "Translated JavaScript code will appear here...",
      copiedToClipboard: "Copied to clipboard!",
      languageSwitch: "🌍 Language"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
