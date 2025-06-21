-- COSMIC ORACLE Database Schema
-- 初期スキーマ作成

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ユーザープロファイル拡張
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  birth_date date,
  birth_time time,
  birth_location jsonb, -- {lat: number, lon: number, timezone: string, city: string}
  preferences jsonb default '{}', -- {language: string, theme: string}
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 占術セッション
create table public.divination_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  session_type text not null, -- 'numerology', 'tarot', 'astrology', 'integrated'
  input_data jsonb not null, -- ユーザー入力データ
  results jsonb not null, -- 占術計算結果
  environment_data jsonb, -- 環境データスナップショット
  interpretation text, -- AI生成解釈
  created_at timestamp with time zone default now()
);

-- 占術結果キャッシュ
create table public.divination_cache (
  id uuid default gen_random_uuid() primary key,
  cache_key text unique not null,
  divination_type text not null,
  input_hash text not null,
  result_data jsonb not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- 環境データログ
create table public.environment_logs (
  id uuid default gen_random_uuid() primary key,
  data_type text not null, -- 'weather', 'lunar', 'astronomical'
  location jsonb, -- {lat: number, lon: number}
  data jsonb not null,
  collected_at timestamp with time zone default now()
);

-- ユーザー設定
create table public.user_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  setting_key text not null,
  setting_value jsonb not null,
  updated_at timestamp with time zone default now(),
  unique(user_id, setting_key)
);

-- インデックス作成
create index idx_divination_sessions_user_id on public.divination_sessions(user_id);
create index idx_divination_sessions_created_at on public.divination_sessions(created_at desc);
create index idx_divination_sessions_type on public.divination_sessions(session_type);
create index idx_divination_cache_key on public.divination_cache(cache_key);
create index idx_divination_cache_expires on public.divination_cache(expires_at);
create index idx_environment_logs_type_time on public.environment_logs(data_type, collected_at desc);

-- RLS (Row Level Security) 設定
alter table public.profiles enable row level security;
alter table public.divination_sessions enable row level security;
alter table public.user_settings enable row level security;

-- ポリシー作成
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can view own sessions" on public.divination_sessions
  for select using (auth.uid() = user_id);

create policy "Users can insert own sessions" on public.divination_sessions
  for insert with check (auth.uid() = user_id);

create policy "Users can view own settings" on public.user_settings
  for select using (auth.uid() = user_id);

create policy "Users can upsert own settings" on public.user_settings
  for insert with check (auth.uid() = user_id);

create policy "Users can update own settings" on public.user_settings
  for update using (auth.uid() = user_id);

-- キャッシュテーブルは全ユーザーが読み取り可能（データに個人情報含まず）
create policy "Anyone can read cache" on public.divination_cache
  for select using (true);

-- 環境データは全ユーザーが読み取り可能
create policy "Anyone can read environment logs" on public.environment_logs
  for select using (true);

-- Functions for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.user_settings
  for each row execute procedure public.handle_updated_at();