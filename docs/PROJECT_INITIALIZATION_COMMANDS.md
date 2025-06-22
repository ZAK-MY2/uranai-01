# Zeami新規プロジェクト立ち上げ標準コマンド集

## 概要

このドキュメントは、Zeamiフレームワークで新規プロジェクトを立ち上げる際の標準的なコマンドフローをまとめています。URANAI-01の開発経験から抽出された「守るべきルール」を含んでいます。

## 📋 新規プロジェクト作成フロー

### 1. プロジェクト作成（基本パターン）

#### パターンA: Zeamiスクリプト使用（推奨）
```bash
# Zeamiルートディレクトリに移動
cd /Users/masato-mba2024/Develop/Zeami-1\ ZAK

# 新規プロジェクト作成スクリプト実行
./scripts/zeami-new-project-v2.sh

# プロンプトに従って選択:
# - プロジェクト名: [英数字、ハイフン、アンダースコアのみ]
# - プロジェクトタイプ: 1) Next.js 2) Next.js + Firebase 3) シンプル
```

#### パターンB: 手動作成（カスタム要件がある場合）
```bash
# プロジェクトディレクトリ作成
mkdir -p /Users/masato-mba2024/Develop/Zeami-1\ ZAK/projects/[プロジェクト名]
cd /Users/masato-mba2024/Develop/Zeami-1\ ZAK/projects/[プロジェクト名]

# Next.js初期化
npx create-next-app@latest . --typescript --tailwind --app --eslint

# Zeami知識システムの設定
mkdir -p .zeami-knowledge
```

### 2. 必須設定ファイルの作成

#### CLAUDE.md（プロジェクト固有のAIガイド）
```bash
cat > CLAUDE.md << 'EOF'
# CLAUDE.md - [プロジェクト名] 開発ガイド

## プロジェクト概要
[プロジェクトの目的と概要]

## 技術スタック
- Next.js 15 + TypeScript
- [その他の主要技術]

## 開発コマンド
```bash
npm run dev        # 開発サーバー起動
npm run build      # ビルド
npm run type-check # 型チェック
npm run lint       # リント
npm run test       # テスト
```

## 重要な注意事項
- 環境変数は .env.local に設定
- 型エラーは包括的アプローチで解決
- 品質チェック3点セット必須実行

## 忘れやすいポイント
- 開発開始時: TodoRead実行
- 変更後: lint && type-check && build
- ターミナル表示は簡潔に
EOF
```

#### PROJECT_KNOWLEDGE.md（プロジェクト知識管理）
```bash
cat > PROJECT_KNOWLEDGE.md << EOF
# PROJECT_KNOWLEDGE.md - [プロジェクト名]

プロジェクト作成日: $(date +%Y-%m-%d)

## プロジェクト概要
- 目的: [プロジェクトの目的]
- 技術: [主要技術スタック]

## 開発メモ

### $(date +%Y-%m-%d): プロジェクト初期化
- Zeamiテンプレートで作成
- 基本設定完了

---
*継続的に知識を蓄積していく*
EOF
```

### 3. 環境変数設定

```bash
# .env.exampleから.env.localを作成
cp .env.example .env.local

# 必要に応じて環境変数を設定
# Next.js + Supabaseの場合の例:
cat > .env.local << 'EOF'
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# アプリケーション設定
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
```

### 4. 依存関係のインストール

```bash
# 基本的な依存関係
npm install

# Supabaseプロジェクトの場合
npm install @supabase/supabase-js @supabase/ssr

# 型チェック設定（package.jsonに追加）
npm pkg set scripts.type-check="tsc --noEmit"
```

## 🚀 Claude Code開発開始時のコマンド

### プロジェクトに入ってClaude Codeを起動する際の標準フロー

```bash
# 1. プロジェクトディレクトリに移動
cd /Users/masato-mba2024/Develop/Zeami-1\ ZAK/projects/[プロジェクト名]

# 2. Claude Code起動
claude

# 3. 起動後、Claude Codeに以下を指示:
```

### Claude Code起動後の初回セットアップコマンド

