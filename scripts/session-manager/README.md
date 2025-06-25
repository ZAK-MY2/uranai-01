# 開発継続性システム - Session Manager

COSMIC ORACLEプロジェクトの開発継続性を高めるための包括的なツール群です。

## 🎯 目的

- **ターミナル出力の管理**: 大量の出力を整理・要約
- **作業文脈の保持**: 中断・再開時の状態復元
- **自動ログ収集**: コマンド履歴とエラーの自動記録
- **引き継ぎ文書生成**: チームや未来の自分への完璧な引き継ぎ

## 🚀 クイックスタート

```bash
# 初期セットアップ（初回のみ）
./scripts/dev-continuity.sh setup

# 開発開始時
./scripts/dev-continuity.sh start

# 作業中のタスク管理
./scripts/dev-continuity.sh task add "新機能の実装"
./scripts/dev-continuity.sh task done 0

# 状態確認
./scripts/dev-continuity.sh status

# 開発終了時
./scripts/dev-continuity.sh finish
```

## 📁 ツール構成

### 1. dev-continuity.sh（マスタースクリプト）
すべてのツールへの統一インターフェース

### 2. session-recorder.sh（セッション記録）
- 開発セッションの管理
- タスクトラッキング
- 重要な発見の記録
- 自動サマリー生成

### 3. context-keeper.sh（コンテキスト保持）
- 作業環境のスナップショット
- Git状態、ファイル、プロセスの記録
- 復元ガイドの提供
- 差分表示機能

### 4. auto-logger.sh（自動ログ収集）
- コマンド実行の自動記録
- エラーの自動検出と記録
- 履歴分析とレポート
- 重要コマンドの抽出

### 5. handover-generator.sh（引き継ぎ生成）
- 包括的な引き継ぎドキュメント
- デイリーサマリー
- チーム向けレポート
- クイックメモ機能

### 6. terminal-helper.sh（ターミナル支援）
- コマンド出力の整理と保存
- 自動要約生成
- エラー情報のハイライト
- インタラクティブビューアー

## 📊 生成されるファイル

```
uranai-01/
├── .sessions/                    # セッション情報
│   ├── current_session.json     # 現在のセッション
│   ├── logs/                    # コマンドログ
│   └── summaries/               # セッションサマリー
├── .context/                     # コンテキスト情報
│   ├── current.json             # 現在のコンテキスト
│   └── snapshots/               # スナップショット
├── .terminal-outputs/            # ターミナル出力
│   ├── output_*.txt             # 生の出力
│   └── summaries/               # 出力サマリー
└── docs/handover/               # 引き継ぎ文書
    ├── handover_*.md            # 包括的引き継ぎ
    ├── daily_*.md               # デイリーサマリー
    └── team_report_*.md         # チームレポート
```

## 🔧 高度な使い方

### セッション管理
```bash
# 名前付きセッション開始
./scripts/session-manager/session-recorder.sh new "API実装作業"

# 重要な発見を記録
./scripts/session-manager/session-recorder.sh finding "APIレート制限は1000/時" "technical"

# セッションサマリー生成
./scripts/session-manager/session-recorder.sh summary
```

### コンテキスト管理
```bash
# 重要なポイントでコンテキスト保存
./scripts/session-manager/context-keeper.sh collect "デプロイ前"

# スナップショット一覧
./scripts/session-manager/context-keeper.sh list

# 特定のスナップショットを復元
./scripts/session-manager/context-keeper.sh load 20240623_143000
```

### ログ分析
```bash
# 過去48時間の分析
./scripts/session-manager/auto-logger.sh analyze 48

# 重要コマンドを抽出
./scripts/session-manager/auto-logger.sh extract important_commands.md

# 古いログのクリーンアップ
./scripts/session-manager/auto-logger.sh cleanup 30
```

### ターミナル出力管理
```bash
# コマンド実行と自動要約
./scripts/session-manager/terminal-helper.sh run npm run build

# 保存された出力を閲覧
./scripts/session-manager/terminal-helper.sh view

# 古い出力をクリーンアップ
./scripts/session-manager/terminal-helper.sh cleanup 7
```

## 🎨 カスタマイズ

### 環境変数
```bash
# セッションファイルの保存場所
export COSMIC_SESSION_DIR="$HOME/.cosmic-oracle/sessions"

# ログの詳細度
export COSMIC_LOG_LEVEL="debug"

# 自動バックアップ間隔（分）
export COSMIC_BACKUP_INTERVAL=30
```

### 設定ファイル
各ツールの動作は以下の設定ファイルでカスタマイズ可能:
- `.cosmic-oracle.rc` - グローバル設定
- `.session-config.json` - セッション設定
- `.context-config.json` - コンテキスト設定

## 🐛 トラブルシューティング

### よくある問題

1. **jqコマンドが見つからない**
   ```bash
   # macOS
   brew install jq
   
   # Ubuntu/Debian
   sudo apt-get install jq
   ```

2. **権限エラー**
   ```bash
   chmod +x scripts/*.sh scripts/session-manager/*.sh
   ```

3. **bashrcへの統合が効かない**
   ```bash
   source ~/.bashrc
   # または新しいターミナルを開く
   ```

## 📝 ベストプラクティス

1. **定期的なコンテキスト保存**
   - 大きな変更の前後
   - ブランチ切り替え時
   - 長時間の作業後

2. **タスクの細分化**
   - 大きなタスクは3-5個のサブタスクに
   - 優先度を明確に設定
   - 完了したらすぐに更新

3. **意味のある記録**
   - 発見は具体的に記録
   - エラーは解決策とセットで
   - 将来の自分が理解できるように

4. **定期的なクリーンアップ**
   - 週1回は古いログを整理
   - 不要なスナップショットを削除
   - ディスク容量を確認

## 🤝 貢献

このツールの改善提案やバグ報告は歓迎します:
1. 問題を見つけたら記録
2. 改善案を開発ログに記載
3. プルリクエストの作成

## 📄 ライセンス

COSMIC ORACLEプロジェクトの一部として、同じライセンスが適用されます。

---

**Happy Coding! 🚀**

開発の継続性を保ち、効率的な作業を実現しましょう。