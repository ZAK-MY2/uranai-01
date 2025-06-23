# COSMIC ORACLE (uranai-01) プロジェクトドキュメント一覧

## 🌟 プロジェクト概要
**COSMIC ORACLE** - 10占術統合 + リアルタイム環境データ連携による高精度AI占いシステム

## 📚 主要ドキュメント概要

### 🎯 仕様・設計ドキュメント
| ドキュメント名 | 対象者 | 目的 | 主な内容 | 優先度 |
|---------------|--------|------|----------|---------|
| **PRODUCTION_SPEC.md** | 開発者・管理者 | 本番実装仕様 | 10占術統合システムの完全技術仕様・アーキテクチャ | ⭐⭐⭐ |
| **COSMIC_ORACLE_DIVINATION_MANUAL.md** | 全ユーザー | 占術システム解説 | 10占術の公式解説書・占い方法・意味 | ⭐⭐⭐ |
| **DIVINATION_ALGORITHMS_TECHNICAL_GUIDE.md** | 開発者 | アルゴリズム詳細 | 各占術の計算ロジック・技術的実装方法 | ⭐⭐ |
| **DIVINATION_ALGORITHM_CORRECTION_MANUAL.md** | 開発者 | アルゴリズム修正 | 精度向上のための修正指針・ファクトチェック結果 | ⭐⭐ |
| **ALGORITHM_FACT_CHECK.md** | 開発者 | 精度検証 | 各占術アルゴリズムの事実確認・信頼性評価 | ⭐⭐ |

### 🗄️ データベース設計ドキュメント
| ドキュメント名 | 対象 | 内容 | 完成度 |
|---------------|------|------|---------|
| **DATABASE_TABLES_NUMEROLOGY.md** | 数秘術 | ピタゴラス式計算・マスターナンバー・完全データベース | ✅ |
| **DATABASE_TABLES_TAROT.md** | タロット | 78枚フルデッキ・スプレッド・解釈データベース | ✅ |
| **DATABASE_TABLES_ASTROLOGY.md** | 西洋占星術 | 12星座・10惑星・ハウス・アスペクト完全システム | ✅ |
| **DATABASE_TABLES_ICHING.md** | 易経 | 64卦・爻辞・変化線・確率分布計算 | ✅ |
| **DATABASE_TABLES_SHICHU_SUIMEI.md** | 四柱推命 | 十干十二支・十神・大運流年システム | ✅ |
| **DATABASE_TABLES_RUNES.md** | ルーン | エルダー・フサルク24文字・スプレッド・解釈 | ✅ |
| **DATABASE_TABLES_KYUSEI_KIGAKU.md** | 九星気学 | 本命星・月命星・方位盤・開運方法 | ✅ |
| **DATABASE_TABLES_VEDIC_ASTROLOGY.md** | ヴェーダ占星術 | 27ナクシャトラ・ダシャーシステム・ドーシャ分析 | ✅ |
| **DATABASE_TABLES_KABBALAH.md** | カバラ | 10セフィロト・生命の樹・ゲマトリア数秘術 | ✅ |
| **DATABASE_TABLES_CELTIC_ASTROLOGY.md** | ケルト占星術 | 13聖樹暦・オガム文字・季節エネルギー | ✅ |
| **DATABASE_TABLES_PALMISTRY.md** | 手相 | 手線・丘・指・健康運（参考用） | 📚 |

### 🛠️ 開発・運用ガイド
| ドキュメント名 | 対象者 | 目的 | 主な内容 | 優先度 |
|---------------|--------|------|----------|---------|
| **STARTUP_PROCEDURE_GUIDE.md** | 全レベル | 開発開始手順 | ターミナル起動〜Claude Code開始まで完全手順 | ⭐⭐⭐ |
| **SESSION_HANDOVER_SUMMARY.md** | Claude Code | セッション引き継ぎ | 前回の成果・手法・重要な決定事項の完全まとめ | ⭐⭐⭐ |
| **quick-start-guide.md** | 全レベル | 忘却防止システム | Claude忘却防止リマインダーシステムの使用方法 | ⭐⭐⭐ |
| **DATABASE_PRODUCTION_SETUP.md** | 開発者 | DB本番構築 | Supabase本番環境でのデータベース構築手順 | ⭐⭐⭐ |
| **NEXT_JS_SUPABASE_STANDARD.md** | 開発者 | 技術標準 | Next.js + Supabase構成の標準実装方法 | ⭐⭐ |
| **QUICK_START_COMMANDS.md** | 開発者 | 開発時コマンド | よく使うコマンド集・デバッグ方法 | ⭐⭐ |
| **DATABASE_VISUALIZATION_GUIDE.md** | 開発者 | データ可視化 | データベース構造の可視化・関係図作成 | ⭐ |

