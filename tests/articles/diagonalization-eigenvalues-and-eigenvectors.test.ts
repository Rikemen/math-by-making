import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const articleDirectory = path.resolve(
  process.cwd(),
  "public/articles/linear-algebra/diagonalization/eigenvalues-and-eigenvectors"
);

const parseArticle = (): Document => {
  const html = fs.readFileSync(path.resolve(articleDirectory, "index.html"), "utf8");
  return new DOMParser().parseFromString(html, "text/html");
};

const isLocalReference = (reference: string): boolean =>
  !reference.startsWith("http://") && !reference.startsWith("https://") && !reference.startsWith("//");

describe("diagonalization eigenvalues-and-eigenvectors local assets", () => {
  it("HTMLから参照するローカルファイルがすべて存在する", () => {
    const document = parseArticle();
    const references = [
      ...[...document.querySelectorAll<HTMLScriptElement>("script[src]")].map((element) => element.getAttribute("src") ?? ""),
      ...[...document.querySelectorAll<HTMLLinkElement>("link[href]")].map((element) => element.getAttribute("href") ?? ""),
    ].filter(isLocalReference);

    expect(references.filter((reference) => !fs.existsSync(path.resolve(articleDirectory, reference)))).toEqual([]);
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

describe("diagonalization eigenvalues-and-eigenvectors article shell", () => {
  it("親記事・科目・ホームへの階層パンくずリストを持つ", () => {
    const document = parseArticle();
    const breadcrumb = document.querySelector<HTMLElement>('nav[aria-label="パンくずリスト"]');
    const parentLink = breadcrumb?.querySelector<HTMLAnchorElement>('a[href="/articles/linear-algebra/diagonalization/"]');
    const subjectLink = breadcrumb?.querySelector<HTMLAnchorElement>('a[href="/ja/subjects/linear-algebra"]');
    const currentPage = breadcrumb?.querySelector<HTMLElement>('[aria-current="page"]');

    expect(parentLink?.textContent).toContain("行列の対角化");
    expect(subjectLink?.textContent).toContain("線形代数");
    expect(currentPage?.textContent).toContain("固有値と固有ベクトルの幾何学的意味");
  });

  it("フッターにまとめ記事、第1回、および科目一覧へのリンクを提供する", () => {
    const document = parseArticle();
    const parentBackLink = document.querySelector<HTMLAnchorElement>('footer a[href="/articles/linear-algebra/diagonalization/"]');
    const part1Link = document.querySelector<HTMLAnchorElement>('footer a[href="/articles/linear-algebra/diagonalization/what-and-why/"]');
    const subjectBackLink = document.querySelector<HTMLAnchorElement>('footer a[href="/ja/subjects/linear-algebra"]');

    expect(parentBackLink?.textContent).toContain("まとめへ戻る");
    expect(part1Link?.textContent).toContain("第1回");
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
    const canvas = document.querySelector('#eigen-canvas');

    expect(tabs).toHaveLength(2);
    expect(canvas).not.toBeNull();
  });

  it("固有値と幾何学的可視化の操作UIを備える", () => {
    const document = parseArticle();
    const btnEigen1 = document.querySelector('#btn-preset-eigen1');
    const btnEigen2 = document.querySelector('#btn-preset-eigen2');
    const btnGeneral = document.querySelector('#btn-preset-general');
    const btnVector = document.querySelector('#btn-mode-vector');
    const btnCircle = document.querySelector('#btn-mode-circle');
    const btnRotate = document.querySelector('#btn-toggle-rotate');
    const btnReset = document.querySelector('#btn-reset-vector');

    expect(btnEigen1).not.toBeNull();
    expect(btnEigen2).not.toBeNull();
    expect(btnGeneral).not.toBeNull();
    expect(btnVector).not.toBeNull();
    expect(btnCircle).not.toBeNull();
    expect(btnRotate).not.toBeNull();
    expect(btnReset).not.toBeNull();
  });

  it("リアルタイム計算ステータス表示カードを備える", () => {
    const document = parseArticle();
    const valX = document.querySelector('#val-vector-x');
    const valAx = document.querySelector('#val-vector-ax');
    const valAngle = document.querySelector('#val-angle-diff');
    const valLambda = document.querySelector('#val-lambda');

    expect(valX).not.toBeNull();
    expect(valAx).not.toBeNull();
    expect(valAngle).not.toBeNull();
    expect(valLambda).not.toBeNull();
  });
});
