#!/bin/bash

# セッション記録システム - メインスクリプト
# 開発作業の文脈を保持し、継続性を高めるツール

SESSION_DIR="$(dirname "$0")/../../.sessions"
CURRENT_SESSION_FILE="$SESSION_DIR/current_session.json"
LOGS_DIR="$SESSION_DIR/logs"
SUMMARIES_DIR="$SESSION_DIR/summaries"

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# 初期化
init_session() {
    mkdir -p "$SESSION_DIR" "$LOGS_DIR" "$SUMMARIES_DIR"
    
    if [ ! -f "$CURRENT_SESSION_FILE" ]; then
        create_new_session
    fi
}

# 新規セッション作成
create_new_session() {
    local session_id=$(date +%Y%m%d_%H%M%S)
    local session_name="${1:-開発セッション}"
    
    cat > "$CURRENT_SESSION_FILE" <<EOF
{
    "id": "$session_id",
    "name": "$session_name",
    "started_at": "$(date -Iseconds)",
    "status": "active",
    "commands_count": 0,
    "errors_count": 0,
    "context": {
        "branch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
        "last_commit": "$(git log -1 --oneline 2>/dev/null || echo 'no commits')",
        "pwd": "$(pwd)"
    },
    "tasks": [],
    "key_findings": []
}
EOF
    
    echo -e "${GREEN}✅ 新規セッション開始: $session_name ($session_id)${NC}"
}

# セッション情報取得
get_session_info() {
    if [ -f "$CURRENT_SESSION_FILE" ]; then
        cat "$CURRENT_SESSION_FILE"
    else
        echo "{}"
    fi
}

# コマンド記録
record_command() {
    local command="$1"
    local exit_code="$2"
    local output="$3"
    local session_id=$(jq -r '.id' "$CURRENT_SESSION_FILE")
    local log_file="$LOGS_DIR/${session_id}_commands.log"
    
    # コマンドログ追記
    cat >> "$log_file" <<EOF
---
timestamp: $(date -Iseconds)
command: $command
exit_code: $exit_code
output: |
$(echo "$output" | head -100)
---
EOF
    
    # セッション情報更新
    local commands_count=$(jq '.commands_count' "$CURRENT_SESSION_FILE")
    local errors_count=$(jq '.errors_count' "$CURRENT_SESSION_FILE")
    
    if [ "$exit_code" -ne 0 ]; then
        errors_count=$((errors_count + 1))
    fi
    
    jq ".commands_count = $((commands_count + 1)) | .errors_count = $errors_count" \
        "$CURRENT_SESSION_FILE" > "$CURRENT_SESSION_FILE.tmp" && \
        mv "$CURRENT_SESSION_FILE.tmp" "$CURRENT_SESSION_FILE"
}

# タスク追加
add_task() {
    local task="$1"
    local priority="${2:-medium}"
    
    jq ".tasks += [{\"task\": \"$task\", \"priority\": \"$priority\", \"added_at\": \"$(date -Iseconds)\", \"status\": \"pending\"}]" \
        "$CURRENT_SESSION_FILE" > "$CURRENT_SESSION_FILE.tmp" && \
        mv "$CURRENT_SESSION_FILE.tmp" "$CURRENT_SESSION_FILE"
    
    echo -e "${GREEN}✅ タスク追加: $task${NC}"
}

# タスク完了
complete_task() {
    local task_index="$1"
    
    jq ".tasks[$task_index].status = \"completed\" | .tasks[$task_index].completed_at = \"$(date -Iseconds)\"" \
        "$CURRENT_SESSION_FILE" > "$CURRENT_SESSION_FILE.tmp" && \
        mv "$CURRENT_SESSION_FILE.tmp" "$CURRENT_SESSION_FILE"
    
    echo -e "${GREEN}✅ タスク完了${NC}"
}

# 重要な発見記録
add_finding() {
    local finding="$1"
    local category="${2:-general}"
    
    jq ".key_findings += [{\"finding\": \"$finding\", \"category\": \"$category\", \"timestamp\": \"$(date -Iseconds)\"}]" \
        "$CURRENT_SESSION_FILE" > "$CURRENT_SESSION_FILE.tmp" && \
        mv "$CURRENT_SESSION_FILE.tmp" "$CURRENT_SESSION_FILE"
    
    echo -e "${YELLOW}💡 重要な発見を記録しました${NC}"
}

