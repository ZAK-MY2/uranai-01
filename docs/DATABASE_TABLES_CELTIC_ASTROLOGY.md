# ケルト占星術データベース表

ケルト占星術（Celtic Astrology）の完全なデータベース表構造です。古代ケルト民族の樹木崇拝とドルイドの智慧に基づく13の聖なる樹と月の暦システムを実装します。

## 📊 主要データベーステーブル

### 1. ケルト樹木暦テーブル (celtic_tree_calendar)

```sql
CREATE TABLE celtic_tree_calendar (
    id SERIAL PRIMARY KEY,
    tree_number INTEGER NOT NULL UNIQUE, -- 1-13
    ogham_name VARCHAR(30) NOT NULL, -- オガム文字での樹名
    english_name VARCHAR(50) NOT NULL, -- 英語名
    japanese_name VARCHAR(50) NOT NULL, -- 日本語名
    scientific_name VARCHAR(100) NOT NULL, -- 学名
    start_date VARCHAR(20) NOT NULL, -- 開始日（月/日形式）
    end_date VARCHAR(20) NOT NULL, -- 終了日（月/日形式）
    lunar_month INTEGER NOT NULL, -- 月の番号
    ogham_symbol VARCHAR(10) NOT NULL, -- オガム文字
    celtic_deity VARCHAR(50), -- 対応ケルトの神
    element VARCHAR(20) NOT NULL, -- 四大元素
    planetary_ruler VARCHAR(30) NOT NULL, -- 支配惑星
    color VARCHAR(30) NOT NULL, -- 対応色
    sacred_animal VARCHAR(50), -- 聖なる動物
    crystal_stone VARCHAR(50), -- 対応石
    tree_wisdom TEXT NOT NULL, -- 樹の智慧
    personality_traits TEXT[] NOT NULL, -- 性格特性
    spiritual_gifts TEXT[] NOT NULL, -- 霊的ギフト
    life_challenges TEXT[] NOT NULL, -- 人生の課題
    druid_teaching TEXT NOT NULL, -- ドルイドの教え
    seasonal_energy TEXT NOT NULL -- 季節のエネルギー
);

-- ケルト樹木暦データ挿入
INSERT INTO celtic_tree_calendar VALUES
(1, 1, 'Beith', 'Birch', '白樺(バーチ)', 'Betula', '12/24', '1/20', 1, 'ᚁ', 'Brigid', '風', 'Venus', '白・銀', '白鹿', 'ムーンストーン', 
'新しい始まりと浄化の樹。すべてを清め、新たな道を照らす。', 
ARRAY['先駆的', '純粋', '直感的', '適応力', '清らか'], 
ARRAY['浄化能力', '新生の力', '直感', '癒し', '指導力'], 
ARRAY['過度の理想主義', '現実逃避', '他者への厳しさ', '完璧主義'], 
'真の始まりには浄化が必要である。古いものを手放し、新しい光に向かって歩め。',
'冬至の再生エネルギー、新年の希望と純粋性'),

(2, 2, 'Luis', 'Rowan', 'ナナカマド(ローワン)', 'Sorbus aucuparia', '1/21', '2/17', 2, 'ᚂ', 'Brigantia', '火', 'Mars', '赤・橙', '龍', 'ガーネット',
'保護と洞察の樹。邪悪なものから身を守り、真実を見抜く力を与える。',
ARRAY['保護的', '洞察力', '勇敢', '直感的', '魔術的'],
ARRAY['霊的保護', '真実の洞察', '予知能力', '治癒力', '魔術的才能'],
ARRAY['過度の疑い深さ', '他者への不信', '魔術への依存', '孤立感'],
'真の力は内なる光から生まれる。恐れを手放し、愛の光で世界を照らせ。',
'水瓶座の季節、革新と保護のエネルギー'),

(3, 3, 'Fearn', 'Alder', 'ハンノキ(アルダー)', 'Alnus', '2/18', '3/17', 3, 'ᚃ', 'Bran', '火', 'Mars', '赤', '熊', 'ルビー',
'勇気と指導力の樹。困難に立ち向かい、他者を導く力を持つ。',
ARRAY['勇敢', 'リーダーシップ', '犠牲的', '保護的', '決断力'],
ARRAY['指導力', '勇気', '犠牲的愛', '戦略的思考', '保護能力'],
ARRAY['無謀さ', '独断的', '過度の責任感', '他者への支配'],
'真の勇気は愛から生まれる。自己犠牲ではなく、智慧ある行動を選べ。',
'魚座の終わりの浄化エネルギー、春分前の準備'),

(4, 4, 'Saille', 'Willow', '柳(ウィロー)', 'Salix', '3/18', '4/14', 4, 'ᚄ', 'Brigid', '水', 'Moon', '黄緑', '兎', 'ムーンストーン',
'直感と月の智慧の樹。感情の流れを理解し、心の奥深くを見つめる。',
ARRAY['直感的', '感情豊か', '柔軟', '神秘的', '受容的'],
ARRAY['月の智慧', '予知夢', '感情の理解', '癒しの力', '水の魔術'],
ARRAY['感情の不安定', '過度の感受性', '現実逃避', '依存的'],
'感情は川のように流れるもの。それに逆らわず、智慧をもって導け。',
'牡羊座の春のエネルギー、新生と成長の始まり'),

(5, 5, 'Huathe', 'Hawthorn', 'サンザシ(ホーソーン)', 'Crataegus', '4/15', '5/12', 5, 'ᚆ', 'Olwen', '火', 'Mars', '白・ピンク', '独角獣', 'ローズクォーツ',
'愛と保護の樹。心を開き、真の愛を見つける力を与える。',
ARRAY['愛情深い', '保護的', '純粋', '献身的', '浄化'],
ARRAY['無条件の愛', '心の浄化', '関係の癒し', '美の感受', '保護魔術'],
ARRAY['過度の献身', '他者への依存', '理想化', '失恋の痛み'],
'真の愛は自由である。束縛せず、条件をつけず、ただ愛せよ。',
'牡牛座の安定エネルギー、愛と美の開花'),

(6, 6, 'Duir', 'Oak', '樫(オーク)', 'Quercus', '5/13', '6/9', 6, 'ᚇ', 'Dagda', '火', 'Jupiter', '茶・金', '鷹', 'シトリン',
'力と持続の樹。不屈の精神と王者の風格を持つ、森の王。',
ARRAY['強力', '持続力', '王者的', '正義感', '威厳'],
ARRAY['不屈の精神', '指導力', '正義の実行', '保護力', '王者の威厳'],
ARRAY['頑固さ', 'プライド', '独断的', '変化への抵抗'],
'真の王は力ではなく、智慧と慈悲で統治する。謙虚さを忘れるな。',
'双子座の多様性エネルギー、知識と力の統合'),

(7, 7, 'Tinne', 'Holly', 'ヒイラギ(ホリー)', 'Ilex', '6/10', '7/7', 7, 'ᚈ', 'Lugh', '火', 'Mars', '深緑・赤', '馬', 'エメラルド',
'犠牲と再生の樹。困難を乗り越え、より高い目的のために自己を捧げる。',
ARRAY['犠牲的', '高潔', '保護的', '戦略的', '再生力'],
ARRAY['犠牲的愛', '高い理想', '戦略的思考', '再生能力', '保護魔術'],
ARRAY['殉教者複合', '過度の自己犠牲', '他者への期待', '完璧主義'],
'真の犠牲は愛から生まれる。自己否定ではなく、より大きな愛のために行動せよ。',
'蟹座の家族愛エネルギー、保護と養育の力'),

(8, 8, 'Coll', 'Hazel', 'ハシバミ(ヘーゼル)', 'Corylus', '7/8', '8/4', 8, 'ᚉ', 'Manannan', '風', 'Mercury', '黄・茶', 'サーモン', 'アンバー',
'智慧と知識の樹。隠された真実を見つけ、深い理解を得る力を持つ。',
ARRAY['知的', '洞察力', '学習欲', 'コミュニケーション', '探求心'],
ARRAY['深い智慧', '隠れた知識', '直感的理解', '教育能力', '占術的才能'],
ARRAY['知識の傲慢', '理論偏重', '批判的', '完璧主義'],
'知識は智慧に、智慧は愛に変えよ。学ぶことの目的は他者への奉仕である。',
'獅子座の創造エネルギー、知識と表現の調和'),

(9, 9, 'Quert', 'Apple', '林檎(アップル)', 'Malus', '8/5', '9/1', 9, 'ᚊ', 'Rhiannon', '風', 'Venus', 'ピンク・緑', '白馬', 'ローズクォーツ',
'愛と美の樹。心の純粋さと無条件の愛を教える、魂の故郷。',
ARRAY['愛情豊か', '美的感覚', '治癒力', '純粋', '魅力的'],
ARRAY['無条件の愛', '美の創造', '心の癒し', '調和の力', '魅力'],
ARRAY['理想主義', '現実逃避', '依存的', '完璧主義'],
'真の美は内面から輝く。外見ではなく、魂の美しさを育てよ。',
'乙女座の完成エネルギー、愛と美の成熟'),

(10, 10, 'Muin', 'Vine', '葡萄(ヴァイン)', 'Vitis', '9/2', '9/29', 10, 'ᚋ', 'Airmid', '水', 'Venus', '紫・緑', '白鳥', 'アメジスト',
'豊穣と変容の樹。人生の実りを味わい、経験を智慧に変える力を持つ。',
ARRAY['豊穣', '変容', '享楽的', '社交的', '芸術的'],
ARRAY['豊かさの創造', '変容の力', '芸術的才能', '社交能力', '治癒の力'],
ARRAY['過度の享楽', '依存症', '表面的', '責任回避'],
'真の豊かさは物質ではなく、魂の充実にある。与えることで受け取れ。',
'天秤座の調和エネルギー、バランスと美の追求'),

(11, 11, 'Gort', 'Ivy', '蔦(アイビー)', 'Hedera', '9/30', '10/27', 11, 'ᚌ', 'Gwydion', '水', 'Saturn', '深緑', '蝶', 'オパール',
'持続と変容の樹。どんな環境でも生き延び、美しく成長する力を持つ。',
ARRAY['持続力', '適応力', '美的', '神秘的', '変容'],
ARRAY['不屈の精神', '美的感覚', '神秘的洞察', '変容の力', '治癒能力'],
ARRAY['執着', '束縛', '支配的', '変化への抵抗'],
'真の強さは柔軟性にある。固執せず、流れに従いながら自分を保て。',
'蠍座の変容エネルギー、死と再生の神秘'),

(12, 12, 'Pethboc', 'Reed', '葦(リード)', 'Phragmites', '10/28', '11/24', 12, 'ᚚ', 'Pwyll', '水', 'Pluto', '深紅・黒', '猫', 'オブシディアン',
'神秘と変容の樹。隠された真実を暴き、深い変容をもたらす力を持つ。',
ARRAY['神秘的', '探求心', '変容力', '洞察力', '魔術的'],
ARRAY['深い洞察', '神秘的知識', '変容の力', '再生能力', '魔術的才能'],
ARRAY['過度の神秘主義', '破壊的', '執着', '孤立'],
'真の魔術は愛である。力を求めるのではなく、奉仕のために使え。',
'射手座への移行エネルギー、探求と変容の力'),

(13, 13, 'Ruis', 'Elder', '接骨木(エルダー)', 'Sambucus', '11/25', '12/23', 13, 'ᚏ', 'Cailleach', '水', 'Saturn', '白・黒', 'カラス', 'ジェット',
'智慧と終わりの樹。人生の集大成として、深い智慧と理解をもたらす。',
ARRAY['智慧', '成熟', '終了', '理解', '慈悲'],
ARRAY['深い智慧', '人生の理解', '慈悲の心', '指導能力', 'スピリチュアルな洞察'],
ARRAY['悲観的', '孤独感', '過去への執着', '諦めの心'],
'終わりは新しい始まりである。経験を智慧に変え、後に続く者を導け。',
'山羊座の成熟エネルギー、完成と新たな始まりの準備');
```

