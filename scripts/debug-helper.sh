#!/bin/bash
# デバッグヘルパースクリプト
# 開発中によく使うデバッグコマンドをまとめたツール

echo "🐛 デバッグヘルパー"
echo "=================="

# 色付き出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# メニュー表示
show_menu() {
  echo ""
  echo "選択してください:"
  echo "1) 型エラーの簡易チェック"
  echo "2) 未使用のインポート/変数を検出"
  echo "3) ビルドエラーの詳細確認"
  echo "4) 特定ファイルの依存関係を調査"
  echo "5) console.logの場所を表示"
  echo "6) 最近変更されたファイル（過去1時間）"
  echo "7) パッケージサイズ分析"
  echo "8) 環境変数チェック"
  echo "9) ポート使用状況確認"
  echo "0) 終了"
}

# 1. 型エラーの簡易チェック
type_check_quick() {
  echo -e "${BLUE}型エラーチェック中...${NC}"
  npm run type-check --silent 2>&1 | head -30
  if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo -e "${GREEN}✅ 型エラーなし${NC}"
  else
    echo -e "${RED}❌ 型エラーあり（上記は最初の30行）${NC}"
  fi
}

# 2. 未使用のインポート/変数を検出
find_unused() {
  echo -e "${BLUE}未使用のインポート/変数を検出中...${NC}"
  npx eslint . --ext .ts,.tsx --quiet 2>/dev/null | grep -E "(is defined but never used|is assigned a value but never used)" | head -20
  echo -e "${YELLOW}表示は最初の20件まで${NC}"
}

# 3. ビルドエラーの詳細確認
build_check() {
  echo -e "${BLUE}ビルドチェック中...${NC}"
  echo "これには時間がかかる場合があります..."
  npm run build 2>&1 | tail -50
  if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo -e "${GREEN}✅ ビルド成功${NC}"
  else
    echo -e "${RED}❌ ビルドエラー（上記は最後の50行）${NC}"
  fi
}

# 4. 特定ファイルの依存関係を調査
check_dependencies() {
  echo -n "調査するファイルパスを入力 (例: src/app/page.tsx): "
  read filepath
  if [ -f "$filepath" ]; then
    echo -e "${BLUE}$filepath の依存関係:${NC}"
    echo -e "${MAGENTA}インポート:${NC}"
    grep -E "^import|^export.*from" "$filepath" | sort
    echo ""
    echo -e "${MAGENTA}このファイルを参照している箇所:${NC}"
    grep -r "from.*$(basename $filepath .tsx)'" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | head -10
  else
    echo -e "${RED}ファイルが見つかりません${NC}"
  fi
}

# 5. console.logの場所を表示
find_console_logs() {
  echo -e "${BLUE}console.log の検出中...${NC}"
  grep -rn "console.log" src/ --include="*.ts" --include="*.tsx" | grep -v "// console.log" | head -20
  TOTAL=$(grep -r "console.log" src/ --include="*.ts" --include="*.tsx" | grep -v "// console.log" | wc -l | tr -d ' ')
  echo -e "${YELLOW}合計: $TOTAL 件${NC}"
}

# 6. 最近変更されたファイル
recent_changes() {
  echo -e "${BLUE}過去1時間に変更されたファイル:${NC}"
  find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) -mmin -60 -exec ls -la {} \; 2>/dev/null
}

# 7. パッケージサイズ分析
analyze_bundle() {
  echo -e "${BLUE}パッケージサイズ分析中...${NC}"
  if [ -d ".next" ]; then
    echo "ビルド済みファイルのサイズ:"
    du -sh .next/static/chunks/*.js 2>/dev/null | sort -rh | head -10
  else
    echo -e "${YELLOW}ビルドされていません。'npm run build' を実行してください。${NC}"
  fi
}

# 8. 環境変数チェック
check_env() {
  echo -e "${BLUE}環境変数チェック:${NC}"
  if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local が存在します${NC}"
    echo "定義されている変数:"
    grep -E "^[A-Z]" .env.local | cut -d= -f1 | sort
  else
    echo -e "${RED}❌ .env.local が見つかりません${NC}"
  fi
  
  echo ""
  echo "コード内で使用されている環境変数:"
  grep -r "process.env" src/ --include="*.ts" --include="*.tsx" | grep -oE "process\.env\.[A-Z_]+" | sort | uniq
}

# 9. ポート使用状況確認
check_ports() {
  echo -e "${BLUE}開発用ポートの使用状況:${NC}"
  for port in 3000 3001 5432 8080; do
    if lsof -i :$port >/dev/null 2>&1; then
      echo -e "${RED}ポート $port: 使用中${NC}"
      lsof -i :$port | grep LISTEN | head -1
    else
      echo -e "${GREEN}ポート $port: 空き${NC}"
    fi
  done
}

# メイン処理
while true; do
  show_menu
  echo -n "> "
  read choice
  
  case $choice in
    1) type_check_quick ;;
    2) find_unused ;;
    3) build_check ;;
    4) check_dependencies ;;
    5) find_console_logs ;;
    6) recent_changes ;;
    7) analyze_bundle ;;
    8) check_env ;;
    9) check_ports ;;
    0) echo "終了します"; exit 0 ;;
    *) echo -e "${RED}無効な選択です${NC}" ;;
  esac
  
  echo ""
  echo "Enterキーを押して続行..."
  read
  clear
done