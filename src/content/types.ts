export type PublicationStatus = "published" | "planned";

interface ContentMeta {
  slug: string;
  title: string;
  description: string;
  status: PublicationStatus;
  href: string;
}

export type SubjectMeta = ContentMeta;

export interface ArticleMeta extends ContentMeta {
  subjectSlug: SubjectMeta["slug"];
  parentSlug?: string;
  isSummary?: boolean;
  thumbnailSrc?: string;
  videoUrl?: string;
  githubUrl?: string;
}
