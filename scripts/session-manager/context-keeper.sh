#!/bin/bash

# コンテキストキーパー - 作業文脈の保持と復元
# 中断・再開時の文脈喪失を防ぐツール

SCRIPT_DIR="$(dirname "$0")"
CONTEXT_DIR="$SCRIPT_DIR/../../.context"
CURRENT_CONTEXT="$CONTEXT_DIR/current.json"
SNAPSHOTS_DIR="$CONTEXT_DIR/snapshots"

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# 初期化
init_context() {
    mkdir -p "$CONTEXT_DIR" "$SNAPSHOTS_DIR"
}

# コンテキスト収集
collect_context() {
    local context_name="${1:-自動保存}"
    
    echo -e "${BLUE}📸 コンテキストを収集中...${NC}"
    
    # Git状態
    local git_status=$(git status --short 2>/dev/null | head -20)
    local git_branch=$(git branch --show-current 2>/dev/null || echo "unknown")
    local git_log=$(git log --oneline -10 2>/dev/null)
    
    # 開いているファイル（最近編集されたファイル）
    local recent_files=$(find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \
        -mtime -1 2>/dev/null | grep -v node_modules | head -20)
    
    # 実行中のプロセス
    local running_processes=$(ps aux | grep -E "(npm|node|next)" | grep -v grep | head -10)
    
    # 環境変数（重要なもののみ）
    local env_vars=$(env | grep -E "(NEXT_|SUPABASE_|NODE_)" | grep -v "KEY" | sort)
    
    # 最新のエラー
    local recent_errors=""
    if [ -f "$HOME/.cosmic-oracle-dev.log" ]; then
        recent_errors=$(tail -50 "$HOME/.cosmic-oracle-dev.log" 2>/dev/null)
    fi
    
    # 現在のTodoList（セッション記録から）
    local todos=""
    if [ -f "$SCRIPT_DIR/../../.sessions/current_session.json" ]; then
        todos=$(jq '.tasks[] | select(.status == "pending") | .task' "$SCRIPT_DIR/../../.sessions/current_session.json" 2>/dev/null)
    fi
    
    # コンテキストJSON作成
    cat > "$CURRENT_CONTEXT" <<EOF
{
    "name": "$context_name",
    "timestamp": "$(date -Iseconds)",
    "environment": {
        "pwd": "$(pwd)",
        "node_version": "$(node --version 2>/dev/null)",
        "npm_version": "$(npm --version 2>/dev/null)"
    },
    "git": {
        "branch": "$git_branch",
        "status": $(echo "$git_status" | jq -Rs .),
        "recent_commits": $(echo "$git_log" | jq -Rs .)
    },
    "files": {
        "recently_edited": $(echo "$recent_files" | jq -Rs 'split("\n") | map(select(length > 0))')
    },
    "processes": $(echo "$running_processes" | jq -Rs .),
    "env_vars": $(echo "$env_vars" | jq -Rs .),
    "recent_errors": $(echo "$recent_errors" | jq -Rs .),
    "pending_todos": $(echo "$todos" | jq -Rs 'split("\n") | map(select(length > 0))')
}
EOF
    
    # スナップショット保存
    local snapshot_file="$SNAPSHOTS_DIR/$(date +%Y%m%d_%H%M%S)_${context_name// /_}.json"
    cp "$CURRENT_CONTEXT" "$snapshot_file"
    
    echo -e "${GREEN}✅ コンテキストを保存しました${NC}"
}

