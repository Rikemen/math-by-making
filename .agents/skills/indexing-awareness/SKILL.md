---
name: indexing-awareness
description: 初見のプロジェクト、構造変更後、対象が不明な調査、またはAPI・依存関係・ファイル配置の変更時に、必要な範囲の構造と参照関係を確認する。文言のみの修正や確認済み対象の再調査では自動実行しない。
---

# Indexing Awareness Skill

Antigravity はリポジトリの事前インデックス化を行わないため、エージェントが **自律的に** プロジェクト構造を把握し、依存関係を検索する必要があります。
このスキルは、Cursor の RAG（事前インデックス + 関連コンテキスト検索）を擬似的に再現するスクリプト群を提供します。

## Triggers (自動実行のタイミング)

適用条件は `indexing-codebase.md` に従う。必要な調査に対応するスクリプトだけを使い、既存の検索結果で足りる場合は実行しない。

| 状況 | 利用できるスクリプト |
|---|---|
| 初見・構造変更後・対象不明で全体像が必要 | `index-structure.sh` |
| API・依存関係・ファイル配置の変更で影響調査が必要 | `trace-dependencies.sh <対象ファイル>` |
| 未知のシンボルの定義・使用箇所が必要 | `trace-dependencies.sh <シンボル名>` |
| ルール・ワークフロー・スキルを追加・削除・リネームした後 | `verify-structure.sh` |

同じ対象の確認結果は前提が変わらない限り再利用する。文言のみの修正では依存関係トレースを省略できる。

## Scripts

### 1. index-structure.sh (構造インデックス)

プロジェクトのディレクトリ構造、ファイル種別、サイズをインデックス化します。

```bash
# 実行権限の付与（初回のみ）
chmod +x .agents/skills/indexing-awareness/scripts/index-structure.sh

# プロジェクト全体のインデックス
./.agents/skills/indexing-awareness/scripts/index-structure.sh

# 探索深度を指定（デフォルト: 4）
./.agents/skills/indexing-awareness/scripts/index-structure.sh --depth 6

# 特定ディレクトリのみ
./.agents/skills/indexing-awareness/scripts/index-structure.sh --dir src/
```

### 2. trace-dependencies.sh (依存関係トレース)

ファイルまたはシンボルの依存関係を **双方向** に検索します。

```bash
chmod +x .agents/skills/indexing-awareness/scripts/trace-dependencies.sh

# ファイルモード: 依存関係の双方向トレース
./.agents/skills/indexing-awareness/scripts/trace-dependencies.sh src/utils/auth.ts

# シンボルモード: 定義元と使用箇所の検索
./.agents/skills/indexing-awareness/scripts/trace-dependencies.sh handleLogin

# 検索範囲を限定
./.agents/skills/indexing-awareness/scripts/trace-dependencies.sh UserService src/
```

**ファイルモード出力:**
- 📥 Forward Dependencies — そのファイルが何を import/require しているか
- 📤 Reverse Dependencies — そのファイルを誰が import/require しているか
- 🔍 Config/Doc References — 設定ファイルやドキュメントからの参照

**シンボルモード出力:**
- 📌 Definitions — 定義元（function, class, const, def, fn 等）
- 📎 Usages — 使用箇所（word boundary マッチ）
- 📦 Import References — import/require/from 文での参照

### 3. verify-structure.sh (ドキュメント整合性チェック)

`.agents/` 内のルール・ワークフロー・スキルと `README.md` の記載整合性を検証します。Skillの未掲載は通常は警告です。READMEに全Skill一覧を維持する方針が明示されている場合だけ `--require-skill-list` を指定して必須チェックにします。

```bash
chmod +x .agents/skills/indexing-awareness/scripts/verify-structure.sh
./.agents/skills/indexing-awareness/scripts/verify-structure.sh
```

## Troubleshooting

- **`trace-dependencies.sh` の結果がノイジー**: 第2引数で検索範囲を限定してください。
- **`index-structure.sh` の出力が長すぎる**: `--depth 2` でツリーの深さを制限してください。
- **Skillの "Missing in README" 警告**: 全Skill一覧を維持する方針がなければ、READMEの追記は不要です。必須チェックのエラーは、対象一覧と実ファイルのどちらを直すべきか確認してください。READMEを実際に変更した場合だけHTML同期を適用します。
