import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { describe, expect, it } from "vitest";

import ArticleCard from "@/components/ArticleCard.vue";
import type { ArticleMeta } from "@/content/types";
import ja from "@/i18n/ja";

const publishedArticle: ArticleMeta = {
  slug: "linear-mapping",
  subjectSlug: "linear-algebra",
  title: "線形写像",
  description: "線形写像をコードと図で確かめます。",
  status: "published",
  href: "/articles/linear-algebra/linear-mapping/",
};

const mountCard = (article: ArticleMeta) =>
  mount(ArticleCard, {
    props: { article },
    global: {
      plugins: [
        createI18n({
          legacy: false,
          locale: "ja",
          messages: { ja },
        }),
      ],
    },
  });

describe("ArticleCard", () => {
  it("公開中の記事をリンクと状態ラベルで表示する", () => {
    const wrapper = mountCard(publishedArticle);

    expect(wrapper.get("a").attributes("href")).toBe(publishedArticle.href);
    expect(wrapper.text()).toContain("公開中");
  });

  it("準備中の記事をリンクにしない", () => {
    const wrapper = mountCard({ ...publishedArticle, status: "planned" });

    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.text()).toContain("準備中");
  });
});
