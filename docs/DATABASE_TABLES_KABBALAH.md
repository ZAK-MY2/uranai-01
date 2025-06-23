# カバラ数秘術データベース表

カバラ（Kabbalah）の完全なデータベース表構造です。ユダヤ教の神秘主義思想に基づく生命の樹、セフィロト、ゲマトリア数秘術システムを実装します。

## 📊 主要データベーステーブル

### 1. セフィロト（生命の樹の球体）テーブル (kabbalah_sephiroth)

```sql
CREATE TABLE kabbalah_sephiroth (
    id SERIAL PRIMARY KEY,
    sephira_number INTEGER NOT NULL UNIQUE, -- 1-10
    hebrew_name VARCHAR(50) NOT NULL, -- ヘブライ語名
    english_name VARCHAR(50) NOT NULL, -- 英語名
    japanese_name VARCHAR(50) NOT NULL, -- 日本語名
    divine_name VARCHAR(50) NOT NULL, -- 神名
    archangel VARCHAR(50) NOT NULL, -- 大天使
    angelic_choir VARCHAR(50) NOT NULL, -- 天使団
    planetary_correspondence VARCHAR(30) NOT NULL, -- 対応惑星
    color VARCHAR(30) NOT NULL, -- 対応色
    element VARCHAR(20), -- 四大元素との対応
    tarot_cards INTEGER[] NOT NULL, -- 対応タロットカード
    description TEXT NOT NULL, -- 説明
    spiritual_meaning TEXT NOT NULL, -- 霊的意味
    psychological_aspect TEXT NOT NULL, -- 心理学的側面
    life_lesson TEXT NOT NULL, -- 人生の学び
    meditation_focus TEXT NOT NULL, -- 瞑想の焦点
    keywords TEXT[] NOT NULL -- キーワード
);

-- セフィロトデータ挿入
INSERT INTO kabbalah_sephiroth VALUES
(1, 1, 'Kether', 'Crown', '王冠(ケテル)', 'Ehyeh', 'Metatron', 'Chayoth ha-Qadesh', 'Primum Mobile', '純白', NULL, ARRAY[1], 
'生命の樹の頂点、すべての源', '純粋意識、神的な源泉', '真の自己、最高の可能性', '自己の本質を理解する', '純粋意識への到達', 
ARRAY['源泉', '純粋', '一体', '完全', '神的']),

(2, 2, 'Chokmah', 'Wisdom', '知恵(ホクマー)', 'Yah', 'Raziel', 'Auphanim', 'Neptune', '灰色', '火', ARRAY[2, 3, 4], 
'動的な智慧、創造の力', '原初の智慧、宇宙の設計図', '直感、洞察力、創造性', '智慧と直感を発達させる', '宇宙の智慧との調和', 
ARRAY['智慧', '直感', '創造', '動的', '男性原理']),

(3, 3, 'Binah', 'Understanding', '理解(ビナー)', 'Elohim', 'Tzaphkiel', 'Aralim', 'Saturn', '黒', '水', ARRAY[5, 6, 7], 
'受容的な理解、形成の力', '深い理解、宇宙の母性', '理解力、受容性、構造化', '深い理解と受容を学ぶ', '宇宙の秩序への理解', 
ARRAY['理解', '受容', '構造', '母性', '女性原理']),

(4, 4, 'Chesed', 'Mercy', '慈悲(ヘセド)', 'El', 'Tzadkiel', 'Chasmalim', 'Jupiter', '青', '水', ARRAY[8, 9, 10], 
'慈愛と拡大、寛大さ', '無限の愛と慈悲', '愛、慈悲、寛容、拡大', '無条件の愛を学ぶ', '愛と慈悲の瞑想', 
ARRAY['愛', '慈悲', '拡大', '寛容', '恩恵']),

(5, 5, 'Geburah', 'Severity', '峻厳(ゲブラー)', 'Elohim Gibor', 'Kamael', 'Seraphim', 'Mars', '赤', '火', ARRAY[11, 12, 13], 
'力と規律、正義', '神的な力と正義', '力、規律、正義、勇気', '規律と正義を学ぶ', '内なる力の統制', 
ARRAY['力', '規律', '正義', '勇気', '破壊と再生']),

(6, 6, 'Tiphereth', 'Beauty', '美(ティファレト)', 'Adonai', 'Michael', 'Malakim', 'Sun', '金色', '火', ARRAY[14, 15, 16], 
'調和と美、バランス', '完全な調和と美', 'バランス、調和、美、統合', '調和とバランスを学ぶ', '心の中心、太陽意識', 
ARRAY['美', '調和', 'バランス', '統合', '中心']),

(7, 7, 'Netzach', 'Victory', '勝利(ネツァク)', 'Adonai Tzabaoth', 'Haniel', 'Elohim', 'Venus', '緑', '火', ARRAY[17, 18, 19], 
'勝利と持続、感情', '感情と芸術的創造', '情熱、芸術、感情、持続力', '感情の理解と統制', '創造的エネルギーの活用', 
ARRAY['勝利', '感情', '芸術', '創造', '持続']),

(8, 8, 'Hod', 'Glory', '栄光(ホド)', 'Elohim Tzabaoth', 'Raphael', 'Beni Elohim', 'Mercury', '橙色', '水', ARRAY[20, 21], 
'栄光と知性、コミュニケーション', '論理的思考と知性', '知性、論理、コミュニケーション', '知的能力の発達', '論理的思考の統合', 
ARRAY['栄光', '知性', '論理', 'コミュニケーション', '分析']),

(9, 9, 'Yesod', 'Foundation', '基盤(イエソド)', 'Shaddai El Chai', 'Gabriel', 'Kerubim', 'Moon', '紫', '風', ARRAY[22, 23, 24], 
'基盤と潜在意識、幻想', '潜在意識とイメージ', '潜在意識、直感、イメージ力', '潜在意識の理解', '月的意識、夢の探求', 
ARRAY['基盤', '潜在意識', '直感', 'イメージ', '月的']),

(10, 10, 'Malkuth', 'Kingdom', '王国(マルクト)', 'Adonai ha-Aretz', 'Sandalphon', 'Ashim', 'Earth', '茶色', '地', ARRAY[25, 26, 27, 28], 
'王国と物質界、実現', '物質界の完成', '物質化、実現、完成', '物質界での実現', '地上での神的実現', 
ARRAY['王国', '物質', '実現', '完成', '地上']);
```

