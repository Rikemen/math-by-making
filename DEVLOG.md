# Math by Making 開発計画

| Loop | Task | User-facing summary | Unit test | Refactor checkpoint |
| --- | --- | --- | --- | --- |
| 0.1 | GitHub CLIを再認証 | `Rikemen` アカウントでGitHub操作できる状態へ戻します。 | `gh auth status` | 複数アカウントのactiveを明示 |
| 0.2 | 現在差分をコミット分割 | 未コミット変更を内容と計画の2単位に分けます。 | `git diff --stat` | 無関係な差分を混ぜない |
| 0.3 | 初期コンテンツをコミット | README・サンプル・キャラクター素材を1コミットにまとめます。 | `git diff --cached` | 1タスク1コミットを維持 |
| 0.4 | 開発計画をコミット | DEVLOGと開発計画HTMLを別コミットにします。 | `git diff --cached` | 計画変更だけを含める |
| 0.5 | 新コミットをmainへ移す | dev上の新規2コミットを既存mainへ安全に取り込みます。 | `git log --oneline` | main固有の履歴を保持 |
| 0.6 | devブランチを廃止 | 復旧用タグを残してローカルdevブランチを削除します。 | `git branch --list` | main以外をpushしない |
| 0.7 | Git remoteの役割を整理 | スターターを`upstream`、専用リポジトリを`origin`として分離します。 | `git remote -v` | remote名と責務を固定 |
| 0.8 | mainだけをGitHubへ登録 | 専用リポジトリへmainだけをpushして追跡設定します。 | `git ls-remote origin` | devとタグをpushしない |
| 0.9 | Firebase aliasを設定 | ローカルのdefaultを`math-by-making`へ紐付けます。 | `npx -y firebase-tools@latest use` | project IDを一意に保つ |
| 0.10 | Hosting targetを設定 | `hosting:app`を既存Hostingサイトへ紐付けます。 | `npx -y firebase-tools@latest target` | Hostingだけを対象にする |
| 0.11 | Firebase Web Appを登録 | 未登録のWebアプリを作成しApp IDを取得します。 | `npx -y firebase-tools@latest apps:list web --project math-by-making` | 作成は1アプリだけに限定 |
| 0.12 | SDK設定を反映 | 公式SDK設定で`src/config/project.ts`の仮値を置換します。 | `rg "your-|your\." src/config/project.ts` | 取得値を手入力で改変しない |
| 0.13 | Firebase設定を静的検証 | alias・target・SDKのproject ID一致を確認します。 | `npm run build` | 環境値とアプリ処理を混ぜない |
| 0.14 | Firebase MCPを接続し直す | MCPの作業先を本リポジトリへ切り替えます。 | `firebase_get_environment` | 他プロジェクトへの誤操作を防ぐ |
| 0.15 | 品質コマンドを通す | 連携前のコードをテスト・Lint・buildで確認します。 | `npm test` | 連携外の機能変更を混ぜない |
| 0.16 | Hostingエミュレータ確認 | ローカルでトップとSPA rewriteを確認します。 | `npm run build` | firebase.json変更は必要時だけ |
| 0.17 | Firebase連携をコミット | `.firebaserc`とSDK設定をmainへ独立コミットします。 | `git diff --cached` | 秘密情報を含めない |
| 0.18 | mainの連携変更をpush | Firebase連携コミットを専用リポジトリへpushします。 | `git status --short --branch` | main以外を作らない |
| 0.19 | Hostingを初回デプロイ | mainの確認済みbuildだけをHostingへ公開します。 | `npx -y firebase-tools@latest deploy --only hosting:app` | Functions・Rulesを配信しない |
| 0.20 | 公開URLを確認 | 公開URLと主要レスポンスを確認し結果を記録します。 | `https://math-by-making.web.app` | deploy成功と画面成功を分ける |
| 1.1 | ホームの受け入れ条件を固定 | スターター画面を学習サイトへ置き換える条件をテストで固定します。 | `npm test -- src/views/__tests__/Home.test.ts` | テスト名を利用者の行動で表現 |
| 1.2 | デザイントークンを定義 | 青を基調とした色・余白・文字サイズを一元管理します。 | `npm test -- src/styles/__tests__/tokens.test.ts` | グローバルCSSはトークンと基礎だけに限定 |
| 1.3 | 共通ヘッダーを実装 | サイト名と主要な学習導線をどの画面でも表示します。 | `npm test -- src/components/__tests__/AppHeader.test.ts` | ヘッダー固有CSSはコンポーネントに閉じる |
| 1.4 | アカウント導線を外す | 初期版では登録なしですぐ学べる画面構成にします。 | `npm test -- src/router/__tests__/routes.test.ts` | 認証依存をレイアウトから分離 |
| 2.1 | 記事メタデータ型を定義 | 記事名・科目・公開状態などを同じ形式で管理します。 | `npm test -- src/content/__tests__/articles.test.ts` | 表示用データと画面ロジックを分離 |
| 2.2 | カタログ検証を追加 | URL重複や必須項目の欠落をテストで検出します。 | `npm test -- src/content/__tests__/articles.test.ts` | 検証関数を小さな純粋関数に保つ |
| 2.3 | 線形写像の記事を登録 | 最初の線形代数教材を一覧から選べるようにします。 | `npm test -- src/content/__tests__/articles.test.ts` | URLや画像パスの直書きを集約 |
| 2.4 | 教材ファイル契約を固定 | 記事フォルダに必要なHTML・JS・画像を自動確認します。 | `npm test -- tests/articles/article-assets.test.ts` | ファイル検査の共通ヘルパーを抽出 |
| 3.1 | ホームのヒーローを実装 | 「創って学ぶ」価値と最初の行動を明確に伝えます。 | `npm test -- src/views/__tests__/Home.test.ts` | ページ固有CSSはHomeに配置 |
| 3.2 | キャラクター導入を実装 | 既存キャラクター画像で親しみやすい入口を作ります。 | `npm test -- src/components/__tests__/LearningHero.test.ts` | 画像のaltと用途をコンポーネントで管理 |
| 3.3 | 科目カードを実装 | 線形代数と今後の科目を見分けやすく一覧表示します。 | `npm test -- src/components/__tests__/SubjectCard.test.ts` | カードを再利用可能な責務に限定 |
| 3.4 | 科目別ページを追加 | 線形代数の記事一覧へ迷わず移動できるようにします。 | `npm test -- src/views/__tests__/Subject.test.ts` | 絞り込みは表示層から分離 |
| 3.5 | 準備中表示を追加 | 未公開科目を壊れたリンクにせず予定として示します。 | `npm test -- src/components/__tests__/SubjectCard.test.ts` | 公開状態の分岐を一か所に集約 |
| 4.1 | サンプル教材を公開配置 | `sample/` の線形写像教材を最初の記事として開けるようにします。 | `npm test -- tests/articles/article-assets.test.ts` | 原本と公開物の役割を明記 |
| 4.2 | 教材内パスを整備 | 行列クラスやスケッチを相対パスで確実に読み込みます。 | `npm test -- tests/articles/linear-mapping.test.ts` | 重複したスクリプト参照を整理 |
| 4.3 | 記事共通シェルを追加 | タイトル・パンくず・学習目標・戻る導線を揃えます。 | `npm test -- tests/articles/linear-mapping.test.ts` | 記事共通部と教材固有部を分離 |
| 4.4 | タブ操作を改善 | 座学と実装をキーボードでも切り替えられるようにします。 | `npm test -- tests/articles/linear-mapping-tabs.test.ts` | ARIA状態更新を一関数に集約 |
| 4.5 | p5キャンバスをレスポンシブ化 | スマホでも線形写像の可視化を画面内で操作できます。 | `npm test -- tests/articles/linear-mapping-canvas.test.ts` | 描画計算とDOMサイズ取得を分離 |
| 4.6 | ソース取得導線を追加 | 教材コードの閲覧先・取得先を記事から確認できます。 | `npm test -- tests/articles/linear-mapping.test.ts` | 外部URLは記事メタデータへ集約 |
| 5.1 | 学習目標チェックを追加 | 学ぶ内容を開始前と終了時に確認できるようにします。 | `npm test -- tests/articles/linear-mapping-progress.test.ts` | 目標データと描画を分離 |
| 5.2 | 4択問題データを追加 | 線形写像の定義を選択問題で確かめられるようにします。 | `npm test -- tests/articles/linear-mapping-quiz.test.ts` | 問題文と判定処理を分離 |
| 5.3 | 回答フィードバックを実装 | 正誤だけでなく理由をその場で理解できるようにします。 | `npm test -- tests/articles/linear-mapping-quiz.test.ts` | 色だけに頼らない状態表現にする |
| 5.4 | 端末内の進捗保存を追加 | アカウントなしでも同じ端末で学習状況を保持します。 | `npm test -- tests/articles/linear-mapping-progress.test.ts` | localStorageアクセスをアダプタ化 |
| 6.1 | 動画導線を追加 | 動画URLがある記事だけ、対応動画を安全に表示します。 | `npm test -- src/components/__tests__/VideoResource.test.ts` | 未設定時の分岐と埋め込みを分離 |
| 6.2 | ページメタ情報を設定 | 記事タイトルや説明がタブ・共有時に正しく伝わります。 | `npm test -- src/views/__tests__/Subject.test.ts` | メタ情報生成を共通関数化 |
| 6.3 | モバイル回帰テストを追加 | スマホ幅でナビ・教材・問題が切れないことを確認します。 | `npm test -- src/components/__tests__/responsive.test.ts` | 横断的な媒体指定を増やしすぎない |
| 7.1 | キーボード・読み上げ確認 | マウスなしでも主要な学習操作を完了できるようにします。 | `npm test -- src/components/__tests__/accessibility.test.ts` | 共通フォーカススタイルを再利用 |
| 7.2 | 画像と初期表示を最適化 | キャラクター画像と教材の読み込み負荷を抑えます。 | `npm test -- tests/performance/assets.test.ts` | 画像指定を共通ヘルパーへ集約 |
| 7.3 | 品質コマンドを通す | テスト・Lint・型検査・本番ビルドを一式確認します。 | `npm test` | 警告の原因を対象責務へ戻して整理 |
| 7.4 | Hostingエミュレータで確認 | Vue画面と静的教材の両方を本番同等の経路で確認します。 | `npm run build` | Firebase設定変更は必要最小限に限定 |
| 7.5 | 連携設定を再確認 | Phase 0で確定したproject・target・Web Appの一致を再確認します。 | `npx -y firebase-tools@latest use` | 接続設定を作り直さない |
| 7.6 | MVPをHostingへ再配信 | MVP変更だけをHostingへ再配信し主要導線を確認します。 | `npx -y firebase-tools@latest deploy --only hosting:app` | Functions・Rulesは変更時だけ配信 |

