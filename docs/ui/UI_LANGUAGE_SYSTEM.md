# UI共通言語システム - 長期運用ガイド

## 📍 システム概要

このUI共通言語システムは、プロジェクトが成長しても一貫性を保てるよう設計されています。

## 🔤 命名規則（不変のルール）

### 基本フォーマット
```
[画面コード]-[要素タイプ]-[機能名]
```

### 画面コード（拡張可能）
```typescript
// 現在の画面
entry     - エントリー画面
dash      - ダッシュボード  
input     - 入力画面
integrated - 統合占術結果

// 占術詳細（短縮形）
num       - 数秘術
tarot     - タロット
astro     - 占星術
iching    - 易経
runes     - ルーン
vedic     - ヴェーダ
nine      - 九星気学
feng      - 風水 (→ 四柱推命に変更)
celtic    - ケルト
kabbalah  - カバラ

// 将来の拡張例
profile   - プロフィール
settings  - 設定
history   - 履歴
payment   - 決済
admin     - 管理画面
```

### 要素タイプ（拡張可能）
```typescript
// 基本要素
button    - ボタン
link      - リンク
input     - 入力フィールド
select    - セレクトボックス
textarea  - テキストエリア

// コンテナ要素
card      - カード
section   - セクション
header    - ヘッダー
footer    - フッター
sidebar   - サイドバー

// 特殊要素
modal     - モーダル
toast     - トースト通知
chart     - グラフ
table     - テーブル
list      - リスト

// 将来の拡張例
widget    - ウィジェット
panel     - パネル
carousel  - カルーセル
```

## 🎯 位置指定システム

### グリッド位置
```
dash-grid[row=1,col=2]     // グリッドの1行2列目
dash-grid[2,3]             // 短縮形
```

### 相対位置
```
header-right               // ヘッダーの右側
sidebar-top                // サイドバーの上部
card-center                // カードの中央
footer-left                // フッターの左側
```

### リスト内位置
```
dash-card-list[0]          // 最初のカード
nav-menu-item[2]           // 3番目のメニュー項目
select-option[last]        // 最後のオプション
```

## 📝 バージョン管理

### 要素の追加
```typescript
// ui-mapper.ts に追加
export const UI_VERSION = "1.2.0";  // バージョン更新

// 新要素の追加例
"profile-button-edit": {
  added: "1.2.0",
  type: "button",
  description: "プロフィール編集ボタン"
}
```

### 要素の廃止
```typescript
// 廃止マーク（削除せずに記録）
"old-element-id": {
  deprecated: "1.2.0",
  replacement: "new-element-id",
  removedIn: "2.0.0"  // 予定
}
```

## 🔄 マイグレーション戦略

### 1. 後方互換性の維持
```typescript
// エイリアスシステム
const elementAliases = {
  "dashboard-btn-numerology": "dash-button-num",  // 旧→新
  "main-header": "dash-header-main"
};
```

### 2. 段階的移行
```typescript
// 警告付き移行
function getElement(id: string) {
  if (isDeprecated(id)) {
    console.warn(`UI要素 ${id} は廃止予定です。${getNewId(id)} を使用してください`);
  }
  return findElement(id);
}
```

## 📊 ドキュメント自動生成

### 変更履歴の自動記録
```bash
# UI要素の変更を検出して記録
npm run ui:track-changes

# マークダウンドキュメント生成
npm run ui:generate-docs
```

### 視覚的差分の生成
```bash
# スクリーンショット比較
npm run ui:visual-diff
```

## 🤝 チーム共有のベストプラクティス

### 1. 新要素追加時のフロー
1. `ui-mapper.ts`に追加
2. 該当する`element-maps/*.md`を更新
3. `ui-reference.html`を再生成
4. PRに変更内容を明記

### 2. コミュニケーション例
```
開発者A: 「profile-section-statsに新しいグラフを追加したい」
開発者B: 「了解、profile-chart-weeklyという IDで追加します」
```

### 3. レビュー時の確認事項
- [ ] 命名規則に従っているか
- [ ] 既存要素と重複していないか
- [ ] ドキュメントが更新されているか
- [ ] 後方互換性が保たれているか

## 🚀 将来の拡張計画

### Phase 1（現在）
- 基本的な画面と要素の定義
- 静的なマッピング

### Phase 2（計画中）
- 動的要素の追跡
- 状態別の要素定義
- アニメーション要素の管理

### Phase 3（将来）
- AIによる要素の自動検出
- 視覚的な要素ピッカー
- リアルタイムコラボレーション

## 📋 クイックリファレンス

### よく使う要素ID
```
// ナビゲーション
dash-nav-main          // メインナビゲーション
dash-nav-user          // ユーザーメニュー

// アクション
dash-button-refresh    // 更新ボタン
dash-button-logout     // ログアウト

// 占術カード
dash-card-num          // 数秘術カード
dash-card-tarot        // タロットカード
（他の占術も同様のパターン）

// 入力フォーム
input-field-name       // 名前入力
input-select-category  // カテゴリ選択
```

---

**このシステムにより、プロジェクトが大規模化しても、チーム全員が同じ言語でUI要素を参照できます。**