### 2. パス（径路）テーブル (kabbalah_paths)

```sql
CREATE TABLE kabbalah_paths (
    id SERIAL PRIMARY KEY,
    path_number INTEGER NOT NULL UNIQUE, -- 1-22
    hebrew_letter VARCHAR(10) NOT NULL, -- ヘブライ文字
    letter_name VARCHAR(30) NOT NULL, -- 文字名
    english_name VARCHAR(50) NOT NULL,
    connects_from INTEGER NOT NULL, -- 接続元セフィラ
    connects_to INTEGER NOT NULL, -- 接続先セフィラ
    tarot_major_arcana INTEGER NOT NULL, -- 対応大アルカナ
    astrological_correspondence VARCHAR(30) NOT NULL, -- 占星術対応
    element VARCHAR(20), -- 元素対応
    color VARCHAR(30) NOT NULL,
    meaning TEXT NOT NULL,
    spiritual_lesson TEXT NOT NULL,
    meditation_theme TEXT NOT NULL,
    keywords TEXT[] NOT NULL,
    FOREIGN KEY (connects_from) REFERENCES kabbalah_sephiroth(sephira_number),
    FOREIGN KEY (connects_to) REFERENCES kabbalah_sephiroth(sephira_number)
);

-- パスデータの例（22のパス全て）
INSERT INTO kabbalah_paths VALUES
(1, 1, 'ア', 'Aleph', 'The Fool', 1, 2, 0, 'Air', '風', '黄色', '愚者の道、新しい始まり', '純粋な信頼と新たな旅路', '無垢な心で歩む道', ARRAY['愚者', '新始', '信頼', '冒険']),
(2, 2, 'ベス', 'Beth', 'The Magician', 1, 3, 1, 'Mercury', '水', '黄色', '魔術師の道、意志の力', '意志による現実創造', '意識的な創造の力', ARRAY['魔術師', '意志', '創造', '力']),
(3, 3, 'ギメル', 'Gimel', 'The High Priestess', 1, 6, 2, 'Moon', '水', '青', '女教皇の道、直感の智慧', '内なる智慧への道', '直感と神秘的知識', ARRAY['女教皇', '直感', '智慧', '神秘']);
-- 残りの19パスも同様に挿入...
```

