import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const whatAndWhyDirectory = path.resolve(process.cwd(), "public/articles/linear-algebra/diagonalization/what-and-why");

const parseArticle = (): Document => {
  const html = fs.readFileSync(path.resolve(whatAndWhyDirectory, "index.html"), "utf8");
  return new DOMParser().parseFromString(html, "text/html");
};

const isLocalReference = (reference: string): boolean =>
  !reference.startsWith("http://") && !reference.startsWith("https://") && !reference.startsWith("//");

describe("diagonalization what-and-why local assets", () => {
  it("HTMLから参照するローカルファイルがすべて存在する", () => {
    const document = parseArticle();
    const references = [
      ...[...document.querySelectorAll<HTMLScriptElement>("script[src]")].map((element) => element.getAttribute("src") ?? ""),
      ...[...document.querySelectorAll<HTMLLinkElement>("link[href]")].map((element) => element.getAttribute("href") ?? ""),
    ].filter(isLocalReference);

    expect(references.filter((reference) => !fs.existsSync(path.resolve(whatAndWhyDirectory, reference)))).toEqual([]);
  });

  it("教材が使用するスクリプトを依存順に読み込む", () => {
    const document = parseArticle();
    const localScripts = [...document.querySelectorAll<HTMLScriptElement>("script[src]")]
      .map((element) => element.getAttribute("src") ?? "")
      .filter(isLocalReference);

    expect(localScripts).toEqual([
      "../../../shared/article-header.js",
      "VectorSpaceElement.js",
      "Matrix.js",
      "canvas-size.js",
      "sketch.js",
      "tabs.js",
      "source-link.js",
    ]);
  });
});

describe("diagonalization what-and-why article shell", () => {
  it("親記事・科目・ホームへの階層パンくずリストを持つ", () => {
    const document = parseArticle();
    const breadcrumb = document.querySelector<HTMLElement>('nav[aria-label="パンくずリスト"]');
    const parentLink = breadcrumb?.querySelector<HTMLAnchorElement>('a[href="/articles/linear-algebra/diagonalization/"]');
    const subjectLink = breadcrumb?.querySelector<HTMLAnchorElement>('a[href="/ja/subjects/linear-algebra"]');
    const currentPage = breadcrumb?.querySelector<HTMLElement>('[aria-current="page"]');

    expect(parentLink?.textContent).toContain("行列の対角化");
    expect(subjectLink?.textContent).toContain("線形代数");
    expect(currentPage?.textContent).toContain("行列の対角化とは何か？なぜ対角化するか？");
  });

  it("フッターにまとめ記事と科目一覧への戻りリンクを提供する", () => {
    const document = parseArticle();
    const parentBackLink = document.querySelector<HTMLAnchorElement>('footer a[href="/articles/linear-algebra/diagonalization/"]');
    const subjectBackLink = document.querySelector<HTMLAnchorElement>('footer a[href="/ja/subjects/linear-algebra"]');

    expect(parentBackLink?.textContent).toContain("まとめへ戻る");
    expect(subjectBackLink?.textContent).toContain("線形代数の教材一覧へ戻る");
  });

  it("記事の学習目標を3項目示す", () => {
    const document = parseArticle();
    const goals = document.querySelectorAll("[aria-labelledby='learning-goals-title'] li");

    expect(document.querySelector("#learning-goals-title")?.textContent).toBe("この教材の学習目標");
    expect(goals).toHaveLength(3);
  });

  it("絵文字を使わずピクトグラム（SVG）を使用する", () => {
    const document = parseArticle();
    const article = document.querySelector("main article");
    const textContent = article?.textContent ?? "";

    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(textContent).not.toMatch(emojiRegex);

    const pictograms = article?.querySelectorAll("svg.article-icon");
    expect(pictograms && pictograms.length).toBeGreaterThanOrEqual(4);
  });

  it("座学タブと実装タブ、可視化キャンバスを備える", () => {
    const document = parseArticle();
    const tabs = document.querySelectorAll('[role="tab"]');
    const canvas = document.querySelector('#diagonalization-canvas');

    expect(tabs).toHaveLength(2);
    expect(canvas).not.toBeNull();
  });

  it("計算量と実行時間の比較グラフおよびベンチマーク操作UIを備える", () => {
    const document = parseArticle();
    const btnOps = document.querySelector('#btn-mode-operations');
    const btnTime = document.querySelector('#btn-mode-time');
    const btnRun = document.querySelector('#btn-run-benchmark');
    const status = document.querySelector('#canvas-benchmark-status');

    expect(btnOps).not.toBeNull();
    expect(btnTime).not.toBeNull();
    expect(btnRun).not.toBeNull();
    expect(status).not.toBeNull();
  });

  it("記事スタイルに枠はみ出し防止（MathJax横スクロール・タイトル折り返し・ボックス防壁）を定義する", () => {
    const styles = fs.readFileSync(path.resolve(whatAndWhyDirectory, "article.css"), "utf8");

    expect(styles).toContain('mjx-container[display="true"]');
    expect(styles).toContain("overflow-x: auto");
    expect(styles).toContain("overflow-wrap: break-word");
    expect(styles).not.toMatch(/\.article-title__english\s*\{[^}]*white-space:\s*nowrap/);
  });

  it("sketch.js はタッチスクロールを抑制する return false を返さない", () => {
    const sketchScript = fs.readFileSync(path.resolve(whatAndWhyDirectory, "sketch.js"), "utf8");

    // touchMoved 内で return false を返すと p5.js がページ全体のスクロールを preventDefault する
    expect(sketchScript).not.toMatch(/function\s+touchMoved\s*\([^)]*\)\s*\{[^}]*return\s+false/);
  });

  it("HTMLおよびスクリプトから停止・危険な polyfill.io 参照が排除されている", () => {
    const html = fs.readFileSync(path.resolve(whatAndWhyDirectory, "index.html"), "utf8");

    expect(html).not.toContain("polyfill.io");
  });
});
