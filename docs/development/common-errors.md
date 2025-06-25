# よくあるエラーと解決法

このドキュメントは、COSMIC ORACLEプロジェクトで頻繁に発生するエラーとその解決法をまとめたものです。

## 型エラー

### 1. Property does not exist on type
**エラー例:**
```
Property 'moon' does not exist on type 'EnvironmentData'
```

**原因:** 型定義の不一致、特にoptionalプロパティへの安全でないアクセス

**解決法:**
```typescript
// ❌ 悪い例
const moonPhase = environmentData.moon.phase;

// ✅ 良い例
const moonPhase = environmentData.moon?.phase || 0.5;
const moonPhase = environmentData.lunar?.phase ?? 0.5;
```

### 2. Type 'null' is not assignable to type
**エラー例:**
```
Type 'null' is not assignable to type 'string[]'
```

**原因:** null/undefinedの可能性を考慮していない

**解決法:**
```typescript
// ❌ 悪い例
const sessions: string[] = userData.sessions;

// ✅ 良い例
const sessions: string[] = userData.sessions || [];
const sessions: string[] = userData.sessions ?? [];
```

### 3. JSX element type 'JSX.Element' is not a constructor function
**エラー例:**
```
'JSX' refers to a value, but is being used as a type here
```

**原因:** JSX名前空間の使用

**解決法:**
```typescript
// ❌ 悪い例
const elements: { [key: string]: JSX.Element } = {};

// ✅ 良い例
const elements: { [key: string]: React.ReactElement } = {};
const elements: Record<string, React.ReactNode> = {};
```

## Hydrationエラー

### 1. Text content does not match server-rendered HTML
**原因:** サーバーとクライアントで異なる内容をレンダリング

**解決法:**
```typescript
// ❌ 悪い例
function Component() {
  return <div>{new Date().toLocaleTimeString()}</div>;
}

// ✅ 良い例
function Component() {
  const [time, setTime] = useState<string>('');
  
  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);
  
  return <div>{time || 'Loading...'}</div>;
}
```

### 2. localStorage is not defined
**原因:** SSR時にブラウザAPIを使用

**解決法:**
```typescript
// ❌ 悪い例
const saved = localStorage.getItem('key');

// ✅ 良い例
const [saved, setSaved] = useState<string | null>(null);

useEffect(() => {
  const value = localStorage.getItem('key');
  setSaved(value);
}, []);
```

## ビルドエラー

### 1. Module not found
**原因:** インポートパスの誤り、ファイルの不存在

**解決法:**
```typescript
// ❌ 悪い例
import { Component } from './component';  // .tsxが必要な場合あり

// ✅ 良い例
import { Component } from './component';
import { Component } from '@/components/component';
```

### 2. ESLint warnings
**よくある警告:**
- `'variable' is defined but never used`
- `React Hook useEffect has missing dependencies`

**解決法:**
```bash
# 自動修正可能な項目を修正
npm run lint -- --fix

# 特定のルールを無効化（慎重に使用）
// eslint-disable-next-line @typescript-eslint/no-unused-vars
```

## API・環境変数エラー

### 1. CORS Error
**原因:** クライアントから外部APIを直接呼び出し

**解決法:**
```typescript
// ❌ 悪い例（クライアントコンポーネント）
const response = await fetch('https://external-api.com/data');

// ✅ 良い例（APIルート経由）
// app/api/external/route.ts
export async function GET() {
  const response = await fetch('https://external-api.com/data');
  return Response.json(await response.json());
}

// クライアント
const response = await fetch('/api/external');
```

### 2. Environment variable undefined
**原因:** 環境変数の未設定、誤った命名

**解決法:**
```typescript
// ❌ 悪い例
const apiKey = process.env.API_KEY;  // クライアントでは使えない

// ✅ 良い例
const apiKey = process.env.NEXT_PUBLIC_API_KEY;  // クライアント用
const secretKey = process.env.SECRET_KEY;  // サーバー用のみ
```

## パフォーマンス問題

### 1. 重い計算の繰り返し
**解決法:**
```typescript
// ❌ 悪い例
function Component() {
  const expensiveResult = heavyCalculation(data);  // 毎回再計算
  
// ✅ 良い例
function Component() {
  const expensiveResult = useMemo(() => 
    heavyCalculation(data), [data]
  );
```

### 2. 不要な再レンダリング
**解決法:**
```typescript
// ❌ 悪い例
<Child onClick={() => handleClick(id)} />  // 毎回新しい関数

// ✅ 良い例
const handleChildClick = useCallback(() => {
  handleClick(id);
}, [id]);

<Child onClick={handleChildClick} />
```

## デバッグのコツ

### エラーメッセージを最後まで読む
```bash
# フルスタックトレースを確認
npm run dev 2>&1 | less
```

### 型エラーの関連ファイルを特定
```bash
# 型エラー包括チェック
npm run check:types
```

### ブラウザのコンソールを活用
```javascript
// デバッグ用の詳細ログ
console.log('Component render:', {
  props,
  state,
  environmentData,
  timestamp: new Date().toISOString()
});
```

### React Developer Toolsを使用
- Components タブで props/state を確認
- Profiler タブでパフォーマンスを分析

## 予防策

1. **型定義を先に書く**
   - インターフェースを定義してから実装
   - optional プロパティは明示的に指定

2. **早めにテスト**
   - 小さな単位で動作確認
   - `npm run check` を頻繁に実行

3. **エラーハンドリング**
   - try-catch で適切にエラーを捕捉
   - フォールバック値を用意

4. **ドキュメント化**
   - 複雑な処理にはコメントを追加
   - 型定義に JSDoc コメントを付与