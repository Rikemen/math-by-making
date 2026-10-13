import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { articleDirectory, parseArticle } from "./linearMappingFixture";

interface CanvasSizeApi {
  calculateCanvasSize: (containerWidth: number, viewportWidth: number) => number;
}

const loadCanvasSizeApi = (): CanvasSizeApi => {
  const source = fs.readFileSync(path.resolve(articleDirectory, "canvas-size.js"), "utf8");
  const initialize = new Function("globalThis", `${source}; return globalThis.MathByMakingCanvas;`);
  return initialize({}) as CanvasSizeApi;
};

const sketchSource = fs.readFileSync(path.resolve(articleDirectory, "sketch.js"), "utf8");

describe("linear mapping canvas", () => {
  it("表示領域に収まる正方形サイズを返す", () => {
    const { calculateCanvasSize } = loadCanvasSizeApi();

    expect(calculateCanvasSize(880, 1280)).toBe(600);
    expect(calculateCanvasSize(328, 360)).toBe(328);
    expect(calculateCanvasSize(0, 360)).toBe(328);
    expect(calculateCanvasSize(1200, 390)).toBe(358);
  });

  it("可視化専用のコンテナを持つ", () => {
    const document = parseArticle();
    const container = document.querySelector("#linear-mapping-canvas");
    const status = document.querySelector("#canvas-animation-status");

    expect(container?.classList.contains("canvas-container")).toBe(true);
    expect(container?.getAttribute("aria-label")).toContain("線形写像");
    expect(status?.getAttribute("aria-live")).toBe("polite");
    expect(status?.textContent).toContain("再生中");
  });

  it("Canvas要素のクリックだけでアニメーションを切り替える", () => {
    expect(sketchSource).toContain("canvas.elt.addEventListener('click', toggleAnimation)");
    expect(sketchSource).not.toMatch(/function touchStarted\s*\(/);
    expect(sketchSource).not.toMatch(/function mousePressed\s*\(/);
  });
});