# コンテキスト表示
show_context() {
    if [ ! -f "$CURRENT_CONTEXT" ]; then
        echo -e "${RED}❌ 保存されたコンテキストがありません${NC}"
        return 1
    fi
    
    local context=$(cat "$CURRENT_CONTEXT")
    
    echo -e "${BLUE}=== 現在のコンテキスト ===${NC}"
    echo -e "${PURPLE}保存時刻:${NC} $(echo "$context" | jq -r '.timestamp')"
    echo -e "${PURPLE}名前:${NC} $(echo "$context" | jq -r '.name')"
    
    echo -e "\n${CYAN}📁 作業環境${NC}"
    echo "ディレクトリ: $(echo "$context" | jq -r '.environment.pwd')"
    echo "Node: $(echo "$context" | jq -r '.environment.node_version')"
    
    echo -e "\n${CYAN}🌿 Git状態${NC}"
    echo "ブランチ: $(echo "$context" | jq -r '.git.branch')"
    echo "変更ファイル数: $(echo "$context" | jq -r '.git.status' | grep -c "^[MAD]" || echo 0)"
    
    echo -e "\n${CYAN}📝 最近編集したファイル${NC}"
    echo "$context" | jq -r '.files.recently_edited[]' | head -10
    
    echo -e "\n${CYAN}✅ 未完了タスク${NC}"
    echo "$context" | jq -r '.pending_todos[]'
}

# コンテキスト復元ガイド
restore_guide() {
    if [ ! -f "$CURRENT_CONTEXT" ]; then
        echo -e "${RED}❌ 復元するコンテキストがありません${NC}"
        return 1
    fi
    
    local context=$(cat "$CURRENT_CONTEXT")
    
    echo -e "${BLUE}=== コンテキスト復元ガイド ===${NC}"
    echo -e "${YELLOW}以下の手順で作業を再開してください:${NC}\n"
    
    # 1. 作業ディレクトリ
    local saved_pwd=$(echo "$context" | jq -r '.environment.pwd')
    if [ "$PWD" != "$saved_pwd" ]; then
        echo -e "${CYAN}1. 作業ディレクトリに移動:${NC}"
        echo "   cd \"$saved_pwd\""
        echo ""
    fi
    
    # 2. Gitブランチ
    local saved_branch=$(echo "$context" | jq -r '.git.branch')
    local current_branch=$(git branch --show-current 2>/dev/null)
    if [ "$current_branch" != "$saved_branch" ]; then
        echo -e "${CYAN}2. ブランチを切り替え:${NC}"
        echo "   git checkout $saved_branch"
        echo ""
    fi
    
    # 3. 開発サーバー
    echo -e "${CYAN}3. 開発サーバーを起動:${NC}"
    echo "   npm run dev"
    echo ""
    
    # 4. 最近のファイル
    echo -e "${CYAN}4. 作業していたファイル:${NC}"
    echo "$context" | jq -r '.files.recently_edited[]' | head -5 | while read file; do
        echo "   - $file"
    done
    echo ""
    
    # 5. 未完了タスク
    local todos=$(echo "$context" | jq -r '.pending_todos[]')
    if [ ! -z "$todos" ]; then
        echo -e "${CYAN}5. 未完了タスク:${NC}"
        echo "$todos" | while read task; do
            echo "   - $task"
        done
        echo ""
    fi
    
    # 6. 注意事項
    echo -e "${YELLOW}⚠️  注意事項:${NC}"
    echo "- package.jsonが変更されている場合は npm install を実行"
    echo "- 環境変数の設定を確認（.env.local）"
    echo "- Git statusで未コミットの変更を確認"
}

# 自動バックアップ
auto_backup() {
    # crontabに登録するための関数
    local cron_entry="*/30 * * * * $SCRIPT_DIR/context-keeper.sh collect '自動バックアップ' > /dev/null 2>&1"
    
    # 既存のcrontabを取得
    crontab -l 2>/dev/null > /tmp/current_cron
    
    # 重複チェック
    if grep -q "context-keeper.sh" /tmp/current_cron; then
        echo -e "${YELLOW}⚠️  自動バックアップは既に設定されています${NC}"
    else
        echo "$cron_entry" >> /tmp/current_cron
        crontab /tmp/current_cron
        echo -e "${GREEN}✅ 30分毎の自動バックアップを設定しました${NC}"
    fi
    
    rm -f /tmp/current_cron
}

