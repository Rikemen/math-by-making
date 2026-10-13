import path from "node:path";

import { describe, expect, it } from "vitest";

import { requiredFiles, validateRequiredFiles } from "./articleAssetContract";

const sampleDirectory = path.resolve(process.cwd(), "sample");
const publishedDirectory = path.resolve(process.cwd(), "public/articles/linear-algebra/linear-mapping");

const linearMappingAssets = requiredFiles("線形写像", publishedDirectory, [
  "README.md",
  "article-mobile.css",
  "article.css",
  "canvas-size.js",
  "index.html",
  "sketch.js",
  "source-link.js",
  "Matrix.js",
  "tabs.js",
  "VectorSpaceElement.js",
]);

describe("article asset contract", () => {
  it("線形写像の公開フォルダに必須ファイルが揃っている", () => {
    expect(validateRequiredFiles(linearMappingAssets)).toEqual([]);
  });

  it("不足ファイルを記事名つきで報告する", () => {
    const incompleteAssets = requiredFiles("線形写像", sampleDirectory, ["Missing.js"]);

    expect(validateRequiredFiles(incompleteAssets)).toEqual(["線形写像: Missing.js がありません"]);
  });
});
