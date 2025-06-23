# 🚀 Vercel デプロイガイド - COSMIC ORACLE

## 📋 環境変数設定が必要

ビルドエラーが発生しているため、Vercel Dashboardで環境変数を設定してください。

### 1. Vercel Dashboard アクセス
https://vercel.com/dashboard

### 2. プロジェクト選択
`uranai-01` プロジェクトを選択

### 3. 環境変数設定
`Settings` > `Environment Variables` で以下を追加：

#### 必須環境変数
```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://fvolmkuinnhwfscincod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2b2xta3Vpbm5od2ZzY2luY29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDc2ODAsImV4cCI6MjA2NjA4MzY4MH0.ED3TFUOVIVhPotKujKEwl9wSPZISPkLkBv5yoKwcm0I

# サイト設定
NEXT_PUBLIC_SITE_URL=https://uranai-01.vercel.app
NODE_ENV=production

# セキュリティ設定（オプション）
ENCRYPTION_KEY=a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890
JWT_SECRET=super-secret-jwt-key-for-production-change-this
```

### 4. 各環境変数の設定手順

1. `Add New` をクリック
2. `Name`: 環境変数名を入力
3. `Value`: 対応する値を入力
4. `Environments`: `Production`, `Preview`, `Development` を選択
5. `Save` をクリック

### 5. 再デプロイ実行

環境変数設定完了後：

```bash
# 再デプロイ
npx vercel --prod
```

または

1. Vercel Dashboard
2. `Deployments` タブ
3. `Redeploy` をクリック

### 6. デプロイ完了後の確認

#### A. サイトアクセス
- **URL**: https://uranai-01.vercel.app
- **機能確認**: 
  - 入力フォーム
  - ダッシュボード
  - 各占術ページ

#### B. ヘルスチェック
```bash
curl https://uranai-01.vercel.app/health
```

期待される応答：
```json
{
  "status": "healthy",
  "timestamp": "2025-06-23T...",
  "services": {
    "database": "connected",
    "api": "operational"
  }
}
```

---

## 🔧 トラブルシューティング

### よくある問題

**Q: ビルドエラーが続く**
- 環境変数がすべて設定されているか確認
- Supabase URLとキーが正しいか確認
- ブラウザでVercel Dashboardをリフレッシュ

**Q: 502/504エラー**
- Supabase接続を確認
- 環境変数の値にスペースや改行が含まれていないか確認

**Q: 機能が動作しない**
- ブラウザの開発者ツールでエラー確認
- ネットワークタブでAPI呼び出し確認

---

## ✅ 成功確認チェックリスト

- [ ] Vercel Dashboardで環境変数設定完了
- [ ] デプロイが成功（緑のチェックマーク）
- [ ] サイトにアクセス可能
- [ ] 入力フォームが動作
- [ ] 各占術ページが表示
- [ ] ユーザーデータが保存・読み込みされる
- [ ] レスポンシブデザインが機能

---

**完了したら COSMIC ORACLE が本番稼働開始です！** 🌟✨🔮