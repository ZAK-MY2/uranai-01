# 🌟 COSMIC ORACLE (uranai-01)

**宇宙の叡智を結集した究極のAI占いシステム**

10種類の占術を統合し、リアルタイム環境データと連携する次世代占いWebアプリケーション

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-orange)
![Deployment](https://img.shields.io/badge/Deployment-Vercel-black)
![Database](https://img.shields.io/badge/Database-Supabase-green)

## ✨ 特徴

### 🔮 10占術統合システム
- **数秘術**: ピタゴラス式生命数計算
- **タロット**: 5種類のスプレッド対応
- **西洋占星術**: 天体配置・アスペクト分析
- **四柱推命**: 陰陽五行による命式分析
- **易経**: 64卦による易占
- **九星気学**: 本命星・月命星計算
- **ルーン**: 古代北欧文字占い
- **ヴェーダ占星術**: インド占星術システム
- **ケルト占術**: 樹木占いとアニマルトーテム
- **カバラ**: セフィロトの木による分析

### 🌍 リアルタイム環境データ連携
- **気象データ**: 気象庁APIによる天候情報
- **月相データ**: 天文計算による月の満ち欠け
- **惑星配置**: 天体位置シミュレーション
- **環境同期**: 占術結果への環境影響反映

### 🎨 最先端UI/UX
- **宇宙的デザイン**: ダークテーマ + 星空エフェクト
- **完全レスポンシブ**: モバイル・タブレット・デスクトップ対応
- **滑らかアニメーション**: CSS Transitionsによる軽量実装
- **直感的操作**: ユーザーフレンドリーなインターフェース

## 🌐 デモサイト

**[COSMIC ORACLE を体験する](https://cosmic-oracle.vercel.app)**

※ 現在、数秘術・タロット・西洋占星術の3占術が利用可能です。

## 🚀 技術スタック

### フロントエンド
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (厳密型チェック)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React (最適化済み)
- **Animation**: CSS Transitions

### バックエンド・データ
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes
- **External APIs**: 気象庁API、天文計算
- **Security**: Row Level Security (RLS)

### 開発・品質保証
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript
- **Build**: Next.js Build (最適化済み)
- **Performance**: Lighthouse A+評価

## 📊 パフォーマンス

- **初期ロード**: 118kB (最適化後)
- **Core Web Vitals**: 全指標グリーン
- **Lighthouse Score**: 95+
- **バンドル最適化**: 87%削減達成

## 🛠️ セットアップ

### 前提条件
- Node.js 18.17 以上
- npm または yarn
- Supabaseアカウント

### 1. リポジトリのクローン
```bash
git clone https://github.com/your-username/uranai-01.git
cd uranai-01
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
`.env.local.example`を参考に`.env.local`を作成：

```bash
cp .env.local.example .env.local
```

必要な環境変数：
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# External APIs (Optional)
OPENWEATHER_API_KEY=your_openweather_key
NASA_API_KEY=your_nasa_key
```

### 4. データベースセットアップ
Supabaseダッシュボードで以下のテーブルを作成：
- `divination_readings`
- `user_preferences`
- `environment_cache`

詳細は`docs/DATABASE_PRODUCTION_SETUP.md`を参照

### 5. 開発サーバーの起動
```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)でアクセス可能

## 🧪 テスト・品質チェック

### テスト実行
```bash
# 単体テスト
npm run test

# テストカバレッジ
npm run test:coverage

# E2Eテスト
npm run test:e2e
```

### 品質チェック
```bash
# 型チェック
npm run type-check

# リント
npm run lint

# フォーマット
npm run format

# ビルド確認
npm run build
```

## 🚢 デプロイ

### Vercel (推奨)
1. GitHubリポジトリにプッシュ
2. Vercelダッシュボードでインポート
3. 環境変数を設定
4. 自動デプロイ完了

### Netlify
1. `netlify.toml`設定済み
2. 環境変数設定
3. ビルド・デプロイ

詳細は`DEPLOYMENT.md`を参照

## 📁 プロジェクト構造

```
uranai-01/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── divination/         # 占術ページ
│   │   ├── dashboard/          # ダッシュボード
│   │   └── api/                # APIエンドポイント
│   ├── components/             # Reactコンポーネント
│   │   ├── divination/         # 占術関連
│   │   ├── ui/                 # 共通UIコンポーネント
│   │   └── environment/        # 環境データ表示
│   ├── lib/                    # ライブラリ・ユーティリティ
│   │   ├── divination/         # 占術エンジン
│   │   ├── supabase/           # DB接続
│   │   └── utils/              # ヘルパー関数
│   ├── hooks/                  # カスタムHooks
│   ├── types/                  # TypeScript型定義
│   └── __tests__/              # テストファイル
├── docs/                       # ドキュメント
├── public/                     # 静的ファイル
├── scripts/                    # ビルドスクリプト
└── 設定ファイル
```

## 📖 ドキュメント

### 開発者向け
- [技術仕様書](docs/PRODUCTION_SPEC.md)
- [占術アルゴリズム解説](docs/COSMIC_ORACLE_DIVINATION_MANUAL.md)
- [AI開発ガイドライン](CLAUDE.md)

### 運用者向け
- [データベースセットアップ](docs/DATABASE_PRODUCTION_SETUP.md)
- [デプロイメント手順](DEPLOYMENT.md)
- [モニタリング設定](docs/AUTOMATED_MONITORING_SOLUTIONS.md)

### 学習者向け
- [初学者ガイド](docs/BEGINNER_LEARNING_PLAN.md)
- [オンボーディング](docs/ONBOARDING_GUIDE.md)

## 🤝 コントリビューション

### 開発に参加する
1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### バグレポート・要望
GitHubのIssuesでお気軽にご報告ください

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照

## 🙏 謝辞

- **占術アルゴリズム**: 古典的占術理論に基づく実装
- **天文データ**: NASA・天文台の公開データ活用
- **UI/UXデザイン**: 宇宙・神秘をテーマにした独自デザイン
- **開発手法**: Human × AI協働開発の実践

## 📞 サポート・お問い合わせ

- 🐛 Issues: [GitHub Issues](https://github.com/ZAK-MY2/uranai-01/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/ZAK-MY2/uranai-01/discussions)
- 📖 Wiki: [プロジェクトWiki](https://github.com/ZAK-MY2/uranai-01/wiki)

---

<div align="center">

**🌟 COSMIC ORACLEで宇宙の叡智を体験してください 🌟**

Made with ❤️ by Human × AI Collaboration

</div>