### 2. オガム文字テーブル (celtic_ogham_alphabet)

```sql
CREATE TABLE celtic_ogham_alphabet (
    id SERIAL PRIMARY KEY,
    ogham_letter VARCHAR(10) NOT NULL UNIQUE,
    letter_name VARCHAR(30) NOT NULL,
    tree_association VARCHAR(50),
    divinatory_meaning TEXT NOT NULL,
    upright_meaning TEXT NOT NULL,
    reversed_meaning TEXT NOT NULL,
    elemental_association VARCHAR(20),
    magical_properties TEXT[] NOT NULL,
    meditation_focus TEXT NOT NULL
);

-- オガム文字データ
INSERT INTO celtic_ogham_alphabet VALUES
('ᚁ', 'Beith', 'Birch', '新しい始まり、浄化、再生。古いものを清め、新しい道を開く。',
'新たな始まり、浄化、希望、清らかな意図', '過去への執着、停滞、浄化の拒否',
'風', ARRAY['浄化', '新生', '保護', '清めの儀式'], '純白の光に包まれた新しい道の瞑想'),

('ᚂ', 'Luis', 'Rowan', '保護、洞察、魔術的防御。邪悪なものから身を守る力。',
'保護、洞察、真実の発見、霊的防御', '誤った判断、保護の欠如、騙されやすさ',
'火', ARRAY['霊的保護', '真実の洞察', '魔除け', '予知'], '赤い炎に守られた聖域の瞑想'),

('ᚃ', 'Fearn', 'Alder', '指導力、勇気、犠牲的愛。他者のために立ち上がる力。',
'勇気ある指導、正義の実行、犠牲的愛', '無謀さ、独断的態度、過度の犠牲',
'火', ARRAY['指導力', '勇気', '正義', '戦略'], '勇敢な戦士の心を持つ指導者の瞑想');
-- 残りのオガム文字も同様に追加...
```