# セッション状態表示
show_status() {
    echo -e "${BLUE}=== 現在のセッション状態 ===${NC}"
    
    local session_info=$(get_session_info)
    
    echo -e "${PURPLE}セッション:${NC} $(echo "$session_info" | jq -r '.name')"
    echo -e "${PURPLE}開始時刻:${NC} $(echo "$session_info" | jq -r '.started_at')"
    echo -e "${PURPLE}実行コマンド数:${NC} $(echo "$session_info" | jq -r '.commands_count')"
    echo -e "${PURPLE}エラー数:${NC} $(echo "$session_info" | jq -r '.errors_count')"
    
    echo -e "\n${BLUE}=== 未完了タスク ===${NC}"
    echo "$session_info" | jq -r '.tasks[] | select(.status == "pending") | "- [\(.priority)] \(.task)"'
    
    echo -e "\n${BLUE}=== 最近の重要な発見 ===${NC}"
    echo "$session_info" | jq -r '.key_findings[-3:] | reverse | .[] | "- [\(.category)] \(.finding)"'
}

# セッションサマリー生成
generate_summary() {
    local session_id=$(jq -r '.id' "$CURRENT_SESSION_FILE")
    local summary_file="$SUMMARIES_DIR/${session_id}_summary.md"
    local session_info=$(get_session_info)
    
    cat > "$summary_file" <<EOF
# セッションサマリー: $(echo "$session_info" | jq -r '.name')

## 基本情報
- **セッションID**: $session_id
- **開始時刻**: $(echo "$session_info" | jq -r '.started_at')
- **ブランチ**: $(echo "$session_info" | jq -r '.context.branch')
- **実行コマンド数**: $(echo "$session_info" | jq -r '.commands_count')
- **エラー数**: $(echo "$session_info" | jq -r '.errors_count')

## 完了タスク
$(echo "$session_info" | jq -r '.tasks[] | select(.status == "completed") | "- [x] \(.task)"')

## 未完了タスク
$(echo "$session_info" | jq -r '.tasks[] | select(.status == "pending") | "- [ ] [\(.priority)] \(.task)"')

## 重要な発見
$(echo "$session_info" | jq -r '.key_findings[] | "### \(.category)\n- \(.finding)\n"')

## エラーと解決策
$(grep -A5 "exit_code: [^0]" "$LOGS_DIR/${session_id}_commands.log" 2>/dev/null | head -50 || echo "エラーなし")

## 次回への引き継ぎ
1. 現在の作業ディレクトリ: $(echo "$session_info" | jq -r '.context.pwd')
2. 最後のコミット: $(echo "$session_info" | jq -r '.context.last_commit')
3. 優先度の高い未完了タスクから着手してください

---
*このサマリーは自動生成されました: $(date)*
EOF
    
    echo -e "${GREEN}✅ サマリーを生成しました: $summary_file${NC}"
}

# セッション終了
end_session() {
    generate_summary
    
    local session_id=$(jq -r '.id' "$CURRENT_SESSION_FILE")
    local archive_file="$SESSION_DIR/archive/${session_id}.json"
    
    mkdir -p "$SESSION_DIR/archive"
    jq '.status = "completed" | .ended_at = "'$(date -Iseconds)'"' \
        "$CURRENT_SESSION_FILE" > "$archive_file"
    
    rm -f "$CURRENT_SESSION_FILE"
    
    echo -e "${GREEN}✅ セッションを終了しました${NC}"
}

# ヘルプ表示
show_help() {
    cat <<EOF
使用方法: session-recorder.sh [コマンド] [オプション]

コマンド:
  new [名前]          新規セッション開始
  status              現在の状態表示
  task add <内容>     タスク追加
  task done <番号>    タスク完了
  finding <内容>      重要な発見を記録
  summary             サマリー生成
  end                 セッション終了
  help                ヘルプ表示

例:
  ./session-recorder.sh new "API実装作業"
  ./session-recorder.sh task add "認証機能の実装"
  ./session-recorder.sh finding "APIレート制限は1000/時"
EOF
}

# メイン処理
init_session

case "$1" in
    new)
        create_new_session "$2"
        ;;
    status)
        show_status
        ;;
    task)
        case "$2" in
            add)
                add_task "$3" "$4"
                ;;
            done)
                complete_task "$3"
                ;;
            *)
                echo "使用方法: task [add|done]"
                ;;
        esac
        ;;
    finding)
        add_finding "$2" "$3"
        ;;
    summary)
        generate_summary
        ;;
    end)
        end_session
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_status
        ;;
esac