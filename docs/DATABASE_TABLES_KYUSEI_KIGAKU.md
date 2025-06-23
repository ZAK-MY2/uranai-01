# 九星気学データベース表

九星気学（九星術）の完全なデータベース表構造です。東洋の気の流れと九つの星による運勢判断システムを実装します。

## 📊 主要データベーステーブル

### 1. 九星基本情報テーブル (kyusei_stars)

```sql
CREATE TABLE kyusei_stars (
    id SERIAL PRIMARY KEY,
    star_number INTEGER NOT NULL UNIQUE, -- 1-9
    star_name VARCHAR(20) NOT NULL, -- 一白水星、二黒土星...
    element VARCHAR(10) NOT NULL, -- 水、土、木、火、金
    color VARCHAR(20) NOT NULL,
    direction VARCHAR(20) NOT NULL, -- 北、南西、東など
    personality TEXT NOT NULL,
    strengths TEXT[] NOT NULL,
    weaknesses TEXT[] NOT NULL,
    compatible_stars INTEGER[] NOT NULL,
    incompatible_stars INTEGER[] NOT NULL,
    lucky_numbers INTEGER[] NOT NULL,
    monthly_fortune TEXT NOT NULL,
    yearly_fortune TEXT NOT NULL
);

-- 基本データ挿入
INSERT INTO kyusei_stars VALUES
(1, 1, '一白水星', '水', '白', '北', '知的で洞察力があり、静かな環境を好む。思慮深く慎重な性格。', ARRAY['洞察力', '知性', '集中力', '適応力'], ARRAY['優柔不断', '孤独感', '冷淡'], ARRAY[3, 4], ARRAY[2, 8], ARRAY[1, 6], '静かに内省し、学習に専念する時期', '知識を深め、基盤を固める年'),
(2, 2, '二黒土星', '土', '黒', '南西', '母性的で面倒見が良く、着実に物事を進める。協調性と忍耐力がある。', ARRAY['協調性', '忍耐力', '母性愛', '実直'], ARRAY['頑固', '消極的', '依存的'], ARRAY[6, 7], ARRAY[1, 5], ARRAY[2, 8], '人とのつながりを大切にし、堅実に歩む時期', '安定と調和を重視し、基盤作りに専念する年'),
(3, 3, '三碧木星', '木', '青', '東', '行動力があり、積極的でエネルギッシュ。新しいことにチャレンジする意欲に満ちている。', ARRAY['行動力', '積極性', 'エネルギッシュ', '革新性'], ARRAY['短気', '衝動的', '計画性不足'], ARRAY[1, 9], ARRAY[7, 2], ARRAY[3, 8], '新しい挑戦と積極的な行動を起こす時期', '成長と発展のエネルギーに満ちた年'),
(4, 4, '四緑木星', '木', '緑', '南東', '調和を重んじ、コミュニケーション能力に長けている。風のように自由で社交的。', ARRAY['社交性', 'コミュニケーション力', '調和性', '自由'], ARRAY['八方美人', '優柔不断', '浮気性'], ARRAY[1, 3], ARRAY[2, 8], ARRAY[4, 9], '人とのつながりを広げ、調和を重視する時期', '新しい出会いと関係性の拡大が期待される年'),
(5, 5, '五黄土星', '土', '黄', '中央', '強いリーダーシップを持ち、中心的存在。破壊と再生の力を秘めている。', ARRAY['リーダーシップ', '統率力', '破壊と再生', '中心力'], ARRAY['独裁的', '破壊的', '孤立'], ARRAY[2, 8], ARRAY[3, 4], ARRAY[5], '大きな変化と変革の時期、リーダーシップを発揮', '重要な決断と変革の年、影響力が高まる'),
(6, 6, '六白金星', '金', '白', '北西', '威厳があり、責任感が強く、指導者的素質を持つ。権威と品格を重んじる。', ARRAY['威厳', '責任感', '指導力', '品格'], ARRAY['プライドが高い', '頑固', '権威主義'], ARRAY[2, 7], ARRAY[3, 4], ARRAY[6, 1], '責任を果たし、指導力を発揮する時期', '地位と名誉を築き、責任ある立場に就く年'),
(7, 7, '七赤金星', '金', '赤', '西', '明るく社交的で、楽しいことを好む。愛嬌があり、人を引きつける魅力を持つ。', ARRAY['社交性', '明るさ', '愛嬌', '魅力'], ARRAY['浅はか', '軽薄', '飽きっぽい'], ARRAY[2, 6], ARRAY[3, 4], ARRAY[7, 2], '楽しみと喜びを見つけ、人との交流を深める時期', '楽しさと充実感に満ちた年、恋愛運も上昇'),
(8, 8, '八白土星', '土', '白', '北東', '変化を好み、革新的な思考を持つ。山のように高い理想を掲げる。', ARRAY['革新性', '理想', '変化への対応', '向上心'], ARRAY['理想主義', '現実逃避', '不安定'], ARRAY[5, 2], ARRAY[1, 3], ARRAY[8, 3], '変化と革新を求め、新しい道を模索する時期', '大きな変化と成長の年、新しい方向性を見つける'),
(9, 9, '九紫火星', '火', '紫', '南', '知性と美意識に優れ、直感力が鋭い。芸術的センスと洞察力を持つ。', ARRAY['知性', '美意識', '直感力', '芸術性'], ARRAY['神経質', '完璧主義', '批判的'], ARRAY[3, 1], ARRAY[2, 8], ARRAY[9, 4], '知性と美しさを追求し、創造性を発揮する時期', '知的探求と美的追求に満ちた年、直感が冴える');
```

