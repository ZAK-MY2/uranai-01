# ORACLE ECHO 🔮
**高精度AI占いシステム - 10占術統合プラットフォーム**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue) ![Next.js](https://img.shields.io/badge/Next.js-15-black)

## 🌟 プロジェクト概要

ORACLE ECHOは、10種類の占術システムとリアルタイム環境データを統合した、商用グレードのAI占いプラットフォームです。著名占術師の研究に基づく高品質メッセージシステムを搭載し、1年間重複のない本格的な占い体験を提供します。

### ✨ 主要機能
- 🔮 **10占術システム**: 数秘術、タロット、西洋占星術、ルーン、易経、九星気学、四柱推命、カバラ、ヴェーダ占星術、ケルト占星術
- 🌍 **リアルタイム環境連携**: 気象庁API、天体データ、月相情報
- 🎨 **コズミックUI**: レスポンシブ対応、美しいアニメーション
- 🧠 **高品質メッセージ**: 5名の著名占術師研究に基づく自然な表現
- ⚡ **高速計算**: 商用グレード占術エンジン
- 🛡️ **型安全**: TypeScript完全対応

## 🚀 クイックスタート

### 開発環境セットアップ
```bash
# プロジェクトクローン
cd "/Users/masato-mba2024/Develop/Zeami-1 ZAK/projects/uranai-01"

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local
# 必要なAPIキーを設定

# 開発サーバー起動
npm run dev
```

### アクセス
- **開発**: http://localhost:3000
- **エントリーポイント**: `/entry` (デモモード)
- **ダッシュボード**: `/dashboard`
- **パラメータ入力**: `/input`

## 🎯 占術システム

### 実装済み占術（全10種類）
| 占術 | エンジン | メッセージ | 特徴 |
|------|----------|-----------|------|
| 🔢 数秘術 | ✅ | 🌟 高品質 | ピタゴラス式、マスターナンバー対応 |
| 🃏 タロット | ✅ | ✅ | ライダー・ウェイト版78枚 |
| ⭐ 西洋占星術 | ✅ | ✅ | プラシダス・ハウスシステム |
| 🪨 ルーン | ✅ | ✅ | エルダー・フサルク24文字 |
| ☯️ 易経 | ✅ | ✅ | 64卦完全対応 |
| 🌟 九星気学 | ✅ | ✅ | 方位・時間考慮 |
| 🏛️ 四柱推命 | ✅ | ✅ | 十干十二支完全計算 |
| 🔯 カバラ | ✅ | ✅ | 生命の樹、ヘブライ文字 |
| 🕉️ ヴェーダ占星術 | ✅ | ✅ | ナクシャトラ、ダシャー |
| 🌿 ケルト占星術 | ✅ | ✅ | 樹木、動物、色彩対応 |

## 🧠 Claude開発支援システム

### 忘却防止・制約克服
ORACLE ECHOには、Claude開発者向けの革新的な支援システムを搭載：

```bash
# 新セッション開始時
./scripts/claude-context-recovery.sh

# 記憶力強化システム
./scripts/claude-memory-booster.sh start

# 大規模ファイル対応
./scripts/claude-memory-booster.sh smart-read large-file.ts 100
```

### 完全引継システム
- 📋 **HANDOVER_GUIDE.md**: 即座実行可能な完全引継書
- 🧠 **コンテキスト復元**: 自動状態復旧スクリプト
- 📊 **制約対策**: 32K token制限・読み取り制限の克服
- 💾 **状態保存**: セッション間の完全な継続性

## 📊 技術スタック

### フロントエンド
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI**: カスタムコンポーネント + ガラスモーフィズム

### バックエンド
- **Database**: Supabase (PostgreSQL)
- **Auth**: Demo mode (本格実装準備済み)
- **APIs**: 気象庁、NAOJ、月相計算
- **Monitoring**: カスタム監視システム

## 🔧 開発コマンド

```bash
# 開発
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド
npm run start        # 本番サーバー起動

# 品質チェック  
npm run lint         # ESLint実行
npm run type-check   # TypeScript型チェック（実装予定）

# ユーティリティ
npm run clean        # キャッシュクリア
npm test             # テスト実行（実装予定）
```

## 📈 ロードマップ

### Phase 1 (完了) ✅
- [x] 全10占術システム実装
- [x] 高品質メッセージシステム  
- [x] 環境データ連携
- [x] レスポンシブUI完成

### Phase 2 (実行中) 🔄
- [ ] 他占術のメッセージ品質向上
- [ ] エラーハンドリング強化
- [ ] パフォーマンス最適化
- [ ] 最終デザイン磨き込み

### Phase 3 (計画中) 📅
- [ ] 本格認証システム
- [ ] 有料プラン機能
- [ ] 多言語対応（英語・中国語）
- [ ] モバイルアプリ展開

## 📞 サポート・リソース

### ドキュメント
- 📋 **HANDOVER_GUIDE.md**: 完全引継書
- 📖 **CLAUDE.md**: 開発ガイドライン  
- 📚 **docs/logs/**: 詳細開発履歴
- 🔧 **scripts/**: ユーティリティツール

### 外部リソース
- [気象庁API](https://www.jma.go.jp/)
- [NAOJ天体データ](https://eco.mtk.nao.ac.jp/)
- [Next.js 15ドキュメント](https://nextjs.org/docs)

## 📄 ライセンス

MIT License - 商用利用可能

---

## 🎉 特別な感謝

このプロジェクトは、以下の皆様の知恵と洞察により実現しました：

- **占術研究**: 石井ゆかり、鏡リュウジ、河合隼雄、しいたけ、yuji各氏の素晴らしい作品と思想
- **技術基盤**: Next.js、Supabase、TypeScriptコミュニティ
- **データ提供**: 気象庁、国立天文台等の公的機関
- **継続開発**: Claude AI開発支援システムの革新

**ORACLE ECHOで、あなたの人生に新しい洞察と可能性を。** ✨

---

*作成日: 2025-06-25 | 最終更新: 2025-06-25 | バージョン: 1.0.0*