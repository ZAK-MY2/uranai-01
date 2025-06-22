# 本番データベース設定ガイド

## 概要
最強占い師システムMVPの本番データベースは、Supabaseを使用して以下の構成で実装されています。

## データベース構造

### 1. profiles テーブル
ユーザープロファイル情報を格納
- `id`: ユーザーID (UUID)
- `email`: メールアドレス
- `full_name`: フルネーム
- `birth_date`: 生年月日
- `birth_time`: 出生時刻
- `birth_location`: 出生地情報（緯度・経度・タイムゾーン・都市名）
- `preferences`: ユーザー設定（言語・テーマ）

### 2. divination_sessions テーブル
占術セッションの履歴
- `id`: セッションID
- `user_id`: ユーザーID
- `session_type`: 占術タイプ（10種類）
- `input_data`: 入力データ
- `results`: 占術結果
- `environment_data`: 環境データスナップショット
- `interpretation`: AI生成解釈

### 3. divination_cache テーブル
計算結果のキャッシュ
- パフォーマンス最適化のため
- 有効期限付き

### 4. environment_logs テーブル
環境データのログ
- 天気データ
- 月齢データ
- 天文データ

### 5. user_settings テーブル
ユーザー固有の設定

## セットアップ手順

### 1. Supabaseプロジェクトの作成
1. [Supabase](https://supabase.com)にアクセス
2. 新規プロジェクト作成
3. プロジェクトURLとANON KEYを取得

### 2. 環境変数の設定
`.env.local`に以下を設定：
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. データベーススキーマの適用
1. Supabase SQLエディタで`supabase/migrations/001_initial_schema.sql`を実行
2. インデックスとRLSポリシーが自動的に設定される

### 4. 初期データの投入
本番環境には実データは不要（ユーザーが使用時に自動生成）

## セキュリティ設定

### Row Level Security (RLS)
- すべてのテーブルでRLS有効
- ユーザーは自分のデータのみアクセス可能
- キャッシュと環境データは全ユーザー読み取り可能

### バックアップ
- Supabaseが自動的に日次バックアップ実行
- 必要に応じてPoint-in-Timeリカバリ可能

## パフォーマンス最適化

### インデックス
以下のインデックスが設定済み：
- `idx_divination_sessions_user_id`
- `idx_divination_sessions_created_at`
- `idx_divination_sessions_type`
- `idx_divination_cache_key`
- `idx_divination_cache_expires`
- `idx_environment_logs_type_time`

### キャッシュ戦略
- 占術結果は24時間キャッシュ
- 環境データは1時間キャッシュ

## モニタリング

### ダッシュボード
Supabaseダッシュボードで以下をモニタリング：
- データベースサイズ
- API呼び出し数
- アクティブユーザー数
- パフォーマンスメトリクス

### アラート設定
- データベース容量80%超過時
- エラー率5%超過時
- レスポンスタイム3秒超過時

## 本番環境チェックリスト

- [x] データベーススキーマ作成
- [x] RLSポリシー設定
- [x] インデックス最適化
- [x] 環境変数設定
- [x] バックアップ設定確認
- [x] モニタリング設定
- [x] パフォーマンステスト実施

## トラブルシューティング

### 接続エラー
1. 環境変数が正しく設定されているか確認
2. Supabaseプロジェクトが稼働中か確認
3. ネットワーク接続を確認

### パフォーマンス問題
1. インデックスが適切に使用されているか確認
2. キャッシュが有効か確認
3. クエリ最適化を検討

## 更新履歴
- 2025-06-22: 初版作成
- 10占術システム対応
- 環境データ統合