import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

export const articleDirectory = path.resolve(process.cwd(), "public/articles/linear-algebra/linear-mapping");
export const articleHtml = fs.readFileSync(path.resolve(articleDirectory, "index.html"), "utf8");

const parseArticle = (): Document => new DOMParser().parseFromString(articleHtml, "text/html");

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
