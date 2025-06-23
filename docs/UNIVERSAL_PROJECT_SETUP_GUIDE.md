# Claude Code自律開発 - 最低限知識ガイド

## 🎯 Claude Code用必須知識

Claude Codeが自律的に開発するために最低限理解すべき用語・概念・手順のみ記載。

## 🚀 自動セットアップ

```bash
# 1. 自動セットアップ実行
/Users/masato-mba2024/Develop/Zeami-1\ ZAK/scripts/zeami-auto-project-setup.sh

# 2. 対話形式で設定→完了

# 3. プロジェクトディレクトリに移動
cd /Users/masato-mba2024/Develop/Zeami-1\ ZAK/projects/[プロジェクト名]

# 4. Claude Code起動
claude
```

## 📋 Claude Code用開始指示テンプレート

```
[プロジェクト名]をMVP段階実装で開発します。

1. TodoReadで現状確認
2. CLAUDE.mdでルール把握  
3. 32K tokens制限内での段階的実装
4. 各段階で品質チェック（lint && type-check && build）
5. Stage 1: 型定義 → Stage 2: ロジック → Stage 3: UI → Stage 4: 統合

詳細は[CLAUDE_MVP_INSTRUCTION_GUIDE.md](CLAUDE_MVP_INSTRUCTION_GUIDE.md)参照
```

## 📁 重要ファイル（Claude Code必読）

```
CLAUDE.md          # プロジェクトルール
PROJECT_KNOWLEDGE.md  # 知識管理
.env.local         # 環境変数
package.json       # 依存関係・スクリプト
```

## ⚙️ 技術スタック（用語のみ）

- **Next.js 15 + TypeScript** = Webフレームワーク
- **Supabase** = データベース・認証
- **Tailwind CSS** = スタイリング
- **Vercel** = デプロイ先

## 🔧 必須コマンド

```bash
# Next.js初期化
npx create-next-app@latest . --typescript --tailwind --app --eslint

# Supabase追加
npm install @supabase/supabase-js @supabase/ssr

# 型チェック追加
npm pkg set scripts.type-check="tsc --noEmit"

# 品質チェック（必須実行）
npm run lint && npm run type-check && npm run build
```

## 🚨 Claude Code自律開発必須要素

### 品質チェック（絶対実行）
```bash
npm run lint && npm run type-check && npm run build
```

### エラー対処原則
- **包括的修正**: 個別修正ではなく根本解決
- **型エラー**: 全関連ファイル同時修正

### TodoWrite/TodoRead
- **開始時**: TodoRead必須
- **進捗管理**: 各完了時に即更新
- **段階管理**: 各Stageを明確に分割

### MVP段階開発
- **32K tokens制限**: 各段階を制限内に収める
- **明確な境界**: Stage間の依存を最小化
- **詳細**: [CLAUDE_MVP_INSTRUCTION_GUIDE.md](CLAUDE_MVP_INSTRUCTION_GUIDE.md)

### 環境変数規則
- **クライアント**: `NEXT_PUBLIC_`必須
- **サーバー**: プレフィックス不要

Claude Codeが最低限理解すべき内容のみ記載。詳細は実装時にWebSearchで補完。