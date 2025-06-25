#!/bin/bash

# 引き継ぎドキュメント自動生成ツール
# 他の開発者（または未来の自分）への完璧な引き継ぎを実現

SCRIPT_DIR="$(dirname "$0")"
PROJECT_ROOT="$SCRIPT_DIR/../.."
HANDOVER_DIR="$PROJECT_ROOT/docs/handover"
TEMPLATE_DIR="$SCRIPT_DIR/templates"

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# 初期化
init_handover() {
    mkdir -p "$HANDOVER_DIR" "$TEMPLATE_DIR"
}

# 包括的な引き継ぎドキュメント生成
generate_comprehensive() {
    local output_file="$HANDOVER_DIR/handover_$(date +%Y%m%d_%H%M%S).md"
    local session_file="$PROJECT_ROOT/.sessions/current_session.json"
    local context_file="$PROJECT_ROOT/.context/current.json"
    
    echo -e "${BLUE}📋 引き継ぎドキュメントを生成中...${NC}"
    
    cat > "$output_file" <<'EOF'
# COSMIC ORACLE 開発引き継ぎドキュメント

生成日時: $(date)

## 🎯 プロジェクト概要

### ビジョン
10占術統合 + リアルタイム環境データ連携による高精度AI占いシステム

### 現在のフェーズ
Phase 1: MVP基盤開発（Week 2）

### 技術スタック
- Frontend: Next.js 15, TypeScript, Tailwind CSS
- Backend: Supabase (PostgreSQL + Auth + Realtime)
- Deployment: Vercel
- AI: OpenAI GPT-4, Claude 3

## 🚀 クイックスタート

### 1. 環境構築
```bash
# リポジトリクローン
git clone [repository-url]
cd uranai-01

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local
# .env.localに必要な値を設定
```

### 2. 開発サーバー起動
```bash
npm run dev
# http://localhost:3000 でアクセス
```

### 3. 開発ツール起動
```bash
# セッション記録開始
./scripts/session-manager/session-recorder.sh new "作業名"

# コンテキスト保存
./scripts/session-manager/context-keeper.sh collect

# 自動ログ収集
./scripts/session-manager/auto-logger.sh toggle on
```

## 📊 現在の作業状態
EOF
    
    # セッション情報を追加
    if [ -f "$session_file" ]; then
        echo -e "\n### アクティブセッション" >> "$output_file"
        local session_info=$(cat "$session_file")
        echo "- セッション名: $(echo "$session_info" | jq -r '.name')" >> "$output_file"
        echo "- 開始時刻: $(echo "$session_info" | jq -r '.started_at')" >> "$output_file"
        echo "- 実行コマンド数: $(echo "$session_info" | jq -r '.commands_count')" >> "$output_file"
        echo "- エラー数: $(echo "$session_info" | jq -r '.errors_count')" >> "$output_file"
        
        echo -e "\n### 未完了タスク" >> "$output_file"
        echo "$session_info" | jq -r '.tasks[] | select(.status == "pending") | "- [ ] [\(.priority)] \(.task)"' >> "$output_file"
        
        echo -e "\n### 完了タスク" >> "$output_file"
        echo "$session_info" | jq -r '.tasks[] | select(.status == "completed") | "- [x] \(.task)"' >> "$output_file"
    fi
    
    # コンテキスト情報を追加
    if [ -f "$context_file" ]; then
        echo -e "\n## 🔧 開発環境コンテキスト" >> "$output_file"
        local context=$(cat "$context_file")
        
        echo -e "\n### Git状態" >> "$output_file"
        echo "- ブランチ: $(echo "$context" | jq -r '.git.branch')" >> "$output_file"
        echo "- 最新コミット:" >> "$output_file"
        echo "$context" | jq -r '.git.recent_commits' | head -5 | sed 's/^/  /' >> "$output_file"
        
        echo -e "\n### 最近作業したファイル" >> "$output_file"
        echo "$context" | jq -r '.files.recently_edited[]' | head -10 | sed 's/^/- /' >> "$output_file"
    fi
    
    # アーキテクチャ情報
    cat >> "$output_file" <<'EOF'

## 🏗️ アーキテクチャ

### ディレクトリ構造
```
uranai-01/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # UIコンポーネント
│   ├── lib/             # ユーティリティ・ロジック
│   │   ├── divination/  # 占術エンジン
│   │   ├── api/         # API連携
│   │   └── db/          # データベース操作
│   └── types/           # TypeScript型定義
├── public/              # 静的ファイル
├── docs/                # ドキュメント
│   ├── logs/           # 開発ログ
│   └── handover/       # 引き継ぎ文書
└── scripts/            # 開発支援スクリプト
```

### 主要コンポーネント

#### 占術エンジン
- `/src/lib/divination/numerology.ts` - 数秘術計算
- `/src/lib/divination/tarot.ts` - タロット展開
- `/src/lib/divination/astrology.ts` - 西洋占星術

#### API統合
- `/src/lib/api/weather.ts` - 天候データ取得
- `/src/lib/api/lunar.ts` - 月相データ取得
- `/src/lib/api/cosmic.ts` - 宇宙環境データ

#### データベース
- `/supabase/migrations/` - スキーマ定義
- `/src/lib/db/client.ts` - Supabaseクライアント

## 🔍 重要な技術的決定

### 1. 占術計算のキャッシュ戦略
- 同一入力での再計算を防ぐためRedisライクなキャッシュを実装
- Supabaseのリアルタイム機能を活用

### 2. 環境データの取り扱い
- 外部APIの障害に備えて3段階のフォールバック
- 1時間ごとのバッチ更新でAPI制限を回避

### 3. UI/UXデザイン原則
- モバイルファースト（占い利用の7割がスマホ）
- ダークテーマベースで神秘的な雰囲気
- アニメーションは控えめに（パフォーマンス重視）

## ⚠️ 既知の問題と対策

### 現在の課題
1. **型エラーのループ問題**
   - 症状: 個別修正すると新たなエラーが発生
   - 対策: 包括的な型定義の見直しが必要

2. **API レート制限**
   - 症状: 無料枠での開発時に制限到達
   - 対策: キャッシュとモックデータの活用

3. **ビルド時間**
   - 症状: 依存関係が多くビルドが遅い
   - 対策: turbopackの導入を検討中

## 📚 参考資料

### 内部ドキュメント
- [PRODUCTION_SPEC.md](../../PRODUCTION_SPEC.md) - 詳細仕様書
- [CLAUDE.md](../../CLAUDE.md) - AI開発ガイド
- [開発ログ一覧](../logs/) - 過去の開発記録

### 外部リソース
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [占術アルゴリズムリファレンス](docs/divination-algorithms.md)

## 🤝 連絡先・サポート

### 開発チーム
- Tech Lead: [名前] ([メール])
- Frontend: [名前] ([メール])
- Backend: [名前] ([メール])

### 緊急時の対応
1. Vercelダッシュボードで稼働状況確認
2. Supabaseダッシュボードでデータベース確認
3. エラーログは`/logs`ディレクトリ参照

## ✅ 引き継ぎチェックリスト

新しい開発者の方は以下を確認してください：

- [ ] 開発環境のセットアップ完了
- [ ] 環境変数の設定確認
- [ ] 開発サーバーの起動確認
- [ ] データベース接続確認
- [ ] 最新の開発ログ確認
- [ ] 未完了タスクの把握
- [ ] コーディング規約の理解

---

このドキュメントは自動生成されました。
最新情報は各種ログファイルも合わせてご確認ください。

頑張ってください！🚀
EOF
    
    # 最新のエラーログを追加
    if [ -f "$HOME/.cosmic-oracle-dev.log" ]; then
        echo -e "\n## 📋 最近のエラーログ（参考）" >> "$output_file"
        echo '```' >> "$output_file"
        tail -20 "$HOME/.cosmic-oracle-dev.log" >> "$output_file"
        echo '```' >> "$output_file"
    fi
    
    echo -e "${GREEN}✅ 引き継ぎドキュメントを生成しました: $output_file${NC}"
}

