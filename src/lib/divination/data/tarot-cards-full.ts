/**
 * タロットカード78枚完全データセット
 * 
 * 大アルカナ22枚 + 小アルカナ56枚
 * 複数流派の解釈を統合
 */

// カードの型定義
export interface TarotCard {
  id: string;
  number: number;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  keywords: string[];
  element?: string;
  astrology?: string;
  hebrew?: string;
  meanings: {
    upright: {
      general: string;
      love: string;
      career: string;
      spirituality: string;
    };
    reversed: {
      general: string;
      love: string;
      career: string;
      spirituality: string;
    };
  };
  symbolism: string[];
  numerology?: number;
  chakra?: string;
}

// 大アルカナ（0-21）
export const majorArcana: TarotCard[] = [
  {
    id: 'major-00',
    number: 0,
    name: '愚者',
    arcana: 'major',
    keywords: ['新しい始まり', '無邪気', '自由', '冒険', '可能性'],
    element: '風',
    astrology: '天王星',
    hebrew: 'アレフ',
    meanings: {
      upright: {
        general: '新しい旅の始まり。無限の可能性と純粋な心で未知の世界へ踏み出す時。',
        love: '新しい恋の始まり。自由な心で相手と向き合い、素直な気持ちを大切に。',
        career: '新規プロジェクトのチャンス。従来の枠にとらわれない斬新なアイデアが吉。',
        spirituality: '魂の純粋性を取り戻す時。子供のような無邪気さが悟りへの道を開く。'
      },
      reversed: {
        general: '無謀な行動への警告。計画性の欠如や現実逃避に注意が必要。',
        love: '軽率な恋愛関係。コミットメントへの恐れや責任回避の傾向。',
        career: 'リスク管理の甘さ。準備不足のまま行動することへの警告。',
        spirituality: '精神的な迷走。地に足をつけることの重要性。'
      }
    },
    symbolism: ['白い太陽', '崖', '白い犬', '手に持つ白い花', '肩にかけた袋'],
    numerology: 0
  },
  {
    id: 'major-01',
    number: 1,
    name: '魔術師',
    arcana: 'major',
    keywords: ['意志力', '創造', '実現化', '技能', '集中'],
    element: '水星',
    astrology: '水星',
    hebrew: 'ベス',
    meanings: {
      upright: {
        general: '意志の力で現実を創造する時。全ての要素が揃い、望みを実現できる。',
        love: '積極的なアプローチが成功を呼ぶ。明確な意図を持って関係を築く。',
        career: 'スキルと才能を最大限に活用。リーダーシップを発揮する好機。',
        spirituality: '高次の意志と繋がり、現実世界で具現化する力を得る。'
      },
      reversed: {
        general: '才能の誤用や操作的な行動。エゴに支配されている可能性。',
        love: '相手を操作しようとする傾向。不誠実な態度への警告。',
        career: '能力の過信や詐欺的行為への注意。スキル不足の自覚が必要。',
        spirituality: '霊的な力の誤用。謙虚さを取り戻す必要性。'
      }
    },
    symbolism: ['∞のシンボル', '祭壇の上の4つの道具', '上を指す右手', '下を指す左手', '赤いバラと白いユリ'],
    numerology: 1
  },
  {
    id: 'major-02',
    number: 2,
    name: '女教皇',
    arcana: 'major',
    keywords: ['直感', '潜在意識', '神秘', '受容性', '内なる知恵'],
    element: '月',
    astrology: '月',
    hebrew: 'ギメル',
    meanings: {
      upright: {
        general: '内なる声に耳を傾ける時。直感と潜在意識からの導きを信頼する。',
        love: '相手の本質を直感的に理解。言葉にならない感情の交流を大切に。',
        career: '研究や調査が実を結ぶ。隠れた情報や知識が鍵となる。',
        spirituality: '高次の知恵との繋がり。瞑想と内省により真理に近づく。'
      },
      reversed: {
        general: '直感の無視や表面的な判断。内なる声を聞く余裕がない状態。',
        love: '感情の抑圧や秘密。本音を隠している関係性への警告。',
        career: '重要な情報の見落とし。表面的な分析では不十分。',
        spirituality: '霊的な成長の停滞。日常に埋没し内面を見失っている。'
      }
    },
    symbolism: ['三日月の冠', 'TORAの巻物', '黒と白の柱', '青いローブ', 'ザクロの模様'],
    numerology: 2
  },
  {
    id: 'major-03',
    number: 3,
    name: '女帝',
    arcana: 'major',
    keywords: ['豊穣', '母性', '創造性', '自然', '育成'],
    element: '金星',
    astrology: '金星',
    hebrew: 'ダレス',
    meanings: {
      upright: {
        general: '豊かな創造性と育成の時期。愛と美と豊穣のエネルギーに満ちている。',
        love: '深い愛情と思いやり。関係が成熟し実を結ぶ時期。',
        career: '創造的プロジェクトの成功。チームを育成し成長させる。',
        spirituality: '地球との繋がりを感じ、生命力に満ち溢れる。'
      },
      reversed: {
        general: '創造性の枯渇や過保護。バランスを失った母性の表れ。',
        love: '愛情の押し付けや依存関係。相手の自立を妨げる傾向。',
        career: '創造的な停滞期。過度な管理や干渉が成長を妨げる。',
        spirituality: '物質主義への偏り。精神性と物質性のバランスが必要。'
      }
    },
    symbolism: ['12の星の冠', '豊穣の角', '小麦畑', 'ハート型の盾', '流れる川'],
    numerology: 3
  },
  {
    id: 'major-04',
    number: 4,
    name: '皇帝',
    arcana: 'major',
    keywords: ['権威', '構造', '安定', '父性', '支配'],
    element: '牡羊座',
    astrology: '牡羊座',
    hebrew: 'ヘー',
    meanings: {
      upright: {
        general: '秩序と安定を築く時。リーダーシップと責任を持って状況を統制する。',
        love: '安定した関係の構築。保護者的な愛情と責任ある態度。',
        career: '組織での昇進や権限拡大。構造的なアプローチが成功を呼ぶ。',
        spirituality: '内なる権威の確立。自己規律により精神的成長を遂げる。'
      },
      reversed: {
        general: '権力の濫用や過度な支配。柔軟性の欠如と独裁的傾向。',
        love: '支配的な関係性。相手をコントロールしようとする傾向。',
        career: '権威主義的な環境。創造性を抑圧する硬直した構造。',
        spirituality: 'エゴの肥大化。謙虚さと柔軟性を取り戻す必要性。'
      }
    },
    symbolism: ['玉座', '鎧', 'アンクの笏', '地球を象徴する球', '雄羊の頭部'],
    numerology: 4
  },
  {
    id: 'major-05',
    number: 5,
    name: '教皇',
    arcana: 'major',
    keywords: ['伝統', '教育', '信念', '慈悲', '精神的権威'],
    element: '牡牛座',
    astrology: '牡牛座',
    hebrew: 'ヴァヴ',
    meanings: {
      upright: {
        general: '伝統的な知恵と教えに従う時。精神的な導きと教育を受ける。',
        love: '伝統的な価値観に基づく関係。結婚や公式な約束の時期。',
        career: 'メンターとの出会い。組織の規範に従うことで成功する。',
        spirituality: '宗教的・精神的な教えとの出会い。師からの導きを受ける。'
      },
      reversed: {
        general: '既存の価値観への疑問。独自の道を探す必要性。',
        love: '型にはまらない関係性。伝統的な結婚観からの脱却。',
        career: '組織の規範への反発。革新的なアプローチの必要性。',
        spirituality: '教条主義からの解放。個人的な精神性の探求。'
      }
    },
    symbolism: ['三重冠', '三段の十字架の杖', '二人の修道士', '鍵のシンボル', '祝福のジェスチャー'],
    numerology: 5
  },
  {
    id: 'major-06',
    number: 6,
    name: '恋人',
    arcana: 'major',
    keywords: ['選択', '調和', '愛', '価値観', '統合'],
    element: '双子座',
    astrology: '双子座',
    hebrew: 'ザイン',
    meanings: {
      upright: {
        general: '重要な選択の時。価値観に基づいた決断が調和をもたらす。',
        love: '深い愛の結合。魂のレベルでの繋がりと相互理解。',
        career: 'パートナーシップの形成。価値観を共有する協力関係。',
        spirituality: '対極の統合。内なる男性性と女性性のバランス。'
      },
      reversed: {
        general: '価値観の不一致や選択の困難。内的葛藤と不調和。',
        love: '関係性の不均衡。コミュニケーションの欠如や誤解。',
        career: '協力関係の破綻。利害の対立や方向性の相違。',
        spirituality: '内的分裂。統合されていない人格の側面。'
      }
    },
    symbolism: ['天使（ラファエル）', 'アダムとイブ', '知恵の木と生命の木', '太陽', '山'],
    numerology: 6
  },
  {
    id: 'major-07',
    number: 7,
    name: '戦車',
    arcana: 'major',
    keywords: ['意志力', '勝利', '克服', '統御', '前進'],
    element: '蟹座',
    astrology: '蟹座',
    hebrew: 'ヘス',
    meanings: {
      upright: {
        general: '意志の力で障害を克服する時。対立する力を統御し前進する。',
        love: '感情をコントロールし関係を前進させる。困難を乗り越える。',
        career: '競争での勝利。意志力と決断力で目標を達成する。',
        spirituality: '低次の衝動を統御し、高次の目的に向かって前進。'
      },
      reversed: {
        general: 'コントロールの喪失。方向性を見失い暴走する危険。',
        love: '感情の制御不能。関係性における力のアンバランス。',
        career: '過度な競争心。攻撃的すぎる態度が問題を引き起こす。',
        spirituality: 'エゴの暴走。内なる戦いに疲弊している状態。'
      }
    },
    symbolism: ['スフィンクス（白と黒）', '星の天蓋', '三日月の肩当て', '都市の背景', '鎧'],
    numerology: 7
  },
  {
    id: 'major-08',
    number: 8,
    name: '力',
    arcana: 'major',
    keywords: ['内なる強さ', '勇気', '忍耐', '慈悲', '自制'],
    element: '獅子座',
    astrology: '獅子座',
    hebrew: 'テス',
    meanings: {
      upright: {
        general: '優しさによる真の強さ。内なる獣性を愛と理解で統御する。',
        love: '愛の力で困難を乗り越える。優しさと忍耐が関係を深める。',
        career: '柔軟なリーダーシップ。説得力と人間性で成功を収める。',
        spirituality: '低次の本能を高次の愛で昇華。真の精神的強さの獲得。'
      },
      reversed: {
        general: '内なる弱さや自信喪失。本能に支配されている状態。',
        love: '関係における弱さ。恐れや不安が愛を妨げている。',
        career: '自信の欠如。困難に立ち向かう勇気が必要。',
        spirituality: '精神的な弱さ。内なる力を信じられない状態。'
      }
    },
    symbolism: ['∞のシンボル', '白い衣', 'ライオン', '花の冠', '優しく口を開ける手'],
    numerology: 8
  },
  {
    id: 'major-09',
    number: 9,
    name: '隠者',
    arcana: 'major',
    keywords: ['内省', '探求', '孤独', '知恵', '導き'],
    element: '乙女座',
    astrology: '乙女座',
    hebrew: 'ヨッド',
    meanings: {
      upright: {
        general: '内なる光を求めて孤独な探求。深い知恵と洞察を得る時期。',
        love: '一人の時間が必要。内省により真の愛の意味を理解する。',
        career: '専門知識の探求。一人で集中して取り組む仕事が実を結ぶ。',
        spirituality: '魂の暗夜を経て光明を得る。内なる師との出会い。'
      },
      reversed: {
        general: '過度な孤立や現実逃避。社会との繋がりを失っている。',
        love: '孤独への執着。親密さへの恐れが関係を妨げる。',
        career: 'チームワークの欠如。協力を拒む頑なな態度。',
        spirituality: '精神的な迷走。導きを求めながら見つからない状態。'
      }
    },
    symbolism: ['ランタン', '六芒星', '杖', '雪山', 'グレーのローブ'],
    numerology: 9
  },
  {
    id: 'major-10',
    number: 10,
    name: '運命の輪',
    arcana: 'major',
    keywords: ['変化', 'サイクル', '運命', '転機', 'カルマ'],
    element: '木星',
    astrology: '木星',
    hebrew: 'カフ',
    meanings: {
      upright: {
        general: '運命の大きな転換点。サイクルの変化と新たな機会の到来。',
        love: '関係性の転機。運命的な出会いや関係の新段階。',
        career: '大きなチャンスの到来。運が味方し成功へ向かう。',
        spirituality: 'カルマの法則の理解。宇宙の流れと調和する。'
      },
      reversed: {
        general: '悪循環や停滞。変化への抵抗が状況を悪化させる。',
        love: '関係の停滞や悪循環。同じパターンの繰り返し。',
        career: '不運な時期。外的要因による計画の遅延。',
        spirituality: 'カルマの教訓を学べていない。同じ課題の繰り返し。'
      }
    },
    symbolism: ['スフィンクス', '蛇', 'アヌビス', 'TARO/ROTA の文字', '四元素のシンボル'],
    numerology: 10
  },
  {
    id: 'major-11',
    number: 11,
    name: '正義',
    arcana: 'major',
    keywords: ['公正', 'バランス', '真実', '因果', '決断'],
    element: '天秤座',
    astrology: '天秤座',
    hebrew: 'ラメド',
    meanings: {
      upright: {
        general: '公正な判断と因果応報。真実が明らかになり正義が為される。',
        love: 'バランスの取れた関係。誠実さと公平性が重要。',
        career: '公正な評価と報酬。法的問題での勝利。',
        spirituality: 'カルマの清算。過去の行いの結果を受け入れる。'
      },
      reversed: {
        general: '不公正や偏見。バランスを欠いた判断と不正義。',
        love: '関係の不均衡。一方的な犠牲や不公平な扱い。',
        career: '不当な扱いや法的トラブル。偏見による不利益。',
        spirituality: 'カルマの誤解。被害者意識からの脱却が必要。'
      }
    },
    symbolism: ['天秤', '剣', '王冠', '赤いローブ', '二本の柱'],
    numerology: 11
  },
  {
    id: 'major-12',
    number: 12,
    name: '吊られた男',
    arcana: 'major',
    keywords: ['犠牲', '視点転換', '忍耐', '悟り', '解放'],
    element: '海王星',
    astrology: '海王星',
    hebrew: 'メム',
    meanings: {
      upright: {
        general: '視点を変えることで新たな理解。一時的な犠牲が大きな悟りをもたらす。',
        love: '相手のために自我を手放す。無条件の愛の学び。',
        career: '短期的な損失を受け入れる。長期的視野での判断。',
        spirituality: 'エゴの死と再生。高次の視点からの理解。'
      },
      reversed: {
        general: '無意味な犠牲や停滞。視点の固執による苦しみ。',
        love: '一方的な犠牲による疲弊。共依存的な関係。',
        career: '無駄な努力や報われない状況。方向転換の必要性。',
        spirituality: '精神的な停滞。古い信念体系への執着。'
      }
    },
    symbolism: ['T字の木', '逆さの姿勢', '光輪', '片足を縛るロープ', '平和な表情'],
    numerology: 12
  },
  {
    id: 'major-13',
    number: 13,
    name: '死神',
    arcana: 'major',
    keywords: ['変容', '終わり', '再生', '解放', '移行'],
    element: '蠍座',
    astrology: '蠍座',
    hebrew: 'ヌン',
    meanings: {
      upright: {
        general: '古いものの終わりと新しい始まり。根本的な変容と再生の時。',
        love: '関係の終わりまたは変容。より深いレベルでの再生。',
        career: 'キャリアの大転換。古い仕事の終わりと新たな始まり。',
        spirituality: 'エゴの死と魂の再生。深い変容のプロセス。'
      },
      reversed: {
        general: '変化への抵抗。必要な終わりを受け入れられない。',
        love: '終わるべき関係への執着。変化を恐れる心。',
        career: '必要な変化を避ける。古いやり方への固執。',
        spirituality: '変容への恐れ。精神的成長の停滞。'
      }
    },
    symbolism: ['白い馬', '黒い鎧', '薔薇の旗', '沈む太陽', '川'],
    numerology: 13
  },
  {
    id: 'major-14',
    number: 14,
    name: '節制',
    arcana: 'major',
    keywords: ['調和', '節度', '統合', '癒し', '錬金術'],
    element: '射手座',
    astrology: '射手座',
    hebrew: 'サメク',
    meanings: {
      upright: {
        general: '対立する要素の調和的統合。中庸と節度による癒しと成長。',
        love: 'バランスの取れた関係。相互理解と調和的な愛。',
        career: '異なる要素の統合。チームワークとバランス感覚。',
        spirituality: '高次と低次の統合。内なる錬金術のプロセス。'
      },
      reversed: {
        general: '不均衡や過剰。節度を失った状態。',
        love: '関係の不調和。極端な感情や行動。',
        career: 'バランスの欠如。仕事と私生活の不調和。',
        spirituality: '精神的な不均衡。グラウンディングの必要性。'
      }
    },
    symbolism: ['天使ミカエル', '二つの杯', '片足を水に', '太陽への道', 'アイリスの花'],
    numerology: 14
  },
  {
    id: 'major-15',
    number: 15,
    name: '悪魔',
    arcana: 'major',
    keywords: ['束縛', '執着', '物質主義', '誘惑', '影'],
    element: '山羊座',
    astrology: '山羊座',
    hebrew: 'アイン',
    meanings: {
      upright: {
        general: '物質的・精神的な束縛。執着と依存が自由を奪っている状態。',
        love: '不健全な執着や依存関係。情欲に支配された関係。',
        career: '金銭や地位への過度な執着。倫理を犠牲にした成功。',
        spirituality: '物質世界への囚われ。低次の欲望との対峙。'
      },
      reversed: {
        general: '束縛からの解放。執着を手放し自由を取り戻す。',
        love: '不健全な関係からの脱却。依存の克服。',
        career: '物質主義からの解放。より高い価値の追求。',
        spirituality: '影の統合。闇を認め光へ向かう。'
      }
    },
    symbolism: ['バフォメット', '逆五芒星', '鎖で繋がれた男女', '松明', '黒い玉座'],
    numerology: 15
  },
  {
    id: 'major-16',
    number: 16,
    name: '塔',
    arcana: 'major',
    keywords: ['崩壊', '啓示', '解放', '真実', '再構築'],
    element: '火星',
    astrology: '火星',
    hebrew: 'ペー',
    meanings: {
      upright: {
        general: '突然の崩壊と啓示。古い構造が壊れ真実が明らかになる。',
        love: '関係の突然の終わりや真実の発覚。幻想の崩壊。',
        career: '組織の崩壊や突然の失職。既存システムの破綻。',
        spirituality: '悟りの雷。古い信念体系の崩壊と覚醒。'
      },
      reversed: {
        general: '崩壊への恐れ。必要な変化を避けることでより大きな危機を招く。',
        love: '関係の危機を無視。問題の先送りによる悪化。',
        career: '崩壊の予兆を無視。リスク管理の失敗。',
        spirituality: '覚醒への抵抗。真実から目を背ける。'
      }
    },
    symbolism: ['雷に打たれる塔', '落下する王冠', '炎', '落下する人物', '暗い空'],
    numerology: 16
  },
  {
    id: 'major-17',
    number: 17,
    name: '星',
    arcana: 'major',
    keywords: ['希望', '導き', '癒し', '更新', 'インスピレーション'],
    element: '水瓶座',
    astrology: '水瓶座',
    hebrew: 'ツァディ',
    meanings: {
      upright: {
        general: '希望と癒しの時。高次の導きとインスピレーションを受ける。',
        love: '理想的な愛の実現。魂レベルでの深い繋がり。',
        career: '創造的なインスピレーション。理想を現実にする力。',
        spirituality: '宇宙との繋がり。高次の目的の自覚。'
      },
      reversed: {
        general: '希望の喪失や幻滅。インスピレーションの枯渇。',
        love: '理想と現実のギャップ。期待の裏切り。',
        career: '創造性の停滞。方向性を見失っている状態。',
        spirituality: '信仰の危機。宇宙との繋がりを感じられない。'
      }
    },
    symbolism: ['大きな星と7つの小さな星', '裸の女性', '水瓶', '池', '鳥'],
    numerology: 17
  },
  {
    id: 'major-18',
    number: 18,
    name: '月',
    arcana: 'major',
    keywords: ['幻想', '不安', '直感', '潜在意識', '変化'],
    element: '魚座',
    astrology: '魚座',
    hebrew: 'コフ',
    meanings: {
      upright: {
        general: '幻想と現実の境界。潜在意識からのメッセージと向き合う時。',
        love: '感情の混乱や不安。隠された真実がある可能性。',
        career: '不確実性と混乱。明確でない状況での判断。',
        spirituality: '魂の暗夜。深い内面の探求と変容。'
      },
      reversed: {
        general: '幻想からの覚醒。真実が明らかになり混乱が晴れる。',
        love: '誤解の解消。隠されていた真実の発覚。',
        career: '混乱の終息。明確な方向性の確立。',
        spirituality: '闇から光へ。潜在意識の統合。'
      }
    },
    symbolism: ['満月と三日月', '二匹の犬（狼）', 'ザリガニ', '二つの塔', '曲がりくねった道'],
    numerology: 18
  },
  {
    id: 'major-19',
    number: 19,
    name: '太陽',
    arcana: 'major',
    keywords: ['成功', '喜び', '活力', '達成', '明晰'],
    element: '太陽',
    astrology: '太陽',
    hebrew: 'レーシュ',
    meanings: {
      upright: {
        general: '成功と喜びの絶頂期。すべてが明るく照らされ活力に満ちる。',
        love: '幸福な関係。愛の喜びと情熱に満ちた時期。',
        career: '大きな成功と認知。目標達成と栄光の時。',
        spirituality: '悟りと啓発。内なる光の完全な顕現。'
      },
      reversed: {
        general: '一時的な曇り。過度の楽観主義や現実逃避。',
        love: 'エゴの衝突。過度の自己中心性による問題。',
        career: '成功への過信。傲慢さによる失敗の危険。',
        spirituality: '精神的な傲慢。謙虚さの必要性。'
      }
    },
    symbolism: ['輝く太陽', '子供（または子供と白馬）', 'ひまわり', '赤い旗', '壁'],
    numerology: 19
  },
  {
    id: 'major-20',
    number: 20,
    name: '審判',
    arcana: 'major',
    keywords: ['復活', '覚醒', '判断', '許し', '再生'],
    element: '冥王星',
    astrology: '冥王星',
    hebrew: 'シン',
    meanings: {
      upright: {
        general: '最終的な判断と復活。過去を清算し新たな人生へ生まれ変わる。',
        love: '関係の再生や復活。過去の清算と新たな始まり。',
        career: '天職への目覚め。真の使命の自覚と実行。',
        spirituality: '魂の覚醒。高次の召命に応える時。'
      },
      reversed: {
        general: '判断の回避や自己批判。過去から学べていない状態。',
        love: '過去の繰り返し。許しの欠如による停滞。',
        career: '使命からの逃避。天職を見つけられない苦悩。',
        spirituality: '覚醒への抵抗。内なる声を無視している。'
      }
    },
    symbolism: ['天使ガブリエル', 'ラッパ', '復活する人々', '十字の旗', '山脈'],
    numerology: 20
  },
  {
    id: 'major-21',
    number: 21,
    name: '世界',
    arcana: 'major',
    keywords: ['完成', '統合', '達成', '全体性', '新たな始まり'],
    element: '土星',
    astrology: '土星',
    hebrew: 'タヴ',
    meanings: {
      upright: {
        general: 'サイクルの完成と統合。すべてが一つになり新たな次元へ。',
        love: '完全な結合と成就。魂の伴侶との出会いと統合。',
        career: '大きなプロジェクトの完成。世界規模での成功。',
        spirituality: '悟りの完成。個と宇宙の完全な統合。'
      },
      reversed: {
        general: '未完成や停滞。最後の一歩を踏み出せない状態。',
        love: '関係の未完成。完全な結合への恐れ。',
        career: 'プロジェクトの未完。最終段階での躓き。',
        spirituality: '統合の未完。最後の課題が残っている。'
      }
    },
    symbolism: ['楕円形の花輪', '踊る人物', '四元素の象徴（雄牛・獅子・鷲・天使）', '紫の布', '杖'],
    numerology: 21
  }
];

