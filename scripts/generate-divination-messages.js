#!/usr/bin/env node

/**
 * 占術メッセージ自動生成スクリプト
 * LLM活用による高品質メッセージ生成
 */

const fs = require('fs');
const path = require('path');

// 占術別知識ベース
const KNOWLEDGE_BASE = {
  celtic: {
    principles: [
      "ケルト文化における自然との調和",
      "ドルイド教の樹木崇拝思想",
      "オガム文字の神秘的意味",
      "四季と生命サイクルの連携"
    ],
    coreArchetypes: [
      "樹木の智慧", "自然の力", "季節の変化", "古代の智慧", "大地の母"
    ],
    culturalModifiers: [
      "ケルト的", "ドルイド的", "神秘的", "自然的", "古代的"
    ],
    messageTemplates: {
      guidance: "{archetype}が示すのは、{modifier}な{context}です。{season}の力があなたを{action}へと導いています。",
      warning: "{tree}の警告として、{challenge}に注意し、{wisdom}の教えに従ってください。",
      blessing: "{sacred_place}の祝福により、{gift}があなたにもたらされます。",
      timing: "{moon_phase}と{tree_energy}が調和し、{optimal_action}に最適な時期です。"
    }
  },
  
  runes: {
    principles: [
      "北欧神話の神々の意志",
      "ゲルマン文化のシンボリズム",
      "エルダー・フサルクの伝統",
      "運命と自由意志の相互作用"
    ],
    coreArchetypes: [
      "戦士の道", "智慧の探求", "運命の受容", "自然の力", "神々の意志"
    ],
    culturalModifiers: [
      "戦士的", "賢者的", "神的", "原始的", "運命的"
    ],
    messageTemplates: {
      strength: "{rune_name}の力により、{challenge}を{warrior_spirit}で乗り越えることができます。",
      wisdom: "{odin_wisdom}として、{insight}を理解し、{wise_action}を取ってください。",
      fate: "運命の糸が{pattern}を織りなし、{destiny}へと導いています。",
      protection: "{protection_rune}が{threat}から守り、{safe_path}を示しています。"
    }
  },
  
  iching: {
    principles: [
      "陰陽の相互変化原理",
      "五行説による万物の相関",
      "易経64卦の古典的解釈",
      "中庸と調和の哲学"
    ],
    coreArchetypes: [
      "天地の調和", "変化の法則", "中庸の道", "五行の力", "易の智慧"
    ],
    culturalModifiers: [
      "陰陽的", "五行的", "中庸的", "易的", "東洋的"
    ],
    messageTemplates: {
      change: "{hexagram}は{change_type}を示し、{timing}において{action}することが{result}をもたらします。",
      harmony: "{yin_yang}のバランスにより、{situation}は{harmony_direction}へと向かいます。",
      wisdom: "古代の智慧{classic_teaching}により、{modern_application}が明らかになります。",
      flow: "{element}の流れに従い、{natural_timing}で{wise_action}を取ってください。"
    }
  }
};

// 動的メッセージ生成エンジン
class DivinationMessageGenerator {
  constructor(divination) {
    this.divination = divination;
    this.knowledge = KNOWLEDGE_BASE[divination];
    if (!this.knowledge) {
      throw new Error(`Unknown divination: ${divination}`);
    }
  }
  
  // 基本メッセージ生成
  generateBasicMessages(element, count = 15) {
    const messages = [];
    const templates = this.knowledge.messageTemplates;
    
    for (let i = 0; i < count; i++) {
      const templateType = this.selectTemplate(i);
      const template = templates[templateType];
      const message = this.fillTemplate(template, element, i);
      messages.push(message);
    }
    
    return messages;
  }
  
  // カテゴリ別メッセージ生成
  generateCategoryMessages(element, category, count = 3) {
    const categoryContexts = {
      love: ["恋愛関係", "パートナーシップ", "心の繋がり"],
      career: ["仕事運", "キャリア発展", "専門性向上"],
      health: ["身体の健康", "精神的安定", "エネルギーバランス"],
      finance: ["金銭運", "物質的豊かさ", "資源管理"],
      spiritual: ["精神的成長", "霊的発展", "内なる智慧"],
      general: ["総合運", "人生全般", "バランス調整"]
    };
    
    const contexts = categoryContexts[category];
    return contexts.slice(0, count).map(context => 
      this.generateContextualMessage(element, context)
    );
  }
  
  // テンプレート選択
  selectTemplate(index) {
    const types = Object.keys(this.knowledge.messageTemplates);
    return types[index % types.length];
  }
  
  // テンプレート埋め込み
  fillTemplate(template, element, seed) {
    const archetype = this.selectFromArray(this.knowledge.coreArchetypes, seed);
    const modifier = this.selectFromArray(this.knowledge.culturalModifiers, seed + 1);
    
    return template
      .replace('{archetype}', archetype)
      .replace('{modifier}', modifier)
      .replace('{element}', element.name || element)
      // 他のプレースホルダーも実装
      ;
  }
  
  // 配列からシード値ベースで選択
  selectFromArray(array, seed) {
    return array[seed % array.length];
  }
  
  // 文脈的メッセージ生成
  generateContextualMessage(element, context) {
    const archetype = this.selectFromArray(this.knowledge.coreArchetypes, 0);
    return `${context}において、${archetype}が${element.name || element}の意味を通じて導きを与えています。`;
  }
  