## ゴール / スコープ

### 最小の完成形

- アカウント登録なしでトップページを開ける。
- 線形代数を選び、最初の記事「線形写像」へ移動できる。
- 1記事の中で、座学、実装コード、p5.js可視化、4択問題を一続きで体験できる。
- スマートフォンでも主要操作を完了できる。
- 記事ごとの自己完結フォルダを保ち、GitHubから教材を取得して再利用できる。
- Vue/Vite側はトップ、科目一覧、共通導線を担当し、教材本体は `public/articles/<subject>/<slug>/` に配置する。

### 今回の非ゴール

- ユーザーアカウント、クラウド進捗同期、Firestore、Cloud Functions。
- CMS、管理画面、記事のブラウザ内編集。
- 想定12科目すべての記事制作。
- 動画撮影・編集・YouTube投稿そのもの。
- ブロックエディタの汎用基盤。最初は1記事内の4択問題で学習ループを検証する。

## 前提とリスク

- 現在の `src/` は Vue/Firebase スターター画面であり、README記載の学習体験は未実装。
- `sample/` の線形写像教材を最初の縦切りMVPとして使う。原本を残すか移動するかは Task 4.1 開始時に差分を確認し、履歴を失わない方法を選ぶ。
- キャラクターは最初の表示例として `public/fermiquest/01_Feru.png` を使い、後でメタデータから差し替え可能にする。
- YouTube URLと教材GitHub URLは未確定。値がない場合は空リンクを表示せず、確定後に記事メタデータへ設定する。
- `src/config/project.ts` と `.firebaserc` はプレースホルダーのため、Phase 0が終わるまで機能開発と本番デプロイを始めない。
- 記事内のMathJax/p5.js CDNは通信障害の影響を受ける。MVPでは現状を動作確認し、再現性が不足する場合だけローカル配布へ切り替える。
- 日本語版をMVP対象とする。既存i18n基盤は壊さないが、英語教材の追加は後続計画とする。

