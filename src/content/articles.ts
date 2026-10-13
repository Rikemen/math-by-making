import { linearAlgebraSubject } from "@/content/subjects";
import type { ArticleMeta } from "@/content/types";

const linearMappingSlug = "linear-mapping";
const diagonalizationSlug = "diagonalization";
const whatAndWhySlug = "what-and-why";

export const linearMappingArticle: ArticleMeta = {
  slug: linearMappingSlug,
  subjectSlug: linearAlgebraSubject.slug,
  title: "線形写像",
  description: "線形写像の定義を読み、JavaScriptの実装と可視化で確かめます。",
  status: "published",
  href: `/articles/${linearAlgebraSubject.slug}/${linearMappingSlug}/`,
  githubUrl: "https://github.com/Rikemen/math-by-making/tree/main/public/articles/linear-algebra/linear-mapping",
};

export const diagonalizationArticle: ArticleMeta = {
  slug: diagonalizationSlug,
  subjectSlug: linearAlgebraSubject.slug,
  title: "行列の対角化",
  description: "空間の変換を特等席の軸から見直し、複雑な計算を劇的に単純化する対角化の全体像を学びます。",
  status: "published",
  isSummary: true,
  href: `/articles/${linearAlgebraSubject.slug}/${diagonalizationSlug}/`,
  githubUrl: "https://github.com/Rikemen/math-by-making/tree/main/public/articles/linear-algebra/diagonalization",
};

export const diagonalizationWhatAndWhyArticle: ArticleMeta = {
  slug: whatAndWhySlug,
  parentSlug: diagonalizationSlug,
  subjectSlug: linearAlgebraSubject.slug,
  title: "行列の対角化とは何か？なぜ対角化するか？",
  description: "対角化の数学的定義と幾何学的意味、そしてなぜ対角化を行うのか（計算高速化や応用）をコードと可視化で確かめます。",
  status: "published",
  href: `/articles/${linearAlgebraSubject.slug}/${diagonalizationSlug}/${whatAndWhySlug}/`,
  githubUrl: "https://github.com/Rikemen/math-by-making/tree/main/public/articles/linear-algebra/diagonalization/what-and-why",
};

export const articles: readonly ArticleMeta[] = [
  linearMappingArticle,
  diagonalizationArticle,
  diagonalizationWhatAndWhyArticle,
];
