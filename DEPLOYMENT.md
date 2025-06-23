# COSMIC ORACLE デプロイガイド

## 📋 本番デプロイ手順

### 1. 事前準備

#### 必要な環境変数
以下の環境変数を本番環境で設定してください：

```bash
# 必須設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
ENCRYPTION_KEY=your_32_byte_encryption_key
JWT_SECRET=your_production_jwt_secret

# オプション設定
OPENWEATHER_API_KEY=your_openweather_key
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=warn
NODE_ENV=production
```

### 2. Vercelでのデプロイ

#### A. Vercel CLIを使用
```bash
# Vercel CLI インストール
npm i -g vercel

# プロジェクトディレクトリで実行
vercel

# 環境変数設定
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add ENCRYPTION_KEY
vercel env add JWT_SECRET

# 本番デプロイ
vercel --prod
```

#### B. Vercel Dashboardを使用
1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. "Import Project"をクリック
3. GitHubリポジトリを選択
4. 環境変数を設定
5. "Deploy"をクリック

### 3. Netlifyでのデプロイ

#### A. Netlify CLIを使用
```bash
# Netlify CLI インストール
npm i -g netlify-cli

# ログイン
netlify login

# サイト作成
netlify init

# 環境変数設定
netlify env:set NEXT_PUBLIC_SUPABASE_URL "your_value"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your_value"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "your_value"
netlify env:set NEXT_PUBLIC_SITE_URL "your_value"
netlify env:set ENCRYPTION_KEY "your_value"
netlify env:set JWT_SECRET "your_value"

# 本番デプロイ
netlify deploy --prod
```

#### B. Netlify Dashboardを使用
1. [Netlify Dashboard](https://app.netlify.com/)にアクセス
2. "Sites"から"Import from Git"
3. GitHubリポジトリを選択
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. 環境変数を設定
6. "Deploy site"をクリック

### 4. デプロイ後の確認

#### A. ヘルスチェック
```bash
curl https://your-domain.com/health
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

#### B. 機能テスト
1. **入力フォーム**: https://your-domain.com/input
2. **ダッシュボード**: https://your-domain.com/
3. **各占術ページ**: 
   - 数秘術: /divination/numerology
   - タロット: /divination/tarot
   - 西洋占星術: /divination/astrology
   - など全10占術

#### C. データベース接続確認
```bash
# Supabase接続テスト
curl -H "Authorization: Bearer your_anon_key" \
     -H "apikey: your_anon_key" \
     https://your-project.supabase.co/rest/v1/health
```

### 5. 監視・メンテナンス

#### A. ログ監視
- Vercel: Vercel Dashboard > Functions > Logs
- Netlify: Netlify Dashboard > Functions > Logs

#### B. エラー追跡
Sentryを設定している場合：
- https://sentry.io/your-org/cosmic-oracle/

#### C. パフォーマンス監視
- Vercel Analytics
- Google PageSpeed Insights
- Web Vitals

### 6. トラブルシューティング

#### よくある問題と解決法

**Q: ビルドエラーが発生する**
```bash
# ローカルでビルドテスト
npm run build

# 型チェック
npm run type-check

# リント確認
npm run lint
```

**Q: 環境変数が認識されない**
- `.env.production.example`を参考に設定を確認
- Vercel/Netlify Dashboardで環境変数を再設定
- デプロイ後に環境変数を変更した場合は再デプロイが必要

**Q: Supabase接続エラー**
- NEXT_PUBLIC_SUPABASE_URLが正しいか確認
- Supabase プロジェクトのRLS設定を確認
- APIキーの権限を確認

**Q: 404エラーが多発**
- `vercel.json`または`netlify.toml`の設定を確認
- Next.js のルーティング設定を確認

### 7. セキュリティチェックリスト

- [ ] 本番用の強力なJWT_SECRETを設定
- [ ] ENCRYPTION_KEYを32バイトランダム文字列に設定
- [ ] HTTPS強制設定
- [ ] CSPヘッダー設定
- [ ] Supabase RLS有効化
- [ ] 環境変数の機密情報確認
- [ ] API レート制限設定

### 8. パフォーマンス最適化

- [ ] 画像最適化確認
- [ ] CSS/JS圧縮確認
- [ ] CDN設定
- [ ] キャッシュ設定
- [ ] Core Web Vitals確認

---

## 🚀 クイックデプロイ（Vercel推奨）

```bash
# 1. リポジトリクローン（既にある場合はスキップ）
git clone your-repo-url

# 2. 依存関係インストール
npm install

# 3. 本番ビルドテスト
npm run build

# 4. Vercelデプロイ
npx vercel

# 5. 環境変数設定（Vercel Dashboard）
# 6. 本番デプロイ
npx vercel --prod
```

デプロイ完了後、https://your-domain.com でCOSMIC ORACLEにアクセスできます！

---

## 📞 サポート

デプロイに関する問題が発生した場合：
1. このドキュメントの該当セクションを確認
2. ログを確認（Vercel/Netlify Dashboard）
3. GitHub Issuesで報告

**成功を祈っています！** 🌟