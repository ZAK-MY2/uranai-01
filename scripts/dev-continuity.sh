#!/bin/bash

# 開発継続性マスタースクリプト
# すべての継続性ツールへの統一インターフェース

SCRIPT_DIR="$(dirname "$0")"
SESSION_MGR="$SCRIPT_DIR/session-manager"

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# バナー表示
show_banner() {
    echo -e "${BLUE}"
    cat << 'EOF'
╔═══════════════════════════════════════════════════════╗
║     COSMIC ORACLE 開発継続性システム v1.0            ║
║     Development Continuity Management System          ║
╚═══════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# クイックスタート
quick_start() {
    echo -e "${GREEN}🚀 開発セッションを開始します...${NC}\n"
    
    # セッション開始
    "$SESSION_MGR/session-recorder.sh" new "開発セッション $(date +%Y%m%d_%H%M)"
    
    # コンテキスト保存
    "$SESSION_MGR/context-keeper.sh" collect "セッション開始"
    
    # 自動ログ有効化
    "$SESSION_MGR/auto-logger.sh" toggle on
    
    # 現在の状態表示
    "$SESSION_MGR/session-recorder.sh" status
    
    echo -e "\n${GREEN}✅ 準備完了！開発を始めてください。${NC}"
    echo -e "${CYAN}ヒント: 'dev-continuity.sh help' でコマンド一覧を確認${NC}"
}

# セッション終了
finish_session() {
    echo -e "${YELLOW}🏁 セッションを終了します...${NC}\n"
    
    # 最終コンテキスト保存
    "$SESSION_MGR/context-keeper.sh" collect "セッション終了"
    
    # サマリー生成
    "$SESSION_MGR/session-recorder.sh" summary
    
    # 引き継ぎドキュメント生成
    "$SESSION_MGR/handover-generator.sh" quick "セッション終了: $(date)"
    
    # セッション終了
    "$SESSION_MGR/session-recorder.sh" end
    
    echo -e "\n${GREEN}✅ お疲れさまでした！${NC}"
}

# 状態チェック
check_status() {
    echo -e "${BLUE}📊 現在の開発状態${NC}\n"
    
    # セッション状態
    "$SESSION_MGR/session-recorder.sh" status
    
    echo -e "\n${BLUE}📁 コンテキスト${NC}"
    "$SESSION_MGR/context-keeper.sh" show | head -20
    
    echo -e "\n${BLUE}📈 本日の活動${NC}"
    "$SESSION_MGR/auto-logger.sh" analyze 24 | head -20
}

# タスク管理
manage_tasks() {
    case "$1" in
        add)
            "$SESSION_MGR/session-recorder.sh" task add "$2" "$3"
            ;;
        done)
            "$SESSION_MGR/session-recorder.sh" task done "$2"
            ;;
        list)
            "$SESSION_MGR/session-recorder.sh" status | grep -A20 "未完了タスク"
            ;;
        *)
            echo "使用方法: dev-continuity.sh task [add|done|list]"
            ;;
    esac
}

# インタラクティブメニュー
interactive_menu() {
    while true; do
        echo -e "\n${BLUE}=== 開発継続性メニュー ===${NC}"
        echo "1) セッション管理"
        echo "2) コンテキスト管理"
        echo "3) タスク管理"
        echo "4) ログ・履歴"
        echo "5) 引き継ぎ・レポート"
        echo "6) ターミナルヘルパー"
        echo "q) 終了"
        
        read -p "> " choice
        
        case "$choice" in
            1)
                session_menu
                ;;
            2)
                context_menu
                ;;
            3)
                task_menu
                ;;
            4)
                log_menu
                ;;
            5)
                handover_menu
                ;;
            6)
                terminal_menu
                ;;
            q)
                break
                ;;
            *)
                echo "無効な選択です"
                ;;
        esac
    done
}

# セッション管理メニュー
session_menu() {
    echo -e "\n${CYAN}=== セッション管理 ===${NC}"
    echo "1) 新規セッション開始"
    echo "2) 現在の状態表示"
    echo "3) サマリー生成"
    echo "4) セッション終了"
    
    read -p "> " choice
    
    case "$choice" in
        1)
            read -p "セッション名: " name
            "$SESSION_MGR/session-recorder.sh" new "$name"
            ;;
        2)
            "$SESSION_MGR/session-recorder.sh" status
            ;;
        3)
            "$SESSION_MGR/session-recorder.sh" summary
            ;;
        4)
            "$SESSION_MGR/session-recorder.sh" end
            ;;
    esac
}