## 連携の現在地（2026-10-12確認）

| 領域 | 確認済み | 未完了 / 問題 |
| --- | --- | --- |
| Git | `dev`上で作業中。`dev`は既存`main`の祖先で、dev固有のコミットはない | 未コミット変更あり。mainにはdev後のmerge履歴が4件あるため単純改名は禁止 |
| GitHub | 専用リポジトリ`Rikemen/math-by-making`は参照可能だがbranch参照がなく空 | `origin`はスターターキットを向き、GitHub CLIのトークンは無効 |
| Firebase CLI | `firebase-tools` 15.33.0、CLIログイン済み | ローカルproject aliasは未設定 |
| Firebase Project | `math-by-making`はACTIVE、Hostingサイトも存在 | Firebase Web Appが0件 |
| ローカルFirebase設定 | `firebase.json`のHosting target名は`app` | `.firebaserc`と`src/config/project.ts`がプレースホルダー |
| Firebase MCP | MCP自体は利用可能 | 作業先が`chloe-pilot`で認証も401。修正前は使用禁止 |

## 最優先の完了ゲート

Phase 1へ進む条件は次のすべてを満たすこと。

1. `origin`が `https://github.com/Rikemen/math-by-making.git`、`upstream`がスターターキットを指す。
2. ローカルとGitHubの開発ブランチは`main`だけで、`dev`ブランチが存在しない。
3. `gh auth status`が`Rikemen`を有効なactive accountとして示す。
4. `.firebaserc`、Hosting target、`src/config/project.ts`がすべて`math-by-making`に一致する。
5. Firebase Web Appが1件登録され、Firebase MCPのProject Directoryも本リポジトリになる。
6. test・lint・build・Hostingエミュレータ・初回Hostingデプロイ・公開URL確認がそれぞれ記録される。

このリポジトリはユーザー指定により`main`単一ブランチで運用する。通常のdevブランチ運用は採用せず、main上でも1タスク1コミットとpush前レビューを維持する。

## 詳細ループ

各Loopは約15分を上限とする。Phase 0の連携作業は「読み取り確認 → 変更を1つ実行 → 同じ観点で再確認」、機能開発は「失敗するテスト → 最小実装 → テスト成功 → 小さな整理 → 再テスト」の順で進める。依存関係は番号順。

### Phase 0: Git・GitHub・Firebase連携（最優先）

#### Loop 0.1 — GitHub CLIを再認証

- **目的:** `Rikemen`としてGitHub操作できる状態へ戻す。
- **事前確認:** `gh auth status`で両アカウントのトークン無効を再確認。
- **最小実装:** ユーザーが`gh auth login -h github.com`を実行し、`Rikemen`を認証・activeにする。パスワードや認証コード入力はユーザーが行う。
- **確認:** `gh auth status`
- **整理:** 仕事用アカウントを誤ってactiveにしない。
- **完了条件:** `Rikemen`が有効なactive accountとして表示される。

#### Loop 0.2 — 現在差分をコミット分割

- **目的:** 既存作業を失わず、レビュー可能な単位へ分ける。
- **事前確認:** `git status --short`と`git diff --stat`を保存。
- **最小実装:** ①README・`sample/`・`public/fermiquest/`、②`DEVLOG.md`・開発計画HTMLの2グループに分類。
- **確認:** 各グループに無関係なファイルがないことを`git diff`で確認。
- **整理:** Firebase設定はまだ含めない。
- **完了条件:** 2コミットの対象と順序が確定する。

#### Loop 0.3 — 初期コンテンツをコミット

- **目的:** プロジェクト定義・教材サンプル・キャラクター素材を保存する。
- **事前確認:** 対象だけをstageし`git diff --cached --stat`を確認。
- **最小実装:** 1タスク1コミットで記録する。
- **確認:** `git show --stat --oneline HEAD`
- **整理:** DEVLOGと計画HTMLを混ぜない。
- **完了条件:** README・sample・キャラクター素材だけのコミットになる。

#### Loop 0.4 — 開発計画をコミット

