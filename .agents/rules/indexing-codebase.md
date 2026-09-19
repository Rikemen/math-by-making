---
trigger: always_on
globs: ["**/*"]
---

# Project Structure Awareness (プロジェクト構造認識)

**Activation:** This rule is **ALWAYS ON** for all files (`**/*`).

> **Positioning:** `senior-engineer-conduct.md` の原則を、プロジェクト構造の
> **インデックス化と依存関係の検索** に具体化したルールです。
> 原則的な行動規範は `senior-engineer-conduct.md` を参照。このルールは **具体的な行動手順** のみを定めます。

## 1. Index Before Act (必要な構造を把握する)
- 初見のプロジェクト、構造変更後、または対象が不明な場合に、必要な範囲の構造を調べる。
- `rg --files` 等で対象を絞り、全体像が必要な場合だけ `indexing-awareness` の `index-structure.sh` を使う。
- 関連するエントリポイントと技術スタックを確認する。同じ対象の確認結果は再利用し、タスク開始だけを理由に再実行しない。

## 2. Grep, Don't Guess (推測せず検索する)
- 存在が不明な関数・型・モジュールは `rg` で実在を確認する。
- API・依存関係・ファイル配置を変える場合は、関連する参照先と被参照元を確認する。必要に応じて `trace-dependencies.sh` を使う。
- 文言のみの修正では依存関係トレースを省略できる。同じ検索をルールとSkillのそれぞれで繰り返さない。
- 循環参照のリスクがある依存関係を追加する場合、事前に影響を説明する。

## 3. Verify After Change (変更後に検証する)
- ファイルの追加・削除・リネーム後、関連範囲に旧パスや旧名称への参照が残っていないか `rg` で確認する。
- ルール・ワークフロー・スキルを追加・削除・リネームした場合、`verify-structure.sh` で一覧との整合性を確認する。本文のみの変更では、変更した指示と参照先の整合性を確認する。