import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { articleDirectory, parseArticle } from "./linearMappingFixture";

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

    expect(localScripts).toEqual([
      "../../shared/article-header.js",
      "VectorSpaceElement.js",
      "Matrix.js",
      "canvas-size.js",
      "sketch.js",
      "tabs.js",
      "source-link.js",
    ]);
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

  it("記事ヘッダーに主要メニューとPWA更新状態を示す", () => {
    const document = parseArticle();
    const primaryNavigation = document.querySelector<HTMLElement>('nav[aria-label="主要ナビゲーション"]');
    const updateButton = document.querySelector<HTMLButtonElement>("[data-pwa-update]");
    const updateStatus = document.querySelector<HTMLElement>("[data-pwa-update-status]");

    expect(primaryNavigation?.querySelector<HTMLAnchorElement>('a[href="/ja/"]')?.textContent).toContain("ホーム");
    expect(primaryNavigation?.querySelector<HTMLAnchorElement>('a[href="/ja/#subjects"]')?.textContent).toContain(
      "科目から学ぶ",
    );
    expect(updateButton?.type).toBe("button");
    expect(updateButton?.textContent).toContain("更新");
    expect(updateStatus?.getAttribute("role")).toBe("status");
    expect(updateStatus?.hasAttribute("hidden")).toBe(true);
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
    expect(pictograms && pictograms.length).toBeGreaterThanOrEqual(5);
  });

  it("共有デザイントークンを読み込み、トップページのブランド色を参照する", () => {
    const document = parseArticle();
    const tokenLink = document.querySelector<HTMLLinkElement>('link[href*="tokens.css"]');
    expect(tokenLink).not.toBeNull();

    const articleCss = fs.readFileSync(path.resolve(articleDirectory, "article.css"), "utf8");
    const headerCss = fs.readFileSync(path.resolve(articleDirectory, "../../shared/article-header.css"), "utf8");

    // トップページ側の正とするトークンを参照していること
    expect(articleCss).toContain("var(--color-brand-700)");
    expect(articleCss).toContain("var(--color-surface-soft)");
    expect(headerCss).toContain("var(--color-brand-700)");

    // 旧ネイビーのハードコード（#075985, #18324a）が存在しないこと
    expect(articleCss).not.toContain("#075985");
    expect(articleCss).not.toContain("#18324a");
    expect(headerCss).not.toContain("#075985");
  });
});
