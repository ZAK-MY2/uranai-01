# Claude Code クイックスタートコマンド集

## 🚀 開発セッション開始時のコピペ用コマンド

### 1. 初期状態確認（全部まとめて実行）
```bash
# プロジェクト状態の完全把握（コピペして実行）
pwd && echo "---" && \
cat CLAUDE.md | head -50 && echo "---" && \
ls -la docs/logs/$(date +%Y-%m)/ && echo "---" && \
git status && echo "---" && \
git log --oneline -5
```

### 2. 個別確認コマンド

#### プロジェクトルール確認
```bash
cat CLAUDE.md
```

#### 最新の開発ログ確認
```bash
# 今月のログ一覧
ls -la docs/logs/$(date +%Y-%m)/

# 最新ログを読む（ファイル名は適宜変更）
cat docs/logs/$(date +%Y-%m)/[最新ファイル名].md
```

#### Git状態確認
```bash
git status
git log --oneline -10
```

#### 環境変数確認
```bash
cat .env.local
```

## 🔧 開発中の品質チェックコマンド

### 品質チェック3点セット（エイリアス推奨）
```bash
# まとめて実行
npm run lint && npm run type-check && npm run build
```

### 個別実行
```bash
npm run lint        # コード品質チェック
npm run type-check  # 型チェック
npm run build       # ビルド確認
npm test           # テスト実行
```

## 📝 作業完了時のコマンド

### 1. 全体品質確認
```bash
# 4つの品質チェックを順次実行
npm run lint && \
npm run type-check && \
npm run build && \
npm test
```

### 2. Git コミット
```bash
# 変更をステージング
git add -A

# 状態確認
git status

# コミット（メッセージは適宜編集）
git commit -m "feat: [機能説明]

[詳細説明]

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 🛠️ トラブルシューティング

### 型エラーが大量発生した場合
```bash
# 1. まず現状確認
npm run type-check 2>&1 | head -20

# 2. 特定ファイルの型チェック
npx tsc --noEmit [ファイルパス]

# 3. 包括的修正後の確認
npm run type-check
```

### ビルドエラーの場合
```bash
# 1. クリーンビルド
rm -rf .next
npm run build

# 2. 依存関係の確認
npm list --depth=0

# 3. 環境変数の確認
cat .env.local
```

## 💡 便利なエイリアス設定

~/.bashrc または ~/.zshrc に追加：

```bash
# Cosmic Oracle 開発用エイリアス
alias co-check='npm run lint && npm run type-check && npm run build'
alias co-start='pwd && cat CLAUDE.md | head -20 && git status'
alias co-log='ls -la docs/logs/$(date +%Y-%m)/'
alias co-commit='git add -A && git status'
```

## 📋 チェックリスト形式

開発セッション開始時：
- [ ] `co-start` または初期確認コマンド実行
- [ ] TodoList確認（TodoReadツール使用）
- [ ] 前回の開発ログ確認

開発中：
- [ ] 定期的に `co-check` 実行
- [ ] ターミナル表示は簡潔に
- [ ] エラーは包括的アプローチで解決

作業終了時：
- [ ] 全体品質チェック実行
- [ ] 開発ログ作成
- [ ] Gitコミット
- [ ] 次回タスクをTodoListに追加

## 🔍 よく使う検索コマンド

```bash
# 特定の関数を探す
grep -r "function_name" src/

# 型定義を探す
find . -name "*.ts" -o -name "*.tsx" | xargs grep "interface.*Result"

# TODOコメントを探す
grep -r "TODO\|FIXME" src/

# 最近変更されたファイル
find src -name "*.ts" -o -name "*.tsx" -mtime -1
```

## 📊 プロジェクト統計

```bash
# TypeScriptファイル数
find src -name "*.ts" -o -name "*.tsx" | wc -l

# コード行数（空行除く）
find src -name "*.ts" -o -name "*.tsx" | xargs grep -v "^$" | wc -l

# パッケージ数
npm list --depth=0 | grep -c "^├"
```

---

このドキュメントをブックマークして、開発時にすぐアクセスできるようにしておくことをお勧めします。