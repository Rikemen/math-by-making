import { describe, expect, expectTypeOf, it } from "vitest";

import { articles } from "@/content/articles";
import { subjects } from "@/content/subjects";
import { validateCatalog } from "@/content/validateCatalog";
import type { ArticleMeta, SubjectMeta } from "@/content/types";

const linearAlgebraSlug = "linear-algebra";
const linearMappingSlug = "linear-mapping";
const linearMappingHref = `/articles/${linearAlgebraSlug}/${linearMappingSlug}/`;
const linearMappingId = `article:${linearAlgebraSlug}/${linearMappingSlug}`;

const subject: SubjectMeta = {
  slug: linearAlgebraSlug,
  title: "線形代数",
  description: "ベクトルと行列から空間の変換を学びます。",
  status: "published",
  href: "/subjects/linear-algebra",
};

const article: ArticleMeta = {
  slug: linearMappingSlug,
  subjectSlug: subject.slug,
  title: "線形写像",
  description: "線形写像の定義をコードと図で確かめます。",
  status: "published",
  href: linearMappingHref,
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

    expect(issues).toContain(`${linearMappingId} のslugが重複しています`);
  });

  it("空の記事タイトルを検出する", () => {
    const issues = validateCatalog({
      subjects: [subject],
      articles: [{ ...article, title: "  " }],
    });

    expect(issues).toContain(`${linearMappingId} のtitleが空です`);
  });

  it("記事の規約外hrefを検出する", () => {
    const issues = validateCatalog({
      subjects: [subject],
      articles: [{ ...article, href: "/linear-mapping" }],
    });

    expect(issues).toContain(`${linearMappingId} のhrefは ${linearMappingHref} にしてください`);
  });
});

describe("content catalog", () => {
  it("線形代数科目を登録する", () => {
    expect(subjects).toContainEqual(
      expect.objectContaining({
        slug: linearAlgebraSlug,
        title: "線形代数",
        status: "published",
      }),
    );
  });

  it("線形写像の記事を公開URL付きで登録する", () => {
    expect(articles).toContainEqual(
      expect.objectContaining({
        slug: linearMappingSlug,
        subjectSlug: linearAlgebraSlug,
        title: "線形写像",
        status: "published",
        href: linearMappingHref,
        githubUrl: "https://github.com/Rikemen/math-by-making/tree/main/public/articles/linear-algebra/linear-mapping",
      }),
    );
  });

  it("登録済みカタログが検証を通る", () => {
    expect(validateCatalog({ subjects, articles })).toEqual([]);
  });
});
