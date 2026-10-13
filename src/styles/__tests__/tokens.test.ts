import { describe, expect, it } from "vitest";

import tokensCss from "@/styles/base/tokens.css?inline";
import indexCss from "@/index.css?raw";

const requiredTokens = [
  "--color-brand-50",
  "--color-brand-500",
  "--color-brand-700",
  "--color-text",
  "--color-surface",
  "--color-focus",
  "--space-4",
  "--font-size-base",
  "--content-max-width",
];

describe("design tokens", () => {
  it.each(requiredTokens)("%s を定義する", (token) => {
    expect(tokensCss).toContain(token);
  });

  it("広い責務から具体的な責務の順でCSSを読み込む", () => {
    const importOrder = ["tailwindcss", "base/tokens.css", "base/reset.css", "layout/app-shell.css"];
    const positions = importOrder.map((path) => indexCss.indexOf(path));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((left, right) => left - right));
  });
});
