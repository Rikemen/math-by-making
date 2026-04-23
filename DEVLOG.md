## キットセットアップ

### nodeのバージョン

functions フォルダ内でのyarn installでエラーが出たので、package.jsonのengines.nodeのバージョンを24に変更した。

### eslint

### firebaseのセットアップ

firebase initは不要(すでにキット内で初期設定に関する記述がされているため)

firebase use --add でプロジェクトを追加し、その後 firebase use でプロジェクトを選択する。は必要。

### 開発環境の立ち上げ

yarn run serveで開発サーバーを立ち上げる。

http://localhost:8080/でアクセスできる。

### デプロイ

yarn build > distフォルダが作成される。
firebase deployでデプロイできる。

### cloud functionsをGen2(第二世代に変更)

既存のキットのコードはcloud functionsのgen1のコードだったため、gen2のコードに変更した。

参考：https://firebase.google.com/docs/functions/v2/quickstart-js

### npm audit 脆弱性対応（2026-04-21）

`npm install` 時に high severity × 2 の脆弱性が報告された。

- **原因:** `eslint-plugin-sonarjs`（v3系）が依存する `minimatch` 10.0.0–10.2.2 に ReDoS 脆弱性（GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj, GHSA-23c5-xmqv-rm74）
- **対応:** `eslint-plugin-sonarjs` を v3 → v4（latest）にメジャーバージョンアップ
- **コマンド:** `npm install -D eslint-plugin-sonarjs@latest`
- **結果:** `npm audit` で `found 0 vulnerabilities` を確認
- **備考:** 開発時ツール（ESLint プラグイン）の間接依存であり、本番ビルドへの影響はなし

※yarnでvitest @vue/test-utils jsdomをインストールしようとするとエラーが出る(yarnとvitestの最新版の互換性がない?▶︎npmに切り替えた)

### テストのセットアップ

npm install -D vitest @vue/test-utils jsdom
