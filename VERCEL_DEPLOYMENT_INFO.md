# 🚀 Vercel デプロイ情報

## GitHubリポジトリ
✅ **URL**: https://github.com/ZAK-MY2/uranai-01.git
✅ **ブランチ**: main
✅ **最新コミット**: 🚀 Complete MVP implementation - Ready for deployment

## Vercel設定手順

### 1. Vercelにアクセス
https://vercel.com

### 2. Import Git Repository
- "Import Project" → "Continue with GitHub"
- リポジトリ選択: `ZAK-MY2/uranai-01`

### 3. Configure Project
**Project Name**: cosmic-oracle（または任意の名前）

**Framework Preset**: Next.js（自動検出されるはず）

**Root Directory**: ./ （変更不要）

**Build Settings**:
- Build Command: `npm run build` （デフォルト）
- Output Directory: `.next` （デフォルト）
- Install Command: `npm install` （デフォルト）

### 4. 環境変数設定
以下の3つを必ず設定：

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

※ Supabaseプロジェクトから取得した値を入力

### 5. Deploy
"Deploy"ボタンをクリック！

## デプロイ後のURL例
- Production: https://cosmic-oracle.vercel.app
- Preview: https://cosmic-oracle-git-main-your-username.vercel.app

## 確認ポイント
- ビルドログで"Success"表示
- デプロイ完了後、URLでアクセス可能
- 各ページが正常に表示される

## トラブルシューティング

### ビルドエラーの場合
1. ビルドログを確認
2. ローカルで `npm run build` を実行して再現
3. エラーを修正してプッシュ

### 環境変数エラーの場合
1. Vercel Dashboard → Settings → Environment Variables
2. 変数名と値を再確認
3. Redeployを実行

---

**準備OK！Vercelでデプロイを開始してください！** 🎉