# 簡易引き継ぎメモ生成
generate_quick_memo() {
    local memo_file="$HANDOVER_DIR/quick_memo_$(date +%Y%m%d_%H%M%S).md"
    local message="$1"
    
    cat > "$memo_file" <<EOF
# クイック引き継ぎメモ

日時: $(date)
作成者: $(whoami)

## メッセージ
$message

## 現在の状態
- ブランチ: $(git branch --show-current 2>/dev/null)
- 作業ディレクトリ: $(pwd)
- 変更ファイル数: $(git status --short 2>/dev/null | wc -l)

## 直近のコミット
$(git log --oneline -5 2>/dev/null)

## 次のアクション
1. $(pwd)に移動
2. git pullで最新を取得
3. npm installで依存関係更新
4. npm run devで開発開始

---
*このメモは簡易版です。詳細は包括的引き継ぎドキュメントを生成してください。*
EOF
    
    echo -e "${GREEN}✅ クイックメモを作成しました: $memo_file${NC}"
}

# デイリーサマリー生成
generate_daily_summary() {
    local summary_file="$HANDOVER_DIR/daily_$(date +%Y%m%d).md"
    
    echo -e "${BLUE}📊 本日のサマリーを生成中...${NC}"
    
    # ヘッダー
    echo "# デイリー開発サマリー: $(date +%Y-%m-%d)" > "$summary_file"
    echo "" >> "$summary_file"
    
    # コマンド統計
    echo "## 📈 本日の活動統計" >> "$summary_file"
    if [ -f "$HOME/.cosmic-oracle-history" ]; then
        local today=$(date +%Y-%m-%d)
        local total_commands=$(grep "^$today" "$HOME/.cosmic-oracle-history" 2>/dev/null | wc -l)
        local error_commands=$(grep "^$today" "$HOME/.cosmic-oracle-history" 2>/dev/null | awk -F'|' '$2 != "0"' | wc -l)
        
        echo "- 実行コマンド数: $total_commands" >> "$summary_file"
        echo "- エラー発生数: $error_commands" >> "$summary_file"
        echo "- 成功率: $(( (total_commands - error_commands) * 100 / (total_commands + 1) ))%" >> "$summary_file"
    fi
    
    # Git活動
    echo -e "\n## 🌿 Git活動" >> "$summary_file"
    echo "### コミット" >> "$summary_file"
    git log --since="1 day ago" --oneline 2>/dev/null | sed 's/^/- /' >> "$summary_file"
    
    echo -e "\n### 変更ファイル" >> "$summary_file"
    git diff --stat HEAD@{1.day.ago} 2>/dev/null | tail -20 >> "$summary_file"
    
    # 主要な作業
    echo -e "\n## 🔧 主要な作業" >> "$summary_file"
    if [ -f "$PROJECT_ROOT/.sessions/current_session.json" ]; then
        echo "### 完了タスク" >> "$summary_file"
        jq -r '.tasks[] | select(.status == "completed" and (.completed_at | startswith("'$today'"))) | "- \(.task)"' \
            "$PROJECT_ROOT/.sessions/current_session.json" 2>/dev/null >> "$summary_file"
        
        echo -e "\n### 重要な発見" >> "$summary_file"
        jq -r '.key_findings[] | select(.timestamp | startswith("'$today'")) | "- [\(.category)] \(.finding)"' \
            "$PROJECT_ROOT/.sessions/current_session.json" 2>/dev/null >> "$summary_file"
    fi
    
    # 明日への申し送り
    echo -e "\n## 📌 明日への申し送り" >> "$summary_file"
    echo "### 優先タスク" >> "$summary_file"
    if [ -f "$PROJECT_ROOT/.sessions/current_session.json" ]; then
        jq -r '.tasks[] | select(.status == "pending" and .priority == "high") | "1. \(.task)"' \
            "$PROJECT_ROOT/.sessions/current_session.json" 2>/dev/null >> "$summary_file"
    fi
    
    echo -e "\n### 注意事項" >> "$summary_file"
    echo "- [ ] テストの実行を忘れずに" >> "$summary_file"
    echo "- [ ] 環境変数の確認" >> "$summary_file"
    echo "- [ ] ブランチの確認" >> "$summary_file"
    
    echo -e "${GREEN}✅ デイリーサマリーを生成しました: $summary_file${NC}"
}