### 2. 月命星・日命星計算テーブル (kyusei_calculation_table)

```sql
CREATE TABLE kyusei_calculation_table (
    id SERIAL PRIMARY KEY,
    birth_year INTEGER NOT NULL,
    birth_month INTEGER NOT NULL,
    birth_day INTEGER NOT NULL,
    honmei_star INTEGER NOT NULL, -- 本命星
    getsurei_star INTEGER NOT NULL, -- 月命星
    nichimei_star INTEGER NOT NULL, -- 日命星
    sexagenary_cycle INTEGER NOT NULL, -- 干支サイクル
    fortune_period VARCHAR(20) NOT NULL -- 運勢期間
);
```

### 3. 方位盤データテーブル (kyusei_houi_ban)

```sql
CREATE TABLE kyusei_houi_ban (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    center_star INTEGER NOT NULL, -- 中央の星
    north_star INTEGER NOT NULL, -- 北の星（1の位置）
    northeast_star INTEGER NOT NULL, -- 北東の星（8の位置）
    east_star INTEGER NOT NULL, -- 東の星（3の位置）
    southeast_star INTEGER NOT NULL, -- 南東の星（4の位置）
    south_star INTEGER NOT NULL, -- 南の星（9の位置）
    southwest_star INTEGER NOT NULL, -- 南西の星（2の位置）
    west_star INTEGER NOT NULL, -- 西の星（7の位置）
    northwest_star INTEGER NOT NULL, -- 北西の星（6の位置）
    center_position INTEGER NOT NULL -- 中央に来る星（その年月の特徴）
);
```

### 4. 運勢判定テーブル (kyusei_fortune)

```sql
CREATE TABLE kyusei_fortune (
    id SERIAL PRIMARY KEY,
    honmei_star INTEGER NOT NULL,
    target_year INTEGER NOT NULL,
    target_month INTEGER,
    fortune_level INTEGER NOT NULL, -- 1-10 (1=最悪、10=最高)
    general_fortune TEXT NOT NULL,
    love_fortune TEXT NOT NULL,
    career_fortune TEXT NOT NULL,
    health_fortune TEXT NOT NULL,
    money_fortune TEXT NOT NULL,
    family_fortune TEXT NOT NULL,
    lucky_direction VARCHAR(20),
    unlucky_direction VARCHAR(20),
    lucky_color VARCHAR(20),
    lucky_number INTEGER,
    caution_periods TEXT[] -- 注意すべき期間
);
```

### 5. 相性判定テーブル (kyusei_compatibility)

```sql
CREATE TABLE kyusei_compatibility (
    id SERIAL PRIMARY KEY,
    star1 INTEGER NOT NULL,
    star2 INTEGER NOT NULL,
    compatibility_score INTEGER NOT NULL, -- 1-10
    relationship_type VARCHAR(50) NOT NULL, -- 恋愛、結婚、友情、仕事など
    compatibility_description TEXT NOT NULL,
    strengths TEXT[] NOT NULL,
    challenges TEXT[] NOT NULL,
    advice TEXT NOT NULL,
    long_term_outlook TEXT NOT NULL
);

-- 相性データの例
INSERT INTO kyusei_compatibility VALUES
(1, 1, 1, 7, '恋愛', '同じ星同士の組み合わせ。理解し合えるが、刺激に欠ける可能性。', ARRAY['深い理解', '安心感', '共感'], ARRAY['刺激不足', 'マンネリ', '成長の停滞'], '互いの違いを見つけ、新しい挑戦を共にする', '安定した関係を築けるが、変化を意識的に取り入れる必要'),
(2, 1, 3, 9, '恋愛', '水と木の関係。木は水によって成長し、非常に良い相性。', ARRAY['相互成長', 'バランス', '自然な調和'], ARRAY['ペース違い', '価値観の差'], 'お互いのペースを尊重し、長期的視点で関係を築く', '非常に良好な関係が期待でき、共に成長できる組み合わせ'),
(3, 1, 2, 4, '恋愛', '水と土の関係。相克の関係で、理解に時間がかかる。', ARRAY['補完関係', '学びの機会'], ARRAY['価値観の違い', '理解困難', '衝突しやすい'], '相手の良い面を見つけ、忍耐強く関係を築く', '困難はあるが、乗り越えれば深い絆が生まれる可能性');
```

