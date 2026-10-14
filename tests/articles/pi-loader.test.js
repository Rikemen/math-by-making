import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createPiLoader,
  initializePiPageLoader,
  PI_DIGITS,
  shouldInterceptNavigation,
  STORAGE_KEY,
} from "../../public/articles/shared/pi-loader.js";

describe("shouldInterceptNavigation", () => {
  const currentLocation = new URL("https://math-by-making.web.app/articles/linear-algebra/linear-mapping/");

  const createFakeEvent = (overrides = {}) => ({
    defaultPrevented: false,
    button: 0,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    ...overrides,
  });

  it("同一オリジンの記事やページへの標準クリックはインターセプト対象とする", () => {
    const anchor = document.createElement("a");
    anchor.href = "/articles/linear-algebra/diagonalization/";
    expect(shouldInterceptNavigation(anchor, createFakeEvent(), currentLocation)).toBe(true);
  });

  it("別ドメインへの外部リンクはインターセプト対象外とする", () => {
    const anchor = document.createElement("a");
    anchor.href = "https://example.com/external";
    expect(shouldInterceptNavigation(anchor, createFakeEvent(), currentLocation)).toBe(false);
  });

  it("target='_blank' のリンクはインターセプト対象外とする", () => {
    const anchor = document.createElement("a");
    anchor.href = "/ja/";
    anchor.target = "_blank";
    expect(shouldInterceptNavigation(anchor, createFakeEvent(), currentLocation)).toBe(false);
  });

  it("同一ページ内のハッシュリンクはインターセプト対象外とする", () => {
    const anchor = document.createElement("a");
    anchor.href = `${currentLocation.pathname}#summary`;
    expect(shouldInterceptNavigation(anchor, createFakeEvent(), currentLocation)).toBe(false);
  });

  it("修飾キー（Meta, Ctrl, Shift, Alt）が押されている場合はインターセプト対象外とする", () => {
    const anchor = document.createElement("a");
    anchor.href = "/ja/";
    expect(shouldInterceptNavigation(anchor, createFakeEvent({ metaKey: true }), currentLocation)).toBe(false);
    expect(shouldInterceptNavigation(anchor, createFakeEvent({ ctrlKey: true }), currentLocation)).toBe(false);
  });

  it("download 属性があるリンクはインターセプト対象外とする", () => {
    const anchor = document.createElement("a");
    anchor.href = "/file.pdf";
    anchor.setAttribute("download", "");
    expect(shouldInterceptNavigation(anchor, createFakeEvent(), currentLocation)).toBe(false);
  });
});

describe("createPiLoader", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("start でDOMを生成し、is-active クラスを付与して円周率の数字をストリーミングする", () => {
    const loader = createPiLoader(document, window);
    loader.start();

    const overlay = document.querySelector(".pi-loader-overlay");
    expect(overlay).not.toBeNull();
    expect(overlay?.classList.contains("is-active")).toBe(true);

    const digitsElement = overlay?.querySelector("[data-pi-digits]");
    expect(digitsElement?.textContent).toBe("3.");

    // タイマーを進めると数字が1文字ずつ増える
    vi.advanceTimersByTime(40);
    expect(digitsElement?.textContent).toBe(PI_DIGITS.slice(0, 3)); // "3.1"

    vi.advanceTimersByTime(40);
    expect(digitsElement?.textContent).toBe(PI_DIGITS.slice(0, 4)); // "3.14"

    loader.stop(true);
    expect(overlay?.classList.contains("is-active")).toBe(false);
  });

  it("stop(false) で最小表示時間後にフェードアウトする", () => {
    const loader = createPiLoader(document, window);
    loader.start();

    const overlay = document.querySelector(".pi-loader-overlay");
    expect(overlay?.classList.contains("is-active")).toBe(true);

    loader.stop(false);

    // 最小表示時間前は active のまま
    vi.advanceTimersByTime(100);
    expect(overlay?.classList.contains("is-active")).toBe(true);

    // 最小表示時間後に is-active が外れる
    vi.advanceTimersByTime(200);
    expect(overlay?.classList.contains("is-active")).toBe(false);
  });
});

describe("initializePiPageLoader", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    document.body.innerHTML = `
      <div id="content">
        <a id="nav-link" href="/articles/linear-algebra/diagonalization/">対角化へ</a>
      </div>
    `;
  });

  afterEach(() => {
    vi.useRealTimers();
    sessionStorage.clear();
  });

  it("sessionStorage にフラグがある場合は自動でローダーを表示してフラグを消去する", () => {
    sessionStorage.setItem(STORAGE_KEY, "1");

    const cleanup = initializePiPageLoader(document, window);
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();

    const overlay = document.querySelector(".pi-loader-overlay");
    expect(overlay?.classList.contains("is-active")).toBe(true);

    cleanup();
  });

  it("対象リンクをクリックした際にローダーを起動し sessionStorage にフラグを保存する", () => {
    const cleanup = initializePiPageLoader(document, window);

    const link = document.getElementById("nav-link");
    link?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));

    expect(sessionStorage.getItem(STORAGE_KEY)).toBe("1");
    const overlay = document.querySelector(".pi-loader-overlay");
    expect(overlay?.classList.contains("is-active")).toBe(true);

    cleanup();
  });
});