# コンテキスト管理メニュー
context_menu() {
    echo -e "\n${CYAN}=== コンテキスト管理 ===${NC}"
    echo "1) コンテキスト保存"
    echo "2) 現在のコンテキスト表示"
    echo "3) 復元ガイド表示"
    echo "4) スナップショット一覧"
    
    read -p "> " choice
    
    case "$choice" in
        1)
            read -p "コンテキスト名: " name
            "$SESSION_MGR/context-keeper.sh" collect "$name"
            ;;
        2)
            "$SESSION_MGR/context-keeper.sh" show
            ;;
        3)
            "$SESSION_MGR/context-keeper.sh" restore
            ;;
        4)
            "$SESSION_MGR/context-keeper.sh" list
            ;;
    esac
}

# 初期セットアップ
initial_setup() {
    echo -e "${BLUE}🔧 開発継続性システムの初期セットアップ${NC}\n"
    
    # 実行権限付与
    chmod +x "$SCRIPT_DIR"/*.sh
    chmod +x "$SESSION_MGR"/*.sh
    
    # 自動ログ設定
    "$SESSION_MGR/auto-logger.sh" setup
    
    # 自動バックアップ設定
    "$SESSION_MGR/context-keeper.sh" auto-backup
    
    echo -e "\n${GREEN}✅ セットアップ完了！${NC}"
    echo -e "${CYAN}使い方: ./scripts/dev-continuity.sh start${NC}"
}

# ヘルプ表示
show_help() {
    cat <<EOF
${BLUE}COSMIC ORACLE 開発継続性システム${NC}

${YELLOW}使用方法:${NC}
  dev-continuity.sh [コマンド] [オプション]

${YELLOW}基本コマンド:${NC}
  ${GREEN}start${NC}             開発セッションを開始
  ${GREEN}finish${NC}            セッションを終了（引き継ぎ作成）
  ${GREEN}status${NC}            現在の状態を確認
  ${GREEN}menu${NC}              インタラクティブメニュー

${YELLOW}タスク管理:${NC}
  ${GREEN}task add${NC} <内容>   タスクを追加
  ${GREEN}task done${NC} <番号>  タスクを完了
  ${GREEN}task list${NC}         タスク一覧表示

${YELLOW}コンテキスト管理:${NC}
  ${GREEN}save${NC} [名前]       現在のコンテキストを保存
  ${GREEN}restore${NC}           復元ガイドを表示
  ${GREEN}diff${NC}              保存時からの差分表示

${YELLOW}ログ・分析:${NC}
  ${GREEN}analyze${NC} [時間]    コマンド履歴分析
  ${GREEN}errors${NC}            最近のエラー表示
  ${GREEN}extract${NC}           重要コマンド抽出

${YELLOW}引き継ぎ:${NC}
  ${GREEN}handover${NC}          包括的引き継ぎ文書生成
  ${GREEN}daily${NC}             デイリーサマリー生成
  ${GREEN}report${NC}            チーム向けレポート生成

${YELLOW}その他:${NC}
  ${GREEN}setup${NC}             初期セットアップ
  ${GREEN}help${NC}              このヘルプを表示

${YELLOW}例:${NC}
  # 朝の開発開始
  ./scripts/dev-continuity.sh start

  # タスク追加
  ./scripts/dev-continuity.sh task add "APIエンドポイント実装"

  # 状態確認
  ./scripts/dev-continuity.sh status

  # 終了時
  ./scripts/dev-continuity.sh finish

${CYAN}詳細は各ツールのヘルプを参照:${NC}
  - session-recorder.sh help
  - context-keeper.sh help
  - auto-logger.sh help
  - handover-generator.sh help
  - terminal-helper.sh help
EOF
}

# メイン処理
show_banner

case "$1" in
    start)
        quick_start
        ;;
    finish)
        finish_session
        ;;
    status)
        check_status
        ;;
    menu)
        interactive_menu
        ;;
    task)
        shift
        manage_tasks "$@"
        ;;
    save)
        "$SESSION_MGR/context-keeper.sh" collect "$2"
        ;;
    restore)
        "$SESSION_MGR/context-keeper.sh" restore
        ;;
    diff)
        "$SESSION_MGR/context-keeper.sh" diff
        ;;
    analyze)
        "$SESSION_MGR/auto-logger.sh" analyze "$2"
        ;;
    errors)
        tail -50 "$HOME/.cosmic-oracle-dev.log" 2>/dev/null || echo "エラーログなし"
        ;;
    extract)
        "$SESSION_MGR/auto-logger.sh" extract "$2"
        ;;
    handover)
        "$SESSION_MGR/handover-generator.sh" full
        ;;
    daily)
        "$SESSION_MGR/handover-generator.sh" daily
        ;;
    report)
        "$SESSION_MGR/handover-generator.sh" team
        ;;
    setup)
        initial_setup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        ;;
esac