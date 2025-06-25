# COSMIC ORACLE デプロイメントチェックリスト

## 🚀 デプロイ前の準備

### 1. 環境変数の準備
- [ ] Supabaseプロジェクトを作成
- [ ] 以下の環境変数を取得：
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  ```

### 2. Supabaseセットアップ
- [ ] Supabaseダッシュボードにログイン
- [ ] 新規プロジェクト作成（リージョン: 東京推奨）
- [ ] SQL Editorで `/supabase/migrations/001_initial_schema.sql` を実行
- [ ] Authentication設定：
  - [ ] Email認証を有効化
  - [ ] サイトURLを設定
  - [ ] リダイレクトURLを設定

### 3. ローカルテスト
- [ ] `.env.local` に環境変数を設定
- [ ] `npm run build` でビルド確認
- [ ] `npm run start` で本番モード確認
- [ ] 基本機能の動作確認：
  - [ ] トップページ表示
  - [ ] 各占術ページ表示
  - [ ] 環境データ取得

## 🌐 Vercelデプロイ

### 1. Vercelアカウント準備
- [ ] [Vercel](https://vercel.com)にログイン
- [ ] GitHubアカウントと連携

### 2. プロジェクトインポート
- [ ] "Import Project"をクリック
- [ ] GitHubリポジトリを選択
- [ ] Framework: Next.js を確認
- [ ] Root Directory: そのまま（変更不要）

### 3. 環境変数設定
Vercelダッシュボードで以下を設定：
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

### 4. デプロイ実行
- [ ] "Deploy"ボタンをクリック
- [ ] ビルドログを確認
- [ ] デプロイ完了を待つ

## ✅ デプロイ後の確認

### 1. 基本動作確認
- [ ] 本番URLでアクセス可能
- [ ] HTTPSが有効
- [ ] レスポンシブデザイン確認（モバイル/PC）

### 2. 機能テスト
- [ ] 占術計算の動作確認：
  - [ ] 数秘術
  - [ ] タロット
  - [ ] 西洋占星術
- [ ] 環境データ取得確認
- [ ] エラーページ表示確認

### 3. パフォーマンス確認
- [ ] Lighthouse実行
- [ ] Core Web Vitals確認
- [ ] 画像最適化確認

### 4. セキュリティ確認
- [ ] CSPヘッダー確認
- [ ] 環境変数の露出なし
- [ ] エラーメッセージに機密情報なし

## 🔧 トラブルシューティング

### ビルドエラーの場合
1. ローカルで `npm run build` を実行
2. エラーメッセージを確認
3. 型エラーの修正
4. 再度プッシュ

### 環境変数エラーの場合
1. Vercel環境変数設定を再確認
2. 変数名のタイポをチェック
3. 再デプロイ実行

### Supabase接続エラーの場合
1. Supabase URLとキーを確認
2. RLSポリシーを確認
3. CORSエラーの場合はSupabase設定確認

## 📝 デプロイ情報記録

デプロイ完了後、以下を記録：

- **本番URL**: https://[your-project].vercel.app
- **デプロイ日時**: 
- **デプロイバージョン**: 
- **確認事項**: 
  - [ ] 全ページアクセス可能
  - [ ] 占術計算正常動作
  - [ ] レスポンシブ対応OK
  - [ ] パフォーマンス良好

## 🎉 デプロイ完了！

おめでとうございます！COSMIC ORACLEが世界に公開されました。

### 次のステップ
1. ユーザーフィードバック収集
2. アナリティクス設定
3. 残り占術の段階的追加
4. パフォーマンス最適化

---

**注意事項**：
- 本番環境の環境変数は絶対に公開しない
- 定期的なバックアップを実施
- エラーログをモニタリング