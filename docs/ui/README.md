# COSMIC ORACLE UIドキュメント

## 概要

COSMIC ORACLEプロジェクトのUI要素マッピングシステムに関するドキュメントです。

## ドキュメント構成

```
docs/ui/
├── README.md                    # このファイル
├── screen-flow.md               # 画面フロー図と要素ID体系
└── element-maps/                # 各画面の詳細要素マップ
    ├── entry-page.md            # エントリー画面
    ├── dashboard-page.md        # ダッシュボード
    └── input-page.md            # 入力画面
```

## UI要素の指定方法

### 1. 要素IDによる指定

形式: `[画面プレフィックス]-[要素タイプ]-[機能名]`

例:
- `entry-input-password` - エントリー画面のパスワード入力
- `dashboard-button-numerology` - ダッシュボードの数秘術ボタン
- `input-nav-progress` - 入力画面のプログレスバー

### 2. コードでの使用方法

```typescript
import { generateUIProps, getElementByUIId } from '@/lib/ui-mapper';

// Reactコンポーネントでの使用
function MyButton() {
  return (
    <button {...generateUIProps('dashboard-button-numerology')}>
      数秘術
    </button>
  );
}

// DOM操作での使用
const element = getElementByUIId('entry-input-password');
if (element) {
  element.focus();
}
```

### 3. テストでの使用方法

```typescript
// Cypressテスト
cy.get('[data-ui-id="entry-button-enter"]').click();

// Jest/Testing Library
const button = screen.getByTestId('dashboard-button-integrated');
expect(button).toBeInTheDocument();
```

## インタラクティブマップの使用

### ローカルでの確認

1. ブラウザで `/ui-reference.html` を開く
2. 各画面の要素をクリックして詳細を確認
3. 検索ボックスで要素IDを検索

### 機能

- **タブ切り替え**: 各画面を簡単に切り替え
- **要素クリック**: 要素の詳細情報を表示
- **検索機能**: 要素IDで絍即検索
- **ハイライト**: 検索結果や選択中の要素を強調

## アクセシビリティガイドライン

### 必須属性

1. **インタラクティブ要素**
   - `aria-label` または適切なラベル
   - キーボードアクセシブル
   - フォーカス状態が明確

2. **フォーム要素**
   - 必須フィールドに `aria-required="true"`
   - エラーメッセージに `aria-live="polite"`
   - 適切な `label` 要素の関連付け

3. **ナビゲーション**
   - `role="navigation"` または `<nav>` 要素
   - プログレスバーに `role="progressbar"`

## レスポンシブ対応

### ブレークポイント

| デバイス | 幅 | 特徴 |
|--------|-----|------|
| モバイル | < 768px | 縦積みレイアウト、タブナビ |
| タブレット | 768-1023px | 2カラムグリッド |
| デスクトップ | ≥ 1024px | 3カラムグリッド |

### UI調整ガイドライン

1. **モバイル**
   - タップターゲットは44px以上
   - 文字サイズは16px以上
   - 余白は少なめに

2. **タブレット**
   - 2カラムレイアウト
   - サイドバーはスライド式

3. **デスクトップ**
   - 3カラムレイアウト
   - ホバーエフェクトを活用

## ユーティリティ関数

### ui-mapper.tsの主要機能

1. **generateElementId()** - 要素ID生成
2. **findElement()** - 要素検索
3. **getElementByUIId()** - DOM要素取得
4. **generateUIProps()** - React props生成
5. **validateAccessibility()** - アクセシビリティ検証
6. **analyzeNavigationFlow()** - ナビゲーション分析

## ベストプラクティス

1. **一貫性**
   - 命名規則に従う
   - 同じ機能には同じパターン

2. **明確性**
   - 要素IDから機能が推測できる
   - 複雑なセレクタを避ける

3. **保守性**
   - UIマップを常に最新に保つ
   - 変更時はドキュメントも更新

4. **テスタビリティ**
   - data-ui-idでテストを安定化
   - 要素の移動に強いテスト

## 関連ファイル

- `/docs/ui/screen-flow.md` - 画面フロー図
- `/docs/ui/element-maps/` - 各画面の詳細
- `/public/ui-reference.html` - インタラクティブマップ
- `/src/lib/ui-mapper.ts` - ユーティリティ関数

## 更新履歴

- 2025-06-25: 初版作成