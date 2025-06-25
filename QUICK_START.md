# 🚀 COSMIC ORACLE クイックスタート

## 最短手順（3ステップ）

### 1️⃣ ターミナルを開く
```bash
cd ~/Develop/Zeami-1\ ZAK/projects/uranai-01
```

### 2️⃣ 開発サーバー起動
```bash
npm run dev
```

### 3️⃣ ブラウザで確認
```
http://localhost:3001
```

以上！これだけで開発開始できます。

---

## 📝 よく使うコマンド（必要な時だけ）

### 状態確認
```bash
# Claudeに現状を確認してもらう
claude-optimized check

# または手動で
git status
npm run quick
```

### 問題が起きたら
```bash
# 自動修正を試す
./scripts/quick-fix.sh

# それでもダメなら
npm run clean && npm install
```

### 作業終了時
```bash
# サーバー停止
Ctrl + C

# 変更を確認
git status
```

---

## 💡 Claudeとの対話例

**あなた**: 「今日は決済機能を実装したい」
**Claude**: 必要な手順を提示し、実装を進めます

**あなた**: 「型エラーが出てる」
**Claude**: `npm run check:types`で詳細確認後、修正します

**あなた**: 「今日の作業をまとめて」
**Claude**: 作業内容を要約し、次回のTODOを提示します

---

## 🎯 覚えることは最小限

1. **`npm run dev`** → 開発開始
2. **`Ctrl+C`** → サーバー停止
3. 困ったら **「○○したい」「○○でエラー」** と伝える

それ以外はClaudeが管理・サポートします！