### 3. ケルト季節暦テーブル (celtic_seasonal_calendar)

```sql
CREATE TABLE celtic_seasonal_calendar (
    id SERIAL PRIMARY KEY,
    season_name VARCHAR(50) NOT NULL,
    start_date VARCHAR(20) NOT NULL,
    end_date VARCHAR(20) NOT NULL,
    celtic_festival VARCHAR(50), -- サウィン、インボルク、ベルテーン、ルーナサ
    spiritual_theme TEXT NOT NULL,
    energy_quality TEXT NOT NULL,
    recommended_practices TEXT[] NOT NULL,
    dominant_trees INTEGER[] NOT NULL, -- 対応する樹木のID
    elemental_focus VARCHAR(20) NOT NULL,
    deity_associations TEXT[] NOT NULL
);

-- ケルト季節暦データ
INSERT INTO celtic_seasonal_calendar VALUES
(1, '冬至から春分前', '12/21', '3/20', 'Imbolc', '内省と準備、新生への準備',
'静寂と瞑想のエネルギー、内なる光の育成',
ARRAY['瞑想', '内省', '浄化儀式', '新年の目標設定', '霊的学習'],
ARRAY[1, 2, 3], '風', ARRAY['Brigid', 'Cailleach', 'Brigantia']),

(2, '春分から夏至前', '3/21', '6/20', 'Beltane', '成長と創造、愛の開花',
'成長と拡大のエネルギー、創造力の開花',
ARRAY['ガーデニング', '創作活動', '愛の儀式', '新しい関係', '芸術的表現'],
ARRAY[4, 5, 6], '地', ARRAY['Brigid', 'Olwen', 'Dagda']),

(3, '夏至から秋分前', '6/21', '9/22', 'Lughnasadh', '収穫と達成、力の頂点',
'完成と収穫のエネルギー、力の頂点',
ARRAY['収穫祭', '達成の祝い', '力の儀式', '知識の共有', '指導活動'],
ARRAY[7, 8, 9], '火', ARRAY['Lugh', 'Manannan', 'Rhiannon']),

(4, '秋分から冬至前', '9/23', '12/20', 'Samhain', '変容と終了、祖先との交流',
'変容と手放しのエネルギー、死と再生',
ARRAY['祖先の祭り', '手放しの儀式', '変容の瞑想', '魔術的修行', '霊的交流'],
ARRAY[10, 11, 12, 13], '水', ARRAY['Gwydion', 'Pwyll', 'Cailleach']);
```

