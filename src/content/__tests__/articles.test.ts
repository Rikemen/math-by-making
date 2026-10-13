import { describe, expect, expectTypeOf, it } from "vitest";

import { validateCatalog } from "@/content/validateCatalog";
import type { ArticleMeta, SubjectMeta } from "@/content/types";

const subject: SubjectMeta = {
  slug: "linear-algebra",
  title: "線形代数",
  description: "ベクトルと行列から空間の変換を学びます。",
  status: "published",
  href: "/subjects/linear-algebra",
};

const article: ArticleMeta = {
  slug: "linear-mapping",
  subjectSlug: subject.slug,
  title: "線形写像",
  description: "線形写像の定義をコードと図で確かめます。",
  status: "published",
  href: "/articles/linear-algebra/linear-mapping/",
};

describe("content metadata types", () => {
  it("科目と記事に必要な公開情報を表現できる", () => {
    expectTypeOf<SubjectMeta>().toExtend<{
      slug: string;
      title: string;
      description: string;
      status: "published" | "planned";
      href: string;
    }>();

    expectTypeOf<ArticleMeta>().toExtend<{
      slug: string;
      subjectSlug: string;
      title: string;
      description: string;
      status: "published" | "planned";
      href: string;
      thumbnailSrc?: string;
      videoUrl?: string;
      githubUrl?: string;
    }>();
  });
});

describe("validateCatalog", () => {
  it("正しいカタログを受け入れる", () => {
    expect(validateCatalog({ subjects: [subject], articles: [article] })).toEqual([]);
  });

  it("同じ科目内の記事slug重複を検出する", () => {
    const issues = validateCatalog({ subjects: [subject], articles: [article, article] });

    expect(issues).toContain("article:linear-algebra/linear-mapping のslugが重複しています");
  });

  it("空の記事タイトルを検出する", () => {
    const issues = validateCatalog({
      subjects: [subject],
      articles: [{ ...article, title: "  " }],
    });

    expect(issues).toContain("article:linear-algebra/linear-mapping のtitleが空です");
  });

  it("記事の規約外hrefを検出する", () => {
    const issues = validateCatalog({
      subjects: [subject],
      articles: [{ ...article, href: "/linear-mapping" }],
    });

    expect(issues).toContain("article:linear-algebra/linear-mapping のhrefは /articles/linear-algebra/linear-mapping/ にしてください");
  });
});
