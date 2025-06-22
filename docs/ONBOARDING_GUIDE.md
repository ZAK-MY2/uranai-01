# URANAI-01プロジェクト オンボーディングガイド

このガイドは、URANAI-01プロジェクトに参加する開発者（中級レベル）が効率的にプロジェクトを理解し、開発を開始できるように作成されています。

## 📌 前提知識

読者に期待する技術レベル：
- JavaScript/TypeScript の基本的な理解
- React/Next.js の開発経験
- npm/git コマンドの基本操作
- ターミナル/コマンドラインの基本操作

## 🎯 プロジェクト概要

### URANAI-01とは
**最強占い師システムMVP** - 10種類の占術を統合したAI占いアプリケーション

- **技術スタック**: Next.js 15 + TypeScript + Supabase + Tailwind CSS
- **占術種類**: 数秘術、タロット、西洋占星術、易経、四柱推命、ルーン、九星気学、ヴェーダ占星術、カバラ、ケルト占星術
- **特徴**: リアルタイム環境データ（天気、月相等）との連携

## 🚀 初回セットアップ手順

### 1. プロジェクトクローン
```bash
# GitHubからクローン（URLは実際のリポジトリに変更）
git clone [リポジトリURL] uranai-01
cd uranai-01
```

### 2. 依存関係インストール
```bash
# Node.js パッケージのインストール
npm install

# インストール完了の確認
npm list --depth=0
```

### 3. 環境変数設定
```bash
# .env.local ファイルを作成
cp .env.example .env.local

# エディタで .env.local を編集
# 最低限必要な設定：
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 動作確認
```bash
# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:3000 にアクセス
# 正常に表示されればセットアップ完了
```

## 🧭 プロジェクト理解のための必読ファイル

**必読順序**：

### 1. 基本理解（5分）
```bash
# プロジェクトの基本情報
cat README.md

# 開発ルール・ガイドライン
cat CLAUDE.md
```

### 2. 技術仕様（10分）
```bash
# ディレクトリ構造確認
tree -L 3 src/

# 主要な型定義
cat src/types/divination.ts | head -50
```

### 3. 実装例理解（15分）
```bash
# 数秘術エンジン（最もシンプルな例）
cat src/lib/divination/numerology.ts

# 統合システム（全体の仕組み）
cat src/lib/divination/integrator.ts | head -100
```

## 🛠️ 開発開始時の標準フロー

### 毎回の開発開始時に実行するコマンド

```bash
# 1. プロジェクト状態の確認
pwd && echo "現在のディレクトリ: URANAI-01" && \
cat CLAUDE.md | head -20 && echo "---開発ルール確認完了---" && \
git status && echo "---Git状態確認完了---"

# 2. 最新の開発ログ確認
ls -la docs/logs/$(date +%Y-%m)/ 2>/dev/null || echo "今月の開発ログはまだありません"

# 3. 依存関係・環境確認
npm list --depth=0 | grep -E "(error|missing)" || echo "依存関係: OK"
```

### このコマンドが何をしているか

1. **`pwd && echo`**: 現在のディレクトリを確認し、正しいプロジェクトにいることを確認
2. **`cat CLAUDE.md | head -20`**: プロジェクトのルールを簡単に復習
3. **`git status`**: Gitの状態確認（未コミットの変更があるかチェック）
4. **`ls -la docs/logs/...`**: 前回の作業内容を確認
5. **`npm list --depth=0`**: パッケージの状態確認

## 🧪 品質チェックの理解

### なぜ品質チェックが重要か

**TypeScript + Next.js プロジェクトの特徴**：
- **型安全性**: TypeScriptの型チェックで実行時エラーを防ぐ
- **コード品質**: ESLintでコーディング規約を統一
- **ビルド確認**: 本番環境で動作するかを事前チェック

### 開発中に実行すべきコマンド
```bash
# 3つのチェックを順次実行
npm run lint        # コードスタイル・品質チェック
npm run type-check  # TypeScript型チェック
npm run build       # 本番ビルド確認

# まとめて実行（&&で前のコマンドが成功した場合のみ次を実行）
npm run lint && npm run type-check && npm run build
```

### エラーが出た場合の対処

```bash
# 1. リントエラー
npm run lint
# → 出力を読んで、コードスタイルの問題を修正

# 2. 型エラー  
npm run type-check
# → TypeScriptの型定義の問題を修正

