# 拡張自律システム - 10時間連続開発対応

## 🎯 人間の集中力限界 vs 必要な介入頻度

### 人間の生理的限界
```
集中力持続: 90分-2時間
深い作業: 最大4時間
1日の限界: 6-8時間（休憩込み）
```

### Claude Codeの特性
```
連続稼働: 理論上無制限
忘却周期: 2-3時間で文脈劣化
エラー発生: 1-2時間で蓄積
```

## 🔧 技術的自動化による人間介入の最小化

### レベル1: セッション自動延長（4-6時間無人化）

#### A. 自動コンテキスト再注入
```bash
#!/bin/bash
# auto-context-injection.sh

CONTEXT_INTERVAL=7200  # 2時間おき
PROJECT_DIR="/Users/masato-mba2024/Develop/Zeami-1 ZAK/projects/uranai-01"

inject_context() {
    echo "🔄 自動コンテキスト再注入 - $(date)"
    
    # Claude Codeに自動送信（AppleScript使用）
    CONTEXT_MESSAGE="## 🔄 定期コンテキスト再注入

$(cat CLAUDE.md | head -20)

現在のTodoList状況確認:
TodoRead

品質チェック実行:
npm run lint && npm run type-check

前回の成功パターン確認完了。継続してください。"

    # Claude Codeのウィンドウに自動入力
    osascript -e "
        tell application \"Terminal\"
            activate
            delay 1
            do script \"echo '$CONTEXT_MESSAGE'\" in front window
        end tell
    "
}

# バックグラウンド実行
while true; do
    sleep $CONTEXT_INTERVAL
    inject_context
done &

echo "🤖 自動コンテキスト注入開始: PID $!"
```

#### B. 進捗監視＆自動軌道修正
```bash
#!/bin/bash
# auto-progress-monitor.sh

monitor_and_correct() {
    while true; do
        sleep 3600  # 1時間おき
        
        echo "📊 自動進捗監視 - $(date)"
        
        # Gitコミット状況確認
        if [ $(git log --since="1 hour ago" --oneline | wc -l) -eq 0 ]; then
            echo "⚠️ 1時間コミットなし - 自動リマインダー送信"
            auto_send_reminder "進捗確認: 1時間コミットがありません。TodoListで現状確認してください。"
        fi
        
        # エラーログ確認
        if [ -f "npm-debug.log" ] || [ -f ".next/build-error.log" ]; then
            echo "❌ ビルドエラー検出 - 自動修正指示送信"
            auto_send_reminder "🔧 ビルドエラーを検出しました。品質チェックを実行してください: npm run lint && npm run type-check"
        fi
        
        # 型エラー確認
        if ! npm run type-check > /dev/null 2>&1; then
            echo "🔍 型エラー検出 - 自動修正指示"
            auto_send_reminder "⚠️ TypeScriptエラーがあります。包括的修正を実行してください。"
        fi
        
    done
}

auto_send_reminder() {
    local message="$1"
    # Claude Codeに自動メッセージ送信
    osascript -e "
        tell application \"Terminal\"
            do script \"echo '$message'\" in front window
            key code 36  # Enter key
        end tell
    "
}

monitor_and_correct &
echo "📊 自動進捗監視開始: PID $!"
```

### レベル2: 完全自動品質管理（6-8時間無人化）

