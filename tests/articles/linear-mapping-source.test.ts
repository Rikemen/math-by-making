import fs from "node:fs";
import path from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import { linearMappingArticle } from "@/content/articles";

import { articleDirectory, articleHtml, parseArticle } from "./linearMappingFixture";

interface SourceLinkApi {
  renderSourceLink: (link: HTMLAnchorElement, githubUrl?: string) => void;
}

const githubUrl = "https://github.com/Rikemen/math-by-making/tree/main/public/articles/linear-algebra/linear-mapping";

const loadSourceLinkApi = (): SourceLinkApi => {
  const source = fs.readFileSync(path.resolve(articleDirectory, "source-link.js"), "utf8");
  const sandbox: { MathByMakingSourceLink?: SourceLinkApi } = {};
  const initialize = new Function("globalThis", source);
  initialize(sandbox);
  return sandbox.MathByMakingSourceLink as SourceLinkApi;
};

describe("linear mapping source link", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = articleHtml;
  });

  it("HTMLメタ情報とコンテンツカタログで同じGitHub URLを使う", () => {
    const article = parseArticle();
    const metaUrl = article.querySelector<HTMLMetaElement>('meta[name="article:github-url"]')?.content;

    expect(linearMappingArticle.githubUrl).toBe(githubUrl);
    expect(metaUrl).toBe(githubUrl);
  });

  it("未設定や不正URLではリンクを表示しない", () => {
    const { renderSourceLink } = loadSourceLinkApi();
    const link = document.createElement("a");

    renderSourceLink(link);
    expect(link.hidden).toBe(true);
    expect(link.hasAttribute("href")).toBe(false);

    renderSourceLink(link, "javascript:alert(1)");
    expect(link.hidden).toBe(true);
    expect(link.hasAttribute("href")).toBe(false);
  });

  it("GitHub URLを安全な外部リンクとして表示する", () => {
    const { renderSourceLink } = loadSourceLinkApi();
    const link = document.createElement("a");

    renderSourceLink(link, githubUrl);

    expect(link.hidden).toBe(false);
    expect(link.href).toBe(githubUrl);
    expect(link.target).toBe("_blank");
    expect(link.rel.split(" ")).toEqual(expect.arrayContaining(["noopener", "noreferrer"]));
  });
});
