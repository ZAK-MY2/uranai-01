# 自律的開発のための仕様書テンプレート

## 概要

Claude Codeが最大限自律的に開発を進められるよう、従来の「Claude Code用MVP作って」から進化した包括的仕様書テンプレートです。URANAI-01での成功パターンを基に設計されています。

## 🎯 使用方法

このテンプレートをコピーして、各項目を埋めてClaude Codeに渡してください。Claude Codeは受け取った仕様書を基に、TodoWrite管理で完全自律的に開発を完了します。

---

# 【プロジェクト名】開発仕様書

## 📋 基本情報

### プロジェクト概要
- **プロジェクト名**: [具体的な名前]
- **目的**: [何を解決するのか、なぜ作るのか]
- **対象ユーザー**: [誰のためのシステムか]
- **完成イメージ**: [最終的にどうなっていればよいか]

### 技術要件
- **フレームワーク**: [Next.js 15 / React Native / など]
- **データベース**: [Supabase / MongoDB / など]
- **認証**: [Supabase Auth / NextAuth / など]
- **スタイリング**: [Tailwind CSS / など]
- **デプロイ**: [Vercel / Netlify / など]

### 開発方針
```
✅ 【重要】以下の方針で開発してください：
- MVP段階実装手法を採用（32K tokens制限内）
- TodoWrite/TodoReadで段階管理
- 各段階で品質チェック（lint && type-check && build）
- Stage 1: 型定義 → Stage 2: ロジック → Stage 3: UI → Stage 4: 統合
- エラーは包括的アプローチで解決
- 実装完了後は開発ログ作成

詳細は[CLAUDE_MVP_INSTRUCTION_GUIDE.md](CLAUDE_MVP_INSTRUCTION_GUIDE.md)参照
```

## 🏗️ システム設計

### 主要機能一覧
```
1. [機能名1] - [機能の詳細説明]
   - 入力: [何を受け取るか]
   - 処理: [どう処理するか]
   - 出力: [何を返すか]

2. [機能名2] - [機能の詳細説明]
   - 入力: [何を受け取るか]
   - 処理: [どう処理するか]
   - 出力: [何を返すか]

3. [機能名3] - [機能の詳細説明]
   - 入力: [何を受け取るか]
   - 処理: [どう処理するか]
   - 出力: [何を返すか]

[必要な分だけ追加]
```

### データ構造設計
```typescript
// メインデータ型
interface [MainDataType] {
  id: string;
  [property1]: [type];
  [property2]: [type];
  created_at: string;
  updated_at: string;
}

// 入力データ型
interface [InputType] {
  [requiredField]: [type];
  [optionalField]?: [type];
}

// 出力データ型
interface [OutputType] {
  [resultField]: [type];
  [metadataField]: [type];
}

// [その他必要な型定義]
```

### API設計
```
POST /api/[endpoint1]
- 目的: [何をするAPI]
- 入力: [InputType]
- 出力: [OutputType]
- 処理: [詳細な処理内容]

GET /api/[endpoint2]
- 目的: [何をするAPI]
- パラメータ: [必要なパラメータ]
- 出力: [OutputType]
- 処理: [詳細な処理内容]

[必要なAPIエンドポイントを全て記載]
```

## 🎨 UI/UX設計

### 画面一覧
```
1. [画面名1] - [画面の目的]
   - URL: /[path]
   - 表示内容: [何を表示するか]
   - 操作: [ユーザーが何をできるか]

2. [画面名2] - [画面の目的]
   - URL: /[path]
   - 表示内容: [何を表示するか]
   - 操作: [ユーザーが何をできるか]

[必要な画面を全て記載]
```

### レスポンシブ要件
```
✅ 以下の画面サイズで適切に動作すること：
- モバイル (<768px): [モバイル専用の要件]
- タブレット (768px-1023px): [タブレット専用の要件]
- デスクトップ (≥1024px): [デスクトップ専用の要件]
```

### デザイン指針
```
- [色使い・テーマの指定]
- [フォント・タイポグラフィの指定]
- [アクセシビリティ要件]
- [ブランディング要件]
```

## 📊 データベース設計

### テーブル設計
```sql
-- [テーブル名1]
CREATE TABLE [table_name1] (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  [column1] [TYPE] [CONSTRAINTS],
  [column2] [TYPE] [CONSTRAINTS],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- [テーブル名2]
CREATE TABLE [table_name2] (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  [foreign_key_id] UUID REFERENCES [table_name1](id),
  [column1] [TYPE] [CONSTRAINTS],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

[必要なテーブルを全て記載]
```

### RLSポリシー
```sql
-- [テーブル名1]のRLS
ALTER TABLE [table_name1] ENABLE ROW LEVEL SECURITY;

CREATE POLICY "[policy_name]" ON [table_name1]
  FOR [operation] USING ([condition]);

[必要なポリシーを全て記載]
```