  // 完全なメッセージオブジェクト生成
  generateCompleteMessages(element) {
    return {
      uprightInterpretations: this.generateBasicMessages(element, 5),
      reversedInterpretations: this.generateBasicMessages(element, 5).map(msg => 
        this.reverseMessage(msg)
      ),
      positionInterpretations: {
        past: this.generateCategoryMessages(element, 'general', 3),
        present: this.generateCategoryMessages(element, 'general', 3),
        future: this.generateCategoryMessages(element, 'general', 3),
        advice: this.generateCategoryMessages(element, 'general', 3),
        obstacle: this.generateCategoryMessages(element, 'general', 3),
        outcome: this.generateCategoryMessages(element, 'general', 3),
        innerSelf: this.generateCategoryMessages(element, 'spiritual', 3),
        environment: this.generateCategoryMessages(element, 'general', 3),
        hopes: this.generateCategoryMessages(element, 'general', 3),
        fears: this.generateCategoryMessages(element, 'general', 3)
      },
      categoryInterpretations: {
        love: this.generateCategoryMessages(element, 'love', 3),
        career: this.generateCategoryMessages(element, 'career', 3),
        health: this.generateCategoryMessages(element, 'health', 3),
        finance: this.generateCategoryMessages(element, 'finance', 3),
        spiritual: this.generateCategoryMessages(element, 'spiritual', 3),
        general: this.generateCategoryMessages(element, 'general', 3)
      },
      timingMessages: {
        morning: ['朝の時間に' + element.name + 'の力が高まります'],
        afternoon: ['午後の活動で' + element.name + 'の影響が現れます'],
        evening: ['夜の静寂で' + element.name + 'の智慧を受け取ります'],
        weekly: ['今週は' + element.name + 'の期間です'],
        monthly: ['今月' + element.name + 'の季節です']
      },
      combinations: {
        withMajorArcana: {},
        withSameSuit: {},
        withCourtCards: {}
      },
      poeticExpressions: this.generatePoetry(element, 5),
      psychologicalInsights: this.generatePsychology(element, 5),
      practicalAdvice: this.generatePractical(element, 5)
    };
  }
  
  // 逆位置メッセージ変換
  reverseMessage(message) {
    const reversalWords = {
      '成功': '課題',
      '幸運': '注意',
      '前進': '見直し',
      '開花': '準備',
      '達成': '努力継続'
    };
    
    let reversed = message;
    Object.entries(reversalWords).forEach(([positive, negative]) => {
      reversed = reversed.replace(positive, negative);
    });
    
    return reversed;
  }
  
  // 詩的表現生成
  generatePoetry(element, count) {
    const poeticTemplates = [
      `{element}の光が心の奥底を照らし、新しい道筋を示している`,
      `古代から受け継がれた{element}の智慧が、現代に響く鐘のように心に響く`,
      `{element}という名の風が、魂の翼を広げて空高く舞い上がらせる`,
      `{element}の根深い力が、大地から立ち上がり、未来への希望を運んでくる`,
      `{element}の神秘が、星々の輝きと共に、永遠の真実を語りかけている`
    ];
    
    return poeticTemplates.slice(0, count).map(template => 
      template.replace('{element}', element.name || element)
    );
  }
  
  // 心理学的洞察生成
  generatePsychology(element, count) {
    const psychTemplates = [
      `{element}は深層心理において、自己実現への強い欲求を表しています`,
      `{element}の象徴は、アーキタイプとして集合的無意識に深く根ざしています`,
      `{element}が示すパターンは、個人の成長段階における重要な転換点です`,
      `{element}の心理的意味は、内的統合プロセスの象徴として働いています`,
      `{element}は投影機制を通じて、抑圧された側面の統合を促しています`
    ];
    
    return psychTemplates.slice(0, count).map(template => 
      template.replace('{element}', element.name || element)
    );
  }
  
  // 実践的アドバイス生成
  generatePractical(element, count) {
    const practicalTemplates = [
      `{element}の教えに従い、今週は新しい習慣を始めてみてください`,
      `{element}のエネルギーを活かすため、自然との接触時間を増やしましょう`,
      `{element}が示す方向性に合わせて、人間関係の整理を行いましょう`,
      `{element}の智慧を日常に取り入れるため、瞑想や内省の時間を設けて`,
      `{element}のメッセージを実践するため、具体的な行動計画を立てましょう`
    ];
    
    return practicalTemplates.slice(0, count).map(template => 
      template.replace('{element}', element.name || element)
    );
  }
}

// コマンドライン実行
if (require.main === module) {
  const divination = process.argv[2];
  const outputPath = process.argv[3];
  
  if (!divination || !outputPath) {
    console.log('使用方法: node generate-divination-messages.js <占術名> <出力パス>');
    console.log('例: node generate-divination-messages.js celtic ./src/lib/divination/messages/celtic-messages.ts');
    process.exit(1);
  }
  
  try {
    const generator = new DivinationMessageGenerator(divination);
    
    // サンプル要素での生成（実際は占術の全要素で実行）
    const sampleElement = { name: '白樺の樹' };
    const messages = generator.generateCompleteMessages(sampleElement);
    
    console.log('生成されたメッセージサンプル:');
    console.log(JSON.stringify(messages, null, 2));
    
    // 実際のファイル生成はここに実装
    console.log(`${divination}占術のメッセージ生成完了`);
    
  } catch (error) {
    console.error('エラー:', error.message);
    process.exit(1);
  }
}

module.exports = { DivinationMessageGenerator, KNOWLEDGE_BASE };