### 3. ゲマトリア数値テーブル (kabbalah_gematria)

```sql
CREATE TABLE kabbalah_gematria (
    id SERIAL PRIMARY KEY,
    hebrew_letter VARCHAR(10) NOT NULL,
    numerical_value INTEGER NOT NULL,
    letter_meaning TEXT NOT NULL,
    esoteric_meaning TEXT NOT NULL,
    pronunciation VARCHAR(20) NOT NULL
);

-- ヘブライ文字とゲマトリア値
INSERT INTO kabbalah_gematria VALUES
('א', 1, 'Aleph', '牛、力、リーダーシップ', '神の一体性、空気の元素', 'aleph'),
('ב', 2, 'Beth', '家、内部、女性性', '二元性、家庭、庇護', 'beth'),
('ג', 3, 'Gimel', 'ラクダ、誇り、持ち上げる', '報酬、高貴さ、旅', 'gimel'),
('ד', 4, 'Daleth', 'ドア、貧困、入口', '扉、通路、変化', 'daleth'),
('ה', 5, 'Heh', '窓、見よ、息', '神的な息、生命力', 'heh'),
('ו', 6, 'Vav', '釘、フック、接続', '接続、統合、完全性', 'vav'),
('ז', 7, 'Zayin', '剣、武器、記憶', '闘争、記憶、時間', 'zayin'),
('ח', 8, 'Cheth', '囲い、生命、存在', '生命力、チャクラ、領域', 'cheth'),
('ט', 9, 'Teth', '蛇、善、代理', '潜在力、原始力、本能', 'teth'),
('י', 10, 'Yod', '手、働く、創る', '神の手、創造力、意志', 'yod');
-- 残りの文字も追加...
```

### 4. 個人カバラ分析テーブル (kabbalah_personal_analysis)

```sql
CREATE TABLE kabbalah_personal_analysis (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    birth_date DATE NOT NULL,
    hebrew_gematria INTEGER NOT NULL, -- ヘブライ語ゲマトリア値
    english_gematria INTEGER NOT NULL, -- 英語ゲマトリア値
    reduced_value INTEGER NOT NULL, -- 還元値（1-9）
    primary_sephira INTEGER NOT NULL, -- 主要セフィラ
    secondary_sephira INTEGER, -- 副次セフィラ
    life_path_sephira INTEGER NOT NULL, -- 人生パスのセフィラ
    soul_correction VARCHAR(100), -- 魂の修正
    tikun_purpose TEXT, -- ティクン（修正）の目的
    karmic_lessons TEXT[] NOT NULL,
    spiritual_gifts TEXT[] NOT NULL,
    FOREIGN KEY (primary_sephira) REFERENCES kabbalah_sephiroth(sephira_number),
    FOREIGN KEY (secondary_sephira) REFERENCES kabbalah_sephiroth(sephira_number),
    FOREIGN KEY (life_path_sephira) REFERENCES kabbalah_sephiroth(sephira_number)
);
```

### 5. カバラ占術解釈テーブル (kabbalah_interpretations)

