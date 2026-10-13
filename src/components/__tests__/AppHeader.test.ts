import { mount, RouterLinkStub } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { describe, expect, it } from "vitest";

import AppHeader from "@/components/AppHeader.vue";
import ja from "@/i18n/ja";

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

describe("AppHeader", () => {
  it("サイト名と主要な学習導線を表示する", () => {
    const wrapper = mountHeader();

    expect(wrapper.get("header").text()).toContain("Math by Making");
    expect(wrapper.get("nav").attributes("aria-label")).toBe("主要ナビゲーション");
    expect(wrapper.text()).toContain("ホーム");
    expect(wrapper.text()).toContain("科目から学ぶ");
  });

  it("現在の言語を保ったリンク先を設定する", () => {
    const wrapper = mountHeader();
    const linkTargets = wrapper.findAllComponents(RouterLinkStub).map((link) => link.props("to"));

    expect(linkTargets).toContain("/ja/");
    expect(linkTargets).toContain("/ja/#subjects");
  });
});