#### A. 自動品質チェック＆修正指示
```bash
#!/bin/bash
# auto-quality-assurance.sh

QUALITY_CHECK_INTERVAL=1800  # 30分おき

auto_quality_check() {
    echo "🔧 自動品質チェック実行 - $(date)"
    
    # 1. Lint チェック
    if ! npm run lint > lint.log 2>&1; then
        echo "❌ Lint エラー検出"
        auto_fix_instruction "Lintエラーを検出しました。以下を実行してください:\nnpm run lint --fix\n修正できないエラーは手動で修正してください。"
    fi
    
    # 2. 型チェック
    if ! npm run type-check > type.log 2>&1; then
        echo "❌ 型エラー検出"
        auto_fix_instruction "TypeScriptエラーがあります。包括的修正アプローチで解決してください。"
    fi
    
    # 3. ビルドチェック
    if ! npm run build > build.log 2>&1; then
        echo "❌ ビルドエラー検出"
        auto_fix_instruction "ビルドエラーがあります。エラーログを確認して修正してください:\ncat build.log"
    fi
    
    # 4. 全てOKの場合
    if [ $? -eq 0 ]; then
        echo "✅ 品質チェック合格"
        auto_send_message "✅ 品質チェック合格。開発を継続してください。"
    fi
}

auto_fix_instruction() {
    local instruction="$1"
    auto_send_message "🔧 自動品質チェック結果:\n$instruction"
}

while true; do
    sleep $QUALITY_CHECK_INTERVAL
    auto_quality_check
done &

echo "🔧 自動品質チェック開始: PID $!"
```

#### B. 自動TodoList管理
```typescript
// auto-todo-manager.js
const fs = require('fs');

class AutoTodoManager {
    constructor() {
        this.checkInterval = 30 * 60 * 1000; // 30分
        this.lastTodoCount = 0;
    }
    
    start() {
        setInterval(() => this.checkTodoProgress(), this.checkInterval);
        console.log('🤖 自動Todo管理開始');
    }
    
    async checkTodoProgress() {
        try {
            // Claude Codeのアクティビティ推測
            const gitChanges = await this.getGitChanges();
            const fileChanges = await this.getRecentFileChanges();
            
            if (gitChanges.length === 0 && fileChanges.length === 0) {
                // 30分間活動なし = スタック可能性
                this.sendProgressReminder();
            }
            
            // Todo進捗推測
            if (fileChanges.length > 5) {
                // 多くのファイル変更 = Todo完了可能性
                this.sendCompletionCheck();
            }
            
        } catch (error) {
            console.error('Todo管理エラー:', error);
        }
    }
    
    sendProgressReminder() {
        const message = `⏰ 30分間活動が検出されていません。
        
現状確認:
- TodoRead で進捗確認
- スタックしている場合は問題を明確化
- 必要に応じて方針転換を検討`;
        
        this.sendToClaudeCode(message);
    }
    
    sendCompletionCheck() {
        const message = `📋 多くのファイル変更を検出しました。
        
進捗確認:
- 完了したタスクをTodoWriteでマーク
- 新しいタスクがあれば追加
- 品質チェックの実行`;
        
        this.sendToClaudeCode(message);
    }
    
    sendToClaudeCode(message) {
        // AppleScript経由でClaude Codeに送信
        const script = `
        tell application "Terminal"
            do script "echo '${message}'" in front window
        end tell`;
        
        require('child_process').exec(`osascript -e '${script}'`);
    }
}

// 実行
new AutoTodoManager().start();
```

### レベル3: 高度自動システム（8-10時間無人化）