## 🔧 外部連携

### 外部API
```
1. [API名1]
   - 目的: [何のために使用]
   - エンドポイント: [URL]
   - 認証: [API Key / OAuth / など]
   - 制限事項: [レート制限など]

2. [API名2]
   - 目的: [何のために使用]
   - エンドポイント: [URL]
   - 認証: [API Key / OAuth / など]
   - 制限事項: [レート制限など]

[必要な外部APIを全て記載]
```

### 環境変数
```bash
# 必須環境変数
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# プロジェクト固有
[CUSTOM_API_KEY]=
[CUSTOM_SETTING]=

# [その他必要な環境変数]
```

## ✅ 品質・テスト要件

### 必須チェック項目
```
✅ 開発完了の定義:
- [ ] 全機能が正常動作
- [ ] lint エラーなし
- [ ] type-check エラーなし  
- [ ] build エラーなし
- [ ] レスポンシブ対応完了
- [ ] 環境変数設定ドキュメント完備
- [ ] 基本的なエラーハンドリング実装
- [ ] [プロジェクト固有の要件]
```

### パフォーマンス要件
```
- ページ読み込み時間: [X秒以内]
- APIレスポンス時間: [X秒以内]
- 同時ユーザー数: [X人まで対応]
- [その他のパフォーマンス要件]
```

## 🚀 デプロイ・運用

### デプロイ設定
```
- 本番環境: [Vercel / Netlify / など]
- ステージング環境: [あり/なし]
- CI/CD: [GitHub Actions / など]
- ドメイン: [custom domain / subdomain]
```

### セキュリティ要件
```
- 認証・認可: [必要な認証レベル]
- データ暗号化: [必要/不要]
- CORS設定: [許可するドメイン]
- CSP設定: [Content Security Policy]
- [その他セキュリティ要件]
```

## 📝 ドキュメント要件

### 作成すべきドキュメント
```
✅ 以下のドキュメントを作成してください：
- [ ] README.md（セットアップ・使用方法）
- [ ] API仕様書（エンドポイント一覧）
- [ ] 開発ログ（実装内容・学んだこと）
- [ ] [プロジェクト固有のドキュメント]
```

## 🎯 特別な要件・制約事項

### ビジネス要件
```
- [法的制約・コンプライアンス要件]
- [業界固有の要件]
- [地域・言語対応]
- [データ保持・削除ポリシー]
```

### 技術的制約
```
- [使用禁止ライブラリ・技術]
- [パフォーマンス制約]
- [互換性要件]
- [サイズ・容量制限]
```

## 🔮 将来拡張

### 今回実装しない機能（将来検討）
```
- [将来追加予定の機能1]
- [将来追加予定の機能2]
- [スケーラビリティ対応]
- [多言語対応]
```

### 技術的な拡張性
```
- [プラグイン機構]
- [API拡張性]
- [データベース拡張性]
- [デプロイ環境拡張]
```

---

## 📋 Claude Code用実行指示

```
【重要】上記仕様書に基づいて、MVP段階実装で開発を進めてください：

1. TodoWriteで段階的タスクを作成・管理
2. Stage 1: 型定義・スキーマ（15K tokens以内）
3. Stage 2: コアロジック実装（20K tokens以内）
4. Stage 3: UI実装（15K tokens以内）
5. Stage 4: 統合・品質チェック（10K tokens以内）
6. ドキュメント作成・開発ログ記録

各段階で品質チェック（lint && type-check && build）を実行し、
完了時には本番レベルの品質を達成してください。

詳細は[CLAUDE_MVP_INSTRUCTION_GUIDE.md](CLAUDE_MVP_INSTRUCTION_GUIDE.md)参照。
分からない点があれば、仕様の明確化を求めてから開発を開始してください。
```

---

## 🚀 使用例

### 良い仕様書の例
```
【プロジェクト名】タスク管理アプリ開発仕様書

## 📋 基本情報
**目的**: チーム向けの効率的なタスク管理システム
**完成イメージ**: Trello風のカンバンボードでタスクを管理

## 🏗️ システム設計
### 主要機能一覧
1. タスク作成・編集・削除
2. ステータス管理（Todo/In Progress/Done）
3. メンバー割り当て
4. 期限管理・通知

[詳細な仕様が続く...]
```

### ダメな仕様書の例
```
❌ 「タスク管理のMVPを作って」
❌ 「なんかいい感じのアプリ」
❌ 「要件は開発しながら決める」
```

## 📚 参考資料

- [URANAI-01成功事例](./DEVELOPMENT_SESSION_ANALYSIS.md)
- [並列開発手法](./PARALLEL_DEVELOPMENT_ANALYSIS.md)
- [品質保証ガイド](../CLAUDE.md)

このテンプレートを使用することで、Claude Codeが最大限自律的に、高品質な成果物を作成できます。