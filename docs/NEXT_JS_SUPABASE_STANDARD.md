# Next.js + Supabase 標準構成ガイド

## 概要

URANAI-01の開発経験から、Zeamiフレームワークでの**Next.js + Supabase**が標準構成として確立されました。このドキュメントはその標準パターンを記録しています。

## 🎯 なぜNext.js + Supabaseが標準か

### URANAI-01での実証済み利点

1. **高速開発**: データベース設計からデプロイまで最短ルート
2. **型安全性**: TypeScript + Supabaseの自動型生成
3. **認証統合**: Supabase Authの簡単統合
4. **リアルタイム**: Supabase Realtimeでライブ更新
5. **スケーラビリティ**: PostgreSQLベースの堅牢性

## 📋 標準セットアップフロー

### 1. プロジェクト初期化（コピペ用）
```bash
# Zeamiプロジェクト作成
cd /Users/masato-mba2024/Develop/Zeami-1\ ZAK
./scripts/zeami-new-project-v2.sh

# Next.js初期化
npx create-next-app@latest . --typescript --tailwind --app --eslint

# Supabase依存関係
npm install @supabase/supabase-js @supabase/ssr
npm install -D supabase
```

### 2. 環境変数設定（標準テンプレート）
```bash
cat > .env.local << 'EOF'
# Supabase設定（必須）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# アプリケーション設定
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# セキュリティ設定（推奨）
ENCRYPTION_KEY=your_encryption_key_32_chars_long
JWT_SECRET=your_jwt_secret_for_additional_auth

# ログレベル
LOG_LEVEL=info
NODE_ENV=development
EOF
```

### 3. Supabaseクライアント設定（URANAI-01パターン）
```bash
# ディレクトリ作成
mkdir -p src/lib/supabase src/types

# クライアント側Supabase
cat > src/lib/supabase/client.ts << 'EOF'
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
EOF

# サーバー側Supabase
cat > src/lib/supabase/server.ts << 'EOF'
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
EOF
```

### 4. 基本データベーススキーマ
```bash
# マイグレーションディレクトリ
mkdir -p supabase/migrations

# 初期スキーマ（URANAI-01パターン）
cat > supabase/migrations/001_initial_schema.sql << 'EOF'
-- 基本拡張
create extension if not exists "uuid-ossp";

-- ユーザープロファイル（認証拡張）
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- インデックス
create index idx_profiles_email on public.profiles(email);

-- RLS（Row Level Security）
alter table public.profiles enable row level security;

-- ポリシー
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- 更新日時の自動更新
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();
EOF
```

### 5. 型定義設定
```bash
# データベース型定義
cat > src/types/database.ts << 'EOF'
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}
EOF
```

## 🏗️ 標準プロジェクト構造

```
project/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   └── auth/          # 認証関連API
│   │   ├── auth/              # 認証ページ
│   │   └── (protected)/       # 認証が必要なページ
│   ├── lib/                   # 共通ロジック
│   │   ├── supabase/          # Supabase設定
│   │   └── utils/             # ユーティリティ
│   ├── components/            # Reactコンポーネント
│   └── types/                 # TypeScript型定義
├── supabase/                  # Supabase設定
│   ├── migrations/            # DBマイグレーション
│   └── config.toml           # Supabase設定
└── docs/                      # プロジェクトドキュメント
```

## 🔐 認証パターン（URANAI-01実証済み）

### 基本認証フロー
```typescript
// src/lib/auth.ts
import { createClient } from '@/lib/supabase/client';

export async function signUp(email: string, password: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  });
  
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
}
```

### 認証状態管理
```typescript
// src/components/AuthProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
}>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // 初期ユーザー状態取得
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

## 📊 データアクセスパターン

### サーバーサイド（推奨）
```typescript
// src/lib/data/profiles.ts
import { createClient } from '@/lib/supabase/server';

export async function getProfile(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: any) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
```

### クライアントサイド（必要時のみ）
```typescript
// src/hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error) setProfile(data);
          setLoading(false);
        });
    }
  }, [user, supabase]);

  return { profile, loading };
}
```

## 🚀 デプロイ設定（Vercel標準）

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@next_public_supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@next_public_supabase_anon_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key"
  }
}
```

## 🔧 開発時の必須コマンド

```bash
# 品質チェック3点セット（URANAI-01標準）
npm run lint && npm run type-check && npm run build

# Supabase型生成（スキーマ変更時）
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts

# ローカルSupabase起動（開発時）
npx supabase start

# マイグレーション実行
npx supabase db reset
```

## ⚠️ よくある落とし穴と対策

### 1. 環境変数の設定ミス
```bash
# 確認方法
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# よくあるミス: PUBLIC付け忘れ
❌ SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_URL
```

### 2. RLSポリシーの設定忘れ
```sql
-- 必須: 全テーブルでRLS有効化
alter table public.your_table enable row level security;

-- ポリシー作成忘れ
create policy "Users can access own data" on public.your_table
  for all using (auth.uid() = user_id);
```

### 3. クライアント/サーバーの混同
```typescript
// ❌ サーバーサイドでクライアント用を使用
import { createClient } from '@/lib/supabase/client'; // クライアント用

// ✅ サーバーサイドではサーバー用を使用
import { createClient } from '@/lib/supabase/server'; // サーバー用
```

## 📚 参考リソース

### URANAI-01での実装例
- `src/lib/supabase/` - Supabase設定
- `supabase/migrations/001_initial_schema.sql` - 初期スキーマ
- `src/types/database.ts` - 型定義

### 公式ドキュメント
- [Supabase + Next.js 公式ガイド](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Next.js 15 ドキュメント](https://nextjs.org/docs)

## 🎯 まとめ

**Next.js + Supabase**は、URANAI-01で実証されたZeamiフレームワークの標準構成です。

### キーポイント
1. **環境変数**: PUBLIC接頭詞の徹底
2. **クライアント/サーバー**: 用途に応じた使い分け
3. **RLS**: 必須のセキュリティ設定
4. **型安全性**: Supabase自動型生成の活用
5. **品質保証**: lint && type-check && build の徹底

この標準に従うことで、迅速で安全なアプリケーション開発が可能になります。