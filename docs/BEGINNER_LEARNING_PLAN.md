# 初級学習プラン - Zeami開発者への道のり

## 🎯 対象者

- プログラミング経験が浅い（6ヶ月未満）
- HTML/CSSは少し分かる
- JavaScriptを少し触ったことがある
- **Zeamiフレームワークで開発できるようになりたい**

## 📚 学習ゴール

**3ヶ月後の目標**: Claude Codeと協働して、簡単なWebアプリケーションを作れるようになる

**6ヶ月後の目標**: [初級者向けオンボーディングガイド](./ONBOARDING_GUIDE_BEGINNER.md)の前提知識を満たす

## 🗓️ 学習計画（3ヶ月 = 12週間）

### 📅 Month 1: 基礎固め（Week 1-4）

#### Week 1: JavaScript基礎
**目標**: モダンJavaScriptの基本構文を理解

**学習内容**
```javascript
// 変数・定数
const name = "Claude";
let age = 25;

// 関数
function greet(name) {
  return `Hello, ${name}!`;
}

// アロー関数
const greet2 = (name) => `Hello, ${name}!`;

// 配列・オブジェクト
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

// 分割代入
const { id, name } = users[0];
const [first, second] = users;
```

**課題**
- [ ] MDN Web Docs JavaScript基礎を読む（5時間）
- [ ] FreeCodeCamp JavaScript課題20問（10時間）
- [ ] 簡単な計算機プログラム作成（3時間）

