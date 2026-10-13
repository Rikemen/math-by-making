import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  initializeArticleHeader,
  refreshArticlePwaContent,
} from "../../public/articles/shared/article-header.js";

const createDependencies = (overrides = {}) => ({
  isOnline: true,
  getRegistration: vi.fn().mockResolvedValue(undefined),
  requestLatestPage: vi.fn().mockResolvedValue({ ok: true }),
  listCacheNames: vi.fn().mockResolvedValue([]),
  deleteCache: vi.fn().mockResolvedValue(true),
  reload: vi.fn(),
  ...overrides,
});

describe("article header PWA refresh", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button type="button" data-pwa-update>
        <span data-pwa-update-label>更新</span>
      </button>
      <p data-pwa-update-status role="status" hidden>更新できませんでした。通信を確認してください。</p>
    `;
  });

  it("最新版確認後にアプリ用キャッシュだけを削除して再読込する", async () => {
    const postMessage = vi.fn();
    const dependencies = createDependencies({
      getRegistration: vi.fn().mockResolvedValue({
        update: vi.fn().mockResolvedValue(undefined),
        waiting: { postMessage },
      }),
      listCacheNames: vi.fn().mockResolvedValue(["math-by-making-runtime-v1", "another-app-cache"]),
    });

    await refreshArticlePwaContent(dependencies);

    expect(dependencies.requestLatestPage).toHaveBeenCalledOnce();
    expect(dependencies.deleteCache).toHaveBeenCalledWith("math-by-making-runtime-v1");
    expect(dependencies.deleteCache).not.toHaveBeenCalledWith("another-app-cache");
    expect(dependencies.reload).toHaveBeenCalledOnce();
    expect(postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
  });

  it("更新中表示と失敗時の案内を切り替える", async () => {
    const refresh = vi.fn().mockRejectedValue(new Error("offline"));
    initializeArticleHeader(document, refresh);

    const button = document.querySelector("[data-pwa-update]");
    button.click();
    await vi.waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    await vi.waitFor(() => expect(button.disabled).toBe(false));

    expect(button.textContent).toContain("更新");
    expect(document.querySelector("[data-pwa-update-status]").hidden).toBe(false);
  });
});
