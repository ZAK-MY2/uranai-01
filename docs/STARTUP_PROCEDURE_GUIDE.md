# Zeami開発スタートアップ手順書

## 概要

ターミナル立ち上げから Claude Code での開発開始まで、初心者でも迷わない完全手順書です。

## 🆕 パターンA: 新規プロジェクト立ち上げ

### Step 1: ターミナル起動
```bash
# macOS: Spotlight検索（⌘ + Space）で「ターミナル」と入力
# または Applications > ユーティリティ > ターミナル.app をダブルクリック
```

### Step 2: Zeamiディレクトリに移動
```bash
cd /Users/masato-mba2024/Develop/Zeami-1\ ZAK
```

**確認**: プロンプトが以下のようになることを確認
```
masato-mba2024@MacBook-Air Zeami-1 ZAK %
```

### Step 3: 自動プロジェクト作成スクリプト実行
```bash
./scripts/zeami-auto-project-setup.sh
```

### Step 4: 対話形式でプロジェクト設定
**画面に表示される質問に答える**:

1. **プロジェクト名入力**
   ```
   プロジェクト名を入力してください（英数字、ハイフン、アンダースコアのみ）: 
   ```
   例: `my-blog-app` または `task-manager`

2. **プロジェクト説明入力**
   ```
   プロジェクトの簡単な説明: 
   ```
   例: `個人ブログサイト` または `チーム用タスク管理アプリ`

3. **機能選択**（y/N で回答）
   ```
   認証システムを追加しますか？ [y/N]: 
   ファイルアップロード機能を追加しますか？ [y/N]: 
   リアルタイム機能を追加しますか？ [y/N]: 
   外部API統合を追加しますか？ [y/N]: 
   ```

4. **設定確認**
   ```
   この設定でプロジェクトを作成しますか？ [Y/n]: 
   ```
   `Y` または `Enter` で確定

### Step 5: 自動作成完了を待つ
**以下のメッセージが表示されるまで待機**:
```
🎉 プロジェクト作成完了！
```

### Step 6: 作成されたプロジェクトに移動
```bash
cd projects/[あなたが入力したプロジェクト名]
```

### Step 7: 環境変数設定（重要）
```bash
# 設定ファイルを開く
open .env.local
```

**テキストエディタが開くので、以下を設定**:
```bash
# 最低限設定が必要な項目（Supabaseプロジェクトを作成して入力）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Supabase設定がまだの場合**: とりあえず仮の値を入れて先に進んでもOK

### Step 8: 忘却防止システム開始
```bash
# 別ターミナルで忘却防止システム開始
./scripts/claude-reminder-system.sh start
```

### Step 9: Claude Code起動
```bash
claude
```

### Step 10: Claude Code用仕様書を準備
**別途、以下のテンプレートを使って仕様書を作成**:
- [AUTONOMOUS_DEVELOPMENT_SPEC_TEMPLATE.md](./AUTONOMOUS_DEVELOPMENT_SPEC_TEMPLATE.md) をコピー
- 各項目を埋めて Claude Code に渡す

**これで新規プロジェクト開発開始準備完了！**
**2時間おきにデスクトップ通知が届くので、忘却防止コマンドを実行してください。**

---

## 🔄 パターンB: URANAI-01（既存プロジェクト）の続き

### Step 1: ターミナル起動
```bash
# macOS: Spotlight検索（⌘ + Space）で「ターミナル」と入力
```

### Step 2: URANAI-01プロジェクトに移動
```bash
cd /Users/masato-mba2024/Develop/Zeami-1\ ZAK/projects/uranai-01
```

**確認**: プロンプトが以下のようになることを確認
```
masato-mba2024@MacBook-Air uranai-01 %
```

### Step 3: プロジェクト状況確認（重要）
```bash
# 現在のGit状況確認
git status

# 最新の開発状況確認
cat PROJECT_KNOWLEDGE.md | tail -20
```

### Step 4: 前回セッションの内容確認
```bash
# 前回の成果・手法を確認
cat docs/SESSION_HANDOVER_SUMMARY.md | head -50
```

### Step 5: 依存関係確認
```bash
# パッケージ状況確認
npm list --depth=0

