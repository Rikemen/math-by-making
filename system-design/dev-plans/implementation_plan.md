# 実装計画書: 行列の対角化（まとめ記事 ＋ 子記事）の階層追加

## 1. 目的

線形代数科目の教材拡張として、長編シリーズとなる「行列の対角化」を体系的に整理・提供するための1階層深い記事構造（まとめ記事 ＋ 子記事）を設計・導入する。

- 線形写像と同階層に、シリーズのハブとなるまとめ記事『行列の対角化』を配置する。
- その配下の第1弾として、導入・意義を体験する記事『行列の対角化とは何か？なぜ対角化するか？』を配置する。
- 既存のサイト設計思想（Math × Code、デザイントークン、PWA更新、アクセシビリティ、SVGピクトグラム等）に完全準拠し、保守性と拡張性の高いデータモデル・ファイル構成を確立する。

---

## 2. 現状分析 (Current State vs. Ideal State)

### 2.1 現状 (Current State)
- **単一階層構造**: 科目（`subjects`）直下にフラットに記事（`articles`）が配置されている。
  - 例: `/subjects/linear-algebra` → `/articles/linear-algebra/linear-mapping/`
- **データモデルの制約**: `src/content/types.ts` の `ArticleMeta` は `subjectSlug` のみを持ち、親記事（シリーズハブ）との親子関係（`parentSlug`）を表現できない。
- **URL検証の制約**: `src/content/validateCatalog.ts` は `/articles/${subjectSlug}/${slug}/` の2階層URLのみを想定している。
- **ディレクトリ構造**: `public/articles/{subject}/{article}/` であり、配下に子記事を持つ前提の設計になっていない。
- **パンくず・相対パス**: 記事共通のヘッダー・デザイントークンへの参照が `../../shared/` の深さ（2階層）固定になっている。

### 2.2 理想の状態 (Ideal State)
- **階層化された URL / ディレクトリ構造**:
  - まとめ記事 (Hub): `/articles/linear-algebra/diagonalization/` (`public/articles/linear-algebra/diagonalization/index.html`)
  - 子記事 (Sub-article 1): `/articles/linear-algebra/diagonalization/what-and-why/` (`public/articles/linear-algebra/diagonalization/what-and-why/index.html`)
- **拡張されたメタデータモデル**:
  - `ArticleMeta` に `parentSlug?: string` および `isSummary?: boolean` を追加。
  - `validateCatalog` が `parentSlug` の有無に応じて期待URL（`/articles/${subjectSlug}/${slug}/` または `/articles/${subjectSlug}/${parentSlug}/${slug}/`）を自動判定・検証。
  - 科目画面（`Subject.vue`）ではトップレベル記事（線形写像、行列の対角化まとめ）をカード一覧として表示。
- **パンくずナビゲーションの連動**:
  - まとめ記事: ホーム > 線形代数 > 行列の対角化
  - 子記事: ホーム > 線形代数 > 行列の対角化 > 行列の対角化とは何か？なぜ対角化するか？
- **相対パスの整合性**:
  - まとめ記事: `../../shared/`
  - 子記事（1階層深い）: `../../../shared/`
- **デザイン・教材品質の遵守**:
  - `DESIGN.md` のデザイントークン（`--color-brand-700`、`--color-surface-soft` 等）に準拠。
  - 絵文字を使用せず SVG ピクトグラムを採用。
  - 座学（Theory）と実装（Practice）の2タブ構成、p5.js による可視化。

---

## 3. アーキテクチャとディレクトリ構造

```
public/articles/
├── shared/
│   ├── tokens.css
│   ├── article-header.css
│   └── article-header.js
└── linear-algebra/
    ├── linear-mapping/                     # 既存記事（線形写像）
    │   ├── index.html
    │   └── ...
    └── diagonalization/                    # 新規: 行列の対角化（まとめ記事）
        ├── index.html                      # まとめ記事本体（シリーズ目次・ロードマップ・導入）
        ├── article.css                     # まとめ記事固有スタイル
        ├── README.md                       # シリーズ概要
        └── what-and-why/                   # 新規: 配下の第1回記事
            ├── index.html                  # 第1回記事本体（座学＋実装タブ）
            ├── article.css                 # 記事スタイル
            ├── article-mobile.css          # モバイル用スタイル
            ├── canvas-size.js              # キャンバスサイズ調整
            ├── Matrix.js                   # 行列演算クラス（累乗・対角化）
            ├── VectorSpaceElement.js       # 空間要素クラス
            ├── sketch.js                   # p5.js 可視化スクリプト
            ├── tabs.js                     # タブ切り替え制御
            ├── source-link.js              # GitHubソースリンク
            └── README.md                   # 記事概要
```