- **目的:** 合意した実装順と連携TODOを独立して保存する。
- **事前確認:** `DEVLOG.md`と`docs/math-by-making-development-plan.html`だけをstage。
- **最小実装:** 計画専用の1コミットを作る。
- **確認:** `git diff --cached`後、`git show --stat --oneline HEAD`
- **整理:** アプリコードやFirebase設定を混ぜない。
- **完了条件:** 計画2ファイルだけがコミットされる。

#### Loop 0.5 — 新コミットをmainへ移す

 - **目的:** 既存mainのmerge履歴を残したまま、Loop 0.3・0.4の内容をmainへ移す。
- **事前確認:** `dev`が`main`の祖先で、main側に4件のmerge履歴があることを確認済み。新規2コミットのhashを記録。
- **最小実装:** `git switch main`後、記録した2コミットを古い順に`git cherry-pick`する。
- **確認:** `git log --oneline --decorate -6`と対象ファイルの差分。
- **整理:** mainをdevへ付け替えず、既存main履歴を保持する。
- **完了条件:** mainに新規2コミット相当の内容が入り、worktreeがcleanになる。

#### Loop 0.6 — devブランチを廃止

- **目的:** ユーザー指定どおりmain単一ブランチへ移行する。
- **事前確認:** Loop 0.3・0.4の内容がmainに存在し、元dev先端hashを記録。
- **最小実装:** 元dev先端へ復旧用ローカルタグを付け、`git branch -D dev`でローカルdevを削除。
- **確認:** `git branch --list`にmainだけが表示される。
- **整理:** 復旧用タグは専用GitHubへpushしない。
- **完了条件:** ローカル開発ブランチがmainだけになる。

#### Loop 0.7 — Git remoteの役割を整理

- **目的:** 元スターターと専用リポジトリの役割を明確に分離する。
- **事前確認:** `origin`が旧スターターを指していることを確認。
- **最小実装:** `git remote rename origin upstream`後、`git remote add origin https://github.com/Rikemen/math-by-making.git`を実行。
- **確認:** `git remote -v`
- **整理:** fetch/push URLを同じ責務へ揃える。
- **完了条件:** `upstream`がスターター、`origin`が専用リポジトリを指す。

#### Loop 0.8 — mainだけをGitHubへ登録

- **目的:** 空の専用リポジトリへmainだけを登録する。
- **事前確認:** `git ls-remote origin`にbranch参照がないことを確認。
- **最小実装:** `git push -u origin main`を実行する。`--all`と`--tags`は使わない。
- **確認:** `git ls-remote origin refs/heads/main`と`git branch -vv`。
- **整理:** devブランチや復旧タグをリモートへ作らない。
- **完了条件:** GitHubにはmainだけがあり、ローカルmainが`origin/main`を追跡する。

#### Loop 0.9 — Firebase aliasを設定

- **目的:** CLIの既定対象を`math-by-making`へ固定する。
- **事前確認:** CLIログインと`math-by-making`がACTIVEであることを再確認。
- **最小実装:** `npx -y firebase-tools@latest use --add`でprojectを選び、alias `default`を設定。
- **確認:** `npx -y firebase-tools@latest use`
- **整理:** 不要な`demo` aliasを作らない。
- **完了条件:** `.firebaserc`のdefaultが`math-by-making`になる。

#### Loop 0.10 — Hosting targetを設定

- **目的:** `firebase.json`の`hosting:app`を既存サイトへ接続する。
- **事前確認:** `https://math-by-making.web.app`に対応するdefault siteが存在することを確認。
- **最小実装:** `npx -y firebase-tools@latest target:apply hosting app math-by-making --project math-by-making`
- **確認:** `npx -y firebase-tools@latest target --project math-by-making`
- **整理:** 新しいHostingサイトを重複作成しない。
- **完了条件:** `.firebaserc`のtarget `app`が`math-by-making`を指す。

#### Loop 0.11 — Firebase Web Appを登録

- **目的:** 現在0件のWeb Appを1件だけ登録する。
- **事前確認:** `apps:list web`が空であることを再確認。
- **最小実装:** `npx -y firebase-tools@latest apps:create web math-by-making --project math-by-making`
- **確認:** `npx -y firebase-tools@latest apps:list web --project math-by-making`
- **整理:** 表示名とApp IDを混同しない。
- **完了条件:** Web Appが1件だけ表示され、App IDを記録できる。

#### Loop 0.12 — SDK設定を反映

- **目的:** `src/config/project.ts`の全プレースホルダーを公式値へ置換する。
- **事前確認:** 対象App IDを再確認。
- **最小実装:** `npx -y firebase-tools@latest apps:sdkconfig web <APP_ID> --project math-by-making`の出力を反映。
- **確認:** `rg "your-|your\." src/config/project.ts`が0件で、projectIdが`math-by-making`。
- **整理:** Firebase Web設定は公開クライアント設定だが、無関係な秘密値は追加しない。
- **完了条件:** SDK初期化が実プロジェクトを参照する。

#### Loop 0.13 — Firebase設定を静的検証

- **目的:** alias・target・SDK設定の食い違いを検出する。
- **事前確認:** `.firebaserc`、`firebase.json`、`src/config/project.ts`を並べて確認。
- **最小実装:** 必要なら設定一致テストを追加し、buildを実行。
- **確認:** `npm run build`
- **整理:** 環境固有値を複数ファイルへ重複させない。
- **完了条件:** 3箇所のproject/site識別子が意図どおり一致する。

#### Loop 0.14 — Firebase MCPを接続し直す

- **目的:** Codexから別プロジェクトを誤操作するリスクをなくす。
- **事前確認:** `firebase_get_environment`が`chloe-pilot`と401を返すことを確認済み。
- **最小実装:** Firebase MCPのProject Directoryを本リポジトリへ変更し、必要な再接続・Codex再起動を行う。
- **確認:** `firebase_get_environment`が本リポジトリと`math-by-making`を返す。
- **整理:** CLIが使える間はMCP不調を回避して設定を書き換えない。
- **完了条件:** MCPのdirectory・project・authenticated userが期待値と一致する。