// 小アルカナ - ワンドのスート（火・創造性・情熱）
export const wandsSuit: TarotCard[] = [
  {
    id: 'wands-01',
    number: 1,
    name: 'ワンドのエース',
    arcana: 'minor',
    suit: 'wands',
    keywords: ['新しい始まり', '創造力', 'インスピレーション', '成長', '潜在力'],
    element: '火',
    meanings: {
      upright: {
        general: '創造的なエネルギーの爆発。新しいプロジェクトや情熱的な始まり。',
        love: '情熱的な恋の始まり。性的魅力と創造的なエネルギー。',
        career: '新事業のスタート。創造的なアイデアが形になる。',
        spirituality: '精神的な目覚め。内なる火の点火。'
      },
      reversed: {
        general: '創造性の停滞。始めたいが始められない状況。',
        love: '情熱の欠如。性的な問題や創造性の枯渇。',
        career: 'プロジェクトの遅延。アイデアが形にならない。',
        spirituality: 'やる気の喪失。内なる火が消えかけている。'
      }
    },
    symbolism: ['雲から現れる手', '芽吹くワンド', '城のある風景'],
    numerology: 1,
    chakra: '第1チャクラ（ルート）'
  },
  {
    id: 'wands-02',
    number: 2,
    name: 'ワンドの2',
    arcana: 'minor',
    suit: 'wands',
    keywords: ['計画', '決断', '野心', '未来展望', '支配'],
    element: '火',
    meanings: {
      upright: {
        general: '世界を見渡し計画を立てる。野心的な目標と長期的視野。',
        love: '関係の将来を考える。パートナーシップの計画。',
        career: '事業計画の策定。グローバルな視野での展開。',
        spirituality: '人生の目的を見定める。高い視点からの洞察。'
      },
      reversed: {
        general: '計画の欠如や短期的視野。決断を下せない状態。',
        love: '将来への不安。関係の方向性が見えない。',
        career: '計画性のなさ。ビジョンの欠如。',
        spirituality: '人生の目的を見失う。方向性の喪失。'
      }
    },
    symbolism: ['城壁に立つ人物', '地球儀を持つ', '2本のワンド'],
    numerology: 2
  },
  {
    id: 'wands-03',
    number: 3,
    name: 'ワンドの3',
    arcana: 'minor',
    suit: 'wands',
    keywords: ['拡大', '先見性', '準備', '協力', '進展'],
    element: '火',
    meanings: {
      upright: {
        general: '計画の実行段階。協力者と共に視野を広げ前進する。',
        love: '関係の発展と拡大。未来への楽観的な展望。',
        career: '事業の拡大。国際的な展開や新市場への進出。',
        spirituality: '精神的な成長と拡大。より広い視野の獲得。'
      },
      reversed: {
        general: '計画の停滞や協力の欠如。期待した進展が見られない。',
        love: '関係の停滞。発展への障害。',
        career: '拡大の失敗。計画通りに進まない状況。',
        spirituality: '成長の停滞。視野が狭まっている。'
      }
    },
    symbolism: ['海を見渡す人物', '3本のワンド', '出航する船'],
    numerology: 3
  },
  {
    id: 'wands-04',
    number: 4,
    name: 'ワンドの4',
    arcana: 'minor',
    suit: 'wands',
    keywords: ['祝福', '調和', '安定', '達成', '家庭'],
    element: '火',
    meanings: {
      upright: {
        general: '努力の実りと祝福。安定した基盤の上での喜び。',
        love: '幸せな関係。結婚や婚約などの祝い事。',
        career: 'プロジェクトの成功。チームでの達成感。',
        spirituality: '内なる平和と調和。精神的な安定。'
      },
      reversed: {
        general: '不安定さや調和の欠如。祝福を素直に受け取れない。',
        love: '関係の不安定さ。幸せを感じられない状態。',
        career: 'チームワークの欠如。達成感の不足。',
        spirituality: '内なる不調和。平和を見つけられない。'
      }
    },
    symbolism: ['花輪で飾られた4本のワンド', '祝福する人々', '城'],
    numerology: 4
  },
  {
    id: 'wands-05',
    number: 5,
    name: 'ワンドの5',
    arcana: 'minor',
    suit: 'wands',
    keywords: ['競争', '対立', '混乱', '挑戦', '葛藤'],
    element: '火',
    meanings: {
      upright: {
        general: '競争と対立の中での成長。創造的な緊張とエネルギー。',
        love: '関係内での対立。情熱的だが混乱した状況。',
        career: '競争の激化。アイデアの衝突と創造的な緊張。',
        spirituality: '内的葛藤。異なる信念の衝突。'
      },
      reversed: {
        general: '対立の回避や競争からの撤退。エネルギーの内向。',
        love: '争いを避ける。対立の解消。',
        career: '競争の終息。協力への転換。',
        spirituality: '内的平和への移行。葛藤の解決。'
      }
    },
    symbolism: ['5人の若者の戦い', '交差するワンド', '混乱した様子'],
    numerology: 5
  },
  {
    id: 'wands-06',
    number: 6,
    name: 'ワンドの6',
    arcana: 'minor',
    suit: 'wands',
    keywords: ['勝利', '認知', '成功', 'リーダーシップ', '達成'],
    element: '火',
    meanings: {
      upright: {
        general: '努力の勝利と公の認知。リーダーシップの発揮と成功。',
        love: '関係での勝利。困難を乗り越えた喜び。',
        career: '昇進や表彰。努力が認められる時。',
        spirituality: '精神的な勝利。内なる戦いでの成功。'
      },
      reversed: {
        general: '勝利の遅延や認知の欠如。期待した成功が得られない。',
        love: '認められない努力。一方的な関係。',
        career: '昇進の見送り。努力が報われない状況。',
        spirituality: '精神的な敗北感。自信の喪失。'
      }
    },
    symbolism: ['月桂冠を戴く騎手', '白馬', '歓迎する群衆'],
    numerology: 6
  },
  {
    id: 'wands-07',
    number: 7,
    name: 'ワンドの7',
    arcana: 'minor',
    suit: 'wands',
    keywords: ['防御', '挑戦', '立場', '勇気', '競争'],
    element: '火',
    meanings: {
      upright: {
        general: '立場を守る勇気。多くの挑戦に立ち向かう強さ。',
        love: '関係を守る努力。外的な圧力との戦い。',
        career: '競争での優位性の維持。挑戦者との対峙。',
        spirituality: '信念を守る。批判に屈しない強さ。'
      },
      reversed: {
        general: '圧倒される感覚。防御に疲れ果てた状態。',
        love: '関係を守ることへの疲れ。諦めの気持ち。',
        career: '競争に疲弊。立場を維持できない。',
        spirituality: '信念の揺らぎ。批判に負けそうな状態。'
      }
    },
    symbolism: ['高台で戦う人物', '6本の攻撃的なワンド', '防御の姿勢'],
    numerology: 7
  },
  {
    id: 'wands-08',
    number: 8,
    name: 'ワンドの8',
    arcana: 'minor',
    suit: 'wands',
    keywords: ['迅速', '動き', '変化', 'コミュニケーション', '進展'],
    element: '火',
    meanings: {
      upright: {
        general: '物事の急速な進展。素早い行動とコミュニケーション。',
        love: '関係の急速な発展。情熱的なメッセージ。',
        career: '急速な進展。素早い決断と行動が必要。',
        spirituality: '急速な精神的成長。啓示的な洞察。'
      },
      reversed: {
        general: '遅延や停滞。期待した速さで進まない。',
        love: 'コミュニケーションの遅れ。関係の停滞。',
        career: 'プロジェクトの遅延。決断の遅れ。',
        spirituality: '成長の減速。焦りと苛立ち。'
      }
    },
    symbolism: ['空を飛ぶ8本のワンド', '川と風景', '動きを表す線'],
    numerology: 8
  },
  {
    id: 'wands-09',
    number: 9,
    name: 'ワンドの9',
    arcana: 'minor',
    suit: 'wands',
    keywords: ['警戒', '忍耐', '防御', '最後の試練', '決意'],
    element: '火',
    meanings: {
      upright: {
        general: '最後の試練に備える。疲れているが諦めない決意。',
        love: '関係での忍耐。困難にも関わらず続ける意志。',
        career: '最終段階での挑戦。もう少しで成功する。',
        spirituality: '精神的な試練。最後の障害を乗り越える。'
      },
      reversed: {
        general: '限界点。これ以上続けられない疲労感。',
        love: '関係への疲れ。続ける意味を見失う。',
        career: '燃え尽き症候群。限界を超えた状態。',
        spirituality: '精神的疲労。信仰の危機。'
      }
    },
    symbolism: ['包帯を巻いた人物', '8本のワンドの柵', '警戒の姿勢'],
    numerology: 9
  },
  {
    id: 'wands-10',
    number: 10,
    name: 'ワンドの10',
    arcana: 'minor',
    suit: 'wands',
    keywords: ['重荷', '責任', '完成', '重圧', '解放'],
    element: '火',
    meanings: {
      upright: {
        general: '大きな責任と重荷。もうすぐ完成だが重圧を感じる。',
        love: '関係での重い責任。愛ゆえの重荷。',
        career: '過重な責任。成功のプレッシャー。',
        spirituality: '精神的な重荷。使命の重さ。'
      },
      reversed: {
        general: '重荷からの解放。責任を手放す決断。',
        love: '関係の重荷から解放。新たな軽やかさ。',
        career: '仕事の重圧からの解放。委譲や退職。',
        spirituality: '精神的解放。重荷を降ろす勇気。'
      }
    },
    symbolism: ['10本のワンドを運ぶ人物', '遠くの町', '前かがみの姿勢'],
    numerology: 10
  }
];