---

## 4. 提案される変更 (Proposed Changes)

### Phase 1: データモデルとカタログの階層拡張 (TypeScript)
1. **`src/content/types.ts`**:
   - `ArticleMeta` に `parentSlug?: string` と `isSummary?: boolean` を追加。
2. **`src/content/validateCatalog.ts`**:
   - `articleId` を親スラッグ対応（`article:${subjectSlug}/${parentSlug}/${slug}`）に更新。
   - `expectedHref` を親スラッグの有無に応じて動的判定するように更新。
3. **`src/content/selectors.ts`**:
   - `getTopLevelArticlesBySubjectSlug`（親スラッグなしのトップレベル記事のみ取得）を追加。
   - `getSubArticlesByParentSlug`（指定した親スラッグを持つ子記事一覧を取得）を追加。
   - `getArticlesBySubjectSlug` は後方互換性のためトップレベル記事を返すようにする。
4. **`src/content/articles.ts`**:
   - `diagonalizationArticle`（まとめ記事: `slug: "diagonalization"`, `isSummary: true`）を追加。
   - `diagonalizationWhatAndWhyArticle`（子記事: `slug: "what-and-why"`, `parentSlug: "diagonalization"`）を追加。
5. **テスト (`src/content/__tests__/articles.test.ts`, `src/views/__tests__/Subject.test.ts`)**:
   - 階層化カタログの検証テストを追加。
   - 科目画面で「線形写像」と「行列の対角化」の両方がカード表示されることを検証。

### Phase 2: 『行列の対角化』まとめ記事の作成
- **配置**: `public/articles/linear-algebra/diagonalization/index.html`
- **内容**:
  - ヘッダー（PWA更新対応、パンくず: ホーム > 線形代数 > 行列の対角化）
  - タイトル: 行列の対角化 (Matrix Diagonalization)
  - リード文: 空間の変換を行列の「特等席」から見つめ直し、複雑な多次元計算を1次元の集まりに分解する強力な道具を学びます。
  - この教材の学習目標（3点）
  - なぜ対角化を学ぶのか（直感的イメージ・モチベーション解説）
  - シリーズロードマップ（全5回カリキュラム）:
    - 第1回: 行列の対角化とは何か？なぜ対角化するか？（公開中・リンク付きカード）
    - 第2回: 固有値と固有ベクトルの幾何学的意味（準備中）
    - 第3回: 対角化の具体的な計算手順とアルゴリズム（準備中）
    - 第4回: 対角化ができる条件（準備中）
    - 第5回: 対角化の応用（行列累乗、漸化式、微分方程式）（準備中）
  - フッター戻りリンク: 線形代数の教材一覧へ戻る

### Phase 3: 配下の第1回記事『行列の対角化とは何か？なぜ対角化するか？』の作成
- **配置**: `public/articles/linear-algebra/diagonalization/what-and-why/index.html`
- **内容**:
  - ヘッダー（PWA更新対応、パンくず: ホーム > 線形代数 > 行列の対角化 > 行列の対角化とは何か？なぜ対角化するか？）
  - タイトル: 行列の対角化とは何か？なぜ対角化するか？ (What is Diagonalization and Why?)
  - リード文: 対角化の数学的定義と幾何学的意味を掴み、なぜわざわざ対角化を行うのか（計算高速化や応用）をコードと可視化で確かめます。
  - この教材の学習目標（3点）
  - **座学 (Theory) タブ**:
    1. 最も扱いやすい行列「対角行列」の秘密（累乗 $D^n$ が一瞬で計算できる理由）
    2. 行列の対角化とは何か？（正則行列 $P$ による $P^{-1} A P = D$ の定義と座標変換の幾何学的意味）
    3. なぜ対角化するのか？（4大モチベーション: 累乗計算の爆速化、連立漸化式・フィボナッチ、連立微分方程式の変数分離、実世界応用）
  - **実装 (Practice) タブ**:
    1. JavaScript による行列演算（$A^n$ 愚直計算 vs $P D^n P^{-1}$ の計算ステップ・時間比較）
    2. p5.js による可視化（一般の基底では歪んで見える空間が、固有ベクトルの方向から見ると単なる独立した伸縮になる様子）
  - フッター戻りリンク:
    - 「行列の対角化 まとめへ戻る」 (`/articles/linear-algebra/diagonalization/`)
    - 「線形代数の教材一覧へ戻る」 (`/ja/subjects/linear-algebra`)