### 4. ケルト個人分析テーブル (celtic_personal_analysis)

```sql
CREATE TABLE celtic_personal_analysis (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    birth_date DATE NOT NULL,
    birth_tree INTEGER NOT NULL, -- 生まれた樹
    supporting_tree INTEGER, -- 支援する樹
    challenging_tree INTEGER, -- 挑戦する樹
    life_season VARCHAR(50) NOT NULL, -- 人生の季節
    elemental_nature VARCHAR(20) NOT NULL, -- 基本エレメント
    druid_path VARCHAR(100) NOT NULL, -- ドルイドの道
    tree_wisdom TEXT NOT NULL, -- 樹の智慧
    spiritual_gifts TEXT[] NOT NULL,
    life_challenges TEXT[] NOT NULL,
    recommended_practices TEXT[] NOT NULL,
    sacred_places TEXT[] NOT NULL,
    FOREIGN KEY (birth_tree) REFERENCES celtic_tree_calendar(tree_number),
    FOREIGN KEY (supporting_tree) REFERENCES celtic_tree_calendar(tree_number),
    FOREIGN KEY (challenging_tree) REFERENCES celtic_tree_calendar(tree_number)
);
```

### 5. ケルト相性分析テーブル (celtic_compatibility)

```sql
CREATE TABLE celtic_compatibility (
    id SERIAL PRIMARY KEY,
    tree1 INTEGER NOT NULL,
    tree2 INTEGER NOT NULL,
    compatibility_score INTEGER NOT NULL, -- 1-10
    relationship_nature TEXT NOT NULL,
    elemental_harmony VARCHAR(50) NOT NULL, -- 四大元素の調和
    strengths TEXT[] NOT NULL,
    challenges TEXT[] NOT NULL,
    spiritual_purpose TEXT NOT NULL,
    growth_path TEXT NOT NULL,
    recommended_rituals TEXT[] NOT NULL,
    FOREIGN KEY (tree1) REFERENCES celtic_tree_calendar(tree_number),
    FOREIGN KEY (tree2) REFERENCES celtic_tree_calendar(tree_number)
);

-- 相性データの例
INSERT INTO celtic_compatibility VALUES
(1, 1, 1, 7, 'Birch-Birch', '風と風の調和',
ARRAY['共通の理想', '純粋性', '新しいことへの挑戦', '清らかな愛'],
ARRAY['現実逃避', '完璧主義', '変化への恐れ', '理想化'],
'共に純粋な心で新しい世界を創造する使命',
'互いの純粋性を保ちながら、現実的な目標に向かって成長',
ARRAY['白い花の儀式', '新月の瞑想', '清めの泉での祈り']),

(2, 1, 6, 9, 'Birch-Oak', '風と火の調和',
ARRAY['革新と安定', '理想と現実', '清らかさと力', '新しさと伝統'],
ARRAY['価値観の違い', 'ペースの違い', '理想と現実のギャップ'],
'新しい智慧を古い伝統に統合し、時代に適応した価値を創造',
'白樺の革新性と樫の安定性を組み合わせた、バランスの取れた成長',
ARRAY['森の王と新生の女神の儀式', '満月と新月の瞑想', '聖なる森での誓い']);
```

