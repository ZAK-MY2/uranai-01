# COSMIC ORACLE - 余白とゆっくりアニメーション設計書

## 🌸 設計思想：「宇宙の呼吸」

### 💫 基本コンセプト
> 「宇宙は急がない。星は静かに輝き、惑星はゆっくりと軌道を描く」

占いという内省的な体験に、慌ただしさは不要。  
ユーザーがゆったりと自分の運命と向き合える空間を創造する。

## 🎭 アニメーション哲学

### 1. **「息をするような」タイミング**
```
アニメーション速度の黄金律：
├── 超ゆっくり: 2-4秒（背景・環境）
├── ゆっくり: 1-2秒（主要コンテンツ）
├── 自然: 0.5-1秒（インタラクション）
└── スナップ: 0.1-0.3秒（マイクロ）
```

### 2. **「宇宙のリズム」基準**
- **呼吸**: 4秒吸って、4秒吐く → 8秒サイクル
- **心拍**: 60-80bpm → 0.75-1秒間隔
- **月の満ち欠け**: 29.5日 → 29.5秒のロングアニメーション
- **季節の移ろい**: 3ヶ月 → 3分のサイクル

## 🌌 具体的なアニメーション設計

### 1. **背景の「呼吸」（8秒サイクル）**
```css
@keyframes cosmic-breathing {
  0% { 
    background: radial-gradient(circle, #0a0a1f 0%, #1a1a3e 100%);
    transform: scale(1.0);
  }
  50% { 
    background: radial-gradient(circle, #0f0f2a 0%, #2a2a4a 100%);
    transform: scale(1.02);
  }
  100% { 
    background: radial-gradient(circle, #0a0a1f 0%, #1a1a3e 100%);
    transform: scale(1.0);
  }
}

.cosmic-background {
  animation: cosmic-breathing 8s infinite ease-in-out;
}
```

### 2. **星のまばたき（ランダム3-12秒）**
```css
@keyframes star-twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1.0; }
}

.star {
  animation: star-twinkle var(--twinkle-duration) infinite ease-in-out;
  --twinkle-duration: calc(3s + random() * 9s);
}
```

### 3. **占術カードの浮遊（20秒サイクル）**
```css
@keyframes gentle-float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
  }
  25% { 
    transform: translateY(-8px) rotate(0.5deg);
  }
  50% { 
    transform: translateY(-12px) rotate(0deg);
  }
  75% { 
    transform: translateY(-5px) rotate(-0.5deg);
  }
}

.divination-card {
  animation: gentle-float 20s infinite ease-in-out;
  animation-delay: var(--float-delay);
}
```

### 4. **文字の出現（1.5秒でゆっくり）**
```css
@keyframes text-emergence {
  0% {
    opacity: 0;
    transform: translateY(30px);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0px);
  }
}

.text-appear {
  animation: text-emergence 1.5s ease-out forwards;
}
```

## 🎨 余白の美学

### 1. **「間」の設計原則**
```
画面構成比（黄金比ベース）:
├── コンテンツ: 38.2%
├── 余白: 61.8%
└── うち装飾的余白: 23.6%（星・パーティクル用）
```

### 2. **レスポンシブ余白システム**
```scss
// 余白の宇宙比率システム
$space-cosmic: (
  'vacuum': 0,        // 0px - 真空
  'asteroid': 8px,    // 小惑星間
  'planet': 16px,     // 惑星間
  'solar': 32px,      // 太陽系内
  'stellar': 64px,    // 恒星間
  'galactic': 128px,  // 銀河間
  'cosmic': 256px     // 宇宙の果て
);

.section {
  margin-bottom: space('galactic');  // 128px
  padding: space('stellar');         // 64px
}

.card {
  margin: space('solar');           // 32px
  padding: space('planet');        // 16px
}
```

### 3. **情報密度の調整**
```
情報階層と余白:
├── H1見出し: 上下に'cosmic'（256px）の余白
├── セクション: 'galactic'（128px）で区切り
├── カード群: 'stellar'（64px）間隔
├── カード内: 'solar'（32px）余白
└── テキスト行間: 1.8倍（ゆったり読める）
```

## 🌙 インタラクション設計

### 1. **ホバー：「近づく星」（0.8秒）**
```css
.interactive-element {
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.interactive-element:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(147, 51, 234, 0.3);
  filter: brightness(1.1);
}
```

### 2. **クリック：「重力の波」（1.2秒）**
```css
@keyframes gravity-wave {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

.clicked {
  animation: gravity-wave 1.2s ease-in-out;
}
```

### 3. **スクロール：「宇宙遊泳」**
```javascript
// パララックス効果（0.7倍速でゆっくり）
const parallaxElements = document.querySelectorAll('.parallax');
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  parallaxElements.forEach(element => {
    const speed = 0.7; // ゆっくり係数
    element.style.transform = `translateY(${scrolled * speed}px)`;
  });
});
```

## 🎵 アニメーション演出

### 1. **数秘術：数字のカウントアップ（3秒）**
```javascript
// 1から目標数字まで3秒かけてゆっくり
function countUpNumber(element, target) {
  const duration = 3000; // 3秒
  const steps = 60; // 60fps想定
  const increment = target / steps;
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    element.textContent = Math.floor(current);
    
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    }
  }, duration / steps);
}
```

### 2. **タロット：カードめくり（2秒）**
```css
@keyframes card-flip {
  0% { 
    transform: rotateY(0deg); 
  }
  50% { 
    transform: rotateY(90deg); 
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }
  100% { 
    transform: rotateY(0deg); 
  }
}

.tarot-card {
  animation: card-flip 2s ease-in-out;
}
```

### 3. **占星術：惑星軌道（30秒ループ）**
```css
@keyframes planet-orbit {
  0% { 
    transform: rotate(0deg) translateX(120px) rotate(0deg); 
  }
  100% { 
    transform: rotate(360deg) translateX(120px) rotate(-360deg); 
  }
}

.planet {
  animation: planet-orbit 30s linear infinite;
}
```

## 🌟 実装ライブラリ候補

### 1. **Framer Motion (React)**
- ゆったりしたアニメーションに最適
- spring物理演算でより自然な動き

### 2. **CSS Custom Properties**
```css
:root {
  --ease-cosmic: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --duration-breath: 8s;
  --duration-float: 20s;
  --duration-gentle: 1.5s;
}
```

### 3. **Intersection Observer**
- スクロール連動のゆっくりアニメーション
- パフォーマンス重視

## 💫 体験設計目標

### ユーザーが感じること：
1. **時間を忘れる没入感**
2. **心が落ち着く安らぎ**
3. **宇宙との一体感**
4. **占いへの期待感の高まり**

この設計により、「急かされない、美しい占い体験」を実現します。