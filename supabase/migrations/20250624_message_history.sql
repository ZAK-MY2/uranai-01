-- メッセージ履歴テーブル
CREATE TABLE IF NOT EXISTS message_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hash VARCHAR(32) NOT NULL UNIQUE,
  user_id VARCHAR(16) NOT NULL,
  divination_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX idx_message_history_hash ON message_history(hash);
CREATE INDEX idx_message_history_user_id ON message_history(user_id);
CREATE INDEX idx_message_history_created_at ON message_history(created_at);
CREATE INDEX idx_message_history_divination_type ON message_history(divination_type);

-- RLS (Row Level Security) を有効化
ALTER TABLE message_history ENABLE ROW LEVEL SECURITY;

-- RLSポリシー：誰でも読み取り可能（統計情報のため）
CREATE POLICY "Anyone can read message history" ON message_history
  FOR SELECT USING (true);

-- RLSポリシー：認証されたユーザーのみ挿入可能
CREATE POLICY "Authenticated users can insert" ON message_history
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 古いデータを自動削除する関数
CREATE OR REPLACE FUNCTION cleanup_old_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM message_history
  WHERE created_at < NOW() - INTERVAL '2 years';
END;
$$ LANGUAGE plpgsql;

-- 定期的なクリーンアップのためのスケジュール（pg_cronが必要）
-- SELECT cron.schedule('cleanup-old-messages', '0 2 * * 0', 'SELECT cleanup_old_messages();');