```sql
CREATE TABLE kabbalah_interpretations (
    id SERIAL PRIMARY KEY,
    sephira_combination VARCHAR(50) NOT NULL, -- セフィラの組み合わせ
    interpretation_type VARCHAR(30) NOT NULL, -- 人格、運勢、相性など
    description TEXT NOT NULL,
    strengths TEXT[] NOT NULL,
    challenges TEXT[] NOT NULL,
    spiritual_guidance TEXT NOT NULL,
    recommended_practices TEXT[] NOT NULL,
    meditation_techniques TEXT[] NOT NULL
);

-- 解釈データの例
INSERT INTO kabbalah_interpretations VALUES
('Kether-Primary', '人格', 'ケテルが主要セフィラの人は、純粋な意識と神的な直感を持つ魂です。', 
ARRAY['純粋な直感', '高い霊性', 'リーダーシップ', '創造力'], 
ARRAY['現実離れ', '孤立感', '完璧主義', '理解されにくい'], 
'地上での神的な目的を見つけ、それを実現することが使命です。',
ARRAY['瞑想', '祈り', '霊的学習', '奉仕'],
ARRAY['クラウンチャクラ瞑想', '白い光の瞑想', '神名の詠唱']),

('Chokmah-Primary', '人格', 'ホクマーが主要セフィラの人は、智慧と直感に溢れた革新的な魂です。',
ARRAY['深い智慧', '創造的洞察', '革新性', '直感力'],
ARRAY['衝動性', '理論偏重', '実用性不足', '他者との摩擦'],
'宇宙の智慧を地上に降ろし、人類の進歩に貢献することが使命です。',
ARRAY['学習', '研究', '創作活動', '指導'],
ARRAY['第三の目瞑想', '智慧の光瞑想', '宇宙意識瞑想']);
```

### 6. カバラ相性分析テーブル (kabbalah_compatibility)

```sql
CREATE TABLE kabbalah_compatibility (
    id SERIAL PRIMARY KEY,
    sephira1 INTEGER NOT NULL,
    sephira2 INTEGER NOT NULL,
    compatibility_score INTEGER NOT NULL, -- 1-10
    relationship_dynamic TEXT NOT NULL,
    strengths TEXT[] NOT NULL,
    challenges TEXT[] NOT NULL,
    spiritual_purpose TEXT NOT NULL,
    growth_opportunities TEXT[] NOT NULL,
    FOREIGN KEY (sephira1) REFERENCES kabbalah_sephiroth(sephira_number),
    FOREIGN KEY (sephira2) REFERENCES kabbalah_sephiroth(sephira_number)
);

-- 相性データの例
INSERT INTO kabbalah_compatibility VALUES
(1, 1, 8, 'Kether-Kether', '同じ純粋な意識を持つ二人。深い理解と高い理想を共有。',
ARRAY['深い理解', '共通の理想', '霊的成長', '純粋な愛'],
ARRAY['現実逃避', '物質的課題', '孤立の危険', '完璧主義'],
'共に神的な目的を地上で実現し、人類の霊的進化に貢献する。',
ARRAY['共同瞑想', '霊的修行', '奉仕活動', '創造的プロジェクト']),

(2, 2, 4, 9, 'Chokmah-Chesed', '智慧と愛の完璧な組み合わせ。創造と拡大の力。',
ARRAY['智慧と愛のバランス', '創造力', '教育能力', '霊的指導'],
ARRAY['理想主義', '現実とのギャップ', '他者への期待過剰'],
'智慧に基づいた愛を世界に広め、真の教育者となる。',
ARRAY['共同学習', '教育活動', '慈善事業', '霊的カウンセリング']);
```

### 7. カバラ数字意味テーブル (kabbalah_number_meanings)

