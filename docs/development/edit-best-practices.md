# 大規模ファイル編集のベストプラクティス

## 問題パターンと解決策

### 1. 大規模オブジェクト編集の落とし穴
**問題**: 長大なold_stringの完全一致が困難
- 空白・改行・インデントの微妙な違い
- 特殊文字のエスケープ問題
- ファイルサイズによる制約

**解決策**:
```bash
# 1. 事前調査
grep -n "object-key" file.ts
grep -n "^};" file.ts  # オブジェクト終端
tail -n 50 file.ts

# 2. 小さくユニークな部分を使用
# NG: 500行のオブジェクト全体
# OK: オブジェクトの最後の数行 + 次のオブジェクトの開始
```

### 2. 推奨編集パターン

#### パターンA: オブジェクト末尾への追加
```typescript
// old_string: 最後のプロパティの閉じ部分
    ]
  }
};

// 小アルカナ - ワンド（Wands）のメッセージ

// new_string: 新しいエントリを追加
    ]
  },

  'new-key': {
    // 新しいコンテンツ
  }
};

// 小アルカナ - ワンド（Wands）のメッセージ
```

#### パターンB: 行番号ベースの特定
1. `grep -n` で正確な行番号を取得
2. `Read` で該当箇所の前後を確認
3. 最小限のユニークな文字列で編集

### 3. MultiEditの活用シーン
- 同一ファイル内の複数箇所編集
- パターン的な変更（import文の更新など）
- リファクタリング作業

### 4. 失敗時の対処法
1. より小さな文字列で再試行
2. 行番号付近の内容を再確認
3. 別のユニークな箇所を探す

## チェックリスト
- [ ] 編集前にファイル構造を調査したか
- [ ] old_stringは十分に小さくユニークか
- [ ] 空白・改行は正確に一致しているか
- [ ] MultiEditの方が適切ではないか