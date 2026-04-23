# 開発ログ

このキットに対しての主な開発ログをこのファイルに記録します
※ 詳細は各コミット参照

## 2026-04-23

### npm audit 脆弱性対応

`npm install` 時に high severity × 2 の脆弱性が報告された。

- **原因:** `eslint-plugin-sonarjs`（v3系）が依存する `minimatch` 10.0.0–10.2.2 に ReDoS 脆弱性（GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj, GHSA-23c5-xmqv-rm74）
- **対応:** `eslint-plugin-sonarjs` を v3 → v4（latest）にメジャーバージョンアップ
- **コマンド:** `npm install -D eslint-plugin-sonarjs@latest`
- **結果:** `npm audit` で `found 0 vulnerabilities` を確認
- **備考:** 開発時ツール（ESLint プラグイン）の間接依存であり、本番ビルドへの影響はなし

### 開発タスク

github issuesで今後のこのスターターに対する開発課題は管理します。
