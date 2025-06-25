#!/bin/bash

# ORACLE ECHO - Claude完全コンテキスト復元システム
# 新セッション開始時の完全な状況把握支援

set -e

PROJECT_ROOT="/Users/masato-mba2024/Develop/Zeami-1 ZAK/projects/uranai-01"
LOG_DIR="$PROJECT_ROOT/docs/logs/2025-06"

echo "🧠 ORACLE ECHO - Claude Context Recovery System"
echo "=================================================="

# 1. プロジェクト基本情報
echo "📍 1. PROJECT LOCATION & STATUS"
echo "Current Directory: $(pwd)"
echo "Target Directory: $PROJECT_ROOT"
cd "$PROJECT_ROOT" 2>/dev/null || { echo "❌ Project directory not found"; exit 1; }
echo "✅ Successfully moved to project directory"
echo ""

# 2. Git状態確認
echo "📊 2. GIT STATUS & RECENT COMMITS"
git status --porcelain | head -10
echo ""
echo "Recent commits:"
git log --oneline -5
echo ""

# 3. 重要ドキュメント抽出
echo "📚 3. CRITICAL DOCUMENTS SUMMARY"
echo "--- HANDOVER GUIDE (First 50 lines) ---"
if [ -f "HANDOVER_GUIDE.md" ]; then
    head -50 "HANDOVER_GUIDE.md"
else
    echo "⚠️ HANDOVER_GUIDE.md not found"
fi
echo ""

echo "--- PROJECT CLAUDE.md (First 30 lines) ---"
if [ -f "CLAUDE.md" ]; then
    head -30 "CLAUDE.md"
else
    echo "⚠️ CLAUDE.md not found"
fi
echo ""

# 4. 最新開発ログ
echo "📝 4. LATEST DEVELOPMENT LOGS"
if [ -d "$LOG_DIR" ]; then
    echo "Available logs in 2025-06:"
    ls -la "$LOG_DIR" | tail -5
    echo ""
    
    echo "--- Latest Log Content ---"
    latest_log=$(ls -t "$LOG_DIR"/*.md 2>/dev/null | head -1)
    if [ -n "$latest_log" ]; then
        echo "📄 Latest: $(basename "$latest_log")"
        head -30 "$latest_log"
    else
        echo "⚠️ No log files found"
    fi
else
    echo "⚠️ Log directory not found"
fi
echo ""

# 5. システム動作確認
echo "🔧 5. SYSTEM HEALTH CHECK"
echo "--- Package.json scripts ---"
if [ -f "package.json" ]; then
    npm run --silent 2>/dev/null | grep -E "dev|build|lint" | head -5
else
    echo "⚠️ package.json not found"
fi
echo ""

echo "--- Quick Build Test ---"
if command -v npm >/dev/null 2>&1; then
    echo "Running quick build check..."
    npm run build --silent >/dev/null 2>&1 && echo "✅ Build successful" || echo "❌ Build failed"
else
    echo "⚠️ npm not available"
fi
echo ""

# 6. 重要ファイル構造
echo "📁 6. KEY FILE STRUCTURE"
echo "--- Core Implementation Files ---"
find src -name "*.tsx" -o -name "*.ts" | grep -E "(dashboard|divination|engine)" | head -10
echo ""

echo "--- Recent Modified Files ---"
find . -name "*.ts" -o -name "*.tsx" -o -name "*.md" | grep -v node_modules | xargs ls -lt | head -10
echo ""

# 7. 環境・設定確認
echo "⚙️ 7. ENVIRONMENT & CONFIGURATION"
echo "Node version: $(node --version 2>/dev/null || echo 'Not available')"
echo "NPM version: $(npm --version 2>/dev/null || echo 'Not available')"
echo ""

if [ -f ".env.local" ]; then
    echo "Environment variables configured: ✅"
    echo "Variables count: $(wc -l < .env.local)"
else
    echo "Environment variables: ⚠️ .env.local not found"
fi
echo ""

# 8. 推奨次のアクション
echo "🎯 8. RECOMMENDED NEXT ACTIONS"
cat << 'EOF'
Based on current state, recommended actions:

1. Verify current status:
   TodoRead

2. Check latest development:
   cat docs/logs/2025-06/$(ls -t docs/logs/2025-06/*.md | head -1 | xargs basename)

3. Start development server:
   npm run dev

4. Review critical constraints:
   - 32K token limit: Plan work in phases
   - File read limits: Use offset/limit for large files
   - Always document decisions in logs

5. Key commands for development:
   npm run build  # Verify system integrity
   npm run lint   # Code quality check
   TodoWrite      # Task management
EOF

echo ""
echo "=================================================="
echo "🎉 Context Recovery Complete - Ready for Development!"
echo "=================================================="