#### Loop 0.15 — 品質コマンドを通す

- **目的:** 連携前のローカル状態が公開可能か確認する。
- **事前確認:** 失敗時は既存不具合と今回設定変更を分ける。
- **最小実装:** `npm test`、`npm run lint`、`npm run build`を個別に実行。
- **確認:** 3コマンドの終了コードと件数を記録。
- **整理:** 連携外の機能追加を行わない。
- **完了条件:** 失敗0、または既存失敗の原因と次対応が明記される。

#### Loop 0.16 — Hostingエミュレータ確認

- **目的:** 初回デプロイ前にHosting設定とSPA rewriteを確認する。
- **事前確認:** 最新buildが`dist/`に存在することを確認。
- **最小実装:** Hostingエミュレータを起動し、トップ・既存ルート・404を確認。
- **確認:** ローカルURLのHTTPレスポンスと画面表示。
- **整理:** 実害が確認できないrewrite変更は加えない。
- **完了条件:** Hosting経由の主要URLが意図した内容を返す。

#### Loop 0.17 — Firebase連携をコミット

- **目的:** Firebase接続設定を独立してレビュー可能にする。
- **事前確認:** `.firebaserc`、`src/config/project.ts`、必要な検証だけをstage。
- **最小実装:** Firebase連携専用コミットを作成。
- **確認:** `git diff --cached`と`git show --stat --oneline HEAD`
- **整理:** build成果物、認証トークン、ローカルキャッシュを含めない。
- **完了条件:** 接続に必要な最小ファイルだけが記録される。

#### Loop 0.18 — mainの連携変更をpush

- **目的:** Firebase連携コミットをmain単一ブランチの専用リポジトリへ反映する。
- **事前確認:** `git status --short --branch`がcleanで、push対象がFirebase連携コミットだけであることを確認。
- **最小実装:** `git push origin main`を実行する。
- **確認:** `git ls-remote origin refs/heads/main`とローカルHEADの一致。
- **整理:** dev・復旧タグ・他ブランチをpushしない。
- **完了条件:** GitHubのmainがローカルmainと同じcommitを指す。

#### Loop 0.19 — Hostingを初回デプロイ

- **目的:** 連携済みmainの成果物だけを初回公開する。
- **事前確認:** mainでtest・build、active project、target `app`を再確認。
- **最小実装:** `npx -y firebase-tools@latest deploy --project math-by-making --only hosting:app`
- **確認:** CLIのrelease結果と公開URL。
- **整理:** Functions・Firestore Rules・Storage Rulesは配信しない。
- **完了条件:** Hostingリリースが成功し、URLを記録できる。

#### Loop 0.20 — 公開URLを確認

- **目的:** deploy成功と実画面成功を分けて証明する。
- **事前確認:** CLIが示したURLと`https://math-by-making.web.app`の一致を確認。
- **最小実装:** トップ、CSS/JS、SPA fallback、主要コンソールエラーを確認。
- **確認:** 公開URLのHTTP 200とブラウザ表示。
- **整理:** 未実装の学習画面を成功扱いにしない。
- **完了条件:** 公開確認結果、日時、未確認項目をDEVLOGへ追記する。

### Phase 1: スターターから学習サイトの土台へ

#### Loop 1.1 — ホームの受け入れ条件を固定

- **目的:** READMEの価値提案を画面テストに変換する。
- **TDD:** `src/views/__tests__/Home.test.ts` に「Math by Making」「創って学ぶ」「線形代数」を期待する失敗テストを追加。
- **最小実装:** `Home.vue` からスターターのロゴと `HelloWorld` を外し、必要な見出しだけ置く。
- **確認:** `npm test -- src/views/__tests__/Home.test.ts`
- **リファクタ:** テストセットアップの重複だけをヘルパー化。
- **完了条件:** スターター固有文言がなく、3つの期待文言がテストで固定される。

#### Loop 1.2 — デザイントークンを定義

- **目的:** README指定の青系デザインを一元管理する。
- **TDD:** `src/styles/__tests__/tokens.test.ts` で主要CSS変数の存在を検査。
- **最小実装:** `src/styles/base/tokens.css` と `src/styles/base/reset.css` を作り、`src/index.css` を `@import` の入口にする。
- **確認:** `npm test -- src/styles/__tests__/tokens.test.ts`
- **リファクタ:** `index.css` は Tailwind → tokens → reset → layout の順序だけを管理する。
- **完了条件:** 色・余白・文字・フォーカス色が直書きなしで再利用できる。

#### Loop 1.3 — 共通ヘッダーを実装

- **目的:** どのVue画面からもホームと科目へ戻れるようにする。
- **TDD:** `AppHeader.test.ts` にサイト名、ホームリンク、科目リンクのテストを追加。
- **最小実装:** `src/components/AppHeader.vue` を追加し、`Layout.vue` のスターターヘッダーを置換。
- **確認:** `npm test -- src/components/__tests__/AppHeader.test.ts`
- **リファクタ:** ヘッダー固有スタイルは `<style scoped>` に置く。
- **完了条件:** デスクトップと狭幅の両方で主要リンクへフォーカス移動できる。

#### Loop 1.4 — アカウント導線を外す

- **目的:** 初期版を登録不要にする。
- **TDD:** ルート一覧に `account` と `mypage` がないことをテスト。
- **最小実装:** 不要ルート・メニュー・`Layout.vue` の認証監視を外す。Firebase基盤自体は削除しない。
- **確認:** `npm test -- src/router/__tests__/routes.test.ts`
- **リファクタ:** レイアウトからユーザー状態責務を除去。
- **完了条件:** 未ログインで全MVP画面へアクセスできる。