# 不足があれば
npm install
```

### Step 6: 開発サーバー起動確認
```bash
# 現在の動作状況確認
npm run dev
```

**ブラウザで http://localhost:3000 を開いて動作確認**

**停止**: `Ctrl + C`

### Step 7: 忘却防止システム開始
```bash
# 別ターミナルで忘却防止システム開始
./scripts/claude-reminder-system.sh start
```

### Step 8: Claude Code起動
```bash
claude
```

### Step 9: Claude Code用セッション引き継ぎ指示
**Claude Code に以下のメッセージを送信**:

```
前回のURANAI-01セッションの続きです。

まず以下を確認してください：
1. TodoRead で現状確認
2. docs/SESSION_HANDOVER_SUMMARY.md で前回の成果確認
3. 並列開発手法での効率化パターン確認

今回の開発要件：
[ここに具体的な追加機能や修正内容を記載]

前回同様、並列開発手法で本番レベル完成を目指してください。
```

**これでURANAI-01継続開発準備完了！**
**2時間おきにデスクトップ通知が届くので、以下コマンドを実行してください：**
```bash
./scripts/claude-context-restore.sh basic
```

---

## 🛠️ トラブルシューティング

### よくあるエラーと対策

#### 1. `permission denied` エラー
```bash
# スクリプトに実行権限を付与
chmod +x /Users/masato-mba2024/Develop/Zeami-1\ ZAK/scripts/zeami-auto-project-setup.sh
```

#### 2. `No such file or directory` エラー
```bash
# 現在地確認
pwd

# 正しいディレクトリに移動
cd /Users/masato-mba2024/Develop/Zeami-1\ ZAK
```

#### 3. `npm: command not found` エラー
```bash
# Node.js インストール確認
node --version
npm --version

# インストールされていない場合は Node.js をインストール
# https://nodejs.org/ から最新版をダウンロード
```

#### 4. Claude Code が起動しない
```bash
# Claude Code インストール確認
which claude

# インストールされていない場合
# Anthropic公式サイトから Claude Code をインストール
```

#### 5. 環境変数が読み込まれない
```bash
# ファイル名確認（.env.local が正しいか）
ls -la | grep env

# 内容確認
cat .env.local
```

## 📋 チェックリスト

### 新規プロジェクト用
- [ ] ターミナル起動
- [ ] Zeamiディレクトリに移動
- [ ] 自動セットアップスクリプト実行
- [ ] プロジェクト情報入力
- [ ] プロジェクトディレクトリに移動
- [ ] 環境変数設定
- [ ] Claude Code起動
- [ ] 仕様書準備

### 既存プロジェクト用
- [ ] ターミナル起動
- [ ] プロジェクトディレクトリに移動
- [ ] Git状況確認
- [ ] 前回セッション内容確認
- [ ] 依存関係確認
- [ ] 動作確認
- [ ] Claude Code起動
- [ ] セッション引き継ぎ指示

## 💡 開発開始のコツ

### 効率的な進め方
1. **明確な目標設定**: 「今日は何を完成させるか」を決める
2. **時間の目安**: 新機能なら2-4時間、修正なら1-2時間で区切る
3. **品質チェック**: 開発途中でも定期的に `npm run lint && npm run type-check && npm run build` を実行
4. **忘却防止**: 必ず忘却防止システムを開始し、2時間おきの通知に従う

### Claude Code との協働のコツ
1. **具体的な指示**: 「いい感じに」ではなく、具体的な要件を伝える
2. **進捗確認**: TodoRead/TodoWrite を活用して進捗を見える化
3. **エラー対応**: エラーが出たら包括的に修正（個別修正は避ける）
4. **文脈維持**: 2時間おきに `claude-context-restore.sh basic` でコンテキスト復元

### 開発終了時
```bash
# 忘却防止システム停止
./scripts/claude-reminder-system.sh stop
```

## 🎯 よくある質問

**Q: 新規プロジェクトでどんな仕様書を作ればいい？**
A: [AUTONOMOUS_DEVELOPMENT_SPEC_TEMPLATE.md](./AUTONOMOUS_DEVELOPMENT_SPEC_TEMPLATE.md) をコピーして、各項目を埋めてください。

**Q: URANAI-01で追加できる機能は？**
A: UI改善、新占術追加、レスポンシブ対応、認証機能、管理画面など何でも可能です。

**Q: エラーが出た時はどうすれば？**
A: まず `npm run lint && npm run type-check && npm run build` を実行。エラー内容を Claude Code に相談してください。

**Q: 開発が中断した場合は？**
A: PROJECT_KNOWLEDGE.md に現状を記録してから終了。次回は「前回の続き」として開始してください。

このガイドに従えば、初心者でも迷わずに Zeami 開発を開始できます！