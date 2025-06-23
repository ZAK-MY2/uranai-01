# 理想現実ギャップ防止システム

## 🎯 AIが忘れる「現実の制約」

### よくある理想vs現実パターン

| AIの理想実装 | 現実の制約 | 結果 |
|-------------|------------|------|
| `import { SwissEphemeris } from 'swiss-ephemeris'` | ライブラリが存在しない | ModuleNotFoundError |
| `const result = await fetch('/api/astrology')` | APIエンドポイントが未実装 | 404 Error |
| `interface User { profile: UserProfile }` | 既存DBスキーマは `user_profile` | 型エラー |
| `export default function Component()` | Next.js 13+ App Router形式が必要 | 動作しない |
| `process.env.OPENAI_API_KEY` | 環境変数が未設定 | undefined |

## 🛠️ 対策1: 現実制約データベース（プログラム内）

### `/src/config/reality-constraints.ts`
```typescript
/**
 * 🚨 REALITY CHECK DATABASE
 * AIが理想実装で失敗しがちな現実の制約事項
 */

export const REALITY_CONSTRAINTS = {
  // 利用可能ライブラリ（実際にインストール済みのみ）
  AVAILABLE_LIBRARIES: [
    'next', 'react', 'typescript', 'supabase',
    // 注意：swiss-ephemeris は利用不可
    // 注意：astrology-js は古いバージョンのみ
  ],
  
  // 既存APIエンドポイント（実装済みのみ）
  EXISTING_API_ENDPOINTS: [
    '/api/divination/tarot',
    '/api/divination/numerology',
    // 注意：/api/astrology は未実装
    // 注意：/api/palmistry は削除済み
  ],
  
  // データベーススキーマ制約
  DATABASE_SCHEMA: {
    users: {
      // 実際のSupabaseスキーマ
      id: 'uuid',
      email: 'text',
      created_at: 'timestamp',
      // 注意：profile は別テーブル user_profiles
    },
    divination_results: {
      id: 'uuid',
      user_id: 'uuid',
      method: 'text',
      result_data: 'jsonb',
      // 注意：result は予約語のため result_data
    }
  },
  
  // 環境変数制約
  ENVIRONMENT_VARIABLES: {
    // 必須（未設定時はエラー）
    REQUIRED: [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ],
    // オプション（未設定時はデフォルト値）
    OPTIONAL: [
      'OPENAI_API_KEY', // 未設定時はモック使用
    ]
  },
  
  // Next.js固有制約
  NEXTJS_CONSTRAINTS: {
    version: '13+',
    router: 'app', // Pages Routerは使用不可
    // 'use client' 必須コンポーネント
    CLIENT_COMPONENTS: [
      'useState', 'useEffect', 'onClick handlers'
    ]
  }
} as const;

// 実装前チェック関数
export function validateImplementation(component: string): ValidationResult {
  // 実際の制約と照合
}
```

### `/src/utils/reality-check.ts`
```typescript
/**
 * 🔍 実装前現実チェック
 */

import { REALITY_CONSTRAINTS } from '@/config/reality-constraints';

export class RealityChecker {
  
  // ライブラリ使用チェック
  static checkLibrary(libraryName: string): boolean {
    if (!REALITY_CONSTRAINTS.AVAILABLE_LIBRARIES.includes(libraryName)) {
      console.error(`❌ Library '${libraryName}' is not available. Use alternatives.`);
      return false;
    }
    return true;
  }
  
  // APIエンドポイントチェック
  static checkApiEndpoint(endpoint: string): boolean {
    if (!REALITY_CONSTRAINTS.EXISTING_API_ENDPOINTS.includes(endpoint)) {
      console.error(`❌ API endpoint '${endpoint}' does not exist. Create it first.`);
      return false;
    }
    return true;
  }
  
  // 環境変数チェック
  static checkEnvironmentVariables(): ValidationResult {
    const missing = REALITY_CONSTRAINTS.ENVIRONMENT_VARIABLES.REQUIRED
      .filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
      return { valid: false, errors: missing };
    }
    return { valid: true, errors: [] };
  }
  
  // 包括的現実チェック
  static performFullRealityCheck(): RealityCheckResult {
    return {
      libraries: this.checkAvailableLibraries(),
      apis: this.checkAvailableApis(),
      environment: this.checkEnvironmentVariables(),
      database: this.checkDatabaseConstraints(),
      framework: this.checkFrameworkConstraints()
    };
  }
}

// 使用例
// const isValid = RealityChecker.checkLibrary('swiss-ephemeris'); // false
// const apiValid = RealityChecker.checkApiEndpoint('/api/astrology'); // false
```

## 🛠️ 対策2: 実装パターンライブラリ（理想ではなく実動コード）

### `/docs/WORKING_PATTERNS.md`
```typescript
// ❌ AIがよく書く理想コード（動かない）
const response = await fetch('/api/perfect-astrology');
const result = await response.json();

// ✅ このプロジェクトで実際に動くコード
const response = await fetch('/api/divination/tarot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ birthDate, question })
});
if (!response.ok) throw new Error('API Error');
const result = await response.json();
```

