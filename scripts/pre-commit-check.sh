#!/bin/bash
# Pre-commit チェックスクリプト
# コミット前に実行して品質を保証

echo "📋 Pre-commit チェック開始..."
echo "================================"

# 色付き出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# エラーカウンター
ERROR_COUNT=0

# 1. ESLint チェック
echo -n "1. ESLint チェック... "
npm run lint --silent 2>&1 > /tmp/lint-output.txt
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ 合格${NC}"
else
  echo -e "${RED}❌ 不合格${NC}"
  echo -e "${YELLOW}詳細:${NC}"
  head -20 /tmp/lint-output.txt
  ((ERROR_COUNT++))
fi

# 2. 型チェック
echo -n "2. TypeScript 型チェック... "
npm run type-check --silent 2>&1 > /tmp/type-check-output.txt
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ 合格${NC}"
else
  echo -e "${RED}❌ 不合格${NC}"
  echo -e "${YELLOW}詳細:${NC}"
  head -20 /tmp/type-check-output.txt
  ((ERROR_COUNT++))
fi

# 3. ビルドチェック（高速モード）
echo -n "3. ビルド可能性チェック... "
# Next.jsのビルドを高速化するため、型チェックをスキップ
SKIP_TYPE_CHECK=true npm run build --silent > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ 合格${NC}"
else
  echo -e "${RED}❌ 不合格${NC}"
  ((ERROR_COUNT++))
fi

# 4. 未使用インポートチェック
echo -n "4. 未使用インポートチェック... "
UNUSED_COUNT=$(npx eslint . --ext .ts,.tsx --quiet 2>/dev/null | grep -c "is defined but never used" || true)
if [ "$UNUSED_COUNT" = "0" ] || [ -z "$UNUSED_COUNT" ]; then
  echo -e "${GREEN}✅ なし${NC}"
else
  echo -e "${YELLOW}⚠️  ${UNUSED_COUNT}件の未使用インポート${NC}"
fi

# 5. console.log チェック
echo -n "5. console.log チェック... "
CONSOLE_COUNT=$(grep -r "console.log" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "// console.log" | wc -l | tr -d ' ')
if [ "$CONSOLE_COUNT" -eq 0 ]; then
  echo -e "${GREEN}✅ なし${NC}"
else
  echo -e "${YELLOW}⚠️  ${CONSOLE_COUNT}件のconsole.log${NC}"
fi

echo "================================"

# 結果サマリー
if [ $ERROR_COUNT -eq 0 ]; then
  echo -e "${GREEN}✅ すべてのチェックに合格しました！${NC}"
  echo "コミット可能です。"
  exit 0
else
  echo -e "${RED}❌ ${ERROR_COUNT}件のエラーがあります${NC}"
  echo "修正してから再度実行してください。"
  exit 1
fi