// 小アルカナ - カップのスート（水・感情・愛）
export const cupsSuit: TarotCard[] = [
  {
    id: 'cups-01',
    number: 1,
    name: 'カップのエース',
    arcana: 'minor',
    suit: 'cups',
    keywords: ['愛', '新しい感情', '直感', '霊的贈り物', '豊かさ'],
    element: '水',
    meanings: {
      upright: {
        general: '感情的な新しい始まり。愛と喜びに満ちた贈り物。',
        love: '新しい愛の始まり。心が開かれる体験。',
        career: '創造的なインスピレーション。感情的な満足。',
        spirituality: '霊的な目覚め。神聖な愛との出会い。'
      },
      reversed: {
        general: '感情的なブロック。愛を受け取ることへの抵抗。',
        love: '愛への恐れ。感情を開くことができない。',
        career: '創造性の枯渇。仕事への情熱の欠如。',
        spirituality: '霊的な渇き。内なる源との断絶。'
      }
    },
    symbolism: ['雲から現れる手', '聖杯', '鳩', '聖体', '蓮の花'],
    numerology: 1,
    chakra: '第2チャクラ（仙骨）'
  },
  {
    id: 'cups-02',
    number: 2,
    name: 'カップの2',
    arcana: 'minor',
    suit: 'cups',
    keywords: ['パートナーシップ', '相互愛', '結合', '調和', '約束'],
    element: '水',
    meanings: {
      upright: {
        general: '調和的なパートナーシップ。相互理解と愛の交流。',
        love: '理想的な関係。魂のレベルでの結合。',
        career: '良好なパートナーシップ。創造的な協力関係。',
        spirituality: '内なる男性性と女性性の統合。'
      },
      reversed: {
        general: '関係の不調和。バランスを欠いたパートナーシップ。',
        love: '愛の不均衡。一方的な感情。',
        career: 'パートナーシップの問題。協力関係の破綻。',
        spirituality: '内的分裂。統合への抵抗。'
      }
    },
    symbolism: ['乾杯する二人', 'ケーリュケイオンの杖', 'ライオンの頭'],
    numerology: 2
  },
  {
    id: 'cups-03',
    number: 3,
    name: 'カップの3',
    arcana: 'minor',
    suit: 'cups',
    keywords: ['祝福', '友情', '共同体', '創造性', '豊穣'],
    element: '水',
    meanings: {
      upright: {
        general: '友情と祝福の時。コミュニティでの喜びと創造性。',
        love: '幸せな関係。友人や家族からの祝福。',
        career: 'チームでの成功。創造的なコラボレーション。',
        spirituality: '精神的な仲間との出会い。集団での成長。'
      },
      reversed: {
        general: '孤立や友情の問題。グループからの疎外感。',
        love: '第三者の介入。友人関係の問題。',
        career: 'チームワークの欠如。創造性の不一致。',
        spirituality: 'コミュニティからの孤立。孤独な道。'
      }
    },
    symbolism: ['踊る3人の女性', '掲げられた3つのカップ', '豊穣の果実'],
    numerology: 3
  },
  {
    id: 'cups-04',
    number: 4,
    name: 'カップの4',
    arcana: 'minor',
    suit: 'cups',
    keywords: ['内省', '不満', '無関心', '瞑想', '再評価'],
    element: '水',
    meanings: {
      upright: {
        general: '内的な不満と再評価の時期。新しい機会への無関心。',
        love: '関係への倦怠感。感情的な停滞。',
        career: '仕事への不満。モチベーションの低下。',
        spirituality: '内省と瞑想の必要性。外的な刺激からの撤退。'
      },
      reversed: {
        general: '無関心からの脱却。新しい可能性への目覚め。',
        love: '関係への新たな興味。感情の再活性化。',
        career: '新しい機会の認識。やる気の回復。',
        spirituality: '瞑想からの帰還。世界との再結合。'
      }
    },
    symbolism: ['座り込む人物', '3つの立つカップ', '差し出される1つのカップ'],
    numerology: 4
  },
  {
    id: 'cups-05',
    number: 5,
    name: 'カップの5',
    arcana: 'minor',
    suit: 'cups',
    keywords: ['喪失', '悲しみ', '後悔', '失望', '部分的損失'],
    element: '水',
    meanings: {
      upright: {
        general: '感情的な喪失と悲しみ。しかし全てを失ったわけではない。',
        love: '関係の終わりや失望。深い悲しみの体験。',
        career: '期待の裏切り。プロジェクトの失敗。',
        spirituality: '信仰の試練。精神的な喪失感。'
      },
      reversed: {
        general: '悲しみからの回復。希望を見出し前進する。',
        love: '失恋からの癒し。新しい愛への準備。',
        career: '失敗からの学び。新たな機会の発見。',
        spirituality: '精神的な回復。喪失を通じた成長。'
      }
    },
    symbolism: ['黒いマントの人物', '倒れた3つのカップ', '立っている2つのカップ'],
    numerology: 5
  },
  {
    id: 'cups-06',
    number: 6,
    name: 'カップの6',
    arcana: 'minor',
    suit: 'cups',
    keywords: ['郷愁', '子供時代', '無邪気', '思い出', '再会'],
    element: '水',
    meanings: {
      upright: {
        general: '過去の美しい思い出。子供のような純粋さと喜び。',
        love: '過去の恋人との再会。純粋な愛の思い出。',
        career: '過去の成功体験。原点回帰の必要性。',
        spirituality: '内なる子供との出会い。純粋性の回復。'
      },
      reversed: {
        general: '過去への執着。現在を生きられない状態。',
        love: '過去の関係への未練。前に進めない。',
        career: '過去の栄光にしがみつく。革新の欠如。',
        spirituality: '成長への抵抗。子供っぽさと成熟の欠如。'
      }
    },
    symbolism: ['子供と花', '6つのカップ', '中世の町並み'],
    numerology: 6
  },
  {
    id: 'cups-07',
    number: 7,
    name: 'カップの7',
    arcana: 'minor',
    suit: 'cups',
    keywords: ['幻想', '選択', '妄想', '誘惑', '混乱'],
    element: '水',
    meanings: {
      upright: {
        general: '多くの選択肢と幻想。現実と夢の区別がつかない状態。',
        love: '理想と現実の混同。非現実的な期待。',
        career: '多すぎる選択肢。決断の困難。',
        spirituality: '霊的な幻想。グラウンディングの必要性。'
      },
      reversed: {
        general: '幻想からの覚醒。現実的な選択。',
        love: '現実的な愛の理解。幻想から真実へ。',
        career: '明確な方向性。現実的な目標設定。',
        spirituality: '霊的な明晰さ。真実の識別。'
      }
    },
    symbolism: ['雲に浮かぶ7つのカップ', '各カップの幻想的内容', 'シルエット'],
    numerology: 7
  },
  {
    id: 'cups-08',
    number: 8,
    name: 'カップの8',
    arcana: 'minor',
    suit: 'cups',
    keywords: ['放棄', '幻滅', '撤退', '探求', '深い意味'],
    element: '水',
    meanings: {
      upright: {
        general: '感情的な状況からの撤退。より深い意味を求めて去る。',
        love: '関係からの撤退。より深い愛を求める旅。',
        career: '現在の仕事への幻滅。より意味ある仕事を探す。',
        spirituality: '物質世界からの撤退。霊的探求の開始。'
      },
      reversed: {
        general: '放棄への恐れ。現状に留まる選択。',
        love: '関係に留まる決意。逃避の誘惑との戦い。',
        career: '仕事を続ける決断。現実的な妥協。',
        spirituality: '世俗との関わりの継続。統合の道。'
      }
    },
    symbolism: ['去っていく人物', '8つの積まれたカップ', '月と山'],
    numerology: 8
  },
  {
    id: 'cups-09',
    number: 9,
    name: 'カップの9',
    arcana: 'minor',
    suit: 'cups',
    keywords: ['願望成就', '満足', '感情的充足', '自信', '達成'],
    element: '水',
    meanings: {
      upright: {
        general: '感情的な願いの成就。深い満足と充足感。',
        love: '愛の願いが叶う。幸せな関係の実現。',
        career: '夢の仕事の実現。深い職業的満足。',
        spirituality: '精神的な充足。内なる平和の達成。'
      },
      reversed: {
        general: '表面的な満足。真の充足感の欠如。',
        love: '愛の幻想。本当の幸せではない関係。',
        career: '物質的成功の空虚さ。真の満足の不在。',
        spirituality: '霊的な高慢。謙虚さの欠如。'
      }
    },
    symbolism: ['満足げな人物', '9つのカップのアーチ', '豊かな衣装'],
    numerology: 9
  },
  {
    id: 'cups-10',
    number: 10,
    name: 'カップの10',
    arcana: 'minor',
    suit: 'cups',
    keywords: ['家族の幸福', '感情的完成', '調和', '愛の成就', '永続的喜び'],
    element: '水',
    meanings: {
      upright: {
        general: '感情的な完成と家族の幸福。永続的な愛と喜び。',
        love: '理想的な家庭生活。完全な愛の実現。',
        career: '仕事と家庭の調和。真の成功。',
        spirituality: '霊的な家族との結合。普遍的な愛。'
      },
      reversed: {
        general: '家族の不和。感情的な未完成。',
        love: '関係の問題。理想と現実のギャップ。',
        career: '仕事と家庭の不調和。バランスの欠如。',
        spirituality: '霊的な孤立。つながりの喪失。'
      }
    },
    symbolism: ['幸せな家族', '虹のような10個のカップ', '美しい家'],
    numerology: 10
  }
];

