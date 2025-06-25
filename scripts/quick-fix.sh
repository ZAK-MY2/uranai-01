#!/bin/bash
# クイック修正スクリプト
# よくある問題を素早く修正

echo "🔧 クイック修正開始..."

# 色付き出力用
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. ESLintの自動修正
echo -n "1. ESLint自動修正... "
npm run lint -- --fix --quiet
echo -e "${GREEN}✅ 完了${NC}"

# 2. console.logをコメントアウト（開発用は残す）
echo -n "2. console.log処理... "
# デバッグ用のconsole.logは残し、それ以外をコメントアウト
find src -name "*.ts" -o -name "*.tsx" | while read file; do
  # [Debug] や [Dev] タグがないconsole.logをコメントアウト
  sed -i.bak 's/^\([[:space:]]*\)console\.log(/\1\/\/ console.log(/g' "$file"
  # [Debug] タグ付きは復元
  sed -i.bak 's/^\([[:space:]]*\)\/\/ console\.log(\(.*\[Debug\]\)/\1console.log(\2/g' "$file"
  # [Dev] タグ付きは復元
  sed -i.bak 's/^\([[:space:]]*\)\/\/ console\.log(\(.*\[Dev\]\)/\1console.log(\2/g' "$file"
  # バックアップファイルを削除
  rm -f "${file}.bak"
done
echo -e "${GREEN}✅ 完了${NC}"

# 3. 型エラーの簡易チェック
echo -n "3. 型エラーチェック... "
if npm run type-check --silent 2>&1 | grep -q "error TS"; then
  echo -e "${YELLOW}⚠️  型エラーあり（手動修正が必要）${NC}"
else
  echo -e "${GREEN}✅ エラーなし${NC}"
fi

echo ""
echo "修正完了！"
echo "残りの問題は 'npm run debug' で確認してください。"