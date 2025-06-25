#!/bin/bash

# ORACLE ECHO - Claude記憶力強化・制約克服システム
# 32K制限、忘却、読み取り制約の包括的対策

set -e

PROJECT_ROOT="/Users/masato-mba2024/Develop/Zeami-1 ZAK/projects/uranai-01"
MEMORY_DIR="$PROJECT_ROOT/.claude-memory"
SESSION_FILE="$MEMORY_DIR/current-session.md"

# メモリディレクトリ作成
mkdir -p "$MEMORY_DIR"

echo "🧠 CLAUDE MEMORY BOOSTER SYSTEM"
echo "==============================="

# 引数による動作モード切り替え
case "${1:-help}" in
    "start")
        echo "🚀 Starting new session memory system..."
        
        # セッション開始時刻記録
        echo "# Claude Session Memory Log" > "$SESSION_FILE"
        echo "**Started**: $(date)" >> "$SESSION_FILE"
        echo "**Project**: ORACLE ECHO (uranai-01)" >> "$SESSION_FILE"
        echo "" >> "$SESSION_FILE"
        
        # 重要な現状記録
        echo "## Current Status" >> "$SESSION_FILE"
        cd "$PROJECT_ROOT"
        
        echo "### Git Status" >> "$SESSION_FILE"
        echo '```' >> "$SESSION_FILE"
        git status --porcelain | head -10 >> "$SESSION_FILE"
        echo '```' >> "$SESSION_FILE"
        echo "" >> "$SESSION_FILE"
        
        echo "### Recent Commits" >> "$SESSION_FILE"
        echo '```' >> "$SESSION_FILE"
        git log --oneline -3 >> "$SESSION_FILE"
        echo '```' >> "$SESSION_FILE"
        echo "" >> "$SESSION_FILE"
        
        echo "### Build Status" >> "$SESSION_FILE"
        if npm run build --silent >/dev/null 2>&1; then
            echo "✅ Build: SUCCESS" >> "$SESSION_FILE"
        else
            echo "❌ Build: FAILED" >> "$SESSION_FILE"
        fi
        echo "" >> "$SESSION_FILE"
        
        echo "✅ Session memory initialized"
        ;;
        
    "checkpoint")
        echo "💾 Creating checkpoint..."
        
        if [ ! -f "$SESSION_FILE" ]; then
            echo "⚠️ No active session found. Run 'start' first."
            exit 1
        fi
        
        echo "" >> "$SESSION_FILE"
        echo "## Checkpoint: $(date)" >> "$SESSION_FILE"
        echo "${2:-Manual checkpoint}" >> "$SESSION_FILE"
        echo "" >> "$SESSION_FILE"
        
        # 現在のTodoList状態記録
        cd "$PROJECT_ROOT"
        echo "### Current Tasks" >> "$SESSION_FILE"
        echo '```' >> "$SESSION_FILE"
        # TodoListの内容をキャプチャ（実際の実装に応じて調整）
        echo "TodoRead result would be recorded here" >> "$SESSION_FILE"
        echo '```' >> "$SESSION_FILE"
        echo "" >> "$SESSION_FILE"
        
        echo "✅ Checkpoint saved"
        ;;
        
    "smart-read")
        echo "📖 Smart file reading (constraint-aware)..."
        
        if [ -z "$2" ]; then
            echo "Usage: $0 smart-read <file-path> [max-lines]"
            exit 1
        fi
        
        file_path="$2"
        max_lines="${3:-100}"
        
        if [ ! -f "$file_path" ]; then
            echo "❌ File not found: $file_path"
            exit 1
        fi
        
        total_lines=$(wc -l < "$file_path")
        
        echo "📄 File: $file_path"
        echo "📊 Total lines: $total_lines"
        echo "📖 Reading first $max_lines lines..."
        echo ""
        echo "--- FILE CONTENT ---"
        head -n "$max_lines" "$file_path"
        echo "--- END ---"
        
        if [ "$total_lines" -gt "$max_lines" ]; then
            echo ""
            echo "⚠️ File truncated. Use Read tool with offset for remaining content."
            echo "💡 Suggested: Read with offset=$max_lines, limit=$max_lines"
        fi
        ;;
        
    "context-summary")
        echo "📋 Generating context summary for next session..."
        
        cd "$PROJECT_ROOT"
        summary_file="$MEMORY_DIR/context-summary-$(date +%Y%m%d-%H%M).md"
        
        cat > "$summary_file" << EOF