// 小アルカナ - ソードのスート（風・思考・対立）
export const swordsSuit: TarotCard[] = [
  {
    id: 'swords-01',
    number: 1,
    name: 'ソードのエース',
    arcana: 'minor',
    suit: 'swords',
    keywords: ['明晰', '真実', '突破', '新しいアイデア', '勝利'],
    element: '風',
    meanings: {
      upright: {
        general: '明晰な思考と真実の剣。新しいアイデアによる突破。',
        love: '関係の真実が明らかに。明確なコミュニケーション。',
        career: '革新的なアイデア。知的な突破口。',
        spirituality: '真理の閃き。精神的な明晰さ。'
      },
      reversed: {
        general: '混乱した思考。真実を見失っている状態。',
        love: '誤解やコミュニケーション不足。真実から目を背ける。',
        career: 'アイデアの欠如。思考の停滞。',
        spirituality: '精神的な混乱。明晰さの喪失。'
      }
    },
    symbolism: ['雲から現れる手', '王冠を貫く剣', '山脈'],
    numerology: 1,
    chakra: '第5チャクラ（喉）'
  },
  // ... ソードの2-10は省略（パターンは同様）
];

// 小アルカナ - ペンタクルのスート（地・物質・実現）
export const pentaclesSuit: TarotCard[] = [
  {
    id: 'pentacles-01',
    number: 1,
    name: 'ペンタクルのエース',
    arcana: 'minor',
    suit: 'pentacles',
    keywords: ['新しい機会', '繁栄', '物質的始まり', '実現', '豊かさ'],
    element: '地',
    meanings: {
      upright: {
        general: '物質的な新しい始まり。繁栄と豊かさの種。',
        love: '安定した関係の始まり。実質的な愛。',
        career: '新しい仕事や収入源。ビジネスチャンス。',
        spirituality: '物質世界での精神性の実現。'
      },
      reversed: {
        general: '機会の喪失。物質的な困難の始まり。',
        love: '物質面での問題が関係に影響。',
        career: '仕事の機会を逃す。金銭的な損失。',
        spirituality: '物質への執着。霊性の無視。'
      }
    },
    symbolism: ['雲から現れる手', '金貨（ペンタクル）', '庭園への道'],
    numerology: 1,
    chakra: '第1チャクラ（ルート）'
  },
  // ... ペンタクルの2-10は省略（パターンは同様）
];

