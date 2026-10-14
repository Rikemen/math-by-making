import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  PI_DIGITS,
  PiLoaderManager,
  STORAGE_KEY,
  setupGlobalPiLoader,
  shouldInterceptNavigation,
} from "@/utils/piLoader";

const OVERLAY_SELECTOR = ".pi-loader-overlay";
const CURRENT_LOCATION = new URL("https://math-by-making.web.app/ja/");

const createFakeEvent = (overrides = {}): MouseEvent =>
  ({
    defaultPrevented: false,
    button: 0,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    ...overrides,
  }) as unknown as MouseEvent;

describe("shouldInterceptNavigation - allow cases", () => {
  it("同一オリジンのリンクへの標準クリックはインターセプト対象とする", () => {
    const anchor = document.createElement("a");
    anchor.href = "/ja/subjects/linear-algebra";
    expect(shouldInterceptNavigation(anchor, createFakeEvent(), CURRENT_LOCATION)).toBe(true);
  });
});

describe("shouldInterceptNavigation - ignore cases", () => {
  it("外部リンクはインターセプト対象外とする", () => {
    const anchor = document.createElement("a");
    anchor.href = "https://example.com/external";
    expect(shouldInterceptNavigation(anchor, createFakeEvent(), CURRENT_LOCATION)).toBe(false);
  });

  it("target='_blank' のリンクはインターセプト対象外とする", () => {
    const anchor = document.createElement("a");
    anchor.href = "/articles/linear-algebra/linear-mapping/";
    anchor.target = "_blank";
    expect(shouldInterceptNavigation(anchor, createFakeEvent(), CURRENT_LOCATION)).toBe(false);
  });

  it("同一ページ内のハッシュリンクはインターセプト対象外とする", () => {
    const anchor = document.createElement("a");
    anchor.href = `${CURRENT_LOCATION.pathname}#subjects`;
    expect(shouldInterceptNavigation(anchor, createFakeEvent(), CURRENT_LOCATION)).toBe(false);
  });

  it("修飾キー付きクリックはインターセプト対象外とする", () => {
    const anchor = document.createElement("a");
    anchor.href = "/ja/about";
    expect(shouldInterceptNavigation(anchor, createFakeEvent({ metaKey: true }), CURRENT_LOCATION)).toBe(false);
  });

  it("download 属性がある場合はインターセプト対象外とする", () => {
    const anchor = document.createElement("a");
    anchor.href = "/archive.zip";
    anchor.setAttribute("download", "");
    expect(shouldInterceptNavigation(anchor, createFakeEvent(), CURRENT_LOCATION)).toBe(false);
  });
});

describe("PiLoaderManager", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const getOverlay = (): HTMLElement | null => document.querySelector(OVERLAY_SELECTOR);

  it("start でDOMを生成し円周率の数字をストリーミングする", () => {
    const manager = new PiLoaderManager(document, window);
    manager.start();

    const overlay = getOverlay();
    expect(overlay?.classList.contains("is-active")).toBe(true);

    const digitsElement = overlay?.querySelector("[data-pi-digits]");
    expect(digitsElement?.textContent).toBe("3.");

    vi.advanceTimersByTime(40);
    expect(digitsElement?.textContent).toBe(PI_DIGITS.slice(0, 3));

    manager.stop(true);
    expect(overlay?.classList.contains("is-active")).toBe(false);
  });

  it("stop(false) で最小表示時間後にフェードアウトする", () => {
    const manager = new PiLoaderManager(document, window);
    manager.start();

    const overlay = getOverlay();
    expect(overlay?.classList.contains("is-active")).toBe(true);

    manager.stop(false);
    vi.advanceTimersByTime(100);
    expect(overlay?.classList.contains("is-active")).toBe(true);

    vi.advanceTimersByTime(200);
    expect(overlay?.classList.contains("is-active")).toBe(false);
  });
});

describe("setupGlobalPiLoader", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    document.body.innerHTML = `
      <div>
        <a id="article-link" href="/articles/linear-algebra/linear-mapping/">線形写像</a>
      </div>
    `;
  });

  afterEach(() => {
    vi.useRealTimers();
    sessionStorage.clear();
  });

  it("sessionStorage にフラグがある場合は自動でローダーを表示してフラグを消去する", () => {
    sessionStorage.setItem(STORAGE_KEY, "1");

    const cleanup = setupGlobalPiLoader(document, window);
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();

    const overlay = document.querySelector(OVERLAY_SELECTOR);
    expect(overlay?.classList.contains("is-active")).toBe(true);

    cleanup();
  });

  it("対象リンクをクリックした際にローダーを起動し sessionStorage にフラグを保存する", () => {
    const cleanup = setupGlobalPiLoader(document, window);

    const link = document.getElementById("article-link");
    link?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));

    expect(sessionStorage.getItem(STORAGE_KEY)).toBe("1");
    const overlay = document.querySelector(OVERLAY_SELECTOR);
    expect(overlay?.classList.contains("is-active")).toBe(true);

    cleanup();
  });
});