### Phase 2: 記事カタログとフォルダ契約

#### Loop 2.1 — 記事メタデータ型を定義

- **目的:** 科目・記事の追加をコード変更最小で行える形にする。
- **TDD:** 必須項目と公開状態の型テストを追加。
- **最小実装:** `src/content/types.ts` に `SubjectMeta` と `ArticleMeta` を定義。
- **確認:** `npm test -- src/content/__tests__/articles.test.ts`
- **リファクタ:** UI固有の文言を型へ混ぜない。
- **完了条件:** `slug`、`title`、`description`、`status`、`href`、任意の動画・GitHub URLを表現できる。

#### Loop 2.2 — カタログ検証を追加

- **目的:** 記事追加時のURL衝突や設定漏れを早期検出する。
- **TDD:** 重複slug、空タイトル、不正なhrefを失敗させるケースを追加。
- **最小実装:** `src/content/validateCatalog.ts` に純粋な検証関数を追加。
- **確認:** `npm test -- src/content/__tests__/articles.test.ts`
- **リファクタ:** エラー文を記事IDつきで読みやすくする。
- **完了条件:** 不正カタログでテストが明確に失敗する。

#### Loop 2.3 — 線形写像の記事を登録

- **目的:** 最初の教材をVue側の一覧へ接続する。
- **TDD:** 線形代数科目と線形写像記事が1件取得できるテストを追加。
- **最小実装:** `src/content/subjects.ts` と `src/content/articles.ts` に最初のデータを追加。
- **確認:** `npm test -- src/content/__tests__/articles.test.ts`
- **リファクタ:** 画像・教材URLをメタデータへ集約。
- **完了条件:** 公開記事のhrefが `/articles/linear-algebra/linear-mapping/` を指す。

#### Loop 2.4 — 教材ファイル契約を固定

- **目的:** 自己完結記事に必要なファイル不足を自動検出する。
- **TDD:** `index.html`、`sketch.js`、主要クラスの存在を検査するテストを追加。
- **最小実装:** `tests/articles/article-assets.test.ts` に `node:fs` ベースの検査を作る。
- **確認:** `npm test -- tests/articles/article-assets.test.ts`
- **リファクタ:** 今後の記事でも使える `requiredFiles` ヘルパーへ整理。
- **完了条件:** 必須ファイルを1つ外すと対象記事名つきで失敗する。

### Phase 3: ホームと科目ナビゲーション

#### Loop 3.1 — ホームのヒーローを実装

- **目的:** サイトの対象と最初の行動を数秒で理解できるようにする。
- **TDD:** 見出し、短い説明、線形代数へのCTAをテスト。
- **最小実装:** `LearningHero.vue` を作り `Home.vue` に配置。
- **確認:** `npm test -- src/views/__tests__/Home.test.ts`
- **リファクタ:** Home固有の配置とHero固有の見た目を分離。
- **完了条件:** CTAがキーボード操作でき、線形代数ページを指す。

#### Loop 3.2 — キャラクター導入を実装

- **目的:** 既存素材を学習案内役として活用する。
- **TDD:** 画像の `src`、意味のある `alt`、遅延読み込み属性をテスト。
- **最小実装:** Heroに `01_Feru.png` を表示し、装飾か案内役かをaltで明確化。
- **確認:** `npm test -- src/components/__tests__/LearningHero.test.ts`
- **リファクタ:** 画像パスをコンテンツ設定から受け取る。
- **完了条件:** 画像欠落時も見出しとCTAが崩れない。

#### Loop 3.3 — 科目カードを実装

- **目的:** 現在学べる科目と今後の科目を一覧化する。
- **TDD:** 公開中と準備中の表示差をテスト。
- **最小実装:** `SubjectCard.vue` とホームのカード一覧を追加。
- **確認:** `npm test -- src/components/__tests__/SubjectCard.test.ts`
- **リファクタ:** カードはメタデータ入力だけで描画できるようにする。
- **完了条件:** 線形代数はリンク、他科目は準備中として表示される。

#### Loop 3.4 — 科目別ページを追加

- **目的:** 科目内の記事を順番に選べるようにする。
- **TDD:** `/subjects/linear-algebra` で科目名と記事カードが出るテストを追加。
- **最小実装:** `Subject.vue` と動的ルートを追加し、カタログをslugで絞る。
- **確認:** `npm test -- src/views/__tests__/Subject.test.ts`
- **リファクタ:** カタログ検索を `src/content/selectors.ts` へ分離。
- **完了条件:** 不明な科目slugはNotFoundへ遷移する。

#### Loop 3.5 — 準備中表示を追加

- **目的:** 未公開コンテンツを壊れた導線にしない。
- **TDD:** `planned` はリンクなし、`published` はリンクありをテスト。
- **最小実装:** `SubjectCard` と記事カードに公開状態ラベルを追加。
- **確認:** `npm test -- src/components/__tests__/SubjectCard.test.ts`
- **リファクタ:** 状態ラベルと活性判定を共通関数へ整理。
- **完了条件:** 未公開URLへ誤って遷移できない。

### Phase 4: 最初の記事を公開品質へ

#### Loop 4.1 — サンプル教材を公開配置

- **目的:** Vite buildで線形写像教材を配信対象にする。
- **TDD:** 公開先に必須ファイルがない状態で資産テストを失敗させる。
- **最小実装:** `sample/` の必要ファイルを `public/articles/linear-algebra/linear-mapping/` へ安全に複製・整理。
- **確認:** `npm test -- tests/articles/article-assets.test.ts`
- **リファクタ:** 原本との関係を記事READMEに1行で記録。
- **完了条件:** `npm run build` 後も同じ相対構造で `dist/articles/...` に出力される。