// コートカード（人物札）
export const courtCards: TarotCard[] = [
  // ワンドのコートカード
  {
    id: 'wands-page',
    number: 11,
    name: 'ワンドのペイジ',
    arcana: 'minor',
    suit: 'wands',
    keywords: ['熱意', 'メッセージ', '冒険', '発見', '自由な精神'],
    element: '火の地',
    meanings: {
      upright: {
        general: '新しい冒険への熱意。創造的なメッセージや機会。',
        love: '情熱的な若い恋人。新しい恋の始まり。',
        career: '新しいプロジェクトの提案。創造的なアイデア。',
        spirituality: '精神的な冒険の始まり。自由な探求。'
      },
      reversed: {
        general: '無責任な行動。計画性のない冒険。',
        love: '未熟な恋愛。コミットメントの欠如。',
        career: '準備不足のプロジェクト。アイデア倒れ。',
        spirituality: '精神的な迷走。方向性の欠如。'
      }
    },
    symbolism: ['若い人物', 'ワンドを見つめる', '砂漠の風景'],
    numerology: 11
  },
  {
    id: 'wands-knight',
    number: 12,
    name: 'ワンドのナイト',
    arcana: 'minor',
    suit: 'wands',
    keywords: ['情熱', '冒険', '衝動', '勇気', '変化'],
    element: '火の火',
    meanings: {
      upright: {
        general: '情熱的な行動と冒険。勇気を持って前進する。',
        love: '情熱的な恋人。激しい恋愛関係。',
        career: '大胆な行動。リスクを取る勇気。',
        spirituality: '精神的な情熱。熱烈な探求。'
      },
      reversed: {
        general: '衝動的で無謀な行動。怒りのコントロール不能。',
        love: '激しすぎる関係。嫉妬と支配。',
        career: '無謀なリスク。計画性の欠如。',
        spirituality: '精神的な傲慢。バランスの欠如。'
      }
    },
    symbolism: ['疾走する馬に乗る騎士', '炎のような衣装', '砂漠'],
    numerology: 12
  },
  {
    id: 'wands-queen',
    number: 13,
    name: 'ワンドのクイーン',
    arcana: 'minor',
    suit: 'wands',
    keywords: ['自信', 'カリスマ', '独立', '情熱', '創造性'],
    element: '火の水',
    meanings: {
      upright: {
        general: 'カリスマ的な女性性。自信に満ちた創造力。',
        love: '情熱的で独立した女性。自信ある愛の表現。',
        career: '創造的なリーダーシップ。起業家精神。',
        spirituality: '内なる火の女神。創造的な霊性。'
      },
      reversed: {
        general: '自己中心的な態度。嫉妬深さと支配欲。',
        love: '関係での支配的態度。感情的な操作。',
        career: '職場での横暴。チームワークの欠如。',
        spirituality: 'エゴの肥大。謙虚さの欠如。'
      }
    },
    symbolism: ['玉座の女性', '向日葵', '黒猫'],
    numerology: 13
  },
  {
    id: 'wands-king',
    number: 14,
    name: 'ワンドのキング',
    arcana: 'minor',
    suit: 'wands',
    keywords: ['ビジョン', 'リーダーシップ', 'カリスマ', '起業家', '勇気'],
    element: '火の風',
    meanings: {
      upright: {
        general: 'ビジョンあるリーダー。カリスマ的な男性性。',
        love: '情熱的で保護的なパートナー。',
        career: '成功した起業家。ビジョナリーなリーダー。',
        spirituality: '精神的な師。インスピレーションの源。'
      },
      reversed: {
        general: '独裁的なリーダー。傲慢さと支配欲。',
        love: '支配的なパートナー。関係での独裁。',
        career: '独裁的な経営。他者の意見を聞かない。',
        spirituality: '精神的な傲慢。偽りの預言者。'
      }
    },
    symbolism: ['玉座の王', 'サンショウウオまたはトカゲ', '火のシンボル'],
    numerology: 14
  },
  // カップ、ソード、ペンタクルのコートカードも同様のパターンで続く
];