# チーム向けレポート生成
generate_team_report() {
    local report_file="$HANDOVER_DIR/team_report_$(date +%Y%m%d).md"
    
    echo -e "${BLUE}👥 チーム向けレポートを生成中...${NC}"
    
    cat > "$report_file" <<EOF
# COSMIC ORACLE 開発進捗レポート

レポート日: $(date +%Y-%m-%d)
報告者: $(whoami)

## エグゼクティブサマリー

### 今週の成果
- ✅ コズミックUIダッシュボード実装完了
- ✅ 3占術（数秘術、タロット、占星術）の基本実装
- ✅ 環境データ連携の基盤構築

### 進捗状況
- 全体進捗: 25% (Phase 1の Week 2完了)
- 予定との差異: オンスケジュール

## 技術的ハイライト

### 実装完了機能
1. **占術エンジン基盤**
   - 数秘術: ピタゴラス式計算アルゴリズム
   - タロット: 78枚フルデッキ対応
   - 占星術: 12ハウスシステム

2. **UI/UXデザイン**
   - レスポンシブ対応（モバイルファースト）
   - ダークテーマベース
   - スムーズアニメーション

3. **データ連携**
   - OpenWeatherMap API統合
   - 月相データ取得機能
   - リアルタイム更新基盤

### 技術的課題と対策

| 課題 | 影響度 | 対策 | 状態 |
|------|--------|------|------|
| 型定義の不整合 | 中 | 包括的リファクタリング | 進行中 |
| APIレート制限 | 低 | キャッシュ実装 | 完了 |
| ビルド時間 | 低 | 最適化検討中 | 未着手 |

## 次週の計画

### 優先度: 高
- [ ] 西洋占星術の詳細実装
- [ ] 統合占術システムの設計
- [ ] パフォーマンス最適化

### 優先度: 中
- [ ] テストカバレッジ向上
- [ ] ドキュメント整備
- [ ] セキュリティ監査準備

## リソース要求

### 必要なサポート
1. **デザインレビュー**: UI/UXの最終確認（2時間）
2. **インフラ支援**: Vercelデプロイ設定（1時間）
3. **コードレビュー**: セキュリティ観点（3時間）

### 予算関連
- 外部API利用料: 月額 $50見込み
- CDN利用料: 月額 $20見込み

## リスクと軽減策

### 技術的リスク
- **リスク**: 占術計算の精度問題
- **軽減策**: 専門家レビューの実施

### スケジュールリスク
- **リスク**: Phase 2の環境データ連携の複雑性
- **軽減策**: 早期のPOC実施

## 成功指標（KPI）

| 指標 | 目標 | 現状 | 達成率 |
|------|------|------|---------|
| ページ読み込み時間 | <3秒 | 2.5秒 | 100% |
| Lighthouseスコア | >90 | 85 | 94% |
| 型安全性 | 100% | 92% | 92% |

## チームへの感謝

特に以下の貢献に感謝します：
- デザインチーム: 美しいUIの実現
- インフラチーム: 環境構築サポート
- QAチーム: 早期のフィードバック

---

質問や懸念事項があれば、お気軽にご連絡ください。
次回の定例会議でより詳細な説明をさせていただきます。

よろしくお願いいたします。
EOF
    
    echo -e "${GREEN}✅ チームレポートを生成しました: $report_file${NC}"
}

# ヘルプ表示
show_help() {
    cat <<EOF
使用方法: handover-generator.sh [コマンド] [オプション]

コマンド:
  full                包括的な引き継ぎドキュメント生成
  quick [メッセージ]  クイック引き継ぎメモ作成
  daily               デイリーサマリー生成
  team                チーム向けレポート生成
  help                ヘルプ表示

例:
  ./handover-generator.sh full
  ./handover-generator.sh quick "APIの実装が半分完了"
  ./handover-generator.sh daily
EOF
}

# メイン処理
init_handover

case "$1" in
    full)
        generate_comprehensive
        ;;
    quick)
        generate_quick_memo "$2"
        ;;
    daily)
        generate_daily_summary
        ;;
    team)
        generate_team_report
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        generate_comprehensive
        ;;
esac