
export const examples = {
  zh: {
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
输出("今日盲盒开出了：", 今日幸运);

如果 (今日幸运 是不是 "一个bug🐛") {
  反手举报("晦气！今天不宜写代码！");
}`
    },
    loveCalculator: {
      name: "恋爱计算器",
      code: `想要你一个态度 计算缘分(名字1, 名字2) {
  小仙女 名字组合 = 名字1 贴贴 名字2;
  小仙女 缘分值 = 名字组合.length * 10 - 20;
  
  如果 (缘分值 > 80) {
    输出("缘分值:", 缘分值, "，你们是天作之合！💖");
  } 我接受不等于我同意 (缘分值 > 60) {
    输出("缘分值:", 缘分值, "，很有机会哦，加油！");
  } 那能一样吗 {
    输出("缘分值:", 缘分值, "，emmm...做朋友也挺好？");
  }
}

计算缘分("你", "Herlang");`
    }
  },
  en: {
    dragon: {
      name: "Summon Dragon",
      code: `// This is an easter egg function!
output("I want to make a wish...");
summon dragon("Someone buy me bubble tea every day!");`
    },
    blindBox: {
      name: "Open Blind Box",
      code: `// Let's see what good stuff we can get today?
fairy todays_luck = open blind box();
output("Today's blind box opened:", todays_luck);

if (todays_luck is "一个bug🐛") {
  report("Bad luck! Not suitable for coding today!");
}`
    },
    loveCalculator: {
      name: "Love Calculator", 
      code: `want your attitude calculate_fate(name1, name2) {
  fairy name_combo = name1 stick together name2;
  fairy fate_value = name_combo.length * 10 - 20;
  
  if (fate_value > 80) {
    output("Fate value:", fate_value, ", you are made for each other! 💖");
  } I accept not equal I agree (fate_value > 60) {
    output("Fate value:", fate_value, ", very promising, keep going!");
  } how could that be same {
    output("Fate value:", fate_value, ", emmm...being friends is also nice?");
  }
}

calculate_fate("You", "Herlang");`
    }
  }
};

export type ExampleKey = keyof typeof examples.zh;