### 📋 プロジェクト管理・学習
| ドキュメント名 | 対象者 | 目的 | 主な内容 | 優先度 |
|---------------|--------|------|----------|---------|
| **AUTONOMOUS_DEVELOPMENT_SPEC_TEMPLATE.md** | 開発者 | 仕様書作成 | Claude Code自律開発用の包括的仕様書テンプレート | ⭐⭐⭐ |
| **UNIVERSAL_PROJECT_SETUP_GUIDE.md** | Claude Code | 最低限知識 | 自律開発に必要な最小限の概念・コマンド・原則 | ⭐⭐⭐ |
| **DEVELOPMENT_STRATEGY_PROMPT.md** | 開発者 | 戦略決定 | 3パターン開発戦略の判定と最適プロンプト生成 | ⭐⭐⭐ |
| **CLAUDE_MVP_INSTRUCTION_GUIDE.md** | 開発者 | MVP指示方法 | 32K tokens制限内での効果的な指示・成功パターン | ⭐⭐⭐ |
| **PARALLEL_DEVELOPMENT_ANALYSIS.md** | 開発者・管理者 | 手法分析 | 並列開発の効果測定・ROI分析・適用条件 | ⭐⭐ |
| **DEVELOPMENT_FLOW_CHANGES.md** | 開発者 | 手法理解 | MVP→並列開発への変化点・指示方法の進化 | ⭐⭐ |
| **ONBOARDING_GUIDE_BEGINNER.md** | 初級者 | 実践入門 | 6ヶ月〜2年経験者向け実践的開発ガイド | ⭐⭐ |
| **BEGINNER_LEARNING_PLAN.md** | 初心者 | 学習計画 | 3ヶ月でZeami開発者になる詳細カリキュラム | ⭐ |
| **ONBOARDING_GUIDE.md** | 中級者 | 実践入門 | 中級者向けガイド（初級版で補完） | ⭐ |
| **FULL_APP_VERIFICATION.md** | 開発者 | 品質保証 | アプリケーション全体の検証・テスト手順 | ⭐⭐ |

## 🛠️ 技術・設定ファイル

| ファイル名 | 種類 | 目的 | 主な機能 | 使用頻度 |
|-----------|------|------|----------|----------|
| **CLAUDE.md** | 設定 | AI開発ルール | プロジェクト固有の開発ガイドライン・品質基準 | 高 |
| **package.json** | 設定 | 依存関係管理 | Next.js + Supabase + 10占術エンジン構成 | 高 |
| **.env.local** | 設定 | 環境変数 | Supabase接続・外部API Key・開発設定 | 高 |
| **tsconfig.json** | 設定 | TypeScript設定 | 型安全性・モジュール解決・コンパイル設定 | 中 |
| **claude-reminder-system.sh** | スクリプト | 忘却防止 | 2時間おきデスクトップ通知システム | 高 |
| **claude-context-restore.sh** | スクリプト | コンテキスト復元 | 忘却防止コマンド集・緊急時復元 | 高 |
| **quick-start.sh** | スクリプト | 開発開始 | 開発環境起動・依存関係インストール | 中 |

## 📊 既存ドキュメント（参照用）

| ドキュメント名 | 作成時期 | 内容 | 現在の関連性 |
|---------------|----------|------|-------------|
| **DEVELOPMENT_SESSION_ANALYSIS.md** | 前回セッション | 開発手法分析・成功パターン | 高（並列開発の基礎） |
| **NEXT_JS_SUPABASE_STANDARD.md** | 前回セッション | 技術標準構成 | 高（標準スタック） |
| **PROJECT_INITIALIZATION_COMMANDS.md** | 前回セッション | 初期化コマンド集 | 中（自動化で代替） |
| **QUICK_START_COMMANDS.md** | 前回セッション | 開発時コマンド | 中（簡略化済み） |
| **ONBOARDING_GUIDE.md** | 前回セッション | 中級者向けガイド | 中（初級版で補完） |

## 🎯 用途別ドキュメント選択ガイド

### 🚀 開発を始めたい
1. **STARTUP_PROCEDURE_GUIDE.md** - 手順書
2. **claude-reminder-system.sh start** - 忘却防止システム開始
3. **CLAUDE_MVP_INSTRUCTION_GUIDE.md** - MVP指示方法確認
4. **DEVELOPMENT_STRATEGY_PROMPT.md** - 戦略決定
5. **AUTONOMOUS_DEVELOPMENT_SPEC_TEMPLATE.md** - 仕様書作成
6. **zeami-auto-project-setup.sh** - 自動セットアップ

