# ターミナル作業フロー - あなたがやること

## 🚀 ターミナル起動時（開発開始）

### 1. **開発セッション開始** （推奨）
```bash
# プロジェクトディレクトリに移動
cd ~/Develop/Zeami-1\ ZAK/projects/uranai-01

# 開発セッション開始（オプション）
./scripts/dev-continuity.sh start
```

### 2. **現状確認** （任意）
```bash
# Claudeの包括チェックを実行
claude-optimized check

# または個別に確認
git status
npm run quick  # lint + type-check
```

### 3. **開発サーバー起動** （必要に応じて）
```bash
npm run dev
# または
npm run fresh  # キャッシュクリアして起動
```

## 🏁 ターミナル終了時（開発終了）

### 1. **作業内容の保存** （推奨）
```bash
# 開発セッション終了
./scripts/dev-continuity.sh finish

# または簡易的に
claude-optimized summary
```

### 2. **品質チェック** （任意だが推奨）
```bash
# コミット前チェック
npm run check

# 問題があれば自動修正
./scripts/quick-fix.sh
```

### 3. **プロセス終了確認** （必要に応じて）
```bash
# 開発サーバーが動いている場合
# Ctrl+C で停止

# ポートが使用中か確認
lsof -i :3001
```

## 📝 最小限のワークフロー

**朝（開始時）:**
```bash
cd ~/Develop/Zeami-1\ ZAK/projects/uranai-01
npm run dev
```

**夜（終了時）:**
```bash
# Ctrl+C でサーバー停止
git status  # 変更確認
```

## 🤖 Claudeとの協働時

### 開始時に伝えると良いこと
- 「今日は○○の機能を実装したい」
- 「前回○○で終わった」
- 「○○の問題を解決したい」

### 終了時に確認すること
- 「今日の作業をまとめて」
- 「次回やることは？」
- 「コミットすべき変更は？」

## 💡 便利なエイリアス設定（任意）

`.zshrc` または `.bashrc` に追加：
```bash
# COSMIC ORACLEショートカット
alias cosmic='cd ~/Develop/Zeami-1\ ZAK/projects/uranai-01'
alias cstart='cosmic && npm run dev'
alias ccheck='cosmic && npm run check'

# Zeami共通
alias zeami='cd ~/Develop/Zeami-1\ ZAK'
```

## ⚡ トラブルシューティング

### ポート3001が使用中
```bash
# プロセスを確認
lsof -i :3001
# 必要ならkill
kill -9 <PID>
```

### node_modulesの問題
```bash
npm run clean
npm install
npm run dev
```

### 型エラーが多い
```bash
npm run check:types
# または
./scripts/quick-fix.sh
```

## 📌 覚えておくべき最重要コマンド

1. **`npm run dev`** - 開発開始
2. **`npm run check`** - 品質確認
3. **`git status`** - 変更確認
4. **`claude-optimized check`** - 包括的状態確認

---

**ポイント**: 
- 必須作業は実はほとんどありません
- ツールは必要に応じて使用
- Claudeが作業状態を記録・管理
- あなたは「何をしたいか」を伝えるだけでOK