#!/bin/bash

echo "🧹 キャッシュをクリーンアップしています..."

# .nextフォルダを削除
rm -rf .next
echo "✅ .nextフォルダを削除しました"

# node_modulesのキャッシュを削除
rm -rf node_modules/.cache
echo "✅ node_modules/.cacheを削除しました"

# Turbopackキャッシュを削除（存在する場合）
rm -rf .turbo
echo "✅ .turboフォルダを削除しました（存在した場合）"

# Next.jsのSWCキャッシュを削除
rm -rf .swc
echo "✅ .swcフォルダを削除しました（存在した場合）"

echo "🎉 キャッシュのクリーンアップが完了しました！"
echo "次のコマンドで開発サーバーを起動してください："
echo "npm run dev"