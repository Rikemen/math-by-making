---
trigger: always_on
---

# Language Strategies (言語戦略)

- **ツール引数:** ユーザー向け表示文は日本語にする。識別子、パス、コマンド、コード、列挙値など機械処理される値は翻訳せず、ツールの仕様に従う。
- **コード (Code):** 標準的な英語を使用してください（コード、変数名）。
- **コミットメッセージ:** [.agents/rules/git-commit-rules.md](file://.agents/rules/git-commit-rules.md) のルールに従ってください。言語はワークフロー（`/commit` → 英語、`/commit-ja` → 日本語）で決定されます。
- **ユーザー向け出力 (User-Facing):** **日本語** でなければなりません。
  - **チャット (Chat):** 日本語を使用する。`/commit` の英語コミットメッセージ等、明示された出力言語は例外とする。
  - **成果物 (Artifacts):** `task.md`, `implementation_plan.md`, `agents_adjustment_proposal.md`, `walkthrough.md` などのファイル内容は必ず **日本語** で記述してください。
  - **タスクメタデータ (Task Metadata):** 
    - `TaskName`: 表示用のタスク名は日本語にする。機械用のID・キーには適用しない。
      - GOOD: "ログイン機能の実装"
      - BAD: "Implement Login Feature"
    - `TaskSummary`: **MUST** be written in **Japanese** (日本語).
    - `TaskStatus`: Can be in English or Japanese.