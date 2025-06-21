# 🎯 トークン効率化戦略

## 問題: Bash出力によるトークン浪費

### 現状の問題
```bash
# 問題のあるパターン
git status  # 長大な出力
ls -la      # 不要な詳細
npm run build # 大量のビルドログ
```

## ✅ 効率化ルール

### 1. Bash出力の最小化
```bash
# ❌ 避けるべき
git status  # 全出力表示

# ✅ 推奨
git status --porcelain  # 簡潔な形式
git status -s          # 最短形式
```

### 2. 条件付き詳細表示
```typescript
// エラー時のみ詳細表示
if (command_failed) {
  show_full_output();
} else {
  show_summary_only();
}
```

### 3. 効率的なdescription
```typescript
// ❌ 冗長
"Execute git status command to check the current status of the repository"

// ✅ 簡潔
"Check git status"
```

### 4. 並列実行時の出力制御
```bash
# 成功時は結果のみ、エラー時は詳細
git status -s & git diff --stat & git log --oneline -3
```

## 🚀 具体的な改善策

### Git操作の効率化
```bash
# Before: 長大な出力
git status
git diff
git log

# After: 簡潔な出力
git status -s
git diff --stat
git log --oneline -3
```

### ビルド確認の効率化
```bash
# Before: 全ビルドログ
npm run build

# After: 結果のみ
npm run build > /dev/null 2>&1 && echo "✅ Build success" || echo "❌ Build failed"
```

### ファイル確認の効率化
```bash
# Before: 全ファイルリスト
ls -la

# After: 必要な情報のみ
ls -1 | wc -l  # ファイル数のみ
```

## 📊 トークン削減効果

### 推定削減量
- **Git操作**: 80-90%削減
- **ビルド確認**: 95%削減
- **ファイル操作**: 70-80%削減

### 実装パターン
```bash
# パターン1: 成功/失敗のみ
command && echo "✅ Success" || echo "❌ Failed"

# パターン2: 簡潔な統計
git diff --stat --summary

# パターン3: 必要最小限
git status -s | head -5
```

## 🎯 Claude実行時のルール

### 1. 自動判断基準
```typescript
if (likely_to_succeed && routine_operation) {
  use_minimal_output();
} else if (debug_needed || error_expected) {
  use_full_output();
}
```

### 2. 効率的なBash description
```typescript
// 標準パターン
"Check git status"
"Run build"
"Add files to git"
"Create commit"
```

### 3. 出力の後処理
```bash
# 重要な情報のみ抽出
command | grep -E "(error|warning|success)" || echo "✅ Completed"
```

## 🔄 継続的改善

### 監視指標
- 平均トークン使用量
- Bash操作の効率性
- 必要情報の取得率

### 定期見直し
- 月1回の効率性チェック
- 新しい簡潔コマンドの発見
- 出力パターンの最適化

## 🎉 期待効果

### 短期効果
- **40-60%のトークン削減**
- **レスポンス速度向上**
- **画面の見やすさ向上**

### 長期効果
- **コスト効率の大幅改善**
- **より多くの開発作業に集中**
- **持続可能な開発プロセス**

この効率化により、重要な開発作業により多くのトークンを使用できるようになります。