# 🚨 再発防止チェックリスト

## 🎯 開発開始前の必須確認

### TypeScript設定確認
- [ ] `strict: true` が有効
- [ ] `noImplicitAny: true` が有効  
- [ ] ESLintで `@typescript-eslint/no-explicit-any: "error"` 設定済み

### 依存関係の事前確認
- [ ] サーバー専用ライブラリ（swisseph等）はwebpack externalsで分離
- [ ] `'use client'` / `'use server'` の適切な配置
- [ ] JSXとTypeScriptファイルの責務分離

### アーキテクチャ検証
- [ ] 循環依存の回避設計
- [ ] データとプレゼンテーションの分離
- [ ] エラーハンドリング戦略の明確化

## 🔧 コーディング時の注意点

### Template Literal使用禁止パターン
```typescript
// ❌ 禁止: 動的文字列でのtemplate literal
const message = `${variable1}と${variable2}`;

// ✅ 推奨: 文字列結合
const message = variable1 + 'と' + variable2;
const message = [variable1, 'と', variable2].join('');
```

### サーバー/クライアント分離
```typescript
// ❌ 禁止: サーバーサイドでJSX
// TypeScriptファイルでReact.ReactNode使用

// ✅ 推奨: アイコンは文字列で保存
interface DisplayData {
  iconName: string; // 'Heart', 'Star' etc.
  // icon: React.ReactNode; <- これは禁止
}
```

### 型定義の厳密化
```typescript
// ❌ 回避: any型の使用
function process(data: any): any { }

// ✅ 推奨: 厳密な型定義
interface ProcessData {
  id: string;
  value: number;
}
function process(data: ProcessData): ProcessedResult { }
```

## 🧪 ビルド前の必須チェック

### コマンド実行順序
```bash
# 1. リント確認
npm run lint

# 2. 型チェック
npm run type-check  

# 3. ビルド確認
npm run build

# 4. テスト実行（実装後）
npm run test
```

### エラー対処の優先順位
1. **Type errors** → 包括的修正（個別修正禁止）
2. **Import errors** → 依存関係の確認
3. **Build errors** → webpack設定の見直し
4. **Runtime errors** → エラーハンドリングの実装

## 🔄 品質管理プロセス

### プリコミットフック設定
```bash
# husky設定
npm install --save-dev husky lint-staged

# .husky/pre-commit
npm run lint
npm run type-check
npm run build
```

### 継続的ドキュメント化
- [ ] 重要な決定を開発ログに記録
- [ ] アーキテクチャ変更時は設計書更新
- [ ] 問題発生時は再発防止策を明記

### 定期レビュー実施
- [ ] 週次: 技術負債の確認
- [ ] 月次: アーキテクチャの見直し
- [ ] 四半期: 全面的なリファクタリング検討

## 🚀 デプロイ前の最終確認

### 本番環境準備
- [ ] 環境変数の設定完了
- [ ] セキュリティヘッダーの設定
- [ ] パフォーマンス最適化の実装
- [ ] エラー監視システムの設定

### 運用開始後の監視
- [ ] エラーログの定期確認
- [ ] パフォーマンス指標の監視
- [ ] ユーザーフィードバックの収集
- [ ] セキュリティ脆弱性の定期チェック

---

**このチェックリストは各開発サイクルで必ず実行し、問題の早期発見・予防に努めること**