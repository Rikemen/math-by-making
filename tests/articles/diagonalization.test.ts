import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const diagonalizationDirectory = path.resolve(process.cwd(), "public/articles/linear-algebra/diagonalization");

const parseArticle = (): Document => {
  const html = fs.readFileSync(path.resolve(diagonalizationDirectory, "index.html"), "utf8");
  return new DOMParser().parseFromString(html, "text/html");
};

const isLocalReference = (reference: string): boolean =>
  !reference.startsWith("http://") && !reference.startsWith("https://") && !reference.startsWith("//");

describe("diagonalization summary local assets", () => {
  it("HTMLから参照するローカルファイルがすべて存在する", () => {
    const document = parseArticle();
    const references = [
      ...[...document.querySelectorAll<HTMLScriptElement>("script[src]")].map((element) => element.getAttribute("src") ?? ""),
      ...[...document.querySelectorAll<HTMLLinkElement>("link[href]")].map((element) => element.getAttribute("href") ?? ""),
    ].filter(isLocalReference);

    expect(references.filter((reference) => !fs.existsSync(path.resolve(diagonalizationDirectory, reference)))).toEqual([]);
  });
});

describe("diagonalization summary article shell", () => {
  it("サイト内の現在地と戻り道を意味的HTMLで示す", () => {
    const document = parseArticle();
    const breadcrumb = document.querySelector<HTMLElement>('nav[aria-label="パンくずリスト"]');
    const backLink = document.querySelector<HTMLAnchorElement>('footer a[href="/ja/subjects/linear-algebra"]');

    expect(document.querySelector("body > header")?.textContent).toContain("Math by Making");
    expect(breadcrumb?.textContent).toContain("ホーム");
    expect(breadcrumb?.textContent).toContain("線形代数");
    expect(breadcrumb?.querySelector('[aria-current="page"]')?.textContent).toContain("行列の対角化");
    expect(document.querySelector("main article h1")?.textContent).toContain("行列の対角化");
    expect(backLink?.textContent).toContain("教材一覧へ戻る");
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
    expect(pictograms && pictograms.length).toBeGreaterThanOrEqual(3);
  });

  it("ロードマップから第1回記事へのリンクを提供する", () => {
    const document = parseArticle();
    const link = document.querySelector<HTMLAnchorElement>('a[href="what-and-why/"]');
    expect(link).not.toBeNull();
  });

  it("記事スタイルに枠はみ出し防止（MathJax横スクロール・タイトル折り返し・ボックス防壁）を定義する", () => {
    const styles = fs.readFileSync(path.resolve(diagonalizationDirectory, "article.css"), "utf8");

    expect(styles).toContain('mjx-container[display="true"]');
    expect(styles).toContain("overflow-x: auto");
    expect(styles).toContain("overflow-wrap: break-word");
    expect(styles).not.toMatch(/\.article-title__english\s*\{[^}]*white-space:\s*nowrap/);
  });
});