#### A. AI状態監視エージェント
```python
# claude_monitor.py
import time
import subprocess
import re
from datetime import datetime, timedelta

class ClaudeMonitor:
    def __init__(self):
        self.last_activity = datetime.now()
        self.error_count = 0
        self.context_injection_interval = 7200  # 2時間
        self.last_context_injection = datetime.now()
        
    def monitor_claude_activity(self):
        """Claude Codeの活動状況を監視"""
        while True:
            try:
                # ターミナルの活動確認
                activity = self.check_terminal_activity()
                
                if activity:
                    self.last_activity = datetime.now()
                    self.error_count = 0
                else:
                    # 30分間活動なしの場合
                    if datetime.now() - self.last_activity > timedelta(minutes=30):
                        self.send_activation_prompt()
                
                # 定期的なコンテキスト再注入
                if datetime.now() - self.last_context_injection > timedelta(seconds=self.context_injection_interval):
                    self.inject_context()
                
                time.sleep(300)  # 5分おきチェック
                
            except Exception as e:
                print(f"監視エラー: {e}")
                time.sleep(60)
    
    def check_terminal_activity(self):
        """ターミナルの活動をチェック"""
        try:
            # 最近のファイル変更をチェック
            result = subprocess.run(['find', '.', '-name', '*.ts', '-o', '-name', '*.tsx', '-mmin', '-5'], 
                                  capture_output=True, text=True)
            return len(result.stdout.strip()) > 0
        except:
            return False
    
    def send_activation_prompt(self):
        """活動促進プロンプトを送信"""
        message = """🔄 定期アクティベーション

現在の状況を確認してください:
1. TodoRead で進捗状況確認
2. 現在のタスクの状況説明
3. スタックしている場合は問題の明確化

継続してください。"""
        
        self.send_to_claude(message)
        
    def inject_context(self):
        """定期的なコンテキスト再注入"""
        with open('CLAUDE.md', 'r') as f:
            claude_md = f.read()[:500]  # 最初の500文字
            
        message = f"""## 🔄 定期コンテキスト再注入

{claude_md}

必須確認事項:
- TodoRead実行
- 品質チェック: npm run lint && npm run type-check
- 前回の成功パターン（並列開発）継続

効率的に継続してください。"""

        self.send_to_claude(message)
        self.last_context_injection = datetime.now()
    
    def send_to_claude(self, message):
        """Claude Codeにメッセージ送信"""
        script = f'''
        tell application "Terminal"
            activate
            delay 0.5
            do script "{message}" in front window
            delay 0.5
            key code 36
        end tell
        '''
        subprocess.run(['osascript', '-e', script])

# 実行
if __name__ == "__main__":
    monitor = ClaudeMonitor()
    monitor.monitor_claude_activity()
```

## 📊 連続稼働時間と人間介入頻度

| システムレベル | 連続稼働時間 | 人間介入頻度 | 実装難易度 |
|----------------|--------------|-------------|------------|
| **レベル1: 基本自動化** | 4-6時間 | 2-3時間に1回 | ⭐⭐ |
| **レベル2: 完全品質管理** | 6-8時間 | 4-6時間に1回 | ⭐⭐⭐ |
| **レベル3: AI状態監視** | 8-10時間 | 8-10時間に1回 | ⭐⭐⭐⭐ |

## 🎯 10時間無人化の実現方法

### 必要な組み合わせ
```bash
# 全自動化システム起動
./auto-context-injection.sh &    # 2時間おきコンテキスト注入
./auto-progress-monitor.sh &     # 1時間おき進捗監視
./auto-quality-assurance.sh &   # 30分おき品質チェック
python claude_monitor.py &      # 5分おき活動監視

echo "🤖 10時間無人開発システム起動完了"
```

### 人間介入が必要な瞬間
1. **8-10時間後**: トークン制限によるセッション終了
2. **重大エラー時**: 完全スタック（自動解決不可）
3. **方針転換時**: 要求仕様の大幅変更
4. **外部要因**: API障害、システム再起動

## 🚀 実装の優先順位

### Phase 1: 4-6時間無人化（実装容易）
```bash
# 30分で実装可能
auto-context-injection.sh + auto-quality-assurance.sh
```

### Phase 2: 6-8時間無人化（中程度）
```bash
# 2時間で実装可能
+ auto-progress-monitor.sh + auto-todo-manager.js
```

### Phase 3: 8-10時間無人化（高度）
```python
# 4時間で実装可能
+ claude_monitor.py（AI状態監視）
```

## 🏁 結論

**10時間無人化は技術的に実現可能です。**

- **最低人間介入**: 8-10時間に1回（セッション更新のみ）
- **実装時間**: 6-8時間（段階的実装）
- **効果**: 人間の集中力制約を完全克服

**これで本当の意味でのClaude Code自律開発が実現します。**