### 6. 吉凶方位テーブル (kyusei_directions)

```sql
CREATE TABLE kyusei_directions (
    id SERIAL PRIMARY KEY,
    honmei_star INTEGER NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER,
    direction VARCHAR(20) NOT NULL, -- 北、北東、東、南東、南、南西、西、北西
    fortune_type VARCHAR(20) NOT NULL, -- 吉、凶、大吉、大凶、普通
    effect_description TEXT NOT NULL,
    recommended_actions TEXT[] -- この方位での推奨行動
);
```

### 7. 九星暦データテーブル (kyusei_calendar)

```sql
CREATE TABLE kyusei_calendar (
    id SERIAL PRIMARY KEY,
    calendar_date DATE NOT NULL,
    year_star INTEGER NOT NULL, -- その年の中央星
    month_star INTEGER NOT NULL, -- その月の中央星
    day_star INTEGER NOT NULL, -- その日の中央星
    season VARCHAR(20) NOT NULL, -- 春、夏、秋、冬
    seasonal_energy VARCHAR(100) NOT NULL, -- 季節のエネルギーの説明
    general_advice TEXT NOT NULL -- その日の一般的なアドバイス
);
```

### 8. 開運方法テーブル (kyusei_lucky_methods)

```sql
CREATE TABLE kyusei_lucky_methods (
    id SERIAL PRIMARY KEY,
    honmei_star INTEGER NOT NULL,
    method_category VARCHAR(30) NOT NULL, -- 色、食べ物、アクセサリー、行動など
    method_name VARCHAR(100) NOT NULL,
    method_description TEXT NOT NULL,
    effectiveness_level INTEGER NOT NULL, -- 1-5
    timing VARCHAR(100), -- いつ行うべきか
    duration VARCHAR(100) -- どのくらい続けるべきか
);

-- 開運方法データの例
INSERT INTO kyusei_lucky_methods VALUES
(1, 1, '色', '白色の活用', '一白水星の人は白色のアイテムを身につけることで運気アップ。白いシャツ、白い下着、白いアクセサリーが効果的。', 5, '毎日', '継続的に'),
(2, 1, '食べ物', '水に関する食材', '水菜、きゅうり、とうふなど水分の多い食材を積極的に摂取。また、水をたくさん飲むことも重要。', 4, '毎食', '日常的に'),
(3, 1, '行動', '北方向への移動', '北方向への旅行や移住、北側の部屋の使用などが開運につながる。', 5, '重要な決断の前', '必要に応じて'),
(4, 2, '色', '黒・茶色の活用', '二黒土星の人は黒や茶色のアイテムで安定感を高める。革製品や木製品も効果的。', 5, '毎日', '継続的に');
```

## 📈 運勢計算アルゴリズム

### 1. 本命星の計算方法

```sql
-- 本命星計算関数
CREATE OR REPLACE FUNCTION calculate_honmei_star(birth_year INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- 九星気学の本命星計算ロジック
    RETURN (10 - ((birth_year - 1900) % 9)) % 9 + 1;
END;
$$ LANGUAGE plpgsql;
```

### 2. 月命星・日命星の計算

```sql
-- 月命星計算関数
CREATE OR REPLACE FUNCTION calculate_getsurei_star(birth_year INTEGER, birth_month INTEGER)
RETURNS INTEGER AS $$
DECLARE
    base_star INTEGER;
BEGIN
    base_star := calculate_honmei_star(birth_year);
    -- 複雑な月命星計算ロジック
    RETURN ((base_star + birth_month - 2) % 9) + 1;
END;
$$ LANGUAGE plpgsql;
```

## 🔄 統合クエリ例

### 総合運勢取得クエリ

```sql
-- 特定の人の総合運勢を取得
SELECT 
    s.star_name,
    s.personality,
    f.general_fortune,
    f.love_fortune,
    f.career_fortune,
    f.lucky_direction,
    f.lucky_color
FROM kyusei_stars s
JOIN kyusei_fortune f ON s.star_number = f.honmei_star
WHERE s.star_number = calculate_honmei_star(1990)
AND f.target_year = 2024;
```

### 相性診断クエリ

```sql
-- 二人の相性を診断
SELECT 
    s1.star_name as person1_star,
    s2.star_name as person2_star,
    c.compatibility_score,
    c.compatibility_description,
    c.advice
FROM kyusei_compatibility c
JOIN kyusei_stars s1 ON c.star1 = s1.star_number
JOIN kyusei_stars s2 ON c.star2 = s2.star_number
WHERE c.star1 = calculate_honmei_star(1990)
AND c.star2 = calculate_honmei_star(1985)
AND c.relationship_type = '恋愛';
```

この九星気学データベースシステムにより、詳細な運勢分析、相性診断、方位の吉凶判定、開運方法の提案などを提供できます。