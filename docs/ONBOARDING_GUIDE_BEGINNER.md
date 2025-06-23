# 初級者向けオンボーディングガイド - Zeami開発入門

## 🎯 このガイドの対象者

- プログラミング経験6ヶ月〜2年程度
- HTML/CSS/JavaScriptの基本を理解している
- Node.js、npmを使ったことがある
- Gitの基本操作ができる
- **まだNext.js、TypeScript、Supabaseは詳しくない**

## 📚 事前準備：必要な最低限の知識

### 学習必須項目（所要時間: 約20時間）

#### 1. JavaScript基礎（復習）（3時間）
```javascript
// ES6機能の確認
const name = "Claude";
const greeting = `Hello, ${name}!`;
const { id, title } = data;
const newArray = [...oldArray, newItem];

// 非同期処理
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}
```

#### 2. TypeScript基礎（5時間）
```typescript
// 基本型定義
interface User {
  id: string;
  name: string;
  email?: string; // オプショナル
}

// 関数の型定義
function createUser(data: Omit<User, 'id'>): User {
  return { id: crypto.randomUUID(), ...data };
}
```

#### 3. React基礎（8時間）
```tsx
// 関数コンポーネント
import { useState, useEffect } from 'react';

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  return <div>{user?.name}</div>;
}
```

#### 4. Next.js App Router基礎（4時間）
```
app/
├── page.tsx          # ホームページ
├── about/
│   └── page.tsx     # /about ページ
└── api/
    └── users/
        └── route.ts # /api/users エンドポイント
```

### 推奨学習リソース

1. **JavaScript**: MDN Web Docs - Modern JavaScript
2. **TypeScript**: TypeScript公式ハンドブック（日本語版）
3. **React**: React公式ドキュメント（beta.reactjs.org）
4. **Next.js**: Next.js Learn コース（nextjs.org/learn）

## 🚀 URANAI-01プロジェクト理解のステップ

### Step 1: プロジェクト構造の把握（30分）

```bash
# プロジェクトディレクトリに移動
cd /Users/masato-mba2024/Develop/Zeami-1\ ZAK/projects/uranai-01

# 構造確認
tree -I 'node_modules|.next' -L 3
```

**重要ファイル理解チェックリスト**
- [ ] `package.json` - 依存関係とスクリプト確認
- [ ] `CLAUDE.md` - プロジェクト固有ルール理解
- [ ] `src/app/page.tsx` - メインページ構造理解
- [ ] `src/types/` - 型定義の把握
- [ ] `src/lib/` - ビジネスロジック配置確認

### Step 2: 環境設定の理解（20分）

```bash
# 環境変数確認
cat .env.local.example  # テンプレート確認
ls -la | grep env       # 実際の環境ファイル確認

# 依存関係確認
npm list --depth=0
```

**環境設定チェックリスト**
- [ ] Supabase接続設定理解
- [ ] 外部API設定理解（気象・天文）
- [ ] 開発/本番環境の違い理解

### Step 3: 占術システムの理解（45分）

```bash
# 占術エンジン確認
ls -la src/lib/divination/

# 型定義確認
cat src/types/divination.ts | head -50
```

**占術システム理解チェックリスト**
- [ ] 10種類の占術リスト確認
- [ ] 統合システム（integrator.ts）の役割理解
- [ ] 入力データ（DivinationInput）の構造理解
- [ ] 出力データ（IntegratedDivinationResult）の構造理解

### Step 4: 実際の動作確認（30分）

```bash
# 開発サーバー起動
npm run dev

# 別ターミナルで品質チェック
npm run lint && npm run type-check && npm run build
```

**動作確認チェックリスト**
- [ ] ローカルサーバーでアプリ表示
- [ ] 占い機能の基本動作確認
- [ ] エラーなしでビルド完了確認

## 🛠️ 開発に参加する準備

### 開発環境セットアップ（15分）

```bash
# VS Code拡張機能（推奨）
# 以下をVS Code Extensions画面で検索・インストール
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- GitLens
```

### Git操作の基本（復習）

```bash
# 作業ブランチ作成
git checkout -b feature/your-feature-name

# コミット作成
git add .
git commit -m "feat: 機能の説明

詳細な説明をここに記載

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 📋 初級者向け開発フロー

### 新機能開発時の手順

1. **要件理解**（必須）
```bash
# CLAUDE.mdを必ず確認
cat CLAUDE.md | grep -A 5 -B 5 "重要"

# プロジェクト知識確認
cat PROJECT_KNOWLEDGE.md
```

2. **作業計画**
```
Claude Codeに以下のように依頼：

「[機能名]をMVP段階実装で開発したいです。
初級者なので、32K tokens制限内で以下の段階に分けて教えてください：

Stage 1: 型定義（どのような型が必要か）
Stage 2: ロジック（基本的な処理）
Stage 3: UI（画面の作り方）
Stage 4: 統合（全体を繋げる）