### 6. オガム占術スプレッドテーブル (celtic_ogham_spreads)

```sql
CREATE TABLE celtic_ogham_spreads (
    id SERIAL PRIMARY KEY,
    spread_name VARCHAR(100) NOT NULL,
    spread_description TEXT NOT NULL,
    position_count INTEGER NOT NULL,
    positions JSON NOT NULL, -- 各位置の説明
    usage_purpose TEXT NOT NULL,
    difficulty_level INTEGER NOT NULL -- 1-5
);

-- オガムスプレッドデータ
INSERT INTO celtic_ogham_spreads VALUES
(1, '三つの世界', 'ケルトの三つの世界（上の世界、中の世界、下の世界）を表す3枚引き',
3, '{"1": "上の世界（霊的領域・神々の意志）", "2": "中の世界（現実世界・現在の状況）", "3": "下の世界（潜在意識・隠れた影響）"}',
'総合的な状況の把握と霊的指導', 2),

(2, '年輪の智慧', '樹の年輪のように、過去・現在・未来の成長を見る5枚引き',
5, '{"1": "根（過去の影響）", "2": "幹（現在の状況）", "3": "枝（近い未来）", "4": "葉（遠い未来）", "5": "実（最終結果）"}',
'人生の成長過程と将来展望', 3),

(3, 'ドルイドの十字', 'ケルト十字をモチーフにした詳細分析の10枚引き',
10, '{"1": "現在の状況", "2": "課題・障害", "3": "遠い過去", "4": "近い過去", "5": "可能な未来", "6": "近い未来", "7": "あなたの態度", "8": "周囲の影響", "9": "希望と恐れ", "10": "最終結果"}',
'複雑な問題の詳細分析', 5);
```

