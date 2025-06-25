-- COSMIC ORACLE データベーススキーマ
-- 作成日: 2025-06-25

-- ========================================
-- 1. ユーザープロファイル
-- ========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  birth_date DATE NOT NULL,
  birth_time TIME,
  birth_place TEXT,
  gender TEXT CHECK (gender IN ('男性', '女性', 'その他', '未回答')),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- プロファイル更新時のタイムスタンプ自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 2. 占術セッション
-- ========================================
CREATE TABLE IF NOT EXISTS divination_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  divination_type TEXT NOT NULL CHECK (divination_type IN (
    'numerology', 'tarot', 'astrology', 'iching', 'kabbalah', 
    'runes', 'shichu-suimei', 'nine-star-ki', 'feng-shui', 
    'celtic', 'vedic', 'integrated'
  )),
  input_data JSONB NOT NULL,
  result_data JSONB NOT NULL,
  environment_data JSONB,
  is_favorite BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_sessions_user_id ON divination_sessions(user_id);
CREATE INDEX idx_sessions_type ON divination_sessions(divination_type);
CREATE INDEX idx_sessions_created_at ON divination_sessions(created_at DESC);

-- ========================================
-- 3. 環境データログ
-- ========================================
CREATE TABLE IF NOT EXISTS environment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  weather_data JSONB,
  lunar_data JSONB,
  astronomical_data JSONB,
  location JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_env_logs_timestamp ON environment_logs(timestamp DESC);

-- ========================================
-- 4. 占術結果キャッシュ
-- ========================================
CREATE TABLE IF NOT EXISTS divination_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL,
  divination_type TEXT NOT NULL,
  input_hash TEXT NOT NULL,
  result_data JSONB NOT NULL,
  environment_data JSONB,
  hit_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days'
);

CREATE INDEX idx_cache_key ON divination_cache(cache_key);
CREATE INDEX idx_cache_type ON divination_cache(divination_type);
CREATE INDEX idx_cache_expires ON divination_cache(expires_at);

-- ========================================
-- 5. ユーザー設定
-- ========================================
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'cosmic' CHECK (theme IN ('cosmic', 'light', 'dark')),
  language TEXT DEFAULT 'ja' CHECK (language IN ('ja', 'en', 'zh', 'ko')),
  notification_enabled BOOLEAN DEFAULT TRUE,
  privacy_settings JSONB DEFAULT '{
    "share_results": false,
    "public_profile": false,
    "anonymous_mode": false
  }',
  display_settings JSONB DEFAULT '{
    "font_size": "medium",
    "animations": true,
    "high_contrast": false,
    "reduced_motion": false
  }',
  divination_preferences JSONB DEFAULT '{
    "default_spread": "three-card",
    "auto_save": true,
    "show_explanations": true
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 6. お気に入りテンプレート
-- ========================================
CREATE TABLE IF NOT EXISTS favorite_spreads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  divination_type TEXT NOT NULL,
  configuration JSONB NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_fav_spreads_user_id ON favorite_spreads(user_id);

-- ========================================
-- 7. 統計・分析データ
-- ========================================
CREATE TABLE IF NOT EXISTS user_statistics (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_readings INTEGER DEFAULT 0,
  readings_by_type JSONB DEFAULT '{}',
  favorite_divination_type TEXT,
  most_asked_category TEXT,
  lucky_elements JSONB DEFAULT '[]',
  unlucky_elements JSONB DEFAULT '[]',
  reading_patterns JSONB DEFAULT '{}',
  last_reading_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON user_statistics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 8. システムログ（管理用）
-- ========================================
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error', 'debug')),
  component TEXT NOT NULL,
  action TEXT,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_logs_level ON system_logs(level);
CREATE INDEX idx_logs_component ON system_logs(component);
CREATE INDEX idx_logs_created_at ON system_logs(created_at DESC);

-- ========================================
-- Row Level Security (RLS) ポリシー
-- ========================================

-- プロファイル: ユーザーは自分のプロファイルのみアクセス可能
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 占術セッション: ユーザーは自分のセッションのみアクセス可能
ALTER TABLE divination_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON divination_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON divination_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON divination_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON divination_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- ユーザー設定: ユーザーは自分の設定のみアクセス可能
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

-- お気に入りスプレッド: ユーザーは自分のお気に入りのみアクセス可能
ALTER TABLE favorite_spreads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own spreads" ON favorite_spreads
  FOR ALL USING (auth.uid() = user_id);

-- 統計: ユーザーは自分の統計のみアクセス可能
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own statistics" ON user_statistics
  FOR SELECT USING (auth.uid() = user_id);

-- 環境データとキャッシュは全ユーザーが読み取り可能
ALTER TABLE environment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read environment logs" ON environment_logs
  FOR SELECT USING (true);

ALTER TABLE divination_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cache" ON divination_cache
  FOR SELECT USING (true);

-- ========================================
-- ヘルパー関数
-- ========================================

-- キャッシュキー生成関数
CREATE OR REPLACE FUNCTION generate_cache_key(
  p_divination_type TEXT,
  p_input_data JSONB
) RETURNS TEXT AS $$
BEGIN
  RETURN encode(
    digest(
      p_divination_type || '::' || p_input_data::TEXT,
      'sha256'
    ),
    'hex'
  );
END;
$$ LANGUAGE plpgsql;

-- セッション統計更新関数
CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_statistics (user_id, total_readings, readings_by_type, last_reading_at)
  VALUES (
    NEW.user_id,
    1,
    jsonb_build_object(NEW.divination_type, 1),
    NEW.created_at
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_readings = user_statistics.total_readings + 1,
    readings_by_type = user_statistics.readings_by_type || 
      jsonb_build_object(
        NEW.divination_type, 
        COALESCE((user_statistics.readings_by_type->>NEW.divination_type)::INT, 0) + 1
      ),
    last_reading_at = NEW.created_at,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_statistics_on_session
  AFTER INSERT ON divination_sessions
  FOR EACH ROW EXECUTE FUNCTION update_user_statistics();

-- キャッシュクリーンアップ関数（定期実行用）
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM divination_cache
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- インデックス最適化
-- ========================================

-- 複合インデックス
CREATE INDEX idx_sessions_user_type_date ON divination_sessions(user_id, divination_type, created_at DESC);
CREATE INDEX idx_cache_type_hash ON divination_cache(divination_type, input_hash);

-- 部分インデックス（お気に入りのみ）
CREATE INDEX idx_favorite_sessions ON divination_sessions(user_id, created_at DESC) 
  WHERE is_favorite = TRUE;

-- ========================================
-- 初期データ
-- ========================================

-- システム管理者用の初期設定（必要に応じて）
-- INSERT INTO system_settings (key, value) VALUES
--   ('maintenance_mode', 'false'),
--   ('cache_ttl_days', '7'),
--   ('max_sessions_per_user', '1000');

-- コメント追加
COMMENT ON TABLE profiles IS '占術システムのユーザープロファイル';
COMMENT ON TABLE divination_sessions IS '占術セッションの記録';
COMMENT ON TABLE environment_logs IS '環境データ（天候、月相など）のログ';
COMMENT ON TABLE divination_cache IS '占術結果のキャッシュ';
COMMENT ON TABLE user_settings IS 'ユーザー個別設定';
COMMENT ON TABLE favorite_spreads IS 'お気に入りの占術設定';
COMMENT ON TABLE user_statistics IS 'ユーザーの利用統計';
COMMENT ON TABLE system_logs IS 'システムログ（デバッグ・監視用）';