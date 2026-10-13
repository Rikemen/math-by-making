import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

export const articleDirectory = path.resolve(process.cwd(), "public/articles/linear-algebra/linear-mapping");
export const articleHtml = fs.readFileSync(path.resolve(articleDirectory, "index.html"), "utf8");

export const parseArticle = (): Document => new DOMParser().parseFromString(articleHtml, "text/html");

const isLocalReference = (reference: string): boolean =>
  !reference.startsWith("http://") && !reference.startsWith("https://") && !reference.startsWith("//");

describe("linear mapping local assets", () => {
  it("HTMLから参照するローカルファイルがすべて存在する", () => {
    const document = parseArticle();
    const references = [
      ...[...document.querySelectorAll<HTMLScriptElement>("script[src]")].map((element) => element.getAttribute("src") ?? ""),
      ...[...document.querySelectorAll<HTMLLinkElement>("link[href]")].map((element) => element.getAttribute("href") ?? ""),
    ].filter(isLocalReference);

    expect(references.filter((reference) => !fs.existsSync(path.resolve(articleDirectory, reference)))).toEqual([]);
  });

  it("教材が使用するスクリプトだけを依存順に読み込む", () => {
    const document = parseArticle();
    const localScripts = [...document.querySelectorAll<HTMLScriptElement>("script[src]")]
      .map((element) => element.getAttribute("src") ?? "")
      .filter(isLocalReference);

    expect(localScripts).toEqual(["VectorSpaceElement.js", "Matrix.js", "sketch.js"]);
  });
});

describe("linear mapping article shell", () => {
  it("サイト内の現在地と戻り道を意味的HTMLで示す", () => {
    const document = parseArticle();
    const breadcrumb = document.querySelector<HTMLElement>('nav[aria-label="パンくずリスト"]');
    const backLink = document.querySelector<HTMLAnchorElement>('footer a[href="/ja/subjects/linear-algebra"]');

    expect(document.querySelector("body > header")?.textContent).toContain("Math by Making");
    expect(breadcrumb?.textContent).toContain("ホーム");
    expect(breadcrumb?.textContent).toContain("線形代数");
    expect(document.querySelector("main article h1")?.textContent).toContain("線形写像");
    expect(backLink?.textContent).toContain("教材一覧へ戻る");
  });

  it("記事の学習目標を3項目示す", () => {
    const document = parseArticle();
    const goals = document.querySelectorAll("[aria-labelledby='learning-goals-title'] li");

    expect(document.querySelector("#learning-goals-title")?.textContent).toBe("この教材の学習目標");
    expect(goals).toHaveLength(3);
  });
});
