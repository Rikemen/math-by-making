import { describe, expectTypeOf, it } from "vitest";

import type { ArticleMeta, SubjectMeta } from "@/content/types";

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
