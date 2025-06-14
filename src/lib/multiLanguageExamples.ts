
import { ProgrammingStyle } from './multiLanguageEngine';

export const multiLanguageExamples = {
  chinese: {
    dragon: {
      name: "召唤神龙",
      code: `// 这是一个彩蛋函数！
输出("我想要一个愿望...");
召唤神龙("每天都有人请喝奶茶！");`
    },
    blindBox: {
      name: "开启盲盒",
      code: `// 看看今天能开出什么好东西？
小仙女 今日幸运 = 开启盲盒();
输出("今日盲盒开出了：", 今日幸运);`
    }
  },
  english: {
    dragon: {
      name: "Summon Dragon",
      code: `// This is an easter egg function!
output("I want to make a wish...");
summon dragon("Someone buy me bubble tea every day!");`
    },
    blindBox: {
      name: "Open Blind Box",
      code: `// Let's see what we can get today?
fairy todays_luck = open blind box();
output("Today's blind box opened:", todays_luck);`
    }
  },
  python: {
    dragon: {
      name: "召唤神龙 (Python风格)",
      code: `# 这是一个彩蛋函数！
def 想要你一个态度 召唤愿望():
    输出("我想要一个愿望...")
    召唤神龙("每天都有人请喝奶茶！")

召唤愿望()`
    },
    blindBox: {
      name: "开启盲盒 (Python风格)",
      code: `# 看看今天能开出什么好东西？
def 想要你一个态度 今日运势():
    小仙女 今日幸运 = 开启盲盒()
    输出("今日盲盒开出了：", 今日幸运)
    return 今日幸运

今日运势()`
    },
    loop: {
      name: "循环示例 (Python风格)",
      code: `# Python风格的循环
for 每一个 数字 in 从几到几(1, 6):
    输出("数字:", 数字)
    if 如果说 数字 == 3:
        输出("找到了三！")
        break 打住`
    }
  },
  rust: {
    dragon: {
      name: "召唤神龙 (Rust风格)",
      code: `// 这是一个彩蛋函数！
fn 想要你一个态度 召唤愿望() {
    输出("我想要一个愿望...");
    召唤神龙("每天都有人请喝奶茶！");
}

召唤愿望();`
    },
    blindBox: {
      name: "开启盲盒 (Rust风格)",
      code: `// 看看今天能开出什么好东西？
fn 想要你一个态度 今日运势() {
    let 小仙女 今日幸运 = 开启盲盒();
    输出("今日盲盒开出了：", 今日幸运);
    今日幸运
}

今日运势();`
    },
    pattern: {
      name: "模式匹配 (Rust风格)",
      code: `// Rust风格的模式匹配
let 小仙女 运气值 = 5;

看情况 运气值 {
    1 => 输出("运气不太好呢"),
    2 | 3 => 输出("还可以啦"),
    4 | 5 => 输出("运气不错！"),
    _ => 输出("超级好运！")
}`
    }
  }
};

export type MultiLanguageExampleKey = keyof typeof multiLanguageExamples.chinese;
