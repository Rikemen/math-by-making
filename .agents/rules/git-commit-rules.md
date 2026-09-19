---
description: コミットメッセージの生成・作成時に適用する規約
---

# Git Commit Rules (コミットメッセージ規約)

**Activation:** コミットメッセージの生成・作成時だけ適用する。status、diff、レビュー、ブランチ操作には適用しない。

## Scope

- **対象**: staged 変更（`git diff --cached`）のみ。unstaged・未追跡ファイルは無視。
- **適用範囲**: Git サイドバーの Generate ボタン、`/commit` `/commit-ja` ワークフロー、その他すべての git commit 関連操作。
- staged 変更がない場合、コミットメッセージの生成を行わず、ステージングを促すメッセージのみ返すこと。

## Format: Conventional Commits

すべてのコミットメッセージは **Conventional Commits** 形式を厳守する。

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Type（常に英語）

`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`, `revert`

### Description（件名）

- 50文字以内
- 末尾にピリオド（`.`）を付けない
- 言語はワークフローの指定に従う（`/commit` → 英語、`/commit-ja` → 日本語）
- ワークフロー外（Git サイドバー Generate 等）の場合は**英語**をデフォルトとする

### Body（本文、任意）

- 件名と本文の間には空行を入れる
- 変更の理由・背景・影響を簡潔に記述
- 英語の場合は72文字で折り返し

## Guardrails（禁止事項）

- ❌ 絵文字の使用
- ❌ スラング・口語表現
- ❌ 件名のdescriptionが `update`、`fix`、`更新`、`修正` 等だけで、対象や内容を示さない表現。Conventional Commitsのtypeとしての `fix` や、具体的な件名・本文中の使用は禁止しない。
- ❌ 不要なメタ解説・導入文・締めの言葉。分割提案が必要な場合だけ、メッセージとは分けて短く記載できる。

## Principles（原則）

- **1コミット1変更**: 論理的に独立した変更は分割する。複数の type にまたがる場合、分割を提案すること。
- **破壊的変更**: `!` を type の後に付与する（例: `feat!:`, `fix!:`）。footer に `BREAKING CHANGE:` も記述可。
- **出力形式**: 通常はコミットメッセージ本文のみ。必要な分割提案は例外とし、内部の思考過程は出力しない。