### 🔄 継続開発・セッション引き継ぎ
1. **SESSION_HANDOVER_SUMMARY.md** - 前回の成果確認
2. **claude-context-restore.sh basic** - 忘却防止コマンド実行
3. **UNIVERSAL_PROJECT_SETUP_GUIDE.md** - 必要最小限知識
4. **CLAUDE.md** - プロジェクトルール

### 📚 学習・理解を深めたい
1. **BEGINNER_LEARNING_PLAN.md** - 基礎学習（3ヶ月計画）
2. **ONBOARDING_GUIDE_BEGINNER.md** - 実践入門
3. **PARALLEL_DEVELOPMENT_ANALYSIS.md** - 手法の効果分析

### 🏗️ 手法・プロセスを理解したい
1. **DEVELOPMENT_FLOW_CHANGES.md** - 開発手法の変化
2. **PARALLEL_DEVELOPMENT_ANALYSIS.md** - 定量的効果測定
3. **DEVELOPMENT_SESSION_ANALYSIS.md** - 成功パターン分析

## 💡 ドキュメントの特徴・強み

### ⭐⭐⭐ 最重要（必読）
- **実践的**: コピペで実行可能な具体的手順
- **包括的**: 初心者〜Claude Codeまで全レベル対応
- **効率重視**: トークン効率と開発速度の両立

### ⭐⭐ 重要（理解推奨）
- **分析的**: 定量データに基づく効果測定
- **体系的**: 従来手法との比較・変化点の明確化
- **実証済み**: URANAI-01での成功実績

### ⭐ 参考（必要時）
- **教育的**: 段階的な学習プログラム
- **長期的**: 3ヶ月〜6ヶ月の成長計画

## 🔍 ドキュメント間の関係

```
STARTUP_PROCEDURE_GUIDE.md（入口）
    ↓
┌─ 新規プロジェクト ─ AUTONOMOUS_DEVELOPMENT_SPEC_TEMPLATE.md
│                  └─ zeami-auto-project-setup.sh
│
└─ 既存プロジェクト ─ SESSION_HANDOVER_SUMMARY.md
                   └─ UNIVERSAL_PROJECT_SETUP_GUIDE.md

学習・理解支援:
BEGINNER_LEARNING_PLAN.md → ONBOARDING_GUIDE_BEGINNER.md → 実践開発

手法理解:
DEVELOPMENT_FLOW_CHANGES.md → PARALLEL_DEVELOPMENT_ANALYSIS.md
```

## 📋 利用シーン別クイックガイド

| シーン | 読むべきドキュメント | 実行するもの |
|--------|-------------------|-------------|
| **新規開発開始** | STARTUP_PROCEDURE_GUIDE.md<br>CLAUDE_MVP_INSTRUCTION_GUIDE.md<br>DEVELOPMENT_STRATEGY_PROMPT.md<br>AUTONOMOUS_DEVELOPMENT_SPEC_TEMPLATE.md | claude-reminder-system.sh start<br>zeami-auto-project-setup.sh |
| **継続開発開始** | STARTUP_PROCEDURE_GUIDE.md<br>SESSION_HANDOVER_SUMMARY.md<br>quick-start-guide.md | claude-reminder-system.sh start<br>claude |
| **2時間おき確認** | quick-start-guide.md | claude-context-restore.sh basic |
| **手法を学びたい** | PARALLEL_DEVELOPMENT_ANALYSIS.md<br>DEVELOPMENT_FLOW_CHANGES.md | - |
| **基礎から学習** | BEGINNER_LEARNING_PLAN.md<br>ONBOARDING_GUIDE_BEGINNER.md | 学習プログラム |
| **Claude Code指示** | UNIVERSAL_PROJECT_SETUP_GUIDE.md<br>CLAUDE_MVP_INSTRUCTION_GUIDE.md<br>SESSION_HANDOVER_SUMMARY.md | claude |

## 🎯 今後の活用方針

### 即座に使うべきもの
- STARTUP_PROCEDURE_GUIDE.md（毎回の開発開始）
- claude-reminder-system.sh start（忘却防止システム）
- claude-context-restore.sh basic（2時間おき確認）
- SESSION_HANDOVER_SUMMARY.md（セッション引き継ぎ）
- zeami-auto-project-setup.sh（新規プロジェクト）

### 定期的に参照すべきもの
- quick-start-guide.md（忘却防止システム使用方法）
- CLAUDE.md（プロジェクトルール確認）
- PARALLEL_DEVELOPMENT_ANALYSIS.md（手法の効果確認）

### 必要時に参照するもの
- 学習系ドキュメント（スキルアップ時）
- 分析系ドキュメント（手法改善時）

この表により、目的に応じて最適なドキュメントを素早く選択できます！