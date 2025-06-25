#!/bin/bash
# 型エラー包括的チェックスクリプト
# 型エラーを包括的に検出し、関連ファイルを特定

echo "🔍 型エラー包括的チェック開始..."
echo "================================"

# 色付き出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 一時ファイル
TYPE_ERROR_FILE="/tmp/type-errors.log"
AFFECTED_FILES="/tmp/affected-files.log"

# 型チェック実行
echo "型チェック実行中..."
npm run type-check 2>&1 | tee $TYPE_ERROR_FILE

if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo -e "${GREEN}✅ 型エラーなし！${NC}"
  exit 0
fi

echo ""
echo -e "${RED}❌ 型エラーが検出されました${NC}"
echo "================================"

# エラーファイルの抽出
echo -e "${BLUE}影響を受けているファイル:${NC}"
grep -E "^src/.*\.tsx?:" $TYPE_ERROR_FILE | cut -d: -f1 | sort | uniq > $AFFECTED_FILES
cat $AFFECTED_FILES

# エラーの種類を分析
echo ""
echo -e "${BLUE}エラーの種類:${NC}"
echo -n "- Property does not exist: "
grep -c "Property .* does not exist" $TYPE_ERROR_FILE || echo "0"
echo -n "- Type '.*' is not assignable: "
grep -c "Type .* is not assignable" $TYPE_ERROR_FILE || echo "0"
echo -n "- Cannot find module: "
grep -c "Cannot find module" $TYPE_ERROR_FILE || echo "0"
echo -n "- Object is possibly 'null' or 'undefined': "
grep -c "Object is possibly" $TYPE_ERROR_FILE || echo "0"

# 最も影響を受けているモジュールを特定
echo ""
echo -e "${BLUE}最も影響を受けているモジュール:${NC}"
grep -E "import.*from" $(cat $AFFECTED_FILES) 2>/dev/null | \
  grep -oE "from ['\"].*['\"]" | \
  sed 's/from //g' | tr -d "'" | tr -d '"' | \
  sort | uniq -c | sort -rn | head -10

# 包括的修正の提案
echo ""
echo -e "${YELLOW}💡 包括的修正の提案:${NC}"
echo "1. 共通の型定義ファイルを確認:"
echo "   - src/types/*.ts"
echo "   - src/lib/divination/base-engine.ts"
echo ""
echo "2. よくあるパターンの修正:"
echo "   - optional chaining を使用: obj?.property"
echo "   - nullish coalescing を使用: value ?? defaultValue"
echo "   - 型アサーションを慎重に使用: value as Type"
echo ""
echo "3. 関連ファイルを一括で開く:"
echo "   code $(cat $AFFECTED_FILES | tr '\n' ' ')"

# 自動修正可能な項目をチェック
echo ""
echo -e "${BLUE}自動修正可能な項目をチェック中...${NC}"
FIXABLE_COUNT=$(npx eslint . --ext .ts,.tsx --fix --dry-run 2>&1 | grep -c "fixable" || echo "0")
if [ "$FIXABLE_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✅ $FIXABLE_COUNT 件の自動修正可能な項目があります${NC}"
  echo "実行: npm run lint -- --fix"
fi

# クリーンアップ
rm -f $TYPE_ERROR_FILE $AFFECTED_FILES

echo ""
echo "================================"
echo "詳細なエラー内容は 'npm run type-check' で確認してください"