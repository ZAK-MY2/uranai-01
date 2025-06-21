#!/bin/bash

# 🚀 Claude Code セッション開始用スクリプト

echo "🚀 Claude Code Programming Session - Quick Start"
echo "=============================================="

echo ""
echo "📍 1. プロジェクトコンテキスト確認"
if [ -f ".zeami-context" ]; then
    cat .zeami-context
else
    echo "⚠️  .zeami-context ファイルが見つかりません"
fi

echo ""
echo "🚨 2. 重要な再発防止チェックリスト"
echo "必ず確認してください: QUICK_START_CHECKLIST.md"
echo ""

echo "📋 3. 現在のタスク状況"
echo "TodoRead を実行して現状確認してください"
echo ""

echo "📊 4. Git 状況確認"
git status --short 2>/dev/null || echo "Git リポジトリではありません"
echo ""

echo "📚 5. 最新開発ログ"
if [ -d "docs/logs" ]; then
    echo "最新のログファイル:"
    find docs/logs -name "*.md" -type f | sort | tail -3
else
    echo "ログディレクトリが見つかりません"
fi

echo ""
echo "🔧 6. クイックアクセスコマンド"
echo "  - チェックリスト表示: cat QUICK_START_CHECKLIST.md"
echo "  - メインガイド表示: cat CLAUDE.md (プロジェクトルートから)"
echo "  - 教訓集表示: cat docs/lessons-learned/CRITICAL_LESSONS_LEARNED.md"
echo "  - 開発サーバー: npm run dev"
echo "  - ビルド確認: npm run build"
echo ""

echo "✅ セッション開始準備完了！"
echo "最初に QUICK_START_CHECKLIST.md を確認してから作業を開始してください。"