#### Loop 4.2 — 教材内パスを整備

- **目的:** HTMLから全スクリプトと画像を確実に読み込む。
- **TDD:** HTMLのローカル `src` / `href` が存在するか検査。
- **最小実装:** 大文字小文字を含むファイル名と読み込み順を修正。
- **確認:** `npm test -- tests/articles/linear-mapping.test.ts`
- **リファクタ:** 使用していない依存参照だけを削除。
- **完了条件:** ローカル参照の404候補がゼロになる。

#### Loop 4.3 — 記事共通シェルを追加

- **目的:** standalone記事にもサイトとしての現在地と戻り道を持たせる。
- **TDD:** サイト名、パンくず、記事名、学習目標、戻るリンクを検査。
- **最小実装:** `index.html` 冒頭へ意味的な `header` / `nav` / `main` を追加。
- **確認:** `npm test -- tests/articles/linear-mapping.test.ts`
- **リファクタ:** `article.css` に記事共通スタイル、教材固有スタイルをコメントで分離。
- **完了条件:** JavaScript無効時も座学本文と戻るリンクを読める。

#### Loop 4.4 — タブ操作を改善

- **目的:** 座学・実装タブをマウス以外でも操作可能にする。
- **TDD:** `role=tab`、`aria-selected`、関連パネル、矢印キー操作を検査。
- **最小実装:** タブ初期化と状態更新をVanilla JSで追加。
- **確認:** `npm test -- tests/articles/linear-mapping-tabs.test.ts`
- **リファクタ:** クリックとキー操作を同じ選択関数へ集約。
- **完了条件:** Tabキーと左右キーで両パネルを選べる。

#### Loop 4.5 — p5キャンバスをレスポンシブ化

- **目的:** 600px固定キャンバスをスマホ幅に収める。
- **TDD:** 表示領域に応じるサイズ計算を純粋関数でテスト。
- **最小実装:** コンテナ幅から正方形サイズを決め、`windowResized` で再描画。
- **確認:** `npm test -- tests/articles/linear-mapping-canvas.test.ts`
- **リファクタ:** 数学計算と表示サイズ計算を分離。
- **完了条件:** 360px幅で横スクロールせず、タップでアニメーション停止・再開できる。

#### Loop 4.6 — ソース取得導線を追加

- **目的:** READMEにある「コードをDLして利用」を満たす。
- **TDD:** GitHub URL未設定時はリンク非表示、設定時は安全な外部リンクになることをテスト。
- **最小実装:** メタデータからコード閲覧・取得ボタンを描画。
- **確認:** `npm test -- tests/articles/linear-mapping.test.ts`
- **リファクタ:** `target=_blank` の安全属性を共通生成関数へ集約。
- **完了条件:** ダミーURLを公開せず、確定値だけを表示する。

### Phase 5: 「読む」から「創って確かめる」へ

#### Loop 5.1 — 学習目標チェックを追加

- **目的:** 学習前後で到達点を自己確認できるようにする。
- **TDD:** 目標一覧の初期未完了と切替をテスト。
- **最小実装:** 記事内に3項目のチェックリストを追加。
- **確認:** `npm test -- tests/articles/linear-mapping-progress.test.ts`
- **リファクタ:** 目標文を配列データへ切り出す。
- **完了条件:** 目標状態を色以外でも判別できる。

#### Loop 5.2 — 4択問題データを追加

- **目的:** 線形写像の定義を能動的に確認する。
- **TDD:** 選択肢数、正解が1つ、解説があることをテスト。
- **最小実装:** 最初の1問を `quiz-data.js` に定義し、ラジオ選択肢を描画。
- **確認:** `npm test -- tests/articles/linear-mapping-quiz.test.ts`
- **リファクタ:** 問題データとDOM生成を分離。
- **完了条件:** 問題文・4択・回答ボタンが意味的HTMLで表示される。

#### Loop 5.3 — 回答フィードバックを実装

- **目的:** 正誤と理由を即時に返す。
- **TDD:** 未選択、正解、不正解の3状態をテスト。
- **最小実装:** 判定後にテキスト解説と再回答操作を表示。
- **確認:** `npm test -- tests/articles/linear-mapping-quiz.test.ts`
- **リファクタ:** 判定ロジックをDOMから独立させる。
- **完了条件:** 読み上げ環境へ結果が通知され、色だけに依存しない。

#### Loop 5.4 — 端末内の進捗保存を追加

- **目的:** ログインなしで再訪時にチェック状況を復元する。
- **TDD:** 保存、復元、壊れたJSONのフォールバックをテスト。
- **最小実装:** 記事slug単位で目標・問題完了をlocalStorageへ保存。
- **確認:** `npm test -- tests/articles/linear-mapping-progress.test.ts`
- **リファクタ:** 保存キーとJSON処理を小さなアダプタへ集約。
- **完了条件:** 保存不可環境でも学習操作自体は継続できる。

### Phase 6: 動画・共有・モバイル品質

#### Loop 6.1 — 動画導線を追加

- **目的:** 動画がある記事だけ補助教材を表示する。
- **TDD:** URLなし、YouTube URLあり、不許可ホストの3ケースをテスト。
- **最小実装:** `VideoResource.vue` または記事用同等部品を追加し、プライバシー強化URLを使う。
- **確認:** `npm test -- src/components/__tests__/VideoResource.test.ts`
- **リファクタ:** URL検証と表示を分離。
- **完了条件:** 未確定URLで空iframeや壊れたボタンが出ない。