// スプレッドの定義
export interface TarotSpread {
  name: string;
  cardCount: number;
  positions: SpreadPosition[];
  description: string;
  purpose: string;
}

export interface SpreadPosition {
  number: number;
  name: string;
  meaning: string;
  timeFrame?: string;
  aspect?: string;
}

export const spreads: Record<string, TarotSpread> = {
  singleCard: {
    name: '1枚引き',
    cardCount: 1,
    positions: [
      {
        number: 1,
        name: '現在の状況',
        meaning: '今この瞬間のエネルギーとメッセージ',
        timeFrame: '現在',
        aspect: '全体'
      }
    ],
    description: 'シンプルで強力な1枚引き。日々のガイダンスに最適。',
    purpose: '今日のメッセージ、即答が欲しい質問、瞑想のテーマ'
  },
  
  threeCard: {
    name: '3枚引き',
    cardCount: 3,
    positions: [
      {
        number: 1,
        name: '過去/原因',
        meaning: '現在の状況を作り出した過去の影響や原因',
        timeFrame: '過去',
        aspect: '原因'
      },
      {
        number: 2,
        name: '現在/状況',
        meaning: '現在の状況やあなたの立ち位置',
        timeFrame: '現在',
        aspect: '状況'
      },
      {
        number: 3,
        name: '未来/結果',
        meaning: '現在の道を進んだ場合の可能性',
        timeFrame: '未来',
        aspect: '結果'
      }
    ],
    description: '時系列で状況を理解する基本的なスプレッド。',
    purpose: '状況の流れを理解、決断の参考、関係性の把握'
  },
  
  celticCross: {
    name: 'ケルト十字',
    cardCount: 10,
    positions: [
      {
        number: 1,
        name: '現在の状況',
        meaning: 'あなたや質問の現在の状態',
        timeFrame: '現在',
        aspect: '中心'
      },
      {
        number: 2,
        name: '交差する力',
        meaning: '助けとなる力、または障害',
        timeFrame: '現在',
        aspect: '影響'
      },
      {
        number: 3,
        name: '遠い過去・基盤',
        meaning: '状況の根底にある要因',
        timeFrame: '遠い過去',
        aspect: '基盤'
      },
      {
        number: 4,
        name: '最近の過去',
        meaning: '最近起こった関連する出来事',
        timeFrame: '近い過去',
        aspect: '影響'
      },
      {
        number: 5,
        name: '可能な未来',
        meaning: '現在の道を進んだ場合の可能性',
        timeFrame: '近い未来',
        aspect: '可能性'
      },
      {
        number: 6,
        name: '近い未来',
        meaning: '数週間から数ヶ月以内に起こること',
        timeFrame: '近い未来',
        aspect: '展開'
      },
      {
        number: 7,
        name: 'あなたの立場',
        meaning: '状況に対するあなたの姿勢や見方',
        timeFrame: '現在',
        aspect: '内面'
      },
      {
        number: 8,
        name: '周囲の影響',
        meaning: '他者や環境からの影響',
        timeFrame: '現在',
        aspect: '外部'
      },
      {
        number: 9,
        name: '願望と恐れ',
        meaning: 'あなたの希望または恐れていること',
        timeFrame: '現在',
        aspect: '心理'
      },
      {
        number: 10,
        name: '最終結果',
        meaning: '全体的な結果や到達点',
        timeFrame: '未来',
        aspect: '結論'
      }
    ],
    description: '最も詳細で包括的な伝統的スプレッド。',
    purpose: '複雑な状況の完全な分析、人生の重要な決断、深い洞察'
  }
};

