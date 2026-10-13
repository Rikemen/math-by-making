import type { ArticleMeta, SubjectMeta } from "@/content/types";

interface Catalog {
  subjects: readonly SubjectMeta[];
  articles: readonly ArticleMeta[];
}

interface CatalogEntry {
  id: string;
  title: string;
  href: string;
  expectedHref: string;
}

const findDuplicates = (values: readonly string[]): string[] => [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];

const validateTitle = ({ id, title }: CatalogEntry): string[] => {
  if (title.trim() !== "") return [];
  return [`${id} のtitleが空です`];
};

const validateHref = ({ id, href, expectedHref }: CatalogEntry): string[] => {
  if (href === expectedHref) return [];
  return [`${id} のhrefは ${expectedHref} にしてください`];
};

const validateEntry = (entry: CatalogEntry): string[] => [...validateTitle(entry), ...validateHref(entry)];

const subjectId = (subject: SubjectMeta): string => `subject:${subject.slug}`;

const articleId = (article: ArticleMeta): string => `article:${article.subjectSlug}/${article.slug}`;

export const validateCatalog = ({ subjects, articles }: Catalog): string[] => {
  const entries: CatalogEntry[] = [
    ...subjects.map((subject) => ({
      id: subjectId(subject),
      title: subject.title,
      href: subject.href,
      expectedHref: `/subjects/${subject.slug}`,
    })),
    ...articles.map((article) => ({
      id: articleId(article),
      title: article.title,
      href: article.href,
      expectedHref: `/articles/${article.subjectSlug}/${article.slug}/`,
    })),
  ];
  const duplicateIds = findDuplicates(entries.map(({ id }) => id));
  const duplicateHrefs = findDuplicates(entries.map(({ href }) => href));

  return [
    ...duplicateIds.map((id) => `${id} のslugが重複しています`),
    ...duplicateHrefs.map((href) => `href:${href} が重複しています`),
    ...entries.flatMap(validateEntry),
  ];
};
