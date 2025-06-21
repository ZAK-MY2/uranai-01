# デプロイコマンド集

## 現在の状況
✅ Git設定完了
✅ 初回コミット完了  
✅ ビルドテスト成功

## 次に実行するコマンド

### 1. GitHubリポジトリ作成（手動）
以下のURLでGitHubにリポジトリを作成：
https://github.com/new

設定：
- Repository name: `uranai-01`
- Public
- README、.gitignore、licenseは追加しない（既にある）

### 2. リモートリポジトリ追加とプッシュ
```bash
cd "/Users/masato-mba2024/Develop/Zeami-1 ZAK/projects/uranai-01"
git remote add origin https://github.com/YOUR_USERNAME/uranai-01.git
git branch -M main
git push -u origin main
```

### 3. GitHub CLI をインストール（オプション）
```bash
# Homebrew経由でインストール
brew install gh

# 認証
gh auth login
```

### 4. Vercel CLI をインストールしてデプロイ
```bash
# Vercel CLI インストール
npm i -g vercel

# プロジェクトディレクトリで実行
cd "/Users/masato-mba2024/Develop/Zeami-1 ZAK/projects/uranai-01"
vercel

# 初回は以下の質問に答える：
# Set up and deploy? [Y/n] → Y
# Which scope? → あなたのアカウント選択
# Link to existing project? [y/N] → N
# What's your project's name? → uranai-01
# In which directory is your code located? → ./
```

### 5. 環境変数の設定（Vercel）
```bash
# 本番環境用の環境変数を設定
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# または Vercel ダッシュボードで設定
```

### 6. 再デプロイ（環境変数設定後）
```bash
vercel --prod
```

## Supabaseプロジェクト作成

1. https://supabase.com にアクセス
2. 「Start your project」→「New project」
3. 設定：
   - Name: uranai-01
   - Password: 強力なパスワード
   - Region: Tokyo (ap-northeast-1)
4. 「Create new project」をクリック
5. 作成後、Settings → API から以下をコピー：
   - Project URL
   - anon public key

## ローカル環境での確認
環境変数設定後：
```bash
npm run dev
```

## トラブルシューティング
```bash
# ビルドテスト
npm run build

# 型チェック
npm run type-check

# Git状態確認
git status
git log --oneline
```