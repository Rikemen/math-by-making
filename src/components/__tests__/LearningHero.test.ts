import { mount, RouterLinkStub } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { describe, expect, it } from "vitest";

import LearningHero from "@/components/LearningHero.vue";
import ja from "@/i18n/ja";

const mountHero = (guideImageSrc?: string) =>
  mount(LearningHero, {
    props: {
      guideImageSrc,
    },
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

describe("LearningHero", () => {
  it("案内役の画像を意味のある代替文と遅延読み込みで表示する", () => {
    const wrapper = mountHero("/fermiquest/01_Feru.png");
    const image = wrapper.get("img");

    expect(image.attributes("src")).toBe("/fermiquest/01_Feru.png");
    expect(image.attributes("alt")).toBe("数学の実験を案内するキャラクター、フェル");
    expect(image.attributes("loading")).toBe("lazy");
  });

  it("画像未設定でも見出しとCTAを表示する", () => {
    const wrapper = mountHero();

    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.get("h1").text()).toContain("Math by Making");
    expect(wrapper.getComponent(RouterLinkStub).text()).toContain("線形代数から始める");
  });
});
