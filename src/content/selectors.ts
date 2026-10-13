import { articles } from "@/content/articles";
import { subjects } from "@/content/subjects";
import type { ArticleMeta, SubjectMeta } from "@/content/types";

export const getSubjectBySlug = (subjectSlug: string): SubjectMeta | undefined => subjects.find(({ slug }) => slug === subjectSlug);

export const getArticlesBySubjectSlug = (subjectSlug: string): ArticleMeta[] => articles.filter((article) => article.subjectSlug === subjectSlug);
