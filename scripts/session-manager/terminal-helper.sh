#!/bin/bash

# ターミナルヘルパー - コマンド実行結果の整理と要約
# 大量の出力を見やすく整理し、重要な情報を抽出

SCRIPT_DIR="$(dirname "$0")"
OUTPUT_DIR="$SCRIPT_DIR/../../.terminal-outputs"
SUMMARY_DIR="$OUTPUT_DIR/summaries"

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# 初期化
init_terminal_helper() {
    mkdir -p "$OUTPUT_DIR" "$SUMMARY_DIR"
}

# コマンド実行と結果整理
run_and_summarize() {
    local command="$@"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local output_file="$OUTPUT_DIR/output_$timestamp.txt"
    local summary_file="$SUMMARY_DIR/summary_$timestamp.md"
    
    echo -e "${BLUE}🚀 実行中: $command${NC}"
    
    # コマンド実行と出力保存
    {
        echo "Command: $command"
        echo "Timestamp: $(date -Iseconds)"
        echo "PWD: $(pwd)"
        echo "---"
    } > "$output_file"
    
    # 実行と結果取得
    local start_time=$(date +%s)
    $command 2>&1 | tee -a "$output_file"
    local exit_code=${PIPESTATUS[0]}
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    # 実行結果を追記
    {
        echo "---"
        echo "Exit Code: $exit_code"
        echo "Duration: ${duration}s"
    } >> "$output_file"
    
    # サマリー生成
    generate_command_summary "$command" "$output_file" "$summary_file" "$exit_code" "$duration"
    
    # 結果表示
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ 成功 (${duration}秒)${NC}"
    else
        echo -e "${RED}❌ エラー (終了コード: $exit_code)${NC}"
    fi
    
    echo -e "${CYAN}📄 詳細: $output_file${NC}"
    echo -e "${CYAN}📋 要約: $summary_file${NC}"
    
    # セッション記録との連携
    if [ -f "$SCRIPT_DIR/session-recorder.sh" ]; then
        "$SCRIPT_DIR/session-recorder.sh" record_command "$command" "$exit_code" "$(tail -100 $output_file)"
    fi
    
    return $exit_code
}

