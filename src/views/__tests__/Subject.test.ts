import { mount, RouterLinkStub } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createMemoryHistory, createRouter } from "vue-router";
import { describe, expect, it } from "vitest";

import { getArticlesBySubjectSlug, getSubjectBySlug } from "@/content/selectors";
import ja from "@/i18n/ja";
import Subject from "@/views/Subject.vue";

const linearAlgebraSlug = "linear-algebra";

const mountSubject = async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/:lang/subjects/:subjectSlug", component: Subject }],
  });
  await router.push(`/ja/subjects/${linearAlgebraSlug}`);
  await router.isReady();

  return mount(Subject, {
    global: {
      plugins: [
        router,
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
};

describe("content selectors", () => {
  it("slugから科目とその記事を取得する", () => {
    expect(getSubjectBySlug(linearAlgebraSlug)?.title).toBe("線形代数");
    expect(getArticlesBySubjectSlug(linearAlgebraSlug)).toHaveLength(1);
    expect(getArticlesBySubjectSlug(linearAlgebraSlug)[0]?.title).toBe("線形写像");
  });
});

describe("Subject", () => {
  it("線形代数の説明と記事カードを表示する", async () => {
    const wrapper = await mountSubject();

    expect(wrapper.get("h1").text()).toBe("線形代数");
    expect(wrapper.text()).toContain("線形写像");
    expect(wrapper.get('a[href="/articles/linear-algebra/linear-mapping/"]').attributes("href")).toBe("/articles/linear-algebra/linear-mapping/");
  });
});