# スナップショット一覧
list_snapshots() {
    echo -e "${BLUE}=== 保存されたスナップショット ===${NC}"
    
    ls -1t "$SNAPSHOTS_DIR"/*.json 2>/dev/null | head -20 | while read snapshot; do
        local name=$(basename "$snapshot" .json)
        local timestamp=$(jq -r '.timestamp' "$snapshot" 2>/dev/null)
        local context_name=$(jq -r '.name' "$snapshot" 2>/dev/null)
        echo -e "${PURPLE}$name${NC} - $context_name ($timestamp)"
    done
}

# スナップショット復元
restore_snapshot() {
    local snapshot_name="$1"
    
    if [ -z "$snapshot_name" ]; then
        echo -e "${RED}❌ スナップショット名を指定してください${NC}"
        list_snapshots
        return 1
    fi
    
    local snapshot_file="$SNAPSHOTS_DIR/${snapshot_name}.json"
    if [ ! -f "$snapshot_file" ]; then
        snapshot_file="$SNAPSHOTS_DIR/${snapshot_name}"
    fi
    
    if [ ! -f "$snapshot_file" ]; then
        echo -e "${RED}❌ スナップショットが見つかりません: $snapshot_name${NC}"
        return 1
    fi
    
    cp "$snapshot_file" "$CURRENT_CONTEXT"
    echo -e "${GREEN}✅ スナップショットを復元しました${NC}"
    restore_guide
}

# 差分表示
show_diff() {
    if [ ! -f "$CURRENT_CONTEXT" ]; then
        echo -e "${RED}❌ 現在のコンテキストがありません${NC}"
        return 1
    fi
    
    # 現在の状態を一時的に収集
    collect_context "一時比較用" > /dev/null 2>&1
    
    echo -e "${BLUE}=== 保存時からの変更 ===${NC}"
    
    # Git差分
    echo -e "\n${CYAN}Git状態の変化:${NC}"
    local saved_branch=$(jq -r '.git.branch' "$CURRENT_CONTEXT")
    local current_branch=$(git branch --show-current 2>/dev/null)
    if [ "$saved_branch" != "$current_branch" ]; then
        echo "ブランチ: $saved_branch → $current_branch"
    fi
    
    # ファイル変更
    echo -e "\n${CYAN}新規/変更ファイル:${NC}"
    git status --short | head -10
    
    # 新しいエラー
    if [ -f "$HOME/.cosmic-oracle-dev.log" ]; then
        local saved_time=$(jq -r '.timestamp' "$CURRENT_CONTEXT")
        echo -e "\n${CYAN}新しいエラー:${NC}"
        awk -v saved="$saved_time" '$0 ~ /^timestamp:/ && $2 > saved' "$HOME/.cosmic-oracle-dev.log" | head -5
    fi
}

# ヘルプ表示
show_help() {
    cat <<EOF
使用方法: context-keeper.sh [コマンド] [オプション]

コマンド:
  collect [名前]      現在のコンテキストを収集・保存
  show                保存されたコンテキストを表示
  restore             コンテキスト復元ガイドを表示
  diff                保存時からの差分を表示
  list                スナップショット一覧
  load <名前>         スナップショットを復元
  auto-backup         自動バックアップを設定
  help                ヘルプ表示

例:
  ./context-keeper.sh collect "API実装前"
  ./context-keeper.sh restore
  ./context-keeper.sh load 20240623_143000
EOF
}

# メイン処理
init_context

case "$1" in
    collect)
        collect_context "$2"
        ;;
    show)
        show_context
        ;;
    restore)
        restore_guide
        ;;
    diff)
        show_diff
        ;;
    list)
        list_snapshots
        ;;
    load)
        restore_snapshot "$2"
        ;;
    auto-backup)
        auto_backup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        ;;
esac