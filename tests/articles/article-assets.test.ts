import path from "node:path";

import { describe, expect, it } from "vitest";

import { requiredFiles, validateRequiredFiles } from "./articleAssetContract";

const sampleDirectory = path.resolve(process.cwd(), "sample");
const linearMappingDirectory = path.resolve(process.cwd(), "public/articles/linear-algebra/linear-mapping");
const diagonalizationDirectory = path.resolve(process.cwd(), "public/articles/linear-algebra/diagonalization");
const whatAndWhyDirectory = path.resolve(process.cwd(), "public/articles/linear-algebra/diagonalization/what-and-why");

const linearMappingAssets = requiredFiles("線形写像", linearMappingDirectory, [
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

const diagonalizationAssets = requiredFiles("行列の対角化", diagonalizationDirectory, [
  "README.md",
  "article.css",
  "index.html",
]);

const whatAndWhyAssets = requiredFiles("行列の対角化とは何か？なぜ対角化するか？", whatAndWhyDirectory, [
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

  it("行列の対角化まとめ記事の公開フォルダに必須ファイルが揃っている", () => {
    expect(validateRequiredFiles(diagonalizationAssets)).toEqual([]);
  });

  it("行列の対角化第1回記事の公開フォルダに必須ファイルが揃っている", () => {
    expect(validateRequiredFiles(whatAndWhyAssets)).toEqual([]);
  });

  it("不足ファイルを記事名つきで報告する", () => {
    const incompleteAssets = requiredFiles("線形写像", sampleDirectory, ["Missing.js"]);

    expect(validateRequiredFiles(incompleteAssets)).toEqual(["線形写像: Missing.js がありません"]);
  });
});