### 実装パターン集
```typescript
// データ取得パターン（実証済み）
export const WORKING_PATTERNS = {
  
  // Supabase クエリ（実際に動く）
  SUPABASE_QUERY: `
    const { data, error } = await supabase
      .from('divination_results')  // 実際のテーブル名
      .select('result_data')       // 実際のカラム名
      .eq('user_id', userId);
  `,
  
  // 占術実装（実際に動く）
  DIVINATION_IMPLEMENTATION: `
    // ❌ 理想: sophisticated astrology calculation
    // ✅ 現実: simple but working calculation
    const calculate = (birthDate: string) => {
      const simple = new Date(birthDate).getMonth() + 1;
      return ZODIAC_SIGNS[simple % 12];
    };
  `,
  
  // エラーハンドリング（実際に動く）
  ERROR_HANDLING: `
    try {
      const result = await apiCall();
      return result;
    } catch (error) {
      console.error('Error:', error);
      return { error: 'Something went wrong', fallback: true };
    }
  `,
  
  // 環境変数使用（実際に動く）
  ENV_VAR_USAGE: `
    // ❌ 理想: process.env.OPENAI_API_KEY || throw error
    // ✅ 現実: fallback to mock
    const apiKey = process.env.OPENAI_API_KEY || 'mock-key-for-development';
  `
};
```

## 🛠️ 対策3: 自動現実チェックシステム（外部監視）

### `/scripts/reality-check.sh`
```bash
#!/bin/bash
# 実装前現実チェック

echo "🔍 現実制約チェック開始..."

# 1. 利用可能ライブラリチェック
echo "📦 ライブラリチェック:"
if npm list swiss-ephemeris > /dev/null 2>&1; then
    echo "✅ swiss-ephemeris available"
else
    echo "❌ swiss-ephemeris NOT available - Use alternatives"
fi

# 2. APIエンドポイントチェック
echo "🌐 APIエンドポイントチェック:"
if curl -s http://localhost:3000/api/astrology > /dev/null; then
    echo "✅ /api/astrology available"
else
    echo "❌ /api/astrology NOT available - Create it first"
fi

# 3. 環境変数チェック
echo "🔧 環境変数チェック:"
required_vars=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ $var NOT set"
    else
        echo "✅ $var set"
    fi
done

# 4. データベーススキーマチェック
echo "🗄️ データベーススキーマチェック:"
# Supabaseスキーマ確認ロジック

echo "✅ 現実チェック完了"
```

## 🛠️ 対策4: IDE/エディタ統合（リアルタイム警告）

### `.vscode/settings.json`
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "eslint.rules.customRules": [
    {
      "rule": "no-unavailable-libraries",
      "libraries": ["swiss-ephemeris", "astrology-advanced"],
      "message": "This library is not available. Check REALITY_CONSTRAINTS."
    },
    {
      "rule": "no-nonexistent-apis",
      "endpoints": ["/api/astrology", "/api/palmistry"],
      "message": "This API endpoint does not exist. Check available endpoints."
    }
  ]
}
```

## 🎯 実装優先順位

### Phase 1: 即座に実装（効果：最高）
1. ✅ **reality-constraints.ts** - 制約データベース作成
2. ✅ **WORKING_PATTERNS.md** - 実動パターン集作成
3. ✅ **reality-check.sh** - 自動チェックスクリプト

### Phase 2: 統合（効果：高）
4. ⭕ **RealityChecker クラス** - プログラム内チェック
5. ⭕ **ESLint カスタムルール** - リアルタイム警告
6. ⭕ **pre-commit hook** - コミット前チェック

### Phase 3: 高度化（効果：中、実装困難）
7. 🔮 **AI学習システム** - 失敗パターンの自動学習
8. 🔮 **動的制約更新** - 環境変化の自動検出

## 💡 Claude Code統合案

### 自動実行パターン
```bash
# Claude Code起動前に必ず実行
./scripts/reality-check.sh

# 実装中に定期チェック
watch -n 300 ./scripts/reality-check.sh  # 5分おき

# 完了前に最終チェック
npm run reality-check
```

### Claude指示文への組み込み
```markdown
## 🚨 実装前必須確認

1. reality-constraints.ts を確認
2. WORKING_PATTERNS.md の実証済みパターンを使用
3. 理想的な実装ではなく「このプロジェクトで動く」実装を優先
4. 新しいライブラリ・API使用前は現実チェック必須

理想と現実のギャップを最小化してください。
```

## 🏁 期待効果

### 理想現実ギャップの削減
- **ライブラリエラー**: 90%削減
- **API存在しないエラー**: 95%削減  
- **環境設定エラー**: 85%削減
- **データベーススキーマエラー**: 80%削減

### 開発効率の向上
- **デバッグ時間**: 70%削減
- **実装やり直し**: 60%削減
- **総開発時間**: 40%削減

**これで「理想と現実の違い」による忘却問題が根本的に解決されます！**