### 7. ケルト魔術・儀式テーブル (celtic_rituals_magic)

```sql
CREATE TABLE celtic_rituals_magic (
    id SERIAL PRIMARY KEY,
    ritual_name VARCHAR(100) NOT NULL,
    tree_association INTEGER NOT NULL,
    purpose TEXT NOT NULL,
    season VARCHAR(30) NOT NULL,
    moon_phase VARCHAR(30) NOT NULL,
    materials_needed TEXT[] NOT NULL,
    procedure TEXT NOT NULL,
    incantation TEXT,
    expected_results TEXT NOT NULL,
    cautions TEXT[] NOT NULL,
    FOREIGN KEY (tree_association) REFERENCES celtic_tree_calendar(tree_number)
);

-- 儀式データの例
INSERT INTO celtic_rituals_magic VALUES
(1, '白樺の浄化儀式', 1, '過去の束縛から解放され、新しい人生を始める',
'冬', '新月', 
ARRAY['白樺の枝', '白いろうそく', '清水', '海塩', '白い花'],
'1. 白いろうそくに火を灯す\n2. 海塩を清水に溶かし、聖水を作る\n3. 白樺の枝で聖水を自分に振りかける\n4. 過去の不要なエネルギーを手放す意図を込める\n5. 新しい始まりへの感謝を捧げる',
'浄化の光よ、我を清め給え。古きを去らせ、新しき道を照らし給え。',
'心身の浄化、新しい機会の到来、過去のトラウマの解放',
ARRAY['真剣な意図が必要', '軽い気持ちで行わない', '定期的な実践が効果的']),

(2, '樫の力の儀式', 6, '内なる力を覚醒し、リーダーシップを発揮する',
'夏', '満月',
ARRAY['樫の枝', '金のろうそく', '琥珀', 'シトリン', '蜂蜜'],
'1. 金のろうそくを東西南北に配置\n2. 中央に樫の枝を置く\n3. 琥珀とシトリンを手に持つ\n4. 力の覚醒を祈る\n5. 蜂蜜を少し味わい、甘い勝利を感謝する',
'森の王よ、我に力を与え給え。正義の心と智慧の光で、人々を導かん。',
'指導力の向上、困難な決断への勇気、権威ある立場への準備',
ARRAY['権力の乱用に注意', '謙虚さを忘れない', '他者への奉仕の心を保つ']);
```