Claude Codeに対して以下のコマンドを実行してもらう：

```bash
# プロジェクト状態の完全把握
pwd && echo "---" && \
cat CLAUDE.md | head-50 && echo "---" && \
ls -la docs/logs/$(date +%Y-%m)/ 2>/dev/null || echo "新規プロジェクト" && echo "---" && \
git status && echo "---" && \
npm list --depth=0 | head -10
```

### 開発開始時の標準指示

Claude Codeに対する標準的な指示文：

```
「このプロジェクトで開発を開始します。

まず以下を確認してください：
1. CLAUDE.mdを読んでプロジェクトルールを把握
2. TodoReadでタスク状況確認
3. 前回の開発ログがあれば確認
4. 環境変数設定の確認

開発中は以下を守ってください：
- 変更後は必ず lint && type-check && build 実行
- ターミナル表示は簡潔に
- 型エラーは包括的アプローチで解決
- 重要な作業完了時は開発ログ記録

何か質問がある場合は、まずCLAUDE.mdとPROJECT_KNOWLEDGE.mdを確認してください。」
```

## 📝 テンプレート的な開発指示文

### 新機能開発時
```
「[機能名]を実装します。

TodoWriteで以下のタスクを作成し、段階的に進めてください：
1. 型定義の作成/更新
2. コアロジックの実装
3. APIエンドポイント（必要時）
4. フロントエンド実装
5. テスト作成
6. 品質チェック実行

実装完了後は開発ログを作成し、PROJECT_KNOWLEDGE.mdに重要な学びを記録してください。」
```

### バグ修正時
```
「[バグの説明]を修正します。

以下の手順で進めてください：
1. 問題の詳細な調査（TodoWriteで管理）
2. 根本原因の特定
3. 包括的な修正（関連箇所も同時に）
4. テストで検証
5. 品質チェック実行

修正内容と学んだことを開発ログに記録してください。」
```

## 🔧 プロジェクト設定のカスタマイズ

### TypeScript設定の標準化
```bash
# tsconfig.jsonの標準設定
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "baseUrl": ".",
    "paths": {"@/*": ["./src/*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
```

### ESLint設定の標準化
```bash
# .eslintrc.jsonの標準設定
cat > .eslintrc.json << 'EOF'
{
  "extends": ["next/core-web-vitals", "@next/eslint-config-next"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-require-imports": "error"
  }
}
EOF
```

## 📚 参考資料とベストプラクティス

### 必読ドキュメント
1. **Zeami CLAUDE.md** - フレームワーク全体のルール
2. **プロジェクトCLAUDE.md** - プロジェクト固有のルール
3. **DEVELOPMENT_SESSION_ANALYSIS.md** - 効率的な開発方法

### よく使うZeamiスクリプト
```bash
# セッション終了時
../../../scripts/zeami-end-session.sh

# 定期レビュー
../../../scripts/zeami-weekly-review.sh

# 知識検索
../../../scripts/search-knowledge.sh [検索語]
```

## ⚠️ 重要な注意事項

### 守るべきルール（URANAI-01の経験から）

1. **型エラー対策**
   - 個別修正は避け、包括的アプローチを採用
   - 関連ファイル全体を同時に修正

2. **品質保証**
   - 変更後は必ず `lint && type-check && build` 実行
   - エラーを残したまま次の作業に進まない

3. **知識管理**
   - 重要な決定は即座にPROJECT_KNOWLEDGE.mdに記録
   - セッション終了時は必ず開発ログ作成

4. **Claude Code協働**
   - 具体的で測定可能なタスクをTodoWriteで管理
   - ターミナル表示は簡潔に保つ
   - 定期的にCLAUDE.mdを参照

### 失敗パターンの回避

- ❌ 型エラーの個別修正 → ⭕ 包括的修正
- ❌ 品質チェック忘れ → ⭕ 定期的な実行
- ❌ 知識の記録忘れ → ⭕ 即座の記録
- ❌ 曖昧なタスク管理 → ⭕ 具体的なTodo

このガイドラインに従うことで、一貫性があり効率的な開発が可能になります。