# COSMIC ORACLE デプロイガイド

## 🚀 デプロイ手順

### 前提条件
- [x] GitHub アカウント
- [x] Vercel アカウント
- [x] Supabase アカウント
- [x] OpenWeatherMap API キー（オプション）

### Step 1: Supabase プロジェクト設定

#### 1.1 Supabase プロジェクト作成
1. [Supabase Dashboard](https://app.supabase.com/) にアクセス
2. "New Project" をクリック
3. プロジェクト名: `cosmic-oracle` または任意の名前
4. データベースパスワードを設定
5. リージョン選択: `Asia Northeast (Tokyo)` 推奨

#### 1.2 データベーススキーマ適用
1. Supabase Dashboard → SQL Editor
2. `supabase/migrations/001_initial_schema.sql` の内容をコピー
3. SQLエディタに貼り付けて実行
4. エラーがないことを確認

#### 1.3 認証設定
1. Authentication → Settings
2. Site URL を設定:
   - 開発環境: `http://localhost:3000`
   - 本番環境: `https://your-app.vercel.app`
3. Redirect URLs に同じURLを追加

#### 1.4 API キー取得
1. Settings → API
2. 以下をメモ:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: 外部API設定（オプション）

#### 2.1 OpenWeatherMap API
1. [OpenWeatherMap](https://openweathermap.org/api) にアクセス
2. 無料アカウント作成
3. API Key を取得 → `OPENWEATHER_API_KEY`

### Step 3: Vercel デプロイ

#### 3.1 GitHub リポジトリ作成
```bash
git init
git add .
git commit -m "Initial commit: COSMIC ORACLE MVP"
git branch -M main
git remote add origin https://github.com/your-username/cosmic-oracle.git
git push -u origin main
```

#### 3.2 Vercel プロジェクト作成
1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. "New Project" をクリック
3. GitHubリポジトリを選択
4. プロジェクト名: `cosmic-oracle`
5. Framework Preset: `Next.js` を選択
6. "Deploy" をクリック

#### 3.3 環境変数設定
Vercel Dashboard → Settings → Environment Variables で以下を設定:

**必須項目:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

**オプション項目:**
```
OPENWEATHER_API_KEY=your-openweather-key
```

### Step 4: 動作確認

#### 4.1 基本機能テスト
1. デプロイ完了後、アプリにアクセス
2. ユーザー登録・ログイン
3. ダッシュボード表示確認
4. 統合占術フォーム動作確認
5. 占術結果表示確認

#### 4.2 API動作確認
```bash
# 環境データAPI
curl https://your-app.vercel.app/api/environment/current

# 数秘術API（要認証）
curl -X POST https://your-app.vercel.app/api/divination/numerology \
  -H "Content-Type: application/json" \
  -d '{"fullName":"テスト太郎","birthDate":"1990-01-01"}'
```

### Step 5: 本番設定最適化

#### 5.1 セキュリティ設定
1. Supabase → Database → Settings
2. SSL enforcement: ON
3. Row Level Security: 確認済み

#### 5.2 パフォーマンス最適化
1. Vercel → Analytics 有効化
2. Next.js Image Optimization 確認
3. Static Generation の確認

#### 5.3 監視設定
1. Vercel → Functions → Logs
2. Supabase → Logs → Real-time
3. エラー監視体制確立

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 1. "Invalid API key" エラー
- **原因**: Supabase API キーが正しく設定されていない
- **解決**: `.env.local` と Vercel環境変数を確認

#### 2. CORS エラー
- **原因**: Supabase Site URL設定が間違っている
- **解決**: Supabase Authentication設定でURLを確認

#### 3. 環境データが取得できない
- **原因**: OpenWeatherMap API キーが無効または未設定
- **解決**: APIキーを確認、フォールバック機能が動作することを確認

#### 4. ビルドエラー
- **原因**: TypeScript型エラーまたは依存関係の問題
- **解決**: `npm run build` でローカル確認、型定義を修正

#### 5. データベース接続エラー
- **原因**: RLSポリシーまたはスキーマの問題
- **解決**: Supabase SQL Editorでスキーマ・ポリシーを確認

### デバッグ用コマンド

```bash
# ローカル開発サーバー起動
npm run dev

# ビルド確認
npm run build

# 型チェック
npx tsc --noEmit

# Supabase ローカル開発（オプション）
npx supabase start
```

## 📊 パフォーマンス目標

### 目標値
- **First Load**: < 3秒
- **API Response**: < 2秒
- **Uptime**: > 99.5%
- **Error Rate**: < 1%

### 監視項目
- Vercel Analytics
- Supabase Performance
- API Response Time
- User Session Data

## 🔒 セキュリティチェックリスト

- [x] RLS有効化
- [x] APIキーの適切な管理
- [x] HTTPS通信
- [x] 入力値サニタイゼーション
- [x] 認証・認可の実装
- [x] エラー情報の適切な隠蔽

## 📈 運用後の改善計画

### Phase 1: 安定化（1-2週間）
- 監視体制確立
- バグ修正
- パフォーマンス調整

### Phase 2: 機能拡張（1-2ヶ月）
- 残り7占術の実装
- 国際化対応
- モバイルアプリ対応

### Phase 3: スケール（3-6ヶ月）
- CDN導入
- データベース最適化
- 負荷分散対応

---

**注意**: このガイドは基本的なデプロイ手順です。本格的な商用運用では、追加のセキュリティ設定、監視、バックアップ体制が必要です。