## 🔄 計算アルゴリズム

### 1. 誕生樹計算関数

```sql
-- 誕生日から対応する樹を計算
CREATE OR REPLACE FUNCTION get_birth_tree(birth_date DATE)
RETURNS INTEGER AS $$
DECLARE
    birth_month INTEGER := EXTRACT(MONTH FROM birth_date);
    birth_day INTEGER := EXTRACT(DAY FROM birth_date);
    tree_id INTEGER;
BEGIN
    SELECT tree_number INTO tree_id
    FROM celtic_tree_calendar
    WHERE (birth_month = CAST(split_part(start_date, '/', 1) AS INTEGER) 
           AND birth_day >= CAST(split_part(start_date, '/', 2) AS INTEGER))
       OR (birth_month = CAST(split_part(end_date, '/', 1) AS INTEGER) 
           AND birth_day <= CAST(split_part(end_date, '/', 2) AS INTEGER))
       OR (birth_month > CAST(split_part(start_date, '/', 1) AS INTEGER) 
           AND birth_month < CAST(split_part(end_date, '/', 1) AS INTEGER));
    
    RETURN tree_id;
END;
$$ LANGUAGE plpgsql;
```

### 2. 季節エネルギー計算

```sql
-- 現在の季節エネルギーを取得
CREATE OR REPLACE FUNCTION get_current_seasonal_energy()
RETURNS TEXT AS $$
DECLARE
    current_month INTEGER := EXTRACT(MONTH FROM CURRENT_DATE);
    current_day INTEGER := EXTRACT(DAY FROM CURRENT_DATE);
    season_energy TEXT;
BEGIN
    SELECT energy_quality INTO season_energy
    FROM celtic_seasonal_calendar
    WHERE (current_month = CAST(split_part(start_date, '/', 1) AS INTEGER) 
           AND current_day >= CAST(split_part(start_date, '/', 2) AS INTEGER))
       OR (current_month = CAST(split_part(end_date, '/', 1) AS INTEGER) 
           AND current_day <= CAST(split_part(end_date, '/', 2) AS INTEGER))
       OR (current_month > CAST(split_part(start_date, '/', 1) AS INTEGER) 
           AND current_month < CAST(split_part(end_date, '/', 1) AS INTEGER));
    
    RETURN season_energy;
END;
$$ LANGUAGE plpgsql;
```

## 📊 統合クエリ例

### 個人のケルト占星術分析

```sql
-- 個人の完全なケルト占星術分析
SELECT 
    ctc.japanese_name as birth_tree,
    ctc.tree_wisdom,
    ctc.personality_traits,
    ctc.spiritual_gifts,
    ctc.druid_teaching,
    ctc.seasonal_energy,
    csc.spiritual_theme as current_season_theme
FROM celtic_tree_calendar ctc
CROSS JOIN celtic_seasonal_calendar csc
WHERE ctc.tree_number = get_birth_tree('1990-06-15')
AND CURRENT_DATE BETWEEN 
    TO_DATE(csc.start_date || '/2024', 'MM/DD/YYYY') 
    AND TO_DATE(csc.end_date || '/2024', 'MM/DD/YYYY');
```

### 相性分析クエリ

```sql
-- 二人のケルト占星術相性分析
SELECT 
    t1.japanese_name as person1_tree,
    t2.japanese_name as person2_tree,
    cc.compatibility_score,
    cc.relationship_nature,
    cc.spiritual_purpose,
    cc.growth_path
FROM celtic_compatibility cc
JOIN celtic_tree_calendar t1 ON cc.tree1 = t1.tree_number
JOIN celtic_tree_calendar t2 ON cc.tree2 = t2.tree_number
WHERE cc.tree1 = get_birth_tree('1990-01-15')
AND cc.tree2 = get_birth_tree('1985-07-20');
```

このケルト占星術データベースにより、古代ケルトの樹木智慧、ドルイドの教え、自然のサイクルに基づいた深い人生分析と霊的指導を提供できます。