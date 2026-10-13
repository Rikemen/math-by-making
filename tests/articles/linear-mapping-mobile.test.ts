import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { articleDirectory, parseArticle } from "./linearMappingFixture";

const articleStyles = fs.readFileSync(path.resolve(articleDirectory, "article.css"), "utf8");
const articleMobileStyles = fs.readFileSync(path.resolve(articleDirectory, "article-mobile.css"), "utf8");
const articleHeaderStyles = fs.readFileSync(path.resolve(articleDirectory, "../../shared/article-header.css"), "utf8");

describe("linear mapping mobile layout", () => {
  it("端末幅を使うviewportとモバイル用の題名構造を持つ", () => {
    const document = parseArticle();
    const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    const englishTitle = document.querySelector<HTMLElement>("h1 .article-title__english");

    expect(viewport?.content).toBe("width=device-width, initial-scale=1");
    expect(englishTitle?.textContent).toContain("Linear Mapping");
  });

  it("狭い画面ではタブの補助ラベルを分けて扱える", () => {
    const document = parseArticle();
    const tabLabels = [...document.querySelectorAll<HTMLElement>(".tab-btn__secondary")];

    expect(tabLabels).toHaveLength(2);
    expect(tabLabels.map((label) => label.textContent)).toEqual(["Theory", "Practice"]);
  });

  it("記事所有のCSSにモバイルと長いコンテンツの扱いを定義する", () => {
    expect(articleMobileStyles).toContain("@media (max-width: 40rem)");
    expect(articleMobileStyles).toContain(".article-title__english");
    expect(articleMobileStyles).toContain(".tab-btn__secondary");
    expect(articleStyles).toContain('mjx-container[display="true"]');
  });

  it("共通記事ヘッダーを狭い画面でも常時操作できる", () => {
    expect(articleHeaderStyles).toContain("@media (max-width: 40rem)");
    expect(articleHeaderStyles).toContain("grid-template-areas");
    expect(articleHeaderStyles).toContain("min-height: 44px");
    expect(articleHeaderStyles).not.toContain("position: sticky");
  });
});