```sql
CREATE TABLE kabbalah_number_meanings (
    id SERIAL PRIMARY KEY,
    number_value INTEGER NOT NULL UNIQUE,
    hebrew_significance TEXT NOT NULL,
    spiritual_meaning TEXT NOT NULL,
    psychological_aspect TEXT NOT NULL,
    life_lesson TEXT NOT NULL,
    associated_sephira INTEGER,
    biblical_reference TEXT,
    mystical_property TEXT NOT NULL,
    FOREIGN KEY (associated_sephira) REFERENCES kabbalah_sephiroth(sephira_number)
);

-- 数字の意味データ
INSERT INTO kabbalah_number_meanings VALUES
(1, '神の一体性、始まり、創造の力', '純粋意識、神的な源泉', '統一性、リーダーシップ、独立', '真の自己の発見', 1, '「聞け、イスラエルよ、我らの神、主は唯一の主である」', '絶対的統一性'),
(2, '二元性、選択、バランス', '極性、対立、統合', '協調性、パートナーシップ、受容', '対立の統合', 2, '「男と女に創造された」', '聖なる結婚'),
(3, '創造、表現、コミュニケーション', '三位一体、完全性', '創造性、表現力、社交性', '創造的表現の習得', 3, '「父と子と聖霊」', '創造の三原理'),
(4, '物質化、安定、基盤', '四つの世界、実現', '安定性、実用性、組織力', '物質界での実現', NULL, '「四つの河が流れ出ていた」', '物質界の法則'),
(5, '変化、自由、体験', '五つの感覚、人間性', '自由、冒険、体験', '人間的体験の統合', 5, '「五つのパンと二匹の魚」', '人間の完全性'),
(6, '調和、美、愛', '完全性、バランス', '愛、美、調和', '愛による統合', 6, '「六日間で創造された」', '完全な調和'),
(7, '霊性、神秘、探求', '神聖数、完成', '霊性、洞察、神秘', '霊的探求の深化', 7, '「七日目に休まれた」', '神聖な完成'),
(8, '再生、変容、力', '新しい始まり、復活', '力、変容、再生', '霊的な再生', 8, '「八人が救われた（ノアの箱舟）」', '新生と復活'),
(9, '完成、奉仕、智慧', '全体性、統合', '奉仕、智慧、完成', '人類への奉仕', 9, '「九つの実（聖霊の実）」', '霊的完成'),
(10, '完全、実現、回帰', '神の王国、完全実現', '完成、達成、循環', '完全な実現', 10, '「十戒」', '完全な顕現');
```

## 🔄 計算アルゴリズム

### 1. ゲマトリア計算関数

```sql
-- ヘブライ語ゲマトリア計算関数
CREATE OR REPLACE FUNCTION calculate_hebrew_gematria(input_text TEXT)
RETURNS INTEGER AS $$
DECLARE
    total INTEGER := 0;
    char_val INTEGER;
    i INTEGER;
BEGIN
    FOR i IN 1..length(input_text) LOOP
        SELECT numerical_value INTO char_val
        FROM kabbalah_gematria
        WHERE hebrew_letter = substring(input_text, i, 1);
        
        IF char_val IS NOT NULL THEN
            total := total + char_val;
        END IF;
    END LOOP;
    
    RETURN total;
END;
$$ LANGUAGE plpgsql;
```

### 2. セフィラ対応計算

```sql
-- 数値からセフィラを決定する関数
CREATE OR REPLACE FUNCTION get_primary_sephira(gematria_value INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- ゲマトリア値を1-10に還元
    RETURN ((gematria_value - 1) % 10) + 1;
END;
$$ LANGUAGE plpgsql;
```

## 📊 統合クエリ例

### 個人カバラ分析クエリ

```sql
-- 個人の完全なカバラ分析
SELECT 
    pa.full_name,
    pa.hebrew_gematria,
    pa.reduced_value,
    s1.japanese_name as primary_sephira_name,
    s1.description as primary_description,
    s1.spiritual_meaning,
    s1.life_lesson,
    pa.karmic_lessons,
    pa.spiritual_gifts
FROM kabbalah_personal_analysis pa
JOIN kabbalah_sephiroth s1 ON pa.primary_sephira = s1.sephira_number
WHERE pa.full_name = 'John Smith';
```

### 相性分析クエリ

```sql
-- 二人のカバラ相性分析
SELECT 
    s1.japanese_name as person1_sephira,
    s2.japanese_name as person2_sephira,
    kc.compatibility_score,
    kc.relationship_dynamic,
    kc.spiritual_purpose,
    kc.growth_opportunities
FROM kabbalah_compatibility kc
JOIN kabbalah_sephiroth s1 ON kc.sephira1 = s1.sephira_number
JOIN kabbalah_sephiroth s2 ON kc.sephira2 = s2.sephira_number
WHERE kc.sephira1 = 1 AND kc.sephira2 = 6;
```

このカバラ数秘術データベースにより、生命の樹の智慧に基づいた深い霊的分析、魂の目的の解明、カルマの理解、霊的成長の指針などを提供できます。