# コマンドサマリー生成
generate_command_summary() {
    local command="$1"
    local output_file="$2"
    local summary_file="$3"
    local exit_code="$4"
    local duration="$5"
    
    cat > "$summary_file" <<EOF
# コマンド実行サマリー

## 基本情報
- **コマンド**: \`$command\`
- **実行時刻**: $(date)
- **所要時間**: ${duration}秒
- **終了コード**: $exit_code
- **結果**: $([ $exit_code -eq 0 ] && echo "✅ 成功" || echo "❌ 失敗")

## 出力要約
EOF
    
    # コマンドタイプ別の要約
    case "$command" in
        *"npm install"*|*"yarn install"*)
            summarize_package_install "$output_file" >> "$summary_file"
            ;;
        *"npm run build"*|*"yarn build"*)
            summarize_build "$output_file" >> "$summary_file"
            ;;
        *"npm test"*|*"yarn test"*)
            summarize_test "$output_file" >> "$summary_file"
            ;;
        *"git"*)
            summarize_git "$output_file" >> "$summary_file"
            ;;
        *)
            summarize_generic "$output_file" >> "$summary_file"
            ;;
    esac
    
    # エラー情報
    if [ $exit_code -ne 0 ]; then
        echo -e "\n## エラー詳細" >> "$summary_file"
        grep -i -E "(error|fail|exception|warning)" "$output_file" | head -20 >> "$summary_file"
    fi
    
    # 重要な情報の抽出
    echo -e "\n## 重要な情報" >> "$summary_file"
    extract_important_info "$output_file" >> "$summary_file"
}

# パッケージインストールの要約
summarize_package_install() {
    local output_file="$1"
    
    echo "### インストール結果"
    
    # 追加されたパッケージ
    local added=$(grep -c "added.*packages" "$output_file" 2>/dev/null || echo 0)
    [ $added -gt 0 ] && echo "- 追加: $(grep "added.*packages" "$output_file" | head -1)"
    
    # 更新されたパッケージ
    local updated=$(grep -c "updated.*packages" "$output_file" 2>/dev/null || echo 0)
    [ $updated -gt 0 ] && echo "- 更新: $(grep "updated.*packages" "$output_file" | head -1)"
    
    # 脆弱性
    local vulnerabilities=$(grep -E "found.*vulnerabilit" "$output_file" 2>/dev/null | head -1)
    [ ! -z "$vulnerabilities" ] && echo "- ⚠️  脆弱性: $vulnerabilities"
    
    # 警告
    local warnings=$(grep -c "WARN" "$output_file" 2>/dev/null || echo 0)
    [ $warnings -gt 0 ] && echo "- ⚠️  警告: ${warnings}件"
}

# ビルドの要約
summarize_build() {
    local output_file="$1"
    
    echo "### ビルド結果"
    
    # ビルド時間
    local build_time=$(grep -E "Done in|Compiled successfully" "$output_file" 2>/dev/null | tail -1)
    [ ! -z "$build_time" ] && echo "- 完了時間: $build_time"
    
    # バンドルサイズ
    grep -E "First Load JS|Page.*Size" "$output_file" 2>/dev/null | head -10 | sed 's/^/- /'
    
    # 警告数
    local warnings=$(grep -c -i "warning" "$output_file" 2>/dev/null || echo 0)
    [ $warnings -gt 0 ] && echo "- ⚠️  警告: ${warnings}件"
}

# テストの要約
summarize_test() {
    local output_file="$1"
    
    echo "### テスト結果"
    
    # テストサマリー
    grep -E "(Test Suites:|Tests:|Snapshots:|Time:)" "$output_file" 2>/dev/null | sed 's/^/- /'
    
    # 失敗したテスト
    local failed=$(grep -A5 "FAIL" "$output_file" 2>/dev/null | head -20)
    if [ ! -z "$failed" ]; then
        echo -e "\n#### 失敗したテスト"
        echo "$failed"
    fi
}

# Git操作の要約
summarize_git() {
    local output_file="$1"
    
    echo "### Git操作結果"
    
    # ブランチ情報
    grep -E "(branch|Switched to)" "$output_file" 2>/dev/null | head -5 | sed 's/^/- /'
    
    # コミット情報
    grep -E "commit [a-f0-9]{7}" "$output_file" 2>/dev/null | head -5 | sed 's/^/- /'
    
    # ファイル変更
    grep -E "[0-9]+ file.*changed" "$output_file" 2>/dev/null | sed 's/^/- /'
}

# 汎用的な要約
summarize_generic() {
    local output_file="$1"
    
    echo "### 実行結果"
    
    # 最初と最後の数行
    echo "#### 出力の開始部分"
    head -10 "$output_file" | grep -v "^Command:\|^Timestamp:\|^PWD:\|^---"
    
    echo -e "\n#### 出力の終了部分"
    tail -10 "$output_file" | grep -v "^---\|^Exit Code:\|^Duration:"
}

# 重要情報の抽出
extract_important_info() {
    local output_file="$1"
    
    # URL
    local urls=$(grep -Eo "(http|https)://[a-zA-Z0-9./?=_%:-]*" "$output_file" 2>/dev/null | sort -u | head -5)
    if [ ! -z "$urls" ]; then
        echo "### 検出されたURL"
        echo "$urls" | sed 's/^/- /'
    fi
    
    # ファイルパス
    local files=$(grep -Eo "(/[a-zA-Z0-9._-]+)+\.(ts|tsx|js|jsx|json|md)" "$output_file" 2>/dev/null | sort -u | head -10)
    if [ ! -z "$files" ]; then
        echo -e "\n### 言及されたファイル"
        echo "$files" | sed 's/^/- /'
    fi
    
    # ポート番号
    local ports=$(grep -Eo ":[0-9]{4,5}" "$output_file" 2>/dev/null | sort -u)
    if [ ! -z "$ports" ]; then
        echo -e "\n### ポート番号"
        echo "$ports" | sed 's/^/- /'
    fi
}

# インタラクティブビューアー
view_outputs() {
    echo -e "${BLUE}=== 保存された出力一覧 ===${NC}"
    
    # 最新の出力ファイルをリスト
    local files=($(ls -1t "$OUTPUT_DIR"/output_*.txt 2>/dev/null | head -20))
    
    if [ ${#files[@]} -eq 0 ]; then
        echo -e "${YELLOW}保存された出力がありません${NC}"
        return
    fi
    
    # ファイル選択メニュー
    echo "番号を選択してください (qで終了):"
    local i=1
    for file in "${files[@]}"; do
        local basename=$(basename "$file")
        local timestamp=${basename#output_}
        timestamp=${timestamp%.txt}
        local command=$(grep "^Command:" "$file" | sed 's/Command: //')
        echo "$i) $timestamp - ${command:0:50}..."
        ((i++))
    done
    
    while true; do
        read -p "> " choice
        
        if [ "$choice" = "q" ]; then
            break
        elif [[ "$choice" =~ ^[0-9]+$ ]] && [ $choice -ge 1 ] && [ $choice -le ${#files[@]} ]; then
            local selected_file="${files[$((choice-1))]}"
            view_single_output "$selected_file"
        else
            echo "無効な選択です"
        fi
    done
}

# 単一出力の表示
view_single_output() {
    local output_file="$1"
    local summary_file="${output_file/output_/summary_}"
    summary_file="${summary_file/.txt/.md}"
    summary_file="${summary_file/terminal-outputs/terminal-outputs\/summaries}"
    
    echo -e "\n${CYAN}=== 出力内容 ===${NC}"
    
    # サマリーがあれば先に表示
    if [ -f "$summary_file" ]; then
        echo -e "${PURPLE}📋 サマリー:${NC}"
        cat "$summary_file"
        echo -e "\n${PURPLE}📄 詳細出力:${NC}"
    fi
    
    # lessで表示（ページング）
    less -R "$output_file"
}

# クリーンアップ
cleanup_old_outputs() {
    local days="${1:-7}"
    
    echo -e "${YELLOW}🧹 ${days}日以前の出力をクリーンアップします${NC}"
    
    # 古いファイルを削除
    find "$OUTPUT_DIR" -name "output_*.txt" -mtime +$days -delete 2>/dev/null
    find "$SUMMARY_DIR" -name "summary_*.md" -mtime +$days -delete 2>/dev/null
    
    echo -e "${GREEN}✅ クリーンアップ完了${NC}"
}

# ヘルプ表示
show_help() {
    cat <<EOF
使用方法: terminal-helper.sh [コマンド] [オプション]

コマンド:
  run <command>       コマンドを実行し、結果を整理・要約
  view                保存された出力を閲覧
  cleanup [日数]      古い出力をクリーンアップ（デフォルト: 7日）
  help                ヘルプ表示

例:
  ./terminal-helper.sh run npm install
  ./terminal-helper.sh run npm run build
  ./terminal-helper.sh view
  ./terminal-helper.sh cleanup 30

特徴:
  - コマンド出力を自動保存
  - 重要な情報を自動抽出
  - エラー情報をハイライト
  - セッション記録との連携
EOF
}

# メイン処理
init_terminal_helper

case "$1" in
    run)
        shift
        run_and_summarize "$@"
        ;;
    view)
        view_outputs
        ;;
    cleanup)
        cleanup_old_outputs "$2"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        ;;
esac