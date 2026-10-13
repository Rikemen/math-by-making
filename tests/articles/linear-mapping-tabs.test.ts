import fs from "node:fs";
import path from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import { articleDirectory, articleHtml, parseArticle } from "./linearMappingFixture";

const tabsScriptPath = path.resolve(articleDirectory, "tabs.js");

const runTabsScript = (): void => {
  const tabsScript = fs.readFileSync(tabsScriptPath, "utf8");
  new Function(tabsScript)();
};

describe("linear mapping tabs", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = articleHtml;
  });

  it("タブと対応パネルをARIAで関連付ける", () => {
    const article = parseArticle();
    const tabs = article.querySelectorAll<HTMLElement>("[role='tab']");
    const panels = article.querySelectorAll<HTMLElement>("[role='tabpanel']");

    expect(article.querySelector("[role='tablist']")?.getAttribute("aria-label")).toBe("教材の表示切り替え");
    expect(tabs).toHaveLength(2);
    expect(panels).toHaveLength(2);
    expect(tabs[0].getAttribute("aria-controls")).toBe(panels[0].id);
    expect(tabs[1].getAttribute("aria-controls")).toBe(panels[1].id);
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs[1].getAttribute("aria-selected")).toBe("false");
  });

  it("クリックと左右キーを同じ選択状態へ反映する", () => {
    runTabsScript();
    const theoryTab = document.querySelector<HTMLButtonElement>("#tab-theory-button");
    const practiceTab = document.querySelector<HTMLButtonElement>("#tab-practice-button");
    const theoryPanel = document.querySelector<HTMLElement>("#tab-theory");
    const practicePanel = document.querySelector<HTMLElement>("#tab-practice");

    practiceTab?.click();

    expect(practiceTab?.getAttribute("aria-selected")).toBe("true");
    expect(theoryTab?.getAttribute("aria-selected")).toBe("false");
    expect(practicePanel?.hidden).toBe(false);
    expect(theoryPanel?.hidden).toBe(true);

    practiceTab?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));

    expect(theoryTab?.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(theoryTab);
  });
});
