import { describe, expect, it, vi } from "vitest";

import { refreshPwaContent, registerPwa, type PwaUpdateDependencies } from "./appUpdate";

const createDependencies = (overrides: Partial<PwaUpdateDependencies> = {}): PwaUpdateDependencies => ({
  isOnline: true,
  getRegistration: vi.fn().mockResolvedValue(null),
  requestLatestPage: vi.fn().mockResolvedValue({ ok: true }),
  listCacheNames: vi.fn().mockResolvedValue([]),
  deleteCache: vi.fn().mockResolvedValue(true),
  reload: vi.fn(),
  ...overrides,
});

describe("refreshPwaContent", () => {
  it("最新版を確認してアプリ用キャッシュだけを削除してから再読込する", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const postMessage = vi.fn();
    const dependencies = createDependencies({
      getRegistration: vi.fn().mockResolvedValue({ update, waiting: { postMessage } }),
      listCacheNames: vi
        .fn()
        .mockResolvedValue(["math-by-making-runtime-v1", "math-by-making-pages-v2", "another-app-cache"]),
    });

    await refreshPwaContent(dependencies);

    expect({
      cacheDeletes: vi.mocked(dependencies.deleteCache).mock.calls.length,
      reloads: vi.mocked(dependencies.reload).mock.calls.length,
      requests: vi.mocked(dependencies.requestLatestPage).mock.calls.length,
      updates: update.mock.calls.length,
    }).toEqual({ cacheDeletes: 2, reloads: 1, requests: 1, updates: 1 });
    expect(dependencies.deleteCache).toHaveBeenCalledWith("math-by-making-runtime-v1");
    expect(dependencies.deleteCache).toHaveBeenCalledWith("math-by-making-pages-v2");
    expect(dependencies.deleteCache).not.toHaveBeenCalledWith("another-app-cache");
    expect(postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
  });

  it("オフライン時はキャッシュを残して再読込しない", async () => {
    const dependencies = createDependencies({ isOnline: false });

    await expect(refreshPwaContent(dependencies)).rejects.toThrow("offline");

    expect(dependencies.deleteCache).not.toHaveBeenCalled();
    expect(dependencies.reload).not.toHaveBeenCalled();
  });

  it("最新版の取得に失敗したときはキャッシュを残す", async () => {
    const dependencies = createDependencies({
      requestLatestPage: vi.fn().mockResolvedValue({ ok: false }),
    });

    await expect(refreshPwaContent(dependencies)).rejects.toThrow("update-check-failed");

    expect(dependencies.deleteCache).not.toHaveBeenCalled();
    expect(dependencies.reload).not.toHaveBeenCalled();
  });
});

describe("registerPwa", () => {
  it("Service Worker対応環境ではルートスコープに登録する", async () => {
    const register = vi.fn().mockResolvedValue({});

    await registerPwa({ register });

    expect(register).toHaveBeenCalledWith("/sw.js", { scope: "/" });
  });

  it("非対応環境では何もしない", async () => {
    await expect(registerPwa()).resolves.toBeUndefined();
  });
});
