import { linearAlgebraSubject } from "@/content/subjects";
import type { ArticleMeta } from "@/content/types";

const linearMappingSlug = "linear-mapping";

export const linearMappingArticle: ArticleMeta = {
  slug: linearMappingSlug,
  subjectSlug: linearAlgebraSubject.slug,
  title: "線形写像",
  description: "線形写像の定義を読み、JavaScriptの実装と可視化で確かめます。",
  status: "published",
  href: `/articles/${linearAlgebraSubject.slug}/${linearMappingSlug}/`,
};

export const articles: readonly ArticleMeta[] = [linearMappingArticle];
