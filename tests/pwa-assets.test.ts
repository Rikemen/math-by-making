import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const publicDirectory = path.join(projectRoot, "public");

describe("PWA assets", () => {
  it("アプリ入口からWeb App Manifestを参照する", () => {
    const html = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");

    expect(html).toContain('<link rel="manifest" href="/manifest.webmanifest" />');
    expect(html).toContain('<meta name="theme-color" content="#155b8f" />');
  });

  it("Manifestがルートスコープと存在するアイコンを定義する", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(publicDirectory, "manifest.webmanifest"), "utf8")) as {
      display: string;
      icons: { src: string }[];
      scope: string;
      start_url: string;
    };

    expect(manifest).toMatchObject({
      display: "standalone",
      scope: "/",
      start_url: "/ja/",
    });
    expect(manifest.icons).not.toHaveLength(0);
    expect(
      manifest.icons.every((icon) => fs.existsSync(path.join(publicDirectory, icon.src.replace(/^\//, "")))),
    ).toBe(true);
  });

  it("Service Workerがアプリ用キャッシュと手動更新メッセージを扱う", () => {
    const serviceWorker = fs.readFileSync(path.join(publicDirectory, "sw.js"), "utf8");

    expect(serviceWorker).toContain('const CACHE_PREFIX = "math-by-making-"');
    expect(serviceWorker).toContain('event.data?.type === "SKIP_WAITING"');
    expect(serviceWorker).toContain("fetch(request)");
  });
});
