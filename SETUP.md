# Uranai-01 セットアップガイド

## 1. GitHubリポジトリの作成とプッシュ

### 手動でGitHubリポジトリを作成
1. [GitHub](https://github.com) にアクセス
2. 「New repository」をクリック
3. Repository name: `uranai-01`
4. 「Public」を選択
5. 「Create repository」をクリック

### リモートリポジトリの追加とプッシュ
```bash
cd /Users/masato-mba2024/Develop/Zeami-1\ ZAK/projects/uranai-01
git remote add origin https://github.com/YOUR_USERNAME/uranai-01.git
git branch -M main
git push -u origin main
```

## 2. Supabaseプロジェクトの作成

### Supabaseプロジェクトのセットアップ
1. [Supabase](https://supabase.com) にアクセス
2. 「Start your project」をクリック
3. 「New project」を選択
4. Organization: お好みの組織を選択
5. Project name: `uranai-01`
6. Database password: 強力なパスワードを設定
7. Region: `Tokyo (ap-northeast-1)` を推奨
8. 「Create new project」をクリック

### 環境変数の設定
1. Supabaseダッシュボードで「Settings」→「API」に移動
2. 以下の値をコピー：
   - Project URL
   - Project API keys の `anon` `public` key

3. `.env.local`ファイルを更新：
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 認証設定（オプション）
Supabaseダッシュボードで「Authentication」→「Settings」に移動し、以下を設定：
- Site URL: `http://localhost:3000` (開発用)
- Redirect URLs: `http://localhost:3000/auth/callback`

## 3. Vercelでのデプロイ

### Vercelプロジェクトの作成
1. [Vercel](https://vercel.com) にアクセス
2. 「New Project」をクリック
3. GitHubリポジトリ `uranai-01` をインポート
4. Project settings:
   - Project Name: `uranai-01`
   - Framework Preset: `Next.js`
   - Root Directory: `./`
5. 環境変数を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`: SupabaseのProject URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseのanon key
6. 「Deploy」をクリック

### デプロイ後の設定
1. デプロイが完了したらVercelのURLを確認
2. Supabaseダッシュボードで「Authentication」→「Settings」を更新：
   - Site URL: `https://your-project-name.vercel.app`
   - Redirect URLs: `https://your-project-name.vercel.app/auth/callback`

## 4. 動作確認

### ローカル環境での確認
```bash
npm run dev
```
- http://localhost:3000 にアクセス
- ログインページが表示されることを確認
- 新規登録でアカウントを作成してテスト

### 本番環境での確認
- VercelのURLにアクセス
- 同様に認証機能をテスト

## トラブルシューティング

### よくある問題

**1. 認証エラーが発生する場合**
- `.env.local`の環境変数を確認
- SupabaseのRedirect URLsが正しく設定されているか確認

**2. ビルドエラーが発生する場合**
```bash
npm run build
```
でローカルでビルドエラーを確認

**3. 型エラーが発生する場合**
```bash
npm run type-check
```
で型チェックを実行

## 次のステップ

セットアップが完了したら、以下の機能を追加できます：
- データベーステーブルの作成
- ユーザープロフィール機能
- アプリケーション固有の機能実装