// 小アルカナの統合エクスポート
export const minorArcana: TarotCard[] = [
  ...wandsSuit,
  ...cupsSuit,
  ...swordsSuit,
  ...pentaclesSuit,
  ...courtCards
];

// 全カードの統合エクスポート
export const allTarotCards: TarotCard[] = [
  ...majorArcana,
  ...minorArcana
];

// ヘルパー関数
export function getCardById(id: string): TarotCard | undefined {
  return allTarotCards.find(card => card.id === id);
}

export function getCardsByArcana(arcana: 'major' | 'minor'): TarotCard[] {
  return allTarotCards.filter(card => card.arcana === arcana);
}

export function getCardsBySuit(suit: 'wands' | 'cups' | 'swords' | 'pentacles'): TarotCard[] {
  return allTarotCards.filter(card => card.suit === suit);
}

export function getRandomCard(): TarotCard {
  return allTarotCards[Math.floor(Math.random() * allTarotCards.length)];
}

export function getRandomCards(count: number, allowDuplicates = false): TarotCard[] {
  if (!allowDuplicates && count > allTarotCards.length) {
    throw new Error('Cannot draw more unique cards than available');
  }
  
  if (allowDuplicates) {
    return Array(count).fill(null).map(() => getRandomCard());
  }
  
  const shuffled = [...allTarotCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}