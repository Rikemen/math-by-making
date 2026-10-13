import { flushPromises, mount, RouterLinkStub } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AppHeader from "@/components/AppHeader.vue";
import ja from "@/i18n/ja";

const { refreshPwaContentMock } = vi.hoisted(() => ({
  refreshPwaContentMock: vi.fn(),
}));

vi.mock("@/pwa/appUpdate", () => ({
  refreshPwaContent: refreshPwaContentMock,
}));

const mountHeader = () =>
  mount(AppHeader, {
    global: {
      plugins: [
        createI18n({
          legacy: false,
          locale: "ja",
          messages: { ja },
        }),
      ],
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  });

const createDeferredUpdate = () => {
  let resolve = (): void => undefined;
  const promise = new Promise<void>((complete) => {
    resolve = complete;
  });

  return { promise, resolve };
};

describe("AppHeader display", () => {
  beforeEach(() => {
    refreshPwaContentMock.mockReset();
    refreshPwaContentMock.mockResolvedValue(undefined);
  });

  it("サイト名と主要な学習導線を表示する", () => {
    const wrapper = mountHeader();

    expect(wrapper.get("header").text()).toContain("Math by Making");
    expect(wrapper.get("nav").attributes("aria-label")).toBe("主要ナビゲーション");
    expect(wrapper.text()).toContain("ホーム");
    expect(wrapper.text()).toContain("科目から学ぶ");
    expect(wrapper.get("button").text()).toContain("更新");
  });

  it("現在の言語を保ったリンク先を設定する", () => {
    const wrapper = mountHeader();
    const linkTargets = wrapper.findAllComponents(RouterLinkStub).map((link) => link.props("to"));

    expect(linkTargets).toContain("/ja/");
    expect(linkTargets).toContain("/ja/#subjects");
  });
});

describe("AppHeader update", () => {
  beforeEach(() => {
    refreshPwaContentMock.mockReset();
    refreshPwaContentMock.mockResolvedValue(undefined);
  });

  it("更新ボタンからPWAコンテンツの再取得を開始する", async () => {
    const deferredUpdate = createDeferredUpdate();
    refreshPwaContentMock.mockReturnValue(deferredUpdate.promise);
    const wrapper = mountHeader();
    const updateButton = wrapper.get("button");

    await updateButton.trigger("click");

    expect(refreshPwaContentMock).toHaveBeenCalledOnce();
    expect(updateButton.attributes("disabled")).toBeDefined();
    expect(updateButton.text()).toContain("更新中…");

    deferredUpdate.resolve();
    await flushPromises();
  });

  it("更新に失敗したとき通信確認を案内する", async () => {
    refreshPwaContentMock.mockRejectedValue(new Error("offline"));
    const wrapper = mountHeader();

    await wrapper.get("button").trigger("click");
    await flushPromises();

    expect(wrapper.get('[role="status"]').text()).toBe("更新できませんでした。通信を確認してください。");
    expect(wrapper.get("button").attributes("disabled")).toBeUndefined();
  });
});