# 3. ビルドエラー
npm run build
# → 本番環境で動作しない問題を修正
```

## 📁 プロジェクト構造の理解

```
uranai-01/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API エンドポイント
│   │   └── divination/     # 占術ページ
│   ├── lib/                # 核となるロジック
│   │   ├── divination/     # 占術エンジン群
│   │   └── supabase/       # データベース連携
│   ├── components/         # Reactコンポーネント
│   └── types/              # TypeScript型定義
├── docs/                   # プロジェクトドキュメント
│   ├── logs/              # 開発ログ（日付別）
│   └── *.md               # 各種ガイド
├── supabase/              # データベーススキーマ
└── 設定ファイル群
```

### 主要ファイルの役割

| ファイル | 役割 | いつ読むか |
|---------|------|-----------|
| `CLAUDE.md` | 開発ルール | 毎回の作業開始時 |
| `src/types/divination.ts` | 占術関連の型定義 | 新機能実装時 |
| `src/lib/divination/integrator.ts` | 占術統合システム | システム全体を理解したい時 |
| `docs/logs/` | 開発履歴 | 過去の変更を調べたい時 |

## 🔧 よくある作業パターン

### 新しい占術を追加する場合

1. **型定義の追加**
```bash
# 型定義ファイルを確認
cat src/types/divination.ts

# 新しい占術用の型を追加
# XxxInput, XxxResult インターフェースを定義
```

2. **エンジンの実装**
```bash
# 既存のエンジンを参考にする
cat src/lib/divination/numerology.ts

# 新しいファイルを作成
# src/lib/divination/new-divination.ts
```

3. **統合システムに追加**
```bash
# 統合システムを確認
cat src/lib/divination/integrator.ts

# 新しい占術をインポートし、実行メソッドを追加
```

### データベースを変更する場合

```bash
# 既存のスキーマを確認
cat supabase/migrations/001_initial_schema.sql

# 新しいマイグレーションファイルを作成
# supabase/migrations/002_your_changes.sql
```

## 🚨 トラブルシューティング

### よくある問題と解決方法

#### 1. 型エラーが大量発生
```bash
# 問題の確認
npm run type-check 2>&1 | head -10

# 解決アプローチ：
# - 関連する型定義をまとめて修正
# - 個別修正は避け、包括的に対応
```

#### 2. ビルドエラー
```bash
# キャッシュクリア
rm -rf .next

# 再ビルド
npm run build

# 環境変数の確認
cat .env.local
```

#### 3. 開発サーバーが起動しない
```bash
# ポートが使用中の場合
lsof -ti:3000 | xargs kill -9

# 再起動
npm run dev
```

## 📚 学習リソース

### プロジェクト内ドキュメント
- `docs/ALGORITHM_FACT_CHECK.md`: 占術アルゴリズムの詳細
- `docs/DATABASE_PRODUCTION_SETUP.md`: データベース設定
- `docs/QUICK_START_COMMANDS.md`: コマンド集

### 外部リソース
- [Next.js 15 ドキュメント](https://nextjs.org/docs)
- [TypeScript ハンドブック](https://www.typescriptlang.org/docs/)
- [Supabase ドキュメント](https://supabase.com/docs)

## 🎯 最初の1週間の目標

### Day 1-2: 環境構築・理解
- [ ] セットアップ完了
- [ ] 開発サーバー起動確認
- [ ] 基本的なプロジェクト構造の理解

### Day 3-4: コード読解
- [ ] 数秘術エンジンの理解
- [ ] 統合システムの概要把握
- [ ] 型定義の理解

### Day 5-7: 小さな変更・テスト
- [ ] 既存機能の小さな修正
- [ ] 品質チェックコマンドの習得
- [ ] Git操作の確認

## ✅ チェックリスト

開発開始前に以下を確認：
- [ ] Node.js がインストールされている
- [ ] Git の基本操作ができる
- [ ] プロジェクトが正常に起動する
- [ ] CLAUDE.md を読んで理解した
- [ ] 品質チェックコマンドを実行できる

---

このガイドを読んでも不明な点があれば、`docs/` フォルダ内の他のドキュメントを参照するか、既存のコードベースを参考にしてください。

**重要**: このプロジェクトは継続的に進化しています。定期的に `CLAUDE.md` と `docs/logs/` を確認して、最新の開発方針を把握してください。