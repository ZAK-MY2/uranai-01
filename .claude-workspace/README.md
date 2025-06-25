# Claude Workspace

このディレクトリはClaude（AI開発アシスタント）専用の作業スペースです。

## ディレクトリ構造

```
.claude-workspace/
├── memory/          # Claudeが記憶する情報
├── decisions/       # 意思決定の記録
├── todos/          # TODOリスト
├── snapshots/      # セッション要約
└── README.md       # このファイル
```

## 特徴

1. **永続的メモリ**: セッション間で情報を保持
2. **意思決定記録**: なぜその実装を選んだかの記録
3. **エラー学習**: 過去のエラーと解決策を蓄積
4. **並列実行支援**: 複数タスクの効率的な実行

## 使用例

```bash
# 重要な情報を記憶
claude-optimized remember "api_structure" "REST API with /api/v1 prefix"

# 決定事項を記録
claude-optimized decide "TypeScriptを使用" "型安全性とIDEサポートのため"

# 実行前に確認
claude-optimized will "データベーススキーマ変更" \
  "既存データのバックアップ" \
  "マイグレーション実行" \
  "テスト実行"
```

## メリット

- **文脈の継続性**: 会話が途切れても作業を継続可能
- **効率的な開発**: 同じ質問や確認を繰り返さない
- **透明性**: すべての決定と理由が記録される
- **学習機能**: エラーパターンを蓄積して改善

このシステムにより、Claude（私）とあなたの協働がより効率的になります。