各段階で影響範囲と注意点も教えてください。
詳細は[CLAUDE_MVP_INSTRUCTION_GUIDE.md](CLAUDE_MVP_INSTRUCTION_GUIDE.md)を参照。」
```

3. **実装**
```bash
# 必ず型チェックしながら進める
npm run type-check

# リントチェックも定期的に
npm run lint
```

4. **確認**
```bash
# 品質チェック3点セット（必須）
npm run lint && npm run type-check && npm run build
```

### 初級者がよく陥る問題と対策

#### ❌ やりがちなミス
1. **型エラーを無視**: `any`で逃げる
2. **環境変数ミス**: `NEXT_PUBLIC_`の付け忘れ
3. **インポートパスミス**: 相対パス・絶対パスの混同
4. **非同期処理の理解不足**: `await`の付け忘れ

#### ✅ 正しいアプローチ
1. **型は必ず定義**: 不明な場合はClaude Codeに相談
2. **環境変数は慎重に**: `.env.local.example`を参照
3. **インポートは統一**: `@/`エイリアスを使用
4. **非同期は丁寧に**: エラーハンドリングも含める

## 🎓 レベルアップのための学習計画

### 段階1: 基礎固め（2週間）
- [ ] TypeScriptの型システム完全理解
- [ ] React Hooksの実践的な使い方
- [ ] Next.js App Routerの理解
- [ ] Supabaseの基本操作

### 段階2: 実践演習（3週間）
- [ ] 小さな機能追加（UI改善など）
- [ ] 占術アルゴリズムの理解・改良
- [ ] APIエンドポイントの追加
- [ ] エラーハンドリングの実装

### 段階3: 応用展開（3週間）
- [ ] パフォーマンス最適化
- [ ] セキュリティ考慮事項
- [ ] テスト実装
- [ ] デプロイ・CI/CD理解

## 🤝 Claude Codeとの効果的な協働方法（初級者向け）

### 良い質問の仕方

```
❌ 悪い例:
「エラーが出ました」

✅ 良い例:
「TypeScriptで以下のエラーが出ています：
[エラーメッセージの全文]

ファイル: src/types/divination.ts:25
実装しようとしていること: [具体的な説明]
これまでに試したこと: [試行した内容]

初級者なので、原因と解決方法を段階的に教えてください。」
```

### 学習しながら開発する方法

```
「[機能名]を実装しながら、[技術要素]について学習したいです。

MVP段階実装で進めたいので、以下のように分けてみました：
Stage 1: 基本的な型定義を学びながら作成（15K tokens以内）
Stage 2: ロジックの実装方法を学習（20K tokens以内）
Stage 3: UIの作り方を実践（15K tokens以内）
Stage 4: 全体統合とテスト（10K tokens以内）

各段階で32K tokens制限を守りながら、
TodoWriteで管理して進めましょう。」
```

## 📝 成長の記録

### 学習ログテンプレート

```markdown
## YYYY-MM-DD: [学習・実装内容]

### 今日の目標
- [ ] 目標1
- [ ] 目標2

### 実装したこと
- [具体的な成果物]

### 学んだこと
- [技術的な学び]
- [プロセスの学び]

### 次回への課題
- [改善点]
- [次に学ぶべきこと]

### つまずいた点と解決方法
- 問題: [問題の詳細]
- 解決: [解決方法]
- 学び: [今後活かせる知見]
```

## 🌟 中級者への道のり

### 中級者認定の目安
- [ ] TypeScriptエラーを自力で9割解決できる
- [ ] Supabaseスキーマ設計ができる
- [ ] Next.js APIルートを設計・実装できる
- [ ] Git操作（ブランチ、マージ）が問題なくできる
- [ ] Claude Codeと効率的に協働できる
- [ ] コードレビューで建設的な指摘ができる

### 中級者移行のタイミング
1. **自立した問題解決**: エラー解決の70%を自力で対応
2. **設計思考**: 「なぜそう実装するか」を説明できる
3. **品質意識**: テスト・リント・型チェックが習慣化
4. **協働能力**: レビューや相談を建設的にできる

**中級者になったら**: `ONBOARDING_GUIDE.md`（中級者向け）に進む

## 🚨 重要な注意事項

### 絶対に守ること
1. **品質チェック**: `lint && type-check && build`は必須
2. **環境変数**: 秘密情報は絶対にコミットしない
3. **型安全**: `any`の使用は最小限に
4. **学習記録**: 困った点は必ず記録して共有

### 困った時の相談手順
1. **まず自分で調べる**（15分程度）
2. **Claude Codeに具体的に質問**
3. **それでも解決しない場合はチームに相談**
4. **解決したら必ずPROJECT_KNOWLEDGE.mdに記録**

初級者から中級者への成長を応援しています！🎉