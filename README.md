# Your Project Name

このプロジェクトは、[Your Project Name]のウェブアプリケーションです。Vue 3およびFirebaseをベースに構築されています。

スターターキット自体の更新手順は「CONTRIBUTING.md」を参照してください。

## プロジェクト概要

- [アプリの目的を記載]を行うためのアプリとして機能します。
- Vue 3, Vite, Tailwind CSS, Piniaを利用したモダンなフロントエンド環境を採用しています。
- バックエンド・インフラにはFirebase（Firestore, Functions, Hosting）を利用しています。

> **ベースキット:** このプロジェクトは、Vue3とFirebaseを使用するウェブプロジェクト向けスタートアップキット（`firebase-vue3-startup-kit`）をベースに構築されています。vite、vue-router、pinia、tailwindcss、prettier、vue-tscが含まれています。

## 📋 要件

- Node.js バージョン 16以降（推奨：最新のLTSバージョン。※ functionsではNode 24に対応するよう構成を調整済み）。

## 📖 初期セットアップ手順

1. このリポジトリをGitクローンします。
2. `npm global add firebase-tools` を実行して、Firebase toolsをインストールします。
3. 必要なnodeモジュールを取得するため、`npm install` を一度実行します。
4. `functions` ディレクトリ内でも `npm install` を一度実行します。
5. Firebaseコンソール (https://firebase.google.com から) を開き、プロジェクトを追加します。
   - Firebase CLI でログインしていることを確認してください。`firebase login` を実行して、Google アカウントでログインします。
   - CLIでのfirebase initは不要です(このキット自体が初期設定を代行しているため)
   - CLIでのfirebase use --add でプロジェクトを追加し、その後 firebase use でプロジェクトを選択することは必要です。
6. このプロジェクトのダッシュボードから、アプリを追加し「ウェブ」 (</>) を選択します。
7. このアプリの設定から、「Config」を選択します（Firebase SDKスニペット内）。
8. 設定ファイルをコピーし、`src/config/project.ts` ファイルに貼り付けます。
9. `.firebaserc` ファイル内の `fir-vue-startup-kit` という単語を、あなたのFirebaseプロジェクト名に置き換えます。
10. Firebaseコンソールを開き、Cloud Firestoreを作成します（とりあえず「セキュア」にしておきます）。
11. FirebaseコンソールでFirebase Hostingを有効にします。

## 開発環境の立ち上げ

1. パッケージのインストール

```bash
npm install
cd functions && npm install && cd ..
```

2. ローカルサーバーの起動

```bash
npm run serve
```

[http://localhost:8080](http://localhost:8080) でブラウザからアクセスできます。

---

## 💻 Functions

デフォルト設定のコールドスタートの場合、Firebase Functionsは非常に遅いため、このスタートアップキットは少しカスタムされたFirebase Functionsとなっています。

### Functions側

- Functionsはラッパー関数（`functions/src/common/exportifneeded.ts` の `exportIfNeeded` 関数）を使用して呼び出されます。必要な関数のみを読み込みます。
- Functionsは十分なメモリで起動します。`functions/src/wrappers/tests/test.ts` にある `test` 関数は1GBのメモリで実行されます。
- Functionsは近くのリージョンで実行されます。デフォルトでは日本リージョンに設定されています。

このため、Functionsは少し特殊な使い方をされています。
クライアントから呼び出されるFunctionsは、`src/index.ts` に `exportIfNeeded ("test", "tests/test", exports);` のように書かれます。

この場合、クライアントは `test` を関数として呼び出します。そしてクライアントが `test` Functionを呼び出すと、`functions/src/wrappers/tests/test.ts` 内のデフォルト関数が呼び出されます。詳細についてはこのファイルを参照してください。

### Vue.js側

- 関数設定は `src/utils/firebase.ts` にあります。デフォルトでは、`asia-northeast1` (東京) リージョンを呼び出すように設定されています。
- すべての機能は `src/utils/functions.ts` にまとめられています。新しい関数はこのファイルに追加する必要があります。

### リージョン

Functionsのリージョンは `asia-northeast1` (東京) に設定されています。リージョンを変更する場合は、必ずFunctions側とVue.js側の両方を変更してください。

## 🌎 i18n

- このスタートアップキットは、URLパスを使用したi18nをサポートしています。
- `/en/index` と `/jp/index` の両方で1つのVueファイルを使用できます。
- 言語ファイルは `src/i18n/` ディレクトリにあります。
  - `en.ts` と `ja.ts` が言語ファイルです。
  - 言語切り替えプルダウン（セレクト）に使用される言語ファイルは `language.ts` です。同じファイルが `en.ts` と `ja.ts` から読み込まれます。それぞれの言語で記述してください。
  - 新しい言語を追加したい場合は、`index.ts` に言語を追加し、`{language}.ts` を追加し、`language.ts` に言語を追加します。
- URLパスで言語を切り替える方法については、`src/router/index.ts` も参照してください。
- `src/components/Languages.vue` にある言語切り替えプルダウンを使用できます。このファイルは `route.param.lang` を読み込む必要があるため、`App.vue` と `Layout.vue` では使用しないでください。それ以外の場所ではどこでも使用できます。
- i18nは `vue-i18n@next` を使用しているため、使用方法の詳細についてはそちらを参照してください。

## 📄 利用可能なスクリプト

プロジェクトディレクトリで、以下を実行できます：

### `npm run serve`

開発モードでアプリを実行します。<br>
ブラウザで表示するには [http://localhost:8080](http://localhost:8080) を開いてください。

編集するとページがリロードされます。<br>
コンソールにはLintエラーも表示されます。

### `npm run build`

本番環境用にアプリを `dist` フォルダにビルドします。<br>
本番モードのVueを正しくバンドルし、最高のパフォーマンスが得られるようにビルドを最適化します。

ビルドは最小化され、ファイル名にはハッシュが含まれます。<br>
これでアプリのデプロイ準備は完了です！

### `firebase deploy`

Firebaseクラウドにアプリをデプロイします。デプロイの前に `npm run build` を実行する必要があります。

**モックサイトのみをデプロイする場合:**

```bash
firebase deploy --only hosting:mock
```

### `npm run format`

Prettierを実行し、コードフォーマットとしてコードを書き換えます。

---

## UI モック (Design Mockups)

システムデザインの検討および要件定義のため、`system-design/mock/` ディレクトリにHTML/CSSベースのUIモックを構築しています。これらはFirebase Hostingのマルチサイト機能を利用して公開することが可能です。

### Hostingのマルチサイト機能の使い方

Firebase Hostingで複数のサイト（例: ユーザー向けサイト、キオスク向けサイトなど）を個別に管理・デプロイするには、以下の手順でマルチサイト設定とターゲットの登録を行います。

#### 1. サイトの作成

Firebase CLIを使用して、新しいHostingサイトを作成します。

```bash
firebase hosting:sites:create <YOUR_SITE_ID>
```

※ `<YOUR_SITE_ID>` には一意のサイト名（例: `mock-your-project-id`）を指定します。作成したサイトのURLは `https://<YOUR_SITE_ID>.web.app` になります。

#### 2. デプロイターゲットの適用

作成したサイトを、プロジェクト内のターゲット名（`firebase.json` で指定しているエイリアス名）に紐付けます。

```bash
firebase target:apply hosting <TARGET_NAME> <YOUR_SITE_ID>
```

- `<TARGET_NAME>`: `firebase.json` 内で設定する識別子（例: `mock` など）。
- `<YOUR_SITE_ID>`: 手順1で作成したサイトID。

**実行例:**

```bash
# mockターゲットを mock-your-project-id サイトに紐付ける場合
firebase target:apply hosting mock mock-your-project-id

# kioskターゲットを your-kiosk-project-id サイトに紐付ける場合
firebase target:apply hosting kiosk your-kiosk-project-id
```

この操作を行うと、プロジェクトルートの `.firebaserc` にターゲット情報が自動的に保存されます。

#### 3. 設定ファイルの構成（参考）

`firebase.json` で複数のターゲットを配列で定義します。（すでに設定されている場合は変更不要です）

```json
{
  "hosting": [
    {
      "target": "mock",
      "public": "system-design/mock",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
    }
  ]
}
```

設定完了後、指定したターゲットのみを選択してデプロイすることが可能になります。

```bash
firebase deploy --only hosting:mock
```