# ORACLE ECHO Context Summary
**Generated**: $(date)
**Purpose**: Next session quick start

## Project Status
- **Location**: $PROJECT_ROOT
- **Last Build**: $(npm run build --silent >/dev/null 2>&1 && echo "SUCCESS" || echo "FAILED")
- **Git Status**: $(git status --porcelain | wc -l) modified files

## Latest Development
EOF

        # 最新ログファイルの要約
        latest_log=$(find docs/logs/2025-06/ -name "*.md" | xargs ls -t | head -1)
        if [ -n "$latest_log" ]; then
            echo "- **Latest Log**: $(basename "$latest_log")" >> "$summary_file"
            echo "- **Content Summary**:" >> "$summary_file"
            head -10 "$latest_log" | sed 's/^/  /' >> "$summary_file"
        fi
        
        cat >> "$summary_file" << EOF

## Key Files (Recent)
EOF
        
        # 最近更新されたファイル
        find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | xargs ls -lt | head -5 | while read -r line; do
            echo "- $line" >> "$summary_file"
        done
        
        cat >> "$summary_file" << EOF

## Next Session Commands
\`\`\`bash
cd "$PROJECT_ROOT"
./scripts/claude-context-recovery.sh
TodoRead
npm run build
\`\`\`

## Important Reminders
- 32K token limit: Break work into phases
- Large files: Use Read with offset/limit
- Always document decisions
- Run builds before major changes
EOF

        echo "✅ Context summary saved: $summary_file"
        echo "📋 Summary ready for next session handover"
        ;;
        
    "analyze-file")
        echo "🔍 Intelligent file analysis..."
        
        if [ -z "$2" ]; then
            echo "Usage: $0 analyze-file <file-path>"
            exit 1
        fi
        
        file_path="$2"
        if [ ! -f "$file_path" ]; then
            echo "❌ File not found: $file_path"
            exit 1
        fi
        
        echo "📄 Analyzing: $file_path"
        echo "📊 Size: $(wc -l < "$file_path") lines, $(wc -c < "$file_path") bytes"
        echo ""
        
        # ファイル種別による分析
        case "$file_path" in
            *.ts|*.tsx)
                echo "🔧 TypeScript Analysis:"
                echo "- Exports: $(grep -c "export " "$file_path" 2>/dev/null || echo 0)"
                echo "- Imports: $(grep -c "import " "$file_path" 2>/dev/null || echo 0)"
                echo "- Functions: $(grep -c "function\|const.*=" "$file_path" 2>/dev/null || echo 0)"
                echo "- Interfaces: $(grep -c "interface " "$file_path" 2>/dev/null || echo 0)"
                ;;
            *.md)
                echo "📝 Markdown Analysis:"
                echo "- Headers: $(grep -c "^#" "$file_path" 2>/dev/null || echo 0)"
                echo "- Code blocks: $(grep -c '```' "$file_path" 2>/dev/null || echo 0)"
                echo "- Links: $(grep -c '\[.*\](' "$file_path" 2>/dev/null || echo 0)"
                ;;
        esac
        
        echo ""
        echo "🎯 Key sections (first 50 lines):"
        head -50 "$file_path"
        ;;
        
    "help"|*)
        cat << 'EOF'
🧠 CLAUDE MEMORY BOOSTER - Usage Guide

COMMANDS:
  start                     Initialize session memory tracking
  checkpoint [message]      Save current state checkpoint
  smart-read <file> [lines] Read file with constraint awareness
  context-summary          Generate next session summary
  analyze-file <file>       Intelligent file analysis
  help                     Show this help

EXAMPLES:
  ./scripts/claude-memory-booster.sh start
  ./scripts/claude-memory-booster.sh checkpoint "Completed numerology system"
  ./scripts/claude-memory-booster.sh smart-read src/lib/large-file.ts 100
  ./scripts/claude-memory-booster.sh context-summary
  ./scripts/claude-memory-booster.sh analyze-file CLAUDE.md

MEMORY SYSTEM FEATURES:
✅ 32K token limit management
✅ Session state persistence
✅ Smart file reading with limits
✅ Context preservation for handover
✅ Automatic progress tracking

INTEGRATION:
- Use with TodoRead/TodoWrite for task tracking
- Combine with development logs for complete memory
- Generate summaries before ending sessions
EOF
        ;;
esac

echo ""
echo "🎯 Memory system ready. Use 'help' for more commands."