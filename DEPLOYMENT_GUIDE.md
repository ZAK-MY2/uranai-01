# COSMIC ORACLE デプロイメントガイド

## 🚀 Vercelへの本番デプロイ手順

### 1. 事前準備

#### Supabaseプロジェクト設定
- Supabaseプロジェクト作成: https://supabase.com/dashboard
- migrations/20250624_message_history.sql を実行
- 必要な環境変数を確認

#### Gitリポジトリ準備
```bash
git push origin main
```

### 2. Vercelデプロイ

#### 環境変数設定（必須）
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### 3. デプロイ後確認
- 基本動作: /health エンドポイント
- セキュリティヘッダー確認
- 各占術ページの動作テスト
- パフォーマンス測定

### 4. 本番運用
- Vercel Analytics有効化
- エラー監視設定
- 定期メンテナンス計画

詳細: https://vercel.com/docs