### Phase 4: アセット契約テストと品質保証
- `tests/articles/diagonalization.test.ts`: まとめ記事のシェル・アセットテスト
- `tests/articles/diagonalization-what-and-why.test.ts`: 第1回記事のシェル・アセットテスト
- `tests/articles/article-assets.test.ts`: 必須ファイル検証契約の追加
- 全テストスイートの実行 (`npm test`)、リント (`npm run lint`)、ビルド (`npm run build`) の通過確認

---

## 5. 検証計画 (Verification Plan)

### 5.1 自動テスト
```bash
# カタログ・データモデルのテスト
npm test -- src/content/__tests__/articles.test.ts

# 科目ビューの表示テスト
npm test -- src/views/__tests__/Subject.test.ts

# 記事アセット契約およびHTMLシェルテスト
npm test -- tests/articles/

# 全テストスイート・リント・ビルド
npm test && npm run lint && npm run build
```

### 5.2 手動確認・ブラウザ確認
1. **科目一覧画面 (`/ja/subjects/linear-algebra`)**:
   - 「線形写像」と「行列の対角化」の2枚のカードが表示されていること。
2. **まとめ記事 (`/articles/linear-algebra/diagonalization/`)**:
   - パンくずが「ホーム > 線形代数 > 行列の対角化」となっていること。
   - シリーズ目次が表示され、第1回のリンクから子記事へ遷移できること。
3. **第1回記事 (`/articles/linear-algebra/diagonalization/what-and-why/`)**:
   - パンくずが「ホーム > 線形代数 > 行列の対角化 > 行列の対角化とは何か？なぜ対角化するか？」となっていること。
   - 座学タブと実装タブが正しく切り替わること。
   - p5.js のアニメーションが動作すること。
   - パンくずおよびフッターの戻りリンクが正しく機能すること。

---

## 6. リスク評価と対策 (Risk Assessment)

| リスク | 影響度 | 発生確率 | 対策 |
|---|---|---|---|
| 階層深化（3階層）による相対パスのリンク切れ | 高 | 中 | `what-and-why` からは `../../../shared/` を正確に指定。`isLocalReference` テストによりすべての `script` / `link` の実在を自動検証。 |
| カタログ検証 (`validateCatalog.ts`) の回帰 | 高 | 低 | `parentSlug` の有無に応じた条件分岐をテスト駆動開発（TDD）で実装し、既存記事（線形写像）の検証が壊れないことを担保。 |
| 既存テスト（`Subject.test.ts` 等）の固定長アサーション失敗 | 中 | 高 | `expect(...).toHaveLength(1)` などの箇所を、トップレベル教材2件（線形写像＋行列の対角化）を正しく期待するようにテストを更新。 |
| 絵文字混入によるデザインシステム規約違反 | 低 | 低 | ピクトグラムはすべてインライン SVG（`svg.article-icon`）で統一し、絵文字検知テストで担保。 |

---

## 7. 完了条件 (Definition of Done)

1. `src/content/` において、まとめ記事および配下の子記事を表現・検証できること。
2. 科目画面（線形代数）で「線形写像」と「行列の対角化」が同階層のカードとして並ぶこと。
3. まとめ記事から第1回記事へ、第1回記事からまとめ記事および科目画面へ相互にナビゲーションできること。
4. 第1回記事が「座学」「実装」「可視化」を備え、直感的かつコードで学べる状態になっていること。
5. `npm test`、`npm run lint`、`npm run build` がすべて警告・エラーなく通ること。