**学習リソース**
- [MDN JavaScript基礎](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide)
- [JavaScript.info](https://ja.javascript.info/)

#### Week 2: DOM操作・イベント
**目標**: ブラウザでJavaScriptを動かせる

**学習内容**
```javascript
// DOM要素の取得
const button = document.getElementById('myButton');
const items = document.querySelectorAll('.item');

// イベントリスナー
button.addEventListener('click', function() {
  console.log('クリックされました');
});

// 要素の作成・追加
const newDiv = document.createElement('div');
newDiv.textContent = 'Hello World';
document.body.appendChild(newDiv);
```

**課題**
- [ ] ToDoリストアプリ作成（HTML/CSS/JS）（15時間）
- [ ] インタラクティブな計算機作成（5時間）

#### Week 3: ES6+・非同期処理
**目標**: モダンJavaScriptの重要機能を理解

**学習内容**
```javascript
// Promise
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data));

// async/await
async function getUsers() {
  const response = await fetch('/api/users');
  const data = await response.json();
  return data;
}

// 分割代入・スプレッド演算子
const { name, ...rest } = user;
const newArray = [...oldArray, newItem];

// テンプレートリテラル
const message = `こんにちは、${name}さん！`;
```

**課題**
- [ ] 天気APIを使ったアプリ作成（10時間）
- [ ] Promise/async-awaitの練習問題（5時間）

#### Week 4: Node.js・npm基礎
**目標**: Node.js環境でJavaScriptを実行できる

**学習内容**
```bash
# Node.js確認
node --version
npm --version

# パッケージ管理
npm init -y
npm install lodash
npm install -D nodemon

# スクリプト実行
npm run start
npm run dev
```

**課題**
- [ ] Node.js基本チュートリアル（8時間）
- [ ] npmパッケージを使った簡単なプロジェクト（7時間）

**月末チェック**
- [ ] JavaScriptの基本構文が理解できる
- [ ] DOMを操作してWebページを動的にできる
- [ ] 非同期処理（Promise/async-await）が書ける
- [ ] Node.js・npmの基本操作ができる

---

### 📅 Month 2: React・TypeScript入門（Week 5-8）

#### Week 5: React基礎
**目標**: Reactコンポーネントの基本を理解

**学習内容**
```jsx
// 関数コンポーネント
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// useState
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  );
}
```

**課題**
- [ ] React公式チュートリアル完走（10時間）
- [ ] カウンターアプリ作成（3時間）
- [ ] ToDoアプリをReactで作り直し（7時間）

**学習リソース**
- [React公式ドキュメント](https://ja.react.dev/)
- [React入門 - 基礎から実践まで](https://zenn.dev/likr/articles/6be53ca64f29aa035f07)

#### Week 6: React Hooks・状態管理
**目標**: useEffect・カスタムフックを理解

**学習内容**
```jsx
// useEffect
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
  
  if (!user) return <div>Loading...</div>;
  
  return <div>{user.name}</div>;
}

// カスタムフック
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  
  return { count, increment, decrement };
}
```

**課題**
- [ ] APIを使ったユーザー一覧アプリ（12時間）
- [ ] カスタムフックを作る練習（5時間）

#### Week 7: TypeScript基礎
**目標**: TypeScriptでJavaScriptに型を付けられる

**学習内容**
```typescript
// 基本型
let name: string = "Claude";
let age: number = 25;
let isActive: boolean = true;

// 配列・オブジェクト
let numbers: number[] = [1, 2, 3];
let users: { id: number; name: string }[] = [];

// インターフェース
interface User {
  id: number;
  name: string;
  email?: string; // オプショナル
}

// 関数の型
function greet(user: User): string {
  return `Hello, ${user.name}!`;
}

// ジェネリクス
function identity<T>(arg: T): T {
  return arg;
}
```

**課題**
- [ ] TypeScript公式ハンドブック（基礎部分）（8時間）
- [ ] JavaScriptプロジェクトをTypeScript化（7時間）

**学習リソース**
- [TypeScript公式ハンドブック（日本語版）](https://typescript-jp.gitbook.io/deep-dive/)
- [サバイバルTypeScript](https://typescriptbook.jp/)

#### Week 8: React + TypeScript
**目標**: React コンポーネントにTypeScriptを適用

**学習内容**
```tsx
// Props の型定義
interface WelcomeProps {
  name: string;
  age?: number;
}

function Welcome({ name, age }: WelcomeProps) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>Age: {age}</p>}
    </div>
  );
}

// State の型定義
interface User {
  id: number;
  name: string;
  email: string;
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // ...
}

// イベントハンドラーの型
function Form() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ...
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ...
  };
}
```

**課題**
- [ ] ToDoアプリをTypeScript化（10時間）
- [ ] ユーザー管理アプリ（React + TypeScript）（10時間）

**月末チェック**
- [ ] Reactコンポーネントが作れる
- [ ] useState・useEffectが使える
- [ ] TypeScriptで基本的な型定義ができる
- [ ] React + TypeScriptでアプリが作れる

---

### 📅 Month 3: Next.js・開発環境（Week 9-12）

#### Week 9: Next.js基礎
**目標**: Next.jsでWebアプリケーションを作れる

**学習内容**
```bash
# Next.jsプロジェクト作成
npx create-next-app@latest my-app --typescript --tailwind --app

# ディレクトリ構造
app/
├── page.tsx          # ホームページ
├── about/
│   └── page.tsx     # /about ページ
└── api/
    └── hello/
        └── route.ts # /api/hello エンドポイント
```

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main>
      <h1>Welcome to Next.js!</h1>
    </main>
  );
}

// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: 'Hello World' });
}
```

**課題**
- [ ] Next.js Learn コース完走（15時間）
- [ ] 個人ポートフォリオサイト作成（5時間）

**学習リソース**
- [Next.js Learn](https://nextjs.org/learn)
- [Next.js公式ドキュメント](https://nextjs.org/docs)

#### Week 10: データベース・Supabase基礎
**目標**: データベースを使ったアプリケーションの基本

**学習内容**
```sql
-- 基本的なSQL
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
SELECT * FROM users WHERE name = 'Alice';
UPDATE users SET name = 'Bob' WHERE id = 1;
DELETE FROM users WHERE id = 1;
```

```typescript
// Supabase クライアント
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'your-project-url',
  'your-anon-key'
);

// データ取得
const { data, error } = await supabase
  .from('users')
  .select('*');

// データ挿入
const { data, error } = await supabase
  .from('users')
  .insert({ name: 'Alice', email: 'alice@example.com' });
```

**課題**
- [ ] SQL基礎学習（8時間）
- [ ] Supabaseチュートリアル（7時間）
- [ ] ブログアプリ（Next.js + Supabase）（10時間）

#### Week 11: Git・GitHub
**目標**: バージョン管理とコラボレーションの基本

**学習内容**
```bash
# Git基本操作
git init
git add .
git commit -m "初回コミット"

# リモートリポジトリ
git remote add origin https://github.com/username/repo.git
git push -u origin main

# ブランチ操作
git checkout -b feature/new-feature
git merge feature/new-feature

# 履歴確認
git log --oneline
git status
git diff
```

**課題**
- [ ] Git基礎チュートリアル（5時間）
- [ ] GitHubにプロジェクトをアップロード（3時間）
- [ ] Pull Request作成練習（2時間）

#### Week 12: 統合・実践プロジェクト
**目標**: 学んだ技術を統合してアプリケーション作成

**最終プロジェクト**: **ミニブログシステム**
```typescript
// 必要な機能
interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

// 実装する機能
- ブログ記事一覧表示
- 記事詳細ページ
- 記事作成フォーム
- レスポンシブデザイン（Tailwind CSS）
- データベース連携（Supabase）
```

**課題**
- [ ] 要件定義・設計（3時間）
- [ ] 実装（15時間）
- [ ] デプロイ（Vercel）（2時間）

**月末チェック・総仕上げ**
- [ ] Next.jsでアプリケーションが作れる
- [ ] データベース（Supabase）を使える
- [ ] Gitでバージョン管理ができる
- [ ] 作品をGitHubで公開できる
- [ ] **[初級者向けオンボーディングガイド](./ONBOARDING_GUIDE_BEGINNER.md)の前提知識をクリア**

---

## 🎯 達成度チェック

### Month 1 終了時
```
✅ 自己評価チェックリスト
- [ ] JavaScriptの基本文法が理解できる
- [ ] DOM操作でWebページを動的にできる
- [ ] fetch()でAPIからデータを取得できる
- [ ] npm でパッケージ管理ができる
- [ ] Node.js環境でJavaScriptを実行できる
```

### Month 2 終了時
```
✅ 自己評価チェックリスト
- [ ] Reactコンポーネントが作成できる
- [ ] useState・useEffectが使える
- [ ] TypeScriptで型定義ができる
- [ ] React + TypeScript でアプリが作れる
- [ ] Propsを使ってコンポーネント間でデータを渡せる
```

### Month 3 終了時（最終目標）
```
✅ 自己評価チェックリスト
- [ ] Next.jsでWebアプリケーションが作れる
- [ ] Supabaseでデータベース操作ができる
- [ ] Gitでバージョン管理ができる
- [ ] VercelにWebアプリをデプロイできる
- [ ] 簡単なブログシステムが一人で作れる

🎯 達成目標
- [ ] [初級者向けオンボーディングガイド](./ONBOARDING_GUIDE_BEGINNER.md)の前提知識をクリア
- [ ] URANAI-01のようなプロジェクトを理解できる
- [ ] Claude Codeと基本的な協働ができる
```

## 📚 追加学習リソース

### 無料リソース
- **JavaScript**: [freeCodeCamp](https://www.freecodecamp.org/)
- **React**: [React公式ドキュメント](https://ja.react.dev/)
- **TypeScript**: [TypeScript Deep Dive](https://typescript-jp.gitbook.io/deep-dive/)
- **Next.js**: [Next.js Learn](https://nextjs.org/learn)

### 有料リソース（推奨）
- **Udemy**: 「モダンJavaScriptの基礎から始める挫折しないためのReact入門」
- **Udemy**: 「TypeScript入門 完全理解」
- **Progate**: JavaScript・React コース

### 質問・コミュニティ
- **Stack Overflow**: 技術的な質問
- **Zenn**: 日本語の技術記事
- **Discord**: React・TypeScript コミュニティ

## 🚀 卒業後の道筋

### ステップアップ路線
1. **初級クリア** → [初級者向けオンボーディングガイド](./ONBOARDING_GUIDE_BEGINNER.md)
2. **基礎習得** → [中級者向けオンボーディングガイド](./ONBOARDING_GUIDE.md)
3. **実践経験** → URANAI-01レベルのプロジェクト参加
4. **上級レベル** → 独立したプロジェクトリード

### 専門領域の選択
- **フロントエンド特化**: React・Next.js・UI/UX
- **バックエンド特化**: Node.js・データベース・API設計
- **フルスタック**: 全領域をバランス良く
- **モバイル開発**: React Native・Flutter

## 💪 成功のコツ

### 学習習慣
- **毎日コードを書く**: 最低30分/日
- **アウトプット重視**: 理解より実装を優先
- **エラーを恐れない**: エラーから学ぶ姿勢
- **完璧を目指さない**: 動くものを作ることを優先

### 効率的な学習法
- **ポモドーロテクニック**: 25分集中 + 5分休憩
- **アクティブラーニング**: 手を動かしながら学習
- **スパイラル学習**: 同じ内容を何度も復習
- **ピアラーニング**: 他の学習者と情報交換

### モチベーション維持
- **小さな成功を積み重ねる**: 毎週完成させる
- **進捗を見える化**: GitHubに毎日コミット
- **作品を公開**: ポートフォリオサイトで発信
- **目標を明確化**: 3ヶ月後・6ヶ月後のビジョン

この学習プランを完了すれば、Zeamiフレームワークでの開発に参加する準備が整います。頑張ってください！🚀