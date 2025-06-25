#!/bin/bash
# UI要素追跡・更新スクリプト
# 実際のコードからUI要素を検出し、マッピングを最新に保つ

# 色定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT=$(pwd)
UI_MAPPER_FILE="$PROJECT_ROOT/src/lib/ui-mapper.ts"
ELEMENT_LOG="$PROJECT_ROOT/docs/ui/element-changes.log"

# UI要素パターンの検出
detect_ui_elements() {
  echo -e "${BLUE}🔍 UI要素を検出中...${NC}"
  
  # data-ui-id属性を持つ要素を検索
  grep -r 'data-ui-id="[^"]*"' src/ --include="*.tsx" --include="*.ts" 2>/dev/null | \
    sed -n 's/.*data-ui-id="\([^"]*\)".*/\1/p' | \
    sort | uniq > /tmp/found-elements.txt
  
  # generateUIProps関数の使用を検索
  grep -r "generateUIProps('[^']*')" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | \
    sed -n "s/.*generateUIProps('\([^']*\)').*/\1/p" | \
    sort | uniq >> /tmp/found-elements.txt
  
  # 重複を除去
  sort /tmp/found-elements.txt | uniq > /tmp/all-elements.txt
  
  echo -e "${GREEN}✅ $(wc -l < /tmp/all-elements.txt) 個の要素を検出${NC}"
}

# 新しい要素の検出
find_new_elements() {
  echo -e "${BLUE}🆕 新しい要素をチェック中...${NC}"
  
  # ui-mapper.tsから既存の要素を抽出
  grep -oE '"[a-z]+-[a-z]+-[a-z-]*"' "$UI_MAPPER_FILE" | tr -d '"' | sort | uniq > /tmp/existing-elements.txt
  
  # 新しい要素を特定
  comm -23 /tmp/all-elements.txt /tmp/existing-elements.txt > /tmp/new-elements.txt
  
  if [ -s /tmp/new-elements.txt ]; then
    echo -e "${YELLOW}⚠️  新しい要素が見つかりました:${NC}"
    cat /tmp/new-elements.txt
    
    # 変更ログに記録
    echo "$(date '+%Y-%m-%d %H:%M:%S') - 新要素検出:" >> "$ELEMENT_LOG"
    cat /tmp/new-elements.txt >> "$ELEMENT_LOG"
    echo "---" >> "$ELEMENT_LOG"
  else
    echo -e "${GREEN}✅ すべての要素が登録済み${NC}"
  fi
}

# 未使用要素の検出
find_unused_elements() {
  echo -e "${BLUE}🗑️  未使用要素をチェック中...${NC}"
  
  # 登録されているが使用されていない要素
  comm -13 /tmp/all-elements.txt /tmp/existing-elements.txt > /tmp/unused-elements.txt
  
  if [ -s /tmp/unused-elements.txt ]; then
    echo -e "${YELLOW}⚠️  未使用の要素:${NC}"
    cat /tmp/unused-elements.txt
  else
    echo -e "${GREEN}✅ すべての要素が使用中${NC}"
  fi
}

# 命名規則チェック
check_naming_convention() {
  echo -e "${BLUE}📏 命名規則をチェック中...${NC}"
  
  # 正しい形式: screen-type-name
  invalid_count=0
  while IFS= read -r element; do
    if ! echo "$element" | grep -qE '^[a-z]+-[a-z]+-[a-z-]+$'; then
      echo -e "${YELLOW}⚠️  命名規則違反: $element${NC}"
      ((invalid_count++))
    fi
  done < /tmp/all-elements.txt
  
  if [ $invalid_count -eq 0 ]; then
    echo -e "${GREEN}✅ すべての要素が命名規則に準拠${NC}"
  fi
}

# レポート生成
generate_report() {
  echo -e "${BLUE}📊 レポート生成中...${NC}"
  
  cat > "$PROJECT_ROOT/docs/ui/element-report.md" << EOF
# UI要素レポート
生成日時: $(date '+%Y-%m-%d %H:%M:%S')

## 統計
- 検出された要素数: $(wc -l < /tmp/all-elements.txt)
- 登録済み要素数: $(wc -l < /tmp/existing-elements.txt)
- 新規要素数: $(wc -l < /tmp/new-elements.txt 2>/dev/null || echo 0)
- 未使用要素数: $(wc -l < /tmp/unused-elements.txt 2>/dev/null || echo 0)

## 画面別要素数
EOF

  # 画面別に集計
  for screen in entry dash input integrated num tarot astro iching runes vedic nine feng celtic kabbalah; do
    count=$(grep "^$screen-" /tmp/all-elements.txt | wc -l)
    echo "- $screen: $count" >> "$PROJECT_ROOT/docs/ui/element-report.md"
  done
  
  echo -e "${GREEN}✅ レポート生成完了: docs/ui/element-report.md${NC}"
}

# メイン処理
main() {
  echo -e "${BLUE}🚀 UI要素追跡開始${NC}"
  echo "================================"
  
  # ログディレクトリ作成
  mkdir -p "$PROJECT_ROOT/docs/ui"
  
  # 各処理を実行
  detect_ui_elements
  find_new_elements
  find_unused_elements
  check_naming_convention
  generate_report
  
  echo "================================"
  echo -e "${GREEN}✅ 完了${NC}"
  
  # クリーンアップ
  rm -f /tmp/found-elements.txt /tmp/all-elements.txt /tmp/existing-elements.txt /tmp/new-elements.txt /tmp/unused-elements.txt
}

# 実行
main