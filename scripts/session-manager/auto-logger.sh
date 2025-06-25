#!/bin/bash

# 自動ログ収集スクリプト
# コマンド実行を自動的に記録し、セッション記録システムと連携

SCRIPT_DIR="$(dirname "$0")"
SESSION_RECORDER="$SCRIPT_DIR/session-recorder.sh"
LOG_FILE="$HOME/.cosmic-oracle-dev.log"
HISTORY_FILE="$HOME/.cosmic-oracle-history"

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 初期設定
setup_auto_logging() {
    # bashrcへの統合
    local bashrc_addition='
# COSMIC ORACLE 開発ログ自動収集
export COSMIC_ORACLE_LOG=true
export PROMPT_COMMAND="log_command_cosmic"

log_command_cosmic() {
    local exit_code=$?
    local last_command=$(history 1 | sed "s/^[ ]*[0-9]*[ ]*//")
    
    if [ ! -z "$last_command" ] && [ "$COSMIC_ORACLE_LOG" = "true" ]; then
        echo "$(date -Iseconds)|$exit_code|$PWD|$last_command" >> ~/.cosmic-oracle-history
    fi
    
    # エラー時は自動記録
    if [ $exit_code -ne 0 ] && [ "$COSMIC_ORACLE_LOG" = "true" ]; then
        ~/Develop/Zeami-1\ ZAK/projects/uranai-01/scripts/session-manager/auto-logger.sh record-error "$last_command" "$exit_code"
    fi
}
'
    
    # .bashrcに追加（重複チェック付き）
    if ! grep -q "COSMIC_ORACLE_LOG" ~/.bashrc 2>/dev/null; then
        echo "$bashrc_addition" >> ~/.bashrc
        echo -e "${GREEN}✅ 自動ログ収集を.bashrcに追加しました${NC}"
    else
        echo -e "${YELLOW}⚠️  自動ログ収集は既に設定されています${NC}"
    fi
    
    # 即座に有効化
    export COSMIC_ORACLE_LOG=true
    export PROMPT_COMMAND="log_command_cosmic"
}

# ログ収集の有効化/無効化
toggle_logging() {
    if [ "$1" = "on" ]; then
        export COSMIC_ORACLE_LOG=true
        echo -e "${GREEN}✅ 自動ログ収集を有効化しました${NC}"
    elif [ "$1" = "off" ]; then
        export COSMIC_ORACLE_LOG=false
        echo -e "${YELLOW}⚠️  自動ログ収集を無効化しました${NC}"
    else
        if [ "$COSMIC_ORACLE_LOG" = "true" ]; then
            export COSMIC_ORACLE_LOG=false
            echo -e "${YELLOW}⚠️  自動ログ収集を無効化しました${NC}"
        else
            export COSMIC_ORACLE_LOG=true
            echo -e "${GREEN}✅ 自動ログ収集を有効化しました${NC}"
        fi
    fi
}

# エラー記録
record_error() {
    local command="$1"
    local exit_code="$2"
    local timestamp=$(date -Iseconds)
    
    # エラーログファイルに追記
    cat >> "$LOG_FILE" <<EOF
---
timestamp: $timestamp
command: $command
exit_code: $exit_code
pwd: $PWD
context: $(git status --short 2>/dev/null | head -5)
---
EOF
    
    # 重要なエラーパターンを検出
    if [[ "$command" =~ "npm" ]] && [ $exit_code -ne 0 ]; then
        "$SESSION_RECORDER" finding "npmエラー: $command (exit: $exit_code)" "error"
    elif [[ "$command" =~ "git" ]] && [ $exit_code -ne 0 ]; then
        "$SESSION_RECORDER" finding "gitエラー: $command (exit: $exit_code)" "error"
    fi
}

# 履歴分析
analyze_history() {
    local hours="${1:-24}"
    local since=$(date -d "$hours hours ago" -Iseconds 2>/dev/null || date -v-${hours}H -Iseconds)
    
    echo -e "${BLUE}=== 過去${hours}時間のコマンド履歴分析 ===${NC}"
    
    # 最も使用されたコマンド
    echo -e "\n${PURPLE}頻出コマンド TOP10:${NC}"
    awk -F'|' -v since="$since" '$1 >= since {print $4}' "$HISTORY_FILE" 2>/dev/null | \
        awk '{print $1}' | sort | uniq -c | sort -rn | head -10
    
    # エラー頻度
    echo -e "\n${PURPLE}エラー発生状況:${NC}"
    local total_commands=$(awk -F'|' -v since="$since" '$1 >= since' "$HISTORY_FILE" 2>/dev/null | wc -l)
    local error_commands=$(awk -F'|' -v since="$since" '$1 >= since && $2 != "0"' "$HISTORY_FILE" 2>/dev/null | wc -l)
    echo "総コマンド数: $total_commands"
    echo "エラー数: $error_commands"
    if [ $total_commands -gt 0 ]; then
        echo "エラー率: $(( error_commands * 100 / total_commands ))%"
    fi
    
    # 作業ディレクトリ
    echo -e "\n${PURPLE}作業ディレクトリ:${NC}"
    awk -F'|' -v since="$since" '$1 >= since {print $3}' "$HISTORY_FILE" 2>/dev/null | \
        sort | uniq -c | sort -rn | head -5
}

# 重要コマンド抽出
extract_important_commands() {
    local output_file="${1:-important_commands.md}"
    
    echo "# 重要なコマンド履歴" > "$output_file"
    echo "生成日時: $(date)" >> "$output_file"
    echo "" >> "$output_file"
    
    # git操作
    echo "## Git操作" >> "$output_file"
    grep -E "git (add|commit|push|pull|merge)" "$HISTORY_FILE" 2>/dev/null | \
        tail -20 | awk -F'|' '{print "- `" $4 "` (" $1 ")"}' >> "$output_file"
    
    # npm/yarn操作
    echo -e "\n## パッケージ管理" >> "$output_file"
    grep -E "(npm|yarn) (install|add|remove)" "$HISTORY_FILE" 2>/dev/null | \
        tail -20 | awk -F'|' '{print "- `" $4 "` (" $1 ")"}' >> "$output_file"
    
    # ビルド・テスト
    echo -e "\n## ビルド・テスト" >> "$output_file"
    grep -E "(npm run|yarn) (build|test|lint)" "$HISTORY_FILE" 2>/dev/null | \
        tail -20 | awk -F'|' '{print "- `" $4 "` (" $1 ")"}' >> "$output_file"
    
    echo -e "${GREEN}✅ 重要コマンドを抽出しました: $output_file${NC}"
}

# クリーンアップ
cleanup_logs() {
    local days="${1:-30}"
    local cutoff_date=$(date -d "$days days ago" -Iseconds 2>/dev/null || date -v-${days}d -Iseconds)
    
    # 古いログをアーカイブ
    local archive_file="$HOME/.cosmic-oracle-archive-$(date +%Y%m%d).tar.gz"
    
    # 履歴ファイルのバックアップと圧縮
    awk -F'|' -v cutoff="$cutoff_date" '$1 < cutoff' "$HISTORY_FILE" > "$HISTORY_FILE.archive"
    awk -F'|' -v cutoff="$cutoff_date" '$1 >= cutoff' "$HISTORY_FILE" > "$HISTORY_FILE.tmp"
    
    if [ -s "$HISTORY_FILE.archive" ]; then
        tar -czf "$archive_file" "$HISTORY_FILE.archive" "$LOG_FILE" 2>/dev/null
        mv "$HISTORY_FILE.tmp" "$HISTORY_FILE"
        rm "$HISTORY_FILE.archive"
        echo -e "${GREEN}✅ ${days}日以前のログをアーカイブしました: $archive_file${NC}"
    else
        echo -e "${YELLOW}アーカイブするログがありません${NC}"
    fi
}

# ヘルプ表示
show_help() {
    cat <<EOF
使用方法: auto-logger.sh [コマンド] [オプション]

コマンド:
  setup               自動ログ収集の初期設定
  toggle [on|off]     ログ収集の有効/無効切り替え
  analyze [時間]      履歴分析（デフォルト: 24時間）
  extract [ファイル]  重要コマンド抽出
  cleanup [日数]      古いログのクリーンアップ（デフォルト: 30日）
  record-error        エラー記録（内部使用）
  help                ヘルプ表示

例:
  ./auto-logger.sh setup
  ./auto-logger.sh analyze 48
  ./auto-logger.sh extract my_commands.md
EOF
}

# メイン処理
case "$1" in
    setup)
        setup_auto_logging
        ;;
    toggle)
        toggle_logging "$2"
        ;;
    analyze)
        analyze_history "$2"
        ;;
    extract)
        extract_important_commands "$2"
        ;;
    cleanup)
        cleanup_logs "$2"
        ;;
    record-error)
        record_error "$2" "$3"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        ;;
esac