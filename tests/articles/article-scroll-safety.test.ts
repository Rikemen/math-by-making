import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const articlesDirectory = path.resolve(process.cwd(), "public/articles");

// public/articles 配下の指定拡張子ファイルを再帰的に収集
const findFilesRecursively = (dir: string, extension: string): string[] => {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFilesRecursively(fullPath, extension));
    } else if (entry.name.endsWith(extension)) {
      results.push(fullPath);
    }
  }

  return results;
};

describe("article scroll safety & external scripts contract", () => {
  const jsFiles = findFilesRecursively(articlesDirectory, ".js");
  const htmlFiles = findFilesRecursively(articlesDirectory, ".html");
  const cssFiles = findFilesRecursively(articlesDirectory, "article.css");

  it("すべての記事JavaScriptで、p5.jsグローバルタッチイベントによるスクロール抑止（return false）がない", () => {
    const violations: { file: string; match: string }[] = [];

    for (const file of jsFiles) {
      const content = fs.readFileSync(file, "utf8");
      // function touchMoved(...) { ... return false; ... } を検出
      const regex = /function\s+touchMoved\s*\([^)]*\)\s*\{[^}]*return\s+false/g;
      const matches = content.match(regex);
      if (matches) {
        violations.push({
          file: path.relative(process.cwd(), file),
          match: matches.join(", "),
        });
      }
    }

    expect(violations).toEqual([]);
  });

  it("すべての記事HTMLで、停止中・危険な polyfill.io ドメインへの参照が存在しない", () => {
    const violations: string[] = [];

    for (const file of htmlFiles) {
      const content = fs.readFileSync(file, "utf8");
      if (content.includes("polyfill.io")) {
        violations.push(path.relative(process.cwd(), file));
      }
    }

    expect(violations).toEqual([]);
  });

  it("すべての記事CSSで、.canvas-container に縦スクロールを許可する touch-action: pan-y が設定されている", () => {
    const violations: string[] = [];

    for (const file of cssFiles) {
      const content = fs.readFileSync(file, "utf8");
      // canvas-container が定義されている記事を対象に検証
      if (content.includes(".canvas-container")) {
        const hasPanY = /\.canvas-container\s*\{[^}]*touch-action:\s*pan-y/s.test(content);
        if (!hasPanY) {
          violations.push(path.relative(process.cwd(), file));
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
