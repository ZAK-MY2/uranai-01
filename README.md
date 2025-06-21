# Uranai-01

Next.js + Supabase + Vercelで構築されたWebアプリケーション

## 技術スタック

- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example`を`.env.local`にコピーして、Supabaseの認証情報を設定します：

```bash
cp .env.local.example .env.local
```

以下の環境変数を設定してください：

- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの匿名キー

### 3. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)でアプリケーションにアクセスできます。

## Vercelへのデプロイ

1. このリポジトリをGitHubにプッシュ
2. Vercelでプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

## 機能

- ユーザー認証（ログイン/新規登録）
- プロテクトされたルート
- ユーザーダッシュボード
- セッション管理

## ディレクトリ構造

```
uranai-01/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── server.ts
│   └── middleware.ts
├── .env.local.example
├── package.json
└── README.md
```