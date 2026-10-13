import { mount, RouterLinkStub } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { describe, expect, it } from "vitest";

import ja from "@/i18n/ja";
import Home from "@/views/Home.vue";
import appShellHtml from "../../../index.html?raw";

const mountHome = () =>
  mount(Home, {
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

describe("Home", () => {
  it("創って学ぶ数学サイトの入口を表示する", () => {
    const wrapper = mountHome();

    expect(wrapper.get("h1").text()).toContain("Math by Making");
    expect(wrapper.text()).toContain("創って学ぶ");
    expect(wrapper.text()).toContain("線形代数");
  });

  it("線形代数の学習を始めるCTAを表示する", () => {
    const wrapper = mountHome();
    const cta = wrapper.getComponent(RouterLinkStub);

    expect(cta.text()).toContain("線形代数から始める");
    expect(cta.props("to")).toBe("/ja/subjects/linear-algebra");
  });

  it("スターターキット固有の表示を残さない", () => {
    const wrapper = mountHome();

    expect(wrapper.text()).not.toContain("hello world");
    expect(wrapper.find('img[alt="Firebase logo"]').exists()).toBe(false);
    expect(wrapper.find('img[alt="Vue logo"]').exists()).toBe(false);
  });

  it("ブラウザタブにサイト名を表示する", () => {
    expect(appShellHtml).toContain("<title>Math by Making</title>");
    expect(appShellHtml).not.toContain("firebase-vue3-startup-kit");
  });
});
