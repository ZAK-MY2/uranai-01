# 🚀 プログラミング開始時のクイックチェックリスト

## 📍 セッション開始時の必須確認事項

### 1. コンテキスト確認
```bash
# 現在のプロジェクトコンテキストを確認
cat .zeami-context
```

### 2. 重要教訓の確認
```markdown
## 🚨 再発防止チェック（毎回必須）

### Git・コミット
- [ ] 並列実行: git status & git diff & git log を並列で
- [ ] ドキュメント先行: コミット前に必ず開発ログ作成
- [ ] HEREDOC使用: 複数行メッセージはHEREDOC形式
- [ ] 包括的メッセージ: 技術詳細・メトリクス・完成度記載

### 型エラー対処
- [ ] 個別修正禁止: 1つずつ修正は無限ループの原因
- [ ] 包括的解決: 根本原因特定→一括修正
- [ ] 教訓記録: 新しい失敗パターンがあればCLAUDE.mdに追加

### 開発プロセス
- [ ] TodoRead実行: 開始時に必ず現状確認
- [ ] 並列実行最優先: Claude Codeの能力を最大活用
- [ ] 品質チェック: build/lint/type-checkを完了前に必ず実行
```

### 3. プロジェクト状況確認
- [ ] `TodoRead` でタスク状況確認
- [ ] `git status` で変更状況確認
- [ ] 最新の開発ログ確認（`docs/logs/` の最新ファイル）

## 🔧 クイックアクセスコマンド

### 重要ドキュメントへの即座アクセス
```bash
# メインガイドライン
cat CLAUDE.md

# 重要教訓集
cat docs/lessons-learned/CRITICAL_LESSONS_LEARNED.md

# 最新開発ログ
ls -la docs/logs/2025-*/
```

### 開発環境セットアップ
```bash
# 開発サーバー起動
npm run dev

# 型チェック
npm run type-check

# ビルド確認
npm run build
```

## 📝 新しい教訓の追加方法

### 「再発防止に記録」と言われた場合の手順：

1. **即座にCLAUDE.mdを更新**
```markdown
# 新しい教訓をCLAUDE.mdの「🚨 重要な教訓」セクションに追加
- **[カテゴリ]**: [具体的な防止策]
```

2. **詳細教訓をCRITICAL_LESSONS_LEARNED.mdに追加**
```markdown
### ❌ 新しい失敗パターン
- [具体的な失敗内容]
- [なぜ発生したか]

### ✅ 改善策
- [具体的な防止方法]
- [チェック項目]
```

3. **このクイックチェックリストを更新**
```markdown
# 新しいチェック項目を追加
- [ ] [新しい防止策]: [具体的な行動]
```

4. **Git コミット**
```bash
git add . && git commit -m "docs: Add new lesson learned - [教訓の概要]

- Add prevention measure for [問題]
- Update checklist and guidelines
- Ensure future prevention of [具体的な問題]

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 🎯 使用方法

### セッション開始時
1. このファイルを開く: `cat QUICK_START_CHECKLIST.md`
2. チェックリストを確認しながら作業開始
3. TodoReadで現状確認

### 新しい教訓発生時
「再発防止に記録」→ 上記の4ステップを実行

### セッション終了時
- [ ] TodoWrite で進捗更新
- [ ] 開発ログ作成
- [ ] Git コミット（教訓更新含む）

## 🔄 継続的改善

このファイル自体も生きたドキュメントです。新しい学びがあるたびに：
1. チェックリストに項目追加
2. クイックアクセス方法を改善
3. より効率的なワークフローに更新

**目標**: 同じ間違いを二度と繰り返さず、毎回より効率的な開発を実現する