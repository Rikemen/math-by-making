import { mount, RouterLinkStub } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { describe, expect, it } from "vitest";

import SubjectCard from "@/components/SubjectCard.vue";
import type { SubjectMeta } from "@/content/types";
import ja from "@/i18n/ja";

const publishedSubject: SubjectMeta = {
  slug: "linear-algebra",
  title: "線形代数",
  description: "ベクトルと行列を使い、空間とその変換を学びます。",
  status: "published",
  href: "/subjects/linear-algebra",
};

const plannedSubject: SubjectMeta = {
  slug: "calculus",
  title: "微分積分",
  description: "変化と蓄積を数式とコードで学びます。",
  status: "planned",
  href: "/subjects/calculus",
};

const mountCard = (subject: SubjectMeta) =>
  mount(SubjectCard, {
    props: { subject },
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

describe("SubjectCard", () => {
  it("公開中の科目を現在の言語を保ったリンクとして表示する", () => {
    const wrapper = mountCard(publishedSubject);
    const link = wrapper.getComponent(RouterLinkStub);

    expect(link.props("to")).toBe("/ja/subjects/linear-algebra");
    expect(wrapper.text()).toContain("線形代数");
    expect(wrapper.text()).toContain("公開中");
  });

  it("準備中の科目をリンクにしない", () => {
    const wrapper = mountCard(plannedSubject);

    expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false);
    expect(wrapper.text()).toContain("微分積分");
    expect(wrapper.text()).toContain("準備中");
  });
});