#### Loop 6.2 — ページメタ情報を設定

- **目的:** ブラウザタブと共有時に教材内容を識別できるようにする。
- **TDD:** Home・科目ページのtitle/description生成をテスト。
- **最小実装:** 既存 `@unhead/vue` でVue画面のメタ情報を設定し、記事HTMLにもtitle/descriptionを追加。
- **確認:** `npm test -- src/views/__tests__/Subject.test.ts`
- **リファクタ:** タイトル書式を共通関数化。
- **完了条件:** 各主要画面で固有タイトルと説明が得られる。

#### Loop 6.3 — モバイル回帰テストを追加

- **目的:** 360px幅の主要レイアウト崩れを継続検出する。
- **TDD:** ナビ開閉、カード1列、横はみ出し防止の状態をテスト。
- **最小実装:** コンポーネント所有のmedia queryだけ追加。
- **確認:** `npm test -- src/components/__tests__/responsive.test.ts`
- **リファクタ:** 全体に効く例外だけ `src/styles/responsive/` に置く。
- **完了条件:** 主要操作要素が44px相当のタップ領域を持つ。

### Phase 7: 品質保証とHosting公開

#### Loop 7.1 — キーボード・読み上げ確認

- **目的:** 主要フローを支援技術でも完了可能にする。
- **TDD:** 見出し階層、ランドマーク、名前のないボタン、フォーカス順を検査。
- **最小実装:** ラベル、ARIA、focus-visibleを必要箇所だけ修正。
- **確認:** `npm test -- src/components/__tests__/accessibility.test.ts`
- **リファクタ:** 共通フォーカス表現はトークン化。
- **完了条件:** ホームから問題回答までキーボードだけで到達できる。

#### Loop 7.2 — 画像と初期表示を最適化

- **目的:** モバイル回線での初期表示負荷を抑える。
- **TDD:** 非ヒーロー画像のlazy属性、寸法指定、過大ファイル検知を追加。
- **最小実装:** 画像寸法・loading・必要な圧縮版を設定。
- **確認:** `npm test -- tests/performance/assets.test.ts`
- **リファクタ:** 画像メタデータの重複を解消。
- **完了条件:** レイアウトシフト要因と不要な先読みが減る。

#### Loop 7.3 — 品質コマンドを通す

- **目的:** MVP全体の回帰をまとめて検出する。
- **TDD:** 追加テストを含む全テストを先に実行し、失敗を対象Loopへ戻す。
- **最小実装:** 必要な修正だけ行い、`npm test`、`npm run lint`、`npm run build` を順に実行。
- **確認:** `npm test && npm run lint && npm run build`
- **リファクタ:** このLoopで新機能や広範な設計変更を混ぜない。
- **完了条件:** 3コマンドが警告を含めて説明可能な状態で終了する。

#### Loop 7.4 — Hostingエミュレータで確認

- **目的:** SPAと静的記事の配信経路を本番前に確認する。
- **TDD:** 先にbuildし、`dist/articles/.../index.html` の存在を検査。
- **最小実装:** Hostingエミュレータで `/`、科目ページ、記事URL、404を確認。
- **確認:** `npm run build` 後にFirebase Hostingエミュレータで手動スモーク。
- **リファクタ:** rewrite追加は実際に必要な場合だけ行う。
- **完了条件:** Vue deep linkと静的記事が競合せず200で表示される。

#### Loop 7.5 — 連携設定を再確認

- **目的:** Phase 0で確定した接続先がMVP開発中に変わっていないことを確認する。
- **TDD:** `.firebaserc`、`firebase.json`、`src/config/project.ts` のproject/site識別子一致を再検査。
- **最小実装:** 不一致がある場合だけ、Phase 0の記録に沿って修正する。
- **確認:** `npx -y firebase-tools@latest use`、Hosting target、Web App一覧。
- **リファクタ:** 接続設定を別名で重複作成しない。
- **完了条件:** active project、target `app`、SDK設定がすべて`math-by-making`を示す。

#### Loop 7.6 — MVPをHostingへ再配信

- **目的:** Phase 0の初回公開後に追加したMVPだけを再配信する。
- **TDD:** デプロイ前に `npm test` と `npm run build` を再実行。
- **最小実装:** `hosting:app` のみをデプロイし、Functions/Rulesは対象外にする。
- **確認:** 公開URLでホーム→線形代数→記事→タブ→可視化→問題回答を順に確認。
- **リファクタ:** デプロイ後の修正は別Loopとしてテストから始める。
- **完了条件:** 公開URL、デプロイ日時、確認結果、未確認端末をDEVLOGへ追記する。

## 検証戦略

1. 各Loopで対象テストを赤→緑にし、整理後に同じテストを再実行する。
2. Phase終端で関連テスト群をまとめて実行する。
3. Phase 4以降は360px、768px、1280px相当で表示確認する。
4. Phase 7で `npm test`、`npm run lint`、`npm run build` を通す。
5. ローカル成功、Hostingデプロイ成功、公開URL上の操作成功を別々に記録する。
6. 実機のタッチ操作・音声読み上げ・外部動画再生は、実施したものだけを確認済みにする。

## ロールバック / フォローアップ

- 各Phaseは独立した小さなコミット候補にし、問題があれば直前Phaseまで戻せるようにする。
- `sample/` と既存キャラクター画像は、公開配置が安定するまで削除・改名しない。
- 認証・Firestore・FunctionsはMVPから外すため、既存基盤を削除せず接続だけ外す。
- 次の記事は、線形写像の公開後に同じフォルダ契約と資産テストを使って追加する。
- 4択で学習効果を確認してから、ブロック式問題の